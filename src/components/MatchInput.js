import React			from 'react';

import './matchInput.sass';

export default class MatchInput extends React.Component {

	render() {
		return (
			<div className="matchInput">
				<div className="beforeInput">
					<div className="label">{this.props.label}</div>
					{this.props.children}
				</div>
				<div>
					<input
						type={this.props.inputType}
						name={this.props.inputName}
						className='textInp'
					/>
				</div>
			</div>
		)
	}
}
