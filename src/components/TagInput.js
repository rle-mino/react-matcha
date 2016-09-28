import React					from 'react';
import fuzzy					from 'fuzzy';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import ReactDOM					from 'react-dom';

import './tagInput.sass';

export default class TagInput extends React.Component {
	state = {
		tagsList: [],
		tagSugg: [],
		validTag: [],
		isFocused: '',
		suggBlock: '',
	}

	focus = (e) => this.setState({ isFocused: 'isFocused', suggBlock: 'suggBlock' });
	blur = () => this.setState({ isFocused: '', suggBlock: '', tagSugg: [] });

	handleEntry = (e) => {
		if (e.target.value.slice(-1) === ' ' && e.target.value.length > 1) {
			const actualTags = this.state.validTag;
			actualTags.push(e.target.value.substring(0, e.target.value.length - 1));
			e.target.value = '';
			this.setState({ validTag: actualTags });
			return true;
		}
		if (e.target.value.length === 1 && e.target.value.slice(-1) === ' ') e.target.value = '';
		if (e.target.value) {
			const { tags } = this.props;
			const results = fuzzy.filter(e.target.value, tags, {
				extract: el => el.value,
			});
			const matches = results.filter((element, index) => index < 5);
			this.setState({ tagSugg: matches });
		} else this.setState({ tagSugg: [] });
	}

	removeTag = (e) => {
		e.preventDefault();
		const allTags = this.state.validTag;
		const newTags = allTags.filter((tag) => tag !== e.target.innerHTML);
		this.setState({ validTag: newTags });
	}

	addTag = (e) => {
		ReactDOM.findDOMNode(this.refs.tagInput).focus();
		ReactDOM.findDOMNode(this.refs.tagInput).value = '';
		e.preventDefault();
		const newTags = this.state.validTag;
		newTags.push(escape(e.target.innerHTML));
		this.setState({ validTag: newTags, tagSugg: [] });
	}

	componentWillReceiveProps = nextProps => {
		this.setState({ tagsList: nextProps.tags });
	}

	render() {
		const { tagSugg, suggBlock, validTag } = this.state;
		const suggTags = tagSugg.map((tag, index) => <li key={index} onMouseDown={this.addTag} className="sugg">{tag.string}</li>);
		const activTags = validTag.map((tag, index) => <li key={index} onClick={this.removeTag} className="validTag">{tag}</li>);
		return (
			<div className="tagInput">
				<div className="beforeInput">
					<div className="label">TAGS</div>
				</div>
				<br/>
					<ReactCssTransitionGroup
						component="div"
						transitionName="validTag"
						className="validTags"
						transitionEnterTimeout={200}
						transitionLeaveTimeout={200}
					>
						{activTags}
					</ReactCssTransitionGroup>
				<input type="text" ref="tagInput" className={`textInp ${this.state.isFocused}`} onFocus={this.focus} onBlur={this.blur} onChange={this.handleEntry}/>
				<ul className={`tagSuggs ${suggBlock}`}>
					<ReactCssTransitionGroup
						transitionName="sugg"
						component="div"
						className={`tagSuggs ${suggBlock}`}
						transitionEnterTimeout={200}
						transitionLeaveTimeout={0}
					>
						{suggTags}
					</ReactCssTransitionGroup>
				</ul>
			</div>
		);
	}
}
