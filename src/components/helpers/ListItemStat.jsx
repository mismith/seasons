import React from 'react';

import {ListItem} from 'material-ui/List';

export default function ListItemStat(allProps) {
  let {stat, secondaryText, children, ...props} = allProps;
  if (typeof secondaryText === 'string') {
    secondaryText = <div style={{textAlign: 'right'}}>{secondaryText}</div>
  }
  return (
    <ListItem secondaryText={secondaryText} {...props}>
      {children}
      <span style={{float: 'right'}}>{stat}</span>
    </ListItem>
  );
}