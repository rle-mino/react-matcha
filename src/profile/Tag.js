import React					from 'react';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import axios					from 'axios';
import apiConnect				from '../apiConnect';

import FontAwesome				from 'react-fontawesome';
import TagInput					from '../components/TagInput';
import ValidTag					from '../components/ActivTag';
import RippledButton			from '../components/RippledButton';

import './css/tag.sass';

class EditTags extends React.Component{
	state = {
		serverResponse: null,
		savedTags: [],
		addedTags: [],
		subVal: 'SAVE',
		subDis: false,
	}

	componentWillMount() {
		axios({
			url: `${apiConnect}tag/all`,
			method: 'get',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			}
		}).then(({ data }) => {
			if (data) this.setState({ savedTags: data });
		})
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({ addedTags: newProps.addedTags });
	}

	componentDidMount() {
		this.setState({ addedTags: this.props.addedTags });
	}

	sendTags = (e) => {
		e.preventDefault();
		this.setState({ serverResponse: null, subDis: true, subVal: 'WAIT' });
		axios({
			url: `${apiConnect}user/update_profile`,
			method: 'put',
			data: {
				tags: this.refs.tagInput.state.addedTags,
			},
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		}).then(({ data }) => {
			if (data.status === false) this.setState({ serverResponse: data.details, subDis: false, subVal: 'SAVE' });
			else {
				this.setState({ subVal: 'SUCCESS' });
				setTimeout(() => {
					this.props.setEditComp(null);
				}, 1000);
			}
		}).catch(() => this.setState({ serverResponse: 'AN ERROR OCCURRED', subVal: 'ERROR' }));
	}

	finish = (e) => {
		e.preventDefault();
		this.props.setEditComp(null);
	}

	render() {
		const { serverResponse, savedTags, subVal, subDis, addedTags } = this.state;
		return (
			<ReactCssTransitionGroup
				className="editComp comp"
				transitionName="route"
				transitionAppear={true}
				transitionEnterTimeout={500}
				transitionLeaveTimeout={500}
				transitionAppearTimeout={500}
			>
				<div className="errorMessageMain">{serverResponse}</div>
				<form onSubmit={this.sendTags}>
					<TagInput addedTags={addedTags} savedTags={savedTags} ref="tagInput" />
					<RippledButton butType="submit" value={subVal} disabled={subDis} />
					<RippledButton butType="button" value="CANCEL" event={this.finish} />
				</form>
			</ReactCssTransitionGroup>
		);
	}
}

export default class TagProf extends React.Component {
	state = {
		tagsListClass: 'tagsList',
	}

	edit = (e) => {
		e.preventDefault();
		const { editable, setEditComp, tags } = this.props;
		if (!editable) return (false);
		setEditComp(<EditTags setEditComp={setEditComp} addedTags={tags} />)
	}

	showEditable = () => this.setState({ tagsListClass: 'tagsList editHover' });

	hideEditable = () => this.setState({ tagsListClass: 'tagsList' });

	render() {
		const { tags, editable } = this.props;
		const { tagsListClass } = this.state;
		const addedTags = tags ? tags.map((el, key) => <ValidTag key={key} tag={el} editable={false} linkable={true} remove={this.remove} />) : null;
		return (
			<div className="tagProf" onDoubleClick={this.edit}>
				<div className="beforeTags">
					<div className="tagLabel">TAGS</div>
					{editable && <FontAwesome name="pencil" className="editTagsButton"
					onMouseEnter={this.showEditable} onMouseLeave={this.hideEditable} onClick={this.edit}/>}
				</div>
				{((addedTags && addedTags.length > 1) && <ul className={tagsListClass}>
					{addedTags}
				</ul>) || (<div>NO TAGS YET</div>)}
			</div>
		);
	}
}
