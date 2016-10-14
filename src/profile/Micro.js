import React					from 'react';
import axios					from 'axios';

import './css/micro.sass';

import MicroBlock				from '../components/MicroBlock';
import FontAwesome				from 'react-fontawesome';

export default class MicroProf extends React.Component {
	state = {
		popularity: null,
		gender: null,
		genderIcon: 'genderless',
		oriIcon: 'genderless',
		orientation: null,
		interToReq: null,
		interestCounter: null,
		interestedIn: [],
		visiter: [],
		editable: false,
		visiterListClass: 'microList',
		interestedListClass: 'microList',
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({ ...newProps });
		this.getGenderIcon(newProps.gender);
		this.getOriIcon(newProps.orientation, newProps.gender);
	}

	componentWillMount() {
		this.setState({ ...this.props });
		this.getGenderIcon(this.props.gender);
		this.getOriIcon(this.props.orientation, this.props.gender);
	}

	getGenderIcon = (gender) => {
		if (gender === 'male') this.setState({ genderIcon: 'mars' });
		else if (gender === 'female') this.setState({ genderIcon: 'venus' });
		else this.setState({ genderIcon: 'transgender-alt' });
	}

	getOriIcon = (ori, gender) => {
		if (ori === 'straight') this.setState({ oriIcon: 'venus-mars' });
		else if (ori === 'gay' && gender === 'male') this.setState({ oriIcon: 'mars-double' });
		else if (ori === 'gay' && gender === 'female') this.setState({ oriIcon: 'venus-double' });
		else this.setState({ oriIcon: 'genderless' });
	}

	render() {
		const {
			popularity,
			gender,
			genderIcon,
			interestedIn,
			interestedBy,
			orientation,
			oriIcon,
			interToReq,
			visiter,
			location,
			editable,
		} = this.state;
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
					{interestedIn && <MicroBlock label="interested in" value={interestedIn.length} list={interestedIn} icon="gratipay" />}
					{interestedBy && <MicroBlock label="interested by" value={interestedBy.length} list={interestedBy} icon="heartbeat" />}
					<MicroBlock label="location" value={location} icon="map-marker" />
					<FontAwesome name="pencil" className="editMicro" />
				</div>
				}
			</div>
		);
	}
}
