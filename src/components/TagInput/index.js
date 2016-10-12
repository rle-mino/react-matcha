import React						from 'react';
import fuzzy						from 'fuzzy';
import ReactCssTransitionGroup		from 'react-addons-css-transition-group';
import ReactDOM						from 'react-dom';

import './tagInput.sass';

const checkLastChar = (last) => {
	return (
		!((last >= 'A' && last <= 'Z') ||
		(last >= 'a' && last <= 'z') ||
		(last >= '0' && last <= '9')) && last !== ' ');
};

export default class TagInput extends React.Component {
	state = {
		tagsList: [],
		tagSugg: [],
		validTag: [],
		suggBlock: '',
		tip: 'tip invisible',
	}

	focus = () => this.setState({ suggBlock: 'suggBlock', tip: 'tip' });
	blur = () => this.setState({ suggBlock: '', tagSugg: [], tip: 'tip invisible' });

	handleEntry = (e) => {
		const lastChar = e.target.value.slice(-1);
		const { value } = e.target;
		if (checkLastChar(lastChar)) {
			e.target.value = value.substring(0, value.length - 1);
			return (false);
		}
		if (e.target.value.slice(-1) === ' ' && e.target.value.length > 1) {
			const actualTags = this.state.validTag;
			actualTags.push(escape(e.target.value.substring(0, e.target.value.length - 1)));
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
		const index = allTags.indexOf(e.target.innerHTML);
		allTags.splice(index, 1);
		this.setState({ validTag: allTags });
	}

	addTag = (e) => {
		ReactDOM.findDOMNode(this.refs.tagInput).focus();
		ReactDOM.findDOMNode(this.refs.tagInput).value = '';
		e.preventDefault();
		const newTags = this.state.validTag;
		newTags.push(escape(e.target.innerHTML));
		this.setState({ validTag: newTags, tagSugg: [] });
	}

	componentWillReceiveProps = (nextProps) => {
		this.setState({ tagsList: nextProps.tags });
	}

	render() {
		const { tagSugg, suggBlock, validTag, tip } = this.state;
		const suggTags = tagSugg.map((tag, index) => <li key={index} onMouseDown={this.addTag} className="sugg">{tag.string}</li>);
		const activTags = validTag.map((tag, index) => <li key={index} onClick={this.removeTag} className="validTag">{tag}</li>);
		return (
			<div className="tagInput">
				<div className="beforeInput">
					<div className="label tag">TAGS</div>
					<div className={tip}>PRESS SPACE BAR TO ADD TAG TO THE LIST</div>
					{this.props.children}
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
