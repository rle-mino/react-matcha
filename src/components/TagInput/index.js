import React						from 'react';
import fuzzy						from 'fuzzy';
import ReactCssTransitionGroup		from 'react-addons-css-transition-group';
import ReactDOM						from 'react-dom';

import ActivTag						from '../ActivTag';

import './tagInput.sass';

const checkLastChar = (last) => {
	return (
		!((last >= 'A' && last <= 'Z') ||
		(last >= 'a' && last <= 'z') ||
		(last >= '0' && last <= '9')) && last !== ' ');
};

export default class TagInput extends React.Component {
	state = {
		tagSugg: [],
		addedTags: [],
		suggBlock: '',
		tip: 'tip invisible',
		ts: null,
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
			const actualTags = this.state.addedTags;
			actualTags.push(escape(e.target.value.substring(0, e.target.value.length - 1)));
			e.target.value = '';
			this.setState({ addedTags: actualTags, tagSugg: [], ts: null });
			return true;
		}
		if (e.target.value.length === 1 && e.target.value.slice(-1) === ' ') e.target.value = '';
		if (e.target.value) {
			const { savedTags } = this.props;
			const results = fuzzy.filter(e.target.value, savedTags, {
				extract: el => el.value,
			});
			const matches = results.filter((element, index) => index < 5);
			this.setState({ tagSugg: matches, ts: null });
		} else {
			this.setState({ tagSugg: [], ts: null });
		}
	}

	removeTag = (index) => {
		const allTags = this.state.addedTags;
		allTags.splice(index, 1);
		this.setState({ addedTags: allTags });
	}

	addTag = (e) => {
		ReactDOM.findDOMNode(this.refs.tagInput).focus();
		ReactDOM.findDOMNode(this.refs.tagInput).value = '';
		e.preventDefault();
		const newTags = this.state.addedTags;
		newTags.push(escape(e.target.innerHTML));
		this.setState({ addedTags: newTags, tagSugg: [] });
	}

	componentWillReceiveProps = (nextProps) => {
		this.setState({ addedTags: nextProps.addedTags || [] });
	}

	componentDidMount() {
		this.setState({ addedTags: this.props.addedTags || [] });
	}

	selectSuggest = (e) => {
		if (e.keyCode === 38 || e.keyCode === 40) {
			e.preventDefault();
			if (this.state.tagSugg.length > 0) {
				let ts;
				if (this.state.ts === null) {
					if (e.keyCode === 40) {
						ts = 0;
					} else {
						ts = this.state.tagSugg.length - 1;
					}
				} else {
					if (e.keyCode === 40) {
						ts = (this.state.ts + 1) % (this.state.tagSugg.length);
					} else {
						ts = (this.state.ts - 1) >= 0 ?
							(this.state.ts - 1) :
							(this.state.tagSugg.length - 1);
					}
				}
				if (this.state.tagSugg[ts]) {
					e.target.value = this.state.tagSugg[ts].string;
				}
				this.setState({ ts });
			}
		}
	}

	render() {
		const { tagSugg, suggBlock, addedTags, tip } = this.state;
		const suggTags = tagSugg.map((tag, index) => <li key={index} onMouseDown={this.addTag} className="sugg">{tag.string}</li>);
		const activTags = addedTags.map((tag, index) => <ActivTag key={index} remove={() => this.removeTag(index)} tag={tag} editable={true} />);
		return (
			<div className="tagInput">
				<div className="beforeInput">
					<div className="label tag">TAGS</div>
					<div className={tip}>PRESS SPACE BAR TO ADD TAG TO THE LIST</div>
					{this.props.children}
				</div>
				<br/>
				<ul className="validTags">
					{activTags}
				</ul>
				<input
					type="text"
					ref="tagInput"
					className={`textInp ${this.state.isFocused}`}
					onFocus={this.focus}
					onBlur={this.blur}
					onChange={this.handleEntry}
					onKeyDown={this.selectSuggest}
				/>
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
