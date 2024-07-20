import * as React from 'react';
import GjsEditor, {
  AssetsProvider,
  Canvas,
  ModalProvider,
} from '@grapesjs/react';
import type { Editor, EditorConfig, Page } from 'grapesjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CustomModal from './components/CustomModal';
import CustomAssetManager from './components/CustomAssetManager';
import Topbar from './components/Topbar';
import RightSidebar from './components/RightSidebar';
import './style.css';
import { useEffect } from 'react';



const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const fetchTemplate = async (templateName) => {
  try {
    const response = await fetch(`/${templateName}.html`);
    const html = await response.text();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.querySelector('#gjs')?.innerHTML || '';
  } catch (error) {
    console.error(`Failed to fetch template ${templateName}`, error);
    return '';
  }
};

const initializeGjsOptions = async (): Promise<EditorConfig> => {
  const templateContent1 = await fetchTemplate('template');
  const templateContent2 = await fetchTemplate('template2');
  const templateContent3 = await fetchTemplate('template3');
  const templateContent4 = await fetchTemplate('template4');

  return {
    height: '100vh',
    storageManager: false,
    undoManager: { trackSelection: false },
    selectorManager: { componentFirst: true },
    projectData: {
      assets: [
        'https://via.placeholder.com/350x250/78c5d6/fff',
        'https://via.placeholder.com/350x250/459ba8/fff',
        'https://via.placeholder.com/350x250/79c267/fff',
        'https://via.placeholder.com/350x250/c5d647/fff',
        'https://via.placeholder.com/350x250/f28c33/fff',
      ],
      pages: [
        {
          name: 'Home page',
          component: `
            <body id="iz3s">
              ${templateContent1}
            </body>
          `,
        },
        {
          name: 'page2',
          component: `
            <body id="iz3s">
              ${templateContent2}
            </body>
          `,
        },
        {
        },
        {
          name: 'page4',
          component: `
            <body id="iz3s">
              ${templateContent4}
            </body>
          `,
        },
      ],
    },
  };
};

