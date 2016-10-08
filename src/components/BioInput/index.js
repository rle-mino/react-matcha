import React			from 'react';

import './bioInput.sass';

const BioInput = ({children, bio}) => {
	return (
		<div className="bioInput">
			<div className="beforeInput">
				<div className="label">BIO</div>
				{children}
			</div>
			<textarea name="bio" className="textInp textarea" defaultValue={bio}/>
		</div>
	);
}

export default BioInput;
