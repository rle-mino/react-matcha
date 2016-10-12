import React					from 'react';
import axios					from 'axios';

import './css/micro.sass';

export default class MicroProf extends React.Component {
	state = {
		popularity: null,
		gender: null,
		orientation: null,
		interToReq: null,
		interestCounter: null,
		visit: null,
		visiter: null,
		editable: false,
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({ ...newProps });
	}

	render() {
		const {
			popularity,
			gender,
			orientation,
			interToReq,
			interestCounter,
			visit,
			visiter,
			editable,
		} = this.state;
		return (
			<div className="microProf">
			</div>
		);
	}
}
