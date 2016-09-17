import React from 'react';

import LoadingImg from '../../images/loading.gif';

export default allProps => {
	let {height, style, ...props} = allProps;
	return (
		<div style={{textAlign: 'center', ...style}} {...props}>
			<img src={LoadingImg} height={height || 36} />
		</div>
	);
}