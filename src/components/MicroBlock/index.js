import React				from 'react';

import FontAwesome			from 'react-fontawesome';

import './microBlock.sass';

export default class MicroBlock extends React.Component {
	edit = (e) => {
		console.log('edit');
	}

	render() {
		return (
			<div className="microBlock" title={this.props.label}>
				<FontAwesome name={this.props.icon} className="icon" />
				<div className="value">{this.props.value}</div>
			</div>
		);
	}
}
