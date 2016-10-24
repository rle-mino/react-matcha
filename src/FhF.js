import React				from 'react';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';

export default class FhF extends React.Component {
	render() {
		return(
			<ReactCssTransitionGroup
				className="matcha"
				component="div"
				transitionName="route"
				transitionAppear={true}
				transitionEnterTimeout={500}
				transitionLeaveTimeout={500}
				transitionAppearTimeout={500}
			>
				<h1 className="mainTitle">404 NOT FOUND</h1>
			</ReactCssTransitionGroup>
		);
	}
}