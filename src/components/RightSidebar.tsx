// RightSidebar.tsx
import React, { useState } from 'react';
import {
  BlocksProvider,
  LayersProvider,
  PagesProvider,
  SelectorsProvider,
  StylesProvider,
  TraitsProvider,
} from '@grapesjs/react';
import {
  mdiBrush,
  mdiLayers,
  mdiViewGridPlus,
  mdiTextBoxMultiple,
  mdiCog,
} from '@mdi/js';
import Icon from '@mdi/react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { cx } from './common';
import CustomBlockManager from './CustomBlockManager';
import CustomPageManager from './CustomPageManager';
import CustomLayerManager from './CustomLayerManager';
import CustomSelectorManager from './CustomSelectorManager';
import CustomStyleManager from './CustomStyleManager';
import CustomTraitManager from './CustomTraitManager';
import './RightSidebar.css'; // 自定义样式

const defaultTabProps = {
  className: '!min-w-0',
};

export default function RightSidebar({
  className,
  editor
}: any) {
  const [selectedUpperTab, setSelectedUpperTab] = useState(0);
  const [selectedLowerTab, setSelectedLowerTab] = useState(0);

  return (
    <div className={cx('gjs-right-sidebar flex flex-col', className)}>
      {/* 上部的 Tab 区域 */}
      <div className="flex justify-center">
        <Tab {...defaultTabProps} label={<Icon size={1} path={mdiCog} color="black" />} onClick={() => setSelectedUpperTab(0)} />
        <Tab {...defaultTabProps} label={<Icon size={1} path={mdiLayers} color="black" />} onClick={() => setSelectedUpperTab(1)} />
        <Tab {...defaultTabProps} label={<Icon size={1} path={mdiViewGridPlus} color="black" />} onClick={() => setSelectedUpperTab(2)} />
      </div>
      {/* 上部内容区 */}
      <div className={cx('overflow-y-auto flex-grow border-t', 'border-gray-300')}>
        {selectedUpperTab === 0 && (
          <TraitsProvider>
            {(props) => <CustomTraitManager editor={editor} {...props} />}
          </TraitsProvider>
        )}
        {selectedUpperTab === 1 && (
          <LayersProvider>
            {(props) => <CustomLayerManager {...props} />}
          </LayersProvider>
        )}
        {selectedUpperTab === 2 && (
          <BlocksProvider>
            {(props) => <CustomBlockManager {...props} />}
          </BlocksProvider>
        )}
      </div>

      {/* 下部的 Tab 区域 */}
      <div className="flex justify-center mt-2">
        <Tab
          {...defaultTabProps}
          label={
            <div className="flex items-center space-x-1">
              <Icon size={1} path={mdiTextBoxMultiple} color="black" />
              <span>新增页面</span>
            </div>
          }
          onClick={() => setSelectedLowerTab(0)}
        />
      </div>
      {/* 下部内容区 */}
      <div className={cx('overflow-y-auto flex-grow border-t', 'border-gray-300')}>
        {selectedLowerTab === 0 && (
          <PagesProvider>
            {(props) => <CustomPageManager {...props} />}
          </PagesProvider>
        )}
      </div>
    </div>
  );
}
