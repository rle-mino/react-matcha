import React			from 'react';

export default class MatchInput extends React.Component {

	state = {
		focusStatus: 'textInp',
	}

	focusedInput = (e) => this.setState({ focusStatus: `${this.state.focusStatus} isFocused` });

	bluredInput = (e) => this.setState({ focusStatus: 'textInp' });

	render() {
		return (
			<div className="matchInput">
				<div className="beforeInput">
					<div className="label">{this.props.label}</div>
					{this.props.errorMessage}
				</div>
				<div>
					<input
					type={this.props.inputType}
					name={this.props.inputName}
					className={this.state.focusStatus}
					onFocus={this.focusedInput}
					onBlur={this.bluredInput}/>
				</div>
			</div>
		)
	}
}
