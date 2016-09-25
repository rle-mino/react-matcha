import React					from 'react';
import fuzzy					from 'fuzzy';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';

import './tagInput.css';

export default class TagInput extends React.Component {
	state = {
		tagsList: [],
		tagSugg: [],
		validTag: [],
		isFocused: '',
		suggBlock: '',
	}

	focus = (e) => this.setState({ isFocused: 'isFocused', suggBlock: 'suggBlock' });

	blur = () => this.setState({ isFocused: '', suggBlock: '' });

	handleEntry = (e) => {
		if (e.target.value) {
			const { tags } = this.props;
			const results = fuzzy.filter(e.target.value, tags, {
				extract: el => el.value,
			});
			const matches = results.filter((element, index) => index < 8);
			this.setState({ tagSugg: matches });
		} else this.setState({ tagSugg: [] });
	}

	componentWillReceiveProps = nextProps => {
		this.setState({ tagsList: nextProps.tags });
	}

	render() {
		const { validTag, tagSugg, suggBlock } = this.state;
		const suggTags = tagSugg.map((tag, index) => <li key={index} className="sugg">{tag.string}</li>);
		return (
			<div className="tagInput">
				<div className="beforeInput">
					<div className="label">TAGS</div>
				</div>
				{!!validTag.length && (<div>{validTag.length}</div>)}
				<input type="text" className={`textInp ${this.state.isFocused}`} onFocus={this.focus} onBlur={this.blur} onChange={this.handleEntry}/>
				{/* <ul className={`tagSuggs ${suggBlock}`}> */}
					<ReactCssTransitionGroup
						transitionName="sugg"
						className={`tagSuggs ${suggBlock}`}
						component="ul"
						transitionEnterTimeout={200}
						transitionLeaveTimeout={200}
						transitionAppearTimeout={200}
						transitionAppear={true}
					>
						{suggTags}
					</ReactCssTransitionGroup>
				{/* </ul> */}
			</div>
		);
	}
}
