import React				from 'react';
import { browserHistory }	from 'react-router';

export default class Unauthorized extends React.Component {
	componentDidMount() {
		setTimeout(() => {
			browserHistory.push('/');
		}, 4000);
	}
	render() {
		return (
			<div className="comp">
				<div className="mainTitle">{this.props.message}</div>
			</div>
		);
	}
}
