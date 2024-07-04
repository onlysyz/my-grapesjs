import * as React from 'react';
import { useState } from 'react';
import { TraitsResultProps } from '@grapesjs/react';
import SettingItem from "./SettingItem";

export default function CustomTraitManager({ traits, editor }: Omit<TraitsResultProps, 'Container'> & { editor: any }) {
  // 定义状态来存储设置项的值
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("medium");
  const [alignment, setAlignment] = useState("left");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [color, setColor] = useState("#000000");
  const [link, setLink] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [opacity, setOpacity] = useState(1.0);

  // 获取当前选中的组件
  const getSelectedComponent = () => {
    return editor.getSelected();
  };

  // 更新组件的样式
  const updateComponentStyle = (property, value) => {
    const component = getSelectedComponent();
    if (component) {
      component.setStyle({ [property]: value });
    }
  };

  // 更新组件的属性
  const updateComponentAttribute = (attribute, value) => {
    const component = getSelectedComponent();
    if (component) {
      component.addAttributes({ [attribute]: value });
    }
  };

  // 更新状态和组件样式的 onChange 方法
  const handleFontFamilyChange = (value) => {
    setFontFamily(value);
    updateComponentStyle('font-family', value);
  };

  const handleFontSizeChange = (value) => {
    setFontSize(value);
    const sizeMap = {
      small: '24px',
      medium: '36px',
      large: '48px'
    };
    updateComponentStyle('font-size', sizeMap[value]);
  };

  const handleAlignmentChange = (value) => {
    setAlignment(value);
    updateComponentStyle('text-align', value);
  };

  const handleBoldChange = () => {
    setBold(prev => !prev);
    updateComponentStyle('font-weight', bold ? 'normal' : 'bold');
  };

  const handleItalicChange = () => {
    setItalic(prev => !prev);
    updateComponentStyle('font-style', italic ? 'normal' : 'italic');
  };

  const handleUnderlineChange = () => {
    setUnderline(prev => !prev);
    updateComponentStyle('text-decoration', underline ? 'none' : 'underline');
  };

  const handleColorChange = (value) => {
    setColor(value);
    updateComponentStyle('color', value);
  };

  const handleLinkChange = () => {
    setLink(prev => !prev);
    // Handle link logic here
  };

  const handleTextAlignChange = (value) => {
    setTextAlign(value);
    updateComponentStyle('text-align', value);
  };

  const handleOpacityChange = (value) => {
    setOpacity(value);
    updateComponentStyle('opacity', value);
  };

  return (
    <div className="gjs-custom-style-manager text-left mt-3 p-1">
      {/* 字体和大小在同一行 */}
      <div className="flex space-x-2">
        <SettingItem
          name="字型"
          value={fontFamily}
          onChange={handleFontFamilyChange}
          inputType="select"
          options={[
            { label: "Arial", value: "Arial" },
            { label: "Helvetica", value: "Helvetica" },
            { label: "Times New Roman", value: "Times New Roman" },
          ]}
        />
        <SettingItem
          name="大小"
          value={fontSize}
          onChange={handleFontSizeChange}
          inputType="select"
          options={[
            { label: "Small", value: "small" },
            { label: "Medium", value: "medium" },
            { label: "Large", value: "large" },
          ]}
        />
      </div>

      {/* 位置部分 */}
      <div className="setting-item-full flex flex-x-1 ">
        <SettingItem
          name="位置"
          value={alignment}
          onChange={handleAlignmentChange}
          inputType="select"
          options={[
            { label: "左", value: "left" },
            { label: "中", value: "center" },
            { label: "右", value: "right" },
          ]}
        />
      </div>

      {/* 样式部分 */}
      <div className="flex flex-row mb-4 justify-around">
        <SettingItem
          name="B"
          value={bold}
          onChange={handleBoldChange}
          inputType="icon"
          iconType="FormatBold"
        />
        <SettingItem
          name="I"
          value={italic}
          onChange={handleItalicChange}
          inputType="icon"
          iconType="italic"
        />
        <SettingItem
          name="U"
          value={underline}
          onChange={handleUnderlineChange}
          inputType="icon"
          iconType="underline"
        />
        <SettingItem
          name="A"
          value={color}
          onChange={handleColorChange}
          inputType="icon"
          iconType="color"
        />
        <SettingItem
          name="链接"
          value={link}
          onChange={handleLinkChange}
          inputType="icon"
          iconType="link"
        />
      </div>

      {/* 文本对齐部分 */}
      <div className="flex flex-row mb-4 justify-around">
        <SettingItem
          name=""
          value={textAlign === "left"}
          onChange={() => handleTextAlignChange("left")}
          inputType="icon"
          iconType="left-align"
        />
        <SettingItem
          name=""
          value={textAlign === "center"}
          onChange={() => handleTextAlignChange("center")}
          inputType="icon"
          iconType="center-align"
        />
        <SettingItem
          name=""
          value={textAlign === "right"}
          onChange={() => handleTextAlignChange("right")}
          inputType="icon"
          iconType="right-align"
        />
        <SettingItem
          name=""
          value={textAlign === "justify"}
          onChange={() => handleTextAlignChange("justify")}
          inputType="icon"
          iconType="justify"
        />
      </div>

      {/* 颜色和透明度部分 */}
      <div className="flex space-x-2">
        <SettingItem
          name="颜色"
          value={color}
          onChange={handleColorChange}
          inputType="color"
        />
        <SettingItem
          name="透明度"
          value={opacity}
          onChange={handleOpacityChange}
          inputType="range"
        />
      </div>
    </div>
  );
}
