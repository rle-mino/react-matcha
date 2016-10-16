import React					from 'react';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';

import ValidTag					from '../components/ActivTag';

import './css/tag.sass';

export default class TagProf extends React.Component {
	remove = (e) => {
		console.log('remove', e.target.innerHTML);
	}

	// TODO remove tag add add tag component

	render() {
		const { tags, editable } = this.props;
		const tagsList = tags ? tags.map((el, key) => <ValidTag key={key} tag={el} editable={editable} linkable={true} remove={this.remove} />) : null;
		return (
			<div className="tagProf">
				<ReactCssTransitionGroup
					component="ul"
					transitionName="validTag"
					className="tagsList"
					transitionEnterTimeout={200}
					transitionLeaveTimeout={200}
				>
					{tagsList}
				</ReactCssTransitionGroup>
			</div>
		);
	}
}
