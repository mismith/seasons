import React from 'react';

export default allProps => {
	let {height, style, ...props} = allProps;
	return (
		<div style={{textAlign: 'center', ...style}} {...props}>
			<img src="/static/media/loading.gif" alt="Loading..." height={height || 36} />
		</div>
	);
}