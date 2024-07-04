// SettingItem.tsx
import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';

// 引入图标
import AlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import AlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import AlignRightIcon from '@mui/icons-material/FormatAlignRight';
import JustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import FormatUnderlined from '@mui/icons-material/FormatUnderlined';
import Colorize from '@mui/icons-material/ColorLens';
import Link from '@mui/icons-material/Link';


type SettingItemProps = {
  name: string;
  value: any;
  onChange: (value: any) => void;
  inputType?: 'text' | 'select' | 'checkbox' | 'color' | 'range' | 'icon';
  options?: { label: string; value: string }[];
  iconType?: any;
};

const SettingItem: React.FC<SettingItemProps> = ({
  name,
  value,
  onChange,
  inputType = 'text',
  options = [],
  iconType,
}) => {
  const handleChange = (event: any) => {
    onChange(inputType === 'checkbox' ? event.target.checked : event.target.value);
  };

  // 渲染不同的图标
  const renderIcon = (type: string) => {
    switch (type) {
      case 'left-align':
        return <AlignLeftIcon />;
      case 'center-align':
        return <AlignCenterIcon />;
      case 'right-align':
        return <AlignRightIcon />;
      case 'justify':
        return <JustifyIcon />;
      case 'FormatBold':
        return <FormatBold />;
      case 'link':
        return <Link />;
      case 'color':
        return <Colorize />;
      case 'italic':
        return <FormatItalic />;
      case 'underline':
        return <FormatUnderlined />;
      case 'underline':
        return <FormatUnderlined />;
      default:
        return null;
    }
  };

  return (
    <div className="setting-item">
      {inputType === 'select' && (
        <FormControl variant="outlined" fullWidth>
          <InputLabel>{name}</InputLabel>
          <Select
            value={value}
            onChange={handleChange}
            label={name}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {inputType === 'checkbox' && (
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              onChange={handleChange}
              name={name}
              color="primary"
            />
          }
          label={name}
        />
      )}
      {inputType === 'text' && (
        <TextField
          label={name}
          variant="outlined"
          value={value}
          onChange={handleChange}
          fullWidth
        />
      )}
      {inputType === 'color' && (
        <TextField
          type="color"
          label={name}
          variant="outlined"
          value={value}
          onChange={handleChange}
          fullWidth
        />
      )}
      {inputType === 'range' && (
        <TextField
          type="range"
          label={name}
          variant="outlined"
          value={value}
          onChange={handleChange}
          fullWidth
        />
      )}
      {inputType === 'icon' && iconType && (
        <IconButton
          aria-label={iconType}
          onClick={() => onChange(iconType)}
          className={`icon-button ${iconType}`}
        >
          {renderIcon(iconType)}
        </IconButton>
      )}
    </div>
  );
};

export default SettingItem;
