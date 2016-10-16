import React					from 'react';
import axios					from 'axios';
import apiConnect				from '../apiConnect';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';

import MicroBlock				from '../components/MicroBlock';
import FontAwesome				from 'react-fontawesome';
import ErrorMessage				from '../components/ErrorMessage';
import ThreeSelector			from '../components/ThreeSelector';
import MatchInput				from '../components/MatchInput';

import './css/micro.sass';

class MicroEdit extends React.Component {

	state = {
		subVal: 'SAVE',
		subDis: false,
		location: null,
		gender: null,
	}

	checkAddress = async (value) => {
		if (!value) return (null);
		const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${value}`);
		if (response.data.status === 'OK') {
			const result = response.data.results[0];
			return ({
				address: result.formatted_address.toUpperCase(),
				lat: result.geometry.location.lat,
				lng: result.geometry.location.lng,
			});
		}
		return (false);
	}

	send = async (e) => {
		e.preventDefault();
		e.persist()
		const location = await this.checkAddress(e.target.location.value)
		if (location === false) {
			this.setState({ location: 'INVALID ADDRESS', subVal: 'SAVE', subDis: false });
			return (false);
		}
		this.setState({ subVal: 'WAIT', subDis: true });
		axios({
			method: 'put',
			url: `${apiConnect}user/update_profile`,
			data: {
				gender: e.target.gender.value,
				orientation: e.target.orientation.value,
				location,
			},
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			}
		}).then(({data}) => {
			if (data.status === false) {
				if (data.details === 'invalid request') {
					const error = {};
					data.error.forEach((el) => error[el.path] = el.error);
				} else {
					this.setState({ serverResponse: data.details, subVal: 'SEND', subDis: false });
				}
			} else {
				this.setState({ subVal: 'SUCCESS' });
				setTimeout(() => this.props.setEditComp(null), 1000);
			}
		}).catch((err) => {console.log(err);this.setState({ subVal: 'ERROR', serverResponse: 'AN ERROR OCCURRED' })});
	}

	cancel = (e) => {
		e.preventDefault();
		this.props.setEditComp(null);
	}

	render() {
		const { props } = this;
		const { subVal, subDis, gender, orientation, location } = this.state;
		return (
			<ReactCssTransitionGroup
				className="editComp comp"
				transitionName="route"
				transitionAppear={true}
				transitionEnterTimeout={500}
				transitionLeaveTimeout={500}
				transitionAppearTimeout={500}
			>
				<form onSubmit={this.send}>
					<ThreeSelector name="gender" label="GENDER"
								   value1="male" label1="MALE"
								   value2="other" label2="OTHER"
								   value3="female" label3="FEMALE"
								   checked={props.gender}
								   className="genderSelector"
					>
						<ErrorMessage message={gender} />
					</ThreeSelector>
					<ThreeSelector name="orientation" label="ORIENTATION"
								   value1="gay" label1="GAY"
								   value2="bisexual" label2="BISEXUAL"
								   value3="straight" label3="STRAIGHT"
								   checked={props.orientation}
								   className="orientationSelector"
					>
						<ErrorMessage message={orientation} />
					</ThreeSelector>
					<MatchInput label="LOCATION" inputName="location" inputType="text" value={props.location}>
						<ErrorMessage message={location} />
					</MatchInput>
					<input type="submit" value={subVal} className="mainButton" disabled={subDis}/>
					<input type="button" value="CANCEL" className="mainButton" onClick={this.cancel} />
				</form>
			</ReactCssTransitionGroup>
		);
	}
}

export default class MicroProf extends React.Component {
	state = {
		genderIcon: 'genderless',
		oriIcon: 'genderless',
		visiterListClass: 'microList',
		interestedListClass: 'microList',
	};

	componentWillReceiveProps = (newProps) => {
		this.getGenderIcon(newProps.gender);
		this.getOriIcon(newProps.orientation, newProps.gender);
	};

	componentWillMount() {
		this.getGenderIcon(this.props.gender);
		this.getOriIcon(this.props.orientation, this.props.gender);
	}

	getGenderIcon = (gender) => {
		if (gender === 'male') this.setState({ genderIcon: 'mars' });
		else if (gender === 'female') this.setState({ genderIcon: 'venus' });
		else this.setState({ genderIcon: 'transgender-alt' });
	};

	getOriIcon = (ori, gender) => {
		if (ori === 'straight') this.setState({ oriIcon: 'venus-mars' });
		else if (ori === 'gay' && gender === 'male') this.setState({ oriIcon: 'mars-double' });
		else if (ori === 'gay' && gender === 'female') this.setState({ oriIcon: 'venus-double' });
		else this.setState({ oriIcon: 'genderless' });
	};

	edit = (e) => {
		const { gender, orientation, location } = this.props
		e.preventDefault();
		this.props.setEditComp(<MicroEdit gender={gender} orientation={orientation}
								location={location} setEditComp={this.props.setEditComp}/>)
	}

	render() {
		const {
			genderIcon,
			oriIcon,
		} = this.state;
		const {
			popularity,
			gender,
			interestedIn,
			interestedBy,
			orientation,
			interToReq,
			visiter,
			location,
			editable
		} = this.props;
		return (
			<div>
				<div className="microProf">
					<MicroBlock label="popularity" value={popularity} icon="fire" />
					<MicroBlock label="gender" value={gender} icon={genderIcon} />
					<MicroBlock label="orientation" value={orientation} icon={oriIcon} />
					<MicroBlock label="interested in you" value={interToReq ? 'yes' : 'not yet'} icon="arrows-h" />
				</div>
				{editable &&
				<div className="microProf private">
					{visiter && <MicroBlock label="visit" value={visiter.length} list={visiter} icon="bar-chart" />}
					{interestedIn && <MicroBlock label="interested in" value={interestedIn.length}
												 list={interestedIn} icon="gratipay" />}
					{interestedBy && <MicroBlock label="interested by" value={interestedBy.length}
												 list={interestedBy} icon="heartbeat" />}
					<MicroBlock label="location" value={location} icon="map-marker" />
					<FontAwesome name="pencil" className="editMicro" onClick={this.edit} />
				</div>
				}
			</div>
		);
	}
}
