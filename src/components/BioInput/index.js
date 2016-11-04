import React			from 'react';

import './bioInput.sass';

const BioInput = ({ children, bio, editComp }) => {
	return (
		<div className="bioInput">
			<div className="beforeInput">
				<div className="label">BIO</div>
				{children}
			</div>
			<textarea name="bio" className={`textInp textarea ${!!bio ? 'bioEditComp' : ''}`}
				defaultValue={bio}/>
		</div>
	);
}

export default BioInput;
