import React					from 'react';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import axios					from 'axios';
import apiConnect				from '../apiConnect';

import TagInput					from '../components/TagInput.js';
import _ from 'lodash';

import './css/addDetails.sass';

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
				<textarea name="bio" className={`textInp textarea ${this.state.isFocused}`} onFocus={this.focus} onBlur={this.blur}></textarea>
			</div>
		);
	}
}

class GeolocInput extends React.Component {
	state = {
		isFocused: '',
		localInval: null,
		geolocButtonVal: 'LOCATE ME',
		geolocButtonDis: false,
		lat: null,
		lng: null,
	}

	focus = () => this.setState({ isFocused: 'isFocused' });
	blur = () => this.setState({ isFocused: '' });

	geoLoc = async (e) => {
		e.preventDefault();
		this.setState({ geolocButtonVal: 'WAIT', geolocButtonDis: true });
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(async(position) => {
				let lat = position.coords.latitude;
				let lng = position.coords.longitude;
				const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}`);
				if (response.data.status === 'OK') {
					this.setState({
						geolocButtonVal: response.data.results[0].formatted_address.toUpperCase(),
						lat,
						lng,
					});
				} else {
					this.setState({ geolocButtonVal: 'FAILED TO LOCATE YOU' });
				}
			}, (error) => {
				this.setState({ geolocButtonVal: error.message.toUpperCase() });
			});
		}
	}

	render() {
		const { geolocButtonVal, geolocButtonDis } = this.state;
		return (
			<div className="geolocInput">
				<div className="beforeInput">
					<div className="label">LOCATION</div>
					{this.props.children}
				</div>
				<input
					type="button"
					className="geolocButton"
					value={geolocButtonVal}
					name="geoloc"
					onClick={this.geoLoc}
					disabled={geolocButtonDis}
				/>
			</div>
		);
	}
}

class AddDetailsForm extends React.Component {
	state = {
		serverResponse: null,
	}

	sendDetails = async (e) => {
		e.preventDefault();
		const { lat, lng } = this.refs.geolocInput.state;
		const data = {
			location: {
				lat,
				lng,
				address: e.target.geoloc.value,
			},
			gender: e.target.gender.value,
			orientation: e.target.orientation.value,
			bio: e.target.bio.value,
			tags: this.refs.tagInput.state.validTag,
		}
		console.log(data);
	}

	render() {
		const { serverResponse } = this.state;
		return (
			<div className="addDetailsForm">
				<div className="errorMessageMain">{serverResponse}</div>
				<form onSubmit={this.sendDetails}>
					<GeolocInput ref="geolocInput"/>
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
					<TagInput tags={this.props.tags} ref="tagInput"/>
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
