import React from 'react';

import Divider from 'material-ui/Divider';
import {ListItem} from 'material-ui/List';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export function ListContainer(props) {
  const {style, ...passProps} = props;


  /* children need: style={{marginTop: -33}}} */
  return (
    <ListItem disabled style={{...style}} {...passProps} />
  );  
};

export function ListItemPicker(props) {
  const {items, value, onChange, hintText, floatingLabelText, style, selectStyle, ...passProps} = props;

  return (
    <ListContainer
      style={{...style}}
      {...passProps}
    >
      <SelectField
        value={value}
        onChange={onChange}
        hintText={hintText}
        floatingLabelText={floatingLabelText}
        fullWidth
        style={{marginTop: -10, ...selectStyle}}
      >
      {items.map((item, index) => (
        item === null
          ? <Divider key={index} />
          : <MenuItem key={item.$id} value={item.$id} primaryText={item.name} />
      ))}
        <Divider />
        <MenuItem value={null} primaryText={<em>Clear field</em>} />
      </SelectField>
    </ListContainer>
  );
};