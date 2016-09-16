import React from 'react';

import LoadingIcon from '../../images/loading.svg';

export default allProps => {
	let {height, style, ...props} = allProps;
	return (
		<div style={Object.assign({textAlign: 'center'}, style)} {...props}>
			<img src={LoadingIcon} height={height || 36} />
		</div>
	);
}