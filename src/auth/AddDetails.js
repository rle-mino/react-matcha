import React					from 'react';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import axios					from 'axios';
import apiConnect				from '../apiConnect';

import TagInput					from '../components/TagInput.js';
// import ErrorMessage				from '../components/ErrorMessage';
// import MatchInput				from '../components/MatchInput';
import _ from 'lodash';

import './addDetails.css';

class ThreeSelector extends React.Component {
	state = {
		firstC: '',
		secondC: '',
		thirdC: '',
	}

	activate = (e) => {
		this.setState({ firstC: '', secondC: '', thirdC: '' });
		if (e.target.id === this.props.value1) {
			this.setState({ firstC: 'isChecked' });
		} else if (e.target.id === this.props.value2) {
			this.setState({ secondC: 'isChecked' });
		} else {
			this.setState({ thirdC: 'isChecked' });
		}
	}

	render () {
		const { firstC, secondC, thirdC } = this.state;
		return (
			<div className={this.props.className}>
				<div className="beforeInput">
					<div className="labelRadio">{this.props.label}</div>
					{this.props.errorMessage}
				</div>
				<div className="radioInps">
					<input id={this.props.value1} type="radio" name={this.props.name} value={this.props.value1} onClick={this.activate} />
				    <label htmlFor={this.props.value1} className={`radioInp ${firstC}`}>{this.props.label1}</label>
					<input id={this.props.value2} type="radio" name={this.props.name} value={this.props.value2} onClick={this.activate} />
					<label htmlFor={this.props.value2} className={`radioInp ${secondC}`}>{this.props.label2}</label>
				    <input id={this.props.value3} type="radio" name={this.props.name} value={this.props.value3} onClick={this.activate} />
				    <label htmlFor={this.props.value3} className={`radioInp ${thirdC}`}>{this.props.label3}</label>
				</div>
			</div>
		);
	}
}

class BioInput extends React.Component {
	state = {
		isFocused: '',
	}

	focus = () => this.setState({ isFocused: 'isFocused' });
	blur = () => this.setState({ isFocused: '' });

	render() {
		return (
			<div className="bioInput">
				<div className="beforeInput">
					<div className="label">BIO</div>
					{this.props.errorMessage}
				</div>
				<textarea className={`textInp textarea ${this.state.isFocused}`} onFocus={this.focus} onBlur={this.blur}></textarea>
			</div>
		);
	}
}

class AddDetailsForm extends React.Component {
	state = {
		serverResponse: null,
	}

	render() {
		return (
			<div className="addDetailsForm">
				<div className="errorMessageMain">{this.state.serverResponse}</div>
				<form>
					<ThreeSelector name="gender" label="GENDER"
						value1="male" label1="MALE"
						value2="other" label2="OTHER"
						value3="female" label3="FEMALE"
						className="genderSelector"
					/>
					<ThreeSelector name="orientation" label="ORIENTATION"
						value1="gay" label1="GAY"
						value2="bisexual" label2="BISEXUAL"
						value3="straight" label3="STRAIGHT"
						className="orientationSelector"
					/>
					<BioInput />
					<TagInput tags={this.props.tags}/>
					{/* geoloc */}
					<input type="submit" value="ADD DETAILS" className="mainButton" />
				</form>
			</div>
		);
	}
}

export default class AddDetails extends React.Component {
	state = {
		tags: [],
	};

	componentWillMount() {
		axios({
			method: 'get',
			url: `${apiConnect}tag/get/all`,
		})
		.then(({ data }) => {
			this.setState({ tags: data });
		});
	}

	render() {
		const { tags } = this.state;

		return (
			<div>
				{!_.isEmpty(tags) && !_.isNil(tags) && (
					<ReactCssTransitionGroup
						component="div"
						transitionName="route"
						className="addDetailsComponent"
						transitionAppear={true}
						transitionEnterTimeout={500}
						transitionAppearTimeout={500}
						transitionLeaveTimeout={500}
					>
						<div className="mainTitle">ADD DETAILS TO YOUR PROFIL</div>
						<AddDetailsForm tags={tags} />
					</ReactCssTransitionGroup>
				)}
			</div>
		);
	}
}