export default function App() {
  const [gjsOptions, setGjsOptions] = React.useState<EditorConfig | null>(null);
  const [pages, setPages] = React.useState<Page[]>([]);
  const [editor, setEditor] = React.useState<Editor | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startPosition, setStartPosition] = React.useState({ x: 0, y: 0 });
  const editorRef = React.useRef<Editor | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  

  React.useEffect(() => {
    initializeGjsOptions().then(setGjsOptions);
  }, []);

  const onEditor = (editor: Editor) => {
    console.log('Editor loaded');
    (window as any).editor = editor;
    editorRef.current = editor;
    setEditor(editor);
    setPages(editor.Pages.getAll());

    editor.on('page:add', () => {
      const newPages = editor.Pages.getAll();
      setPages(newPages);
      updateAllPages(newPages);
    });

    editor.on('load', () => {
      const doc = editor.Canvas.getDocument();
      doc.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.id && target.id.startsWith('linkToPage')) {
          e.preventDefault();
          const pageId = target.id.replace('linkToPage', '');
          const targetPage = editor.Pages.get(pageId);
          if (targetPage) {
            editor.Pages.select(targetPage);
          }
        }
      });
    });

    const boldIconString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type-bold" viewBox="0 0 16 16">
      <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
    </svg>
    `;

    const italicIconString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type-italic" viewBox="0 0 16 16">
        <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
      </svg>
    `;

    const underlineIconString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type-underline" viewBox="0 0 16 16">
        <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"/>
      </svg>
    `

    const strikethroughIconString=`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type-strikethrough" viewBox="0 0 16 16">
        <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.8 2.8 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967"/>
    </svg>
    `

    const linkIconString=`
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
      <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
      <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/>
    </svg>
    `
    const updateComponentStyle = (property, value) => {
      const component = editor.getSelected();
      if (component) {
        const currentStyle = component.getStyle()[property];
        if (currentStyle === value) {
          component.addStyle({ [property]: '' }); // Remove the style
        } else {
          component.addStyle({ [property]: value }); // Apply the style
        }
      }
    };

    

    const handleDeploy = ({ repoOwner, repoName, branch, token }) => {
      const htmlContent = editor.getHtml();
      const cssContent = editor.getCss();
      const pageContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${cssContent}</style>
          <title>Deployed Page</title>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;
  
      const filePath = 'index.html';
      const message = 'Deploy from GrapesJS';
      const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
  
      fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        const sha = data.sha;
  
        return fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            content: btoa(pageContent),
            branch: branch,
            sha: sha
          }),
        });
      })
      .then(response => response.json())
      .then(data => {
        if (data.content) {
          alert('Page deployed successfully!');
          console.log('Page URL:', `https://${repoOwner}.github.io/${repoName}/`);
        } else {
          alert('Deployment failed!');
        }
      })
      .catch(error => {
        console.error('Error during deployment:', error);
        alert('Deployment error!');
      });
    };
    
    const handleToolbarClick = (property, value) => () => {
      updateComponentStyle(property, value);
    };
    // 添加其他图标...
    
    editor.on('component:selected', (model) => {
      // 获取当前组件的工具栏
      let toolbar = [];
      console.log('Selected component:', model.get('tagName'));
      if(model.get('tagName')== 'body'){
        return;
      }
      toolbar.push({
        attributes: { class: 'toolbar-button' },
        command: handleToolbarClick('font-weight', 'bold'), // Bold button
        label: boldIconString,
        id: 'boldIcon'
      });

      toolbar.push({
        attributes: { class: 'toolbar-button' },
        command: handleToolbarClick('font-style', 'italic'), // Italic button
        label: italicIconString,
        id: 'italicIcon'
      });

      toolbar.push({
        attributes: { class: 'toolbar-button' },
        command: handleToolbarClick('text-decoration', 'underline'), // Underline button
        label: underlineIconString,
        id: 'underlineIcon'
      });

      toolbar.push({
        attributes: { class: 'toolbar-button' },
        command: handleToolbarClick('text-decoration', 'line-through'), // Strikethrough button
        label: strikethroughIconString,
        id: 'strikethroughIcon'
      });

      toolbar.push({
        attributes: { class: 'toolbar-button' },
        command: 'custom-link',
        label: linkIconString,
        id: 'linkIcon'
      });
    
      // 更新工具栏
      model.set('toolbar', toolbar);
      // 当组件被选中时的逻辑
      document.querySelector('.gjs-toolbar').classList.remove('hidden');
    });

    editor.on('component:deselected', () => {
      // 清空工具栏
      const selectedModel = editor.getSelected();
      if (selectedModel) {
        selectedModel.set('toolbar', []);
      }
    
      // 隐藏工具栏
      document.querySelector('.gjs-toolbar').classList.add('hidden');
    });
  };
  

  const getSelectedComponent = () => {
    return editor?.getSelected();
  };

  // Start drag
  const startDrag = (e) => {
    const component = getSelectedComponent();
    if (component) {
      setIsDragging(true);
      setStartPosition({ x: e.clientX, y: e.clientY });
    }
  };

  // During drag
  const duringDrag = (e) => {
    if (isDragging) {
      const component = getSelectedComponent();
      if (component) {
        const deltaX = e.clientX - startPosition.x;
        const deltaY = e.clientY - startPosition.y;

        const style:any = component.getStyle() || {};
        const currentLeft = parseInt(style.left || 0);
        const currentTop = parseInt(style.top || 0);


        component.addStyle({
          left: `${currentLeft + deltaX}px`,
          top: `${currentTop + deltaY}px`,
        });

        setStartPosition({ x: e.clientX, y: e.clientY });
      }
    }
  };

  // End drag
  const endDrag = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (editor) {
      const canvas = editor.Canvas.getDocument().body;

      canvas.addEventListener('mousedown', startDrag);
      canvas.addEventListener('mousemove', duringDrag);
      canvas.addEventListener('mouseup', endDrag);

      return () => {
        canvas.removeEventListener('mousedown', startDrag);
        canvas.removeEventListener('mousemove', duringDrag);
        canvas.removeEventListener('mouseup', endDrag);
      };
    }
  }, [editor, isDragging, startPosition]);

  const updateAllPages = (allPages: Page[]) => {
    allPages.forEach((page) => {
      const links = allPages
        .map(
          (p) =>
            `<a href="#" id="linkToPage${p.getId()}">Go to ${p.getName()}</a>`
        )
        .join('<br>');
      const updatedComponent = page.getMainComponent();
      updatedComponent.set(
        'content',
        `
        <body>
          ${updatedComponent.get('content')}
          <footer>
            ${links}
          </footer>
        </body>
      `
      );
    });
  };

  if (!gjsOptions) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <GjsEditor
        className="gjs-custom-editor text-white bg-slate-900"
        grapesjs="https://unpkg.com/grapesjs"
        grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
        options={gjsOptions}
        plugins={[
          {
            id: 'gjs-blocks-basic',
            src: 'https://unpkg.com/grapesjs-blocks-basic',
          },
        ]}
        onEditor={onEditor}
      >
        <div className="flex h-full relative">
          <div className="right-sidebar left-sidebar w-[300px] border-r flex-none">
           {editor && <RightSidebar editor={editor} />} {/* 传递 editor 实例 */}
          </div>
          <div className="flex flex-col flex-grow">
            <Topbar className="min-h-[48px]" />
            <Canvas className="flex-grow bg-black" />
          </div>
        </div>
        <ModalProvider>
          {({ open, title, content, close }) => (
            <CustomModal
              open={open}
              title={title}
              children={content}
              close={close}
            />
          )}
        </ModalProvider>
        <AssetsProvider>
          {({ assets, select, close, Container }) => (
            <Container>
              <CustomAssetManager
                assets={assets}
                select={select}
                close={close}
              />
            </Container>
          )}
        </AssetsProvider>
      </GjsEditor>
    </ThemeProvider>
  );
}
