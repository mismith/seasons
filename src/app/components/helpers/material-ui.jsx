import React from 'react';

export function ListContainer(allProps) {
	let {style, ...props} = allProps;
	return (
		<div style={{paddingLeft: 16, paddingRight: 16, paddingBottom: 16, ...style}} {...props} />
	);	
};