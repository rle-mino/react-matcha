import React			from 'react';

import './matchInput.sass';

export default ({label, children, inputType, inputName}) => {
	return (
		<div className="matchInput">
			<div className="beforeInput">
				<div className="label">{label}</div>
				{children}
			</div>
			<div>
				<input
					type={inputType}
					name={inputName}
					className='textInp'
				/>
			</div>
		</div>
	)
}
