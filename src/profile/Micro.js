import React					from 'react';
import axios					from 'axios';

import './css/micro.sass';

import MicroBlock				from '../components/MicroBlock';

export default class MicroProf extends React.Component {
	state = {
		popularity: null,
		gender: null,
		genderIcon: 'genderless',
		oriIcon: 'genderless',
		orientation: null,
		interToReq: null,
		interestCounter: null,
		visit: null,
		visiter: null,
		editable: false,
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({ ...newProps });
		this.getGenderIcon(newProps.gender);
		this.getOriIcon(newProps.orientation, newProps.gender);
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
			orientation,
			oriIcon,
			interToReq,
			interestCounter,
			visit,
			visiter,
			editable,
		} = this.state;
		return (
			<div className="microProf">
				<MicroBlock label="popularity" value={popularity} icon="fire" />
				<MicroBlock label="gender" value={gender} icon={genderIcon} />
				<MicroBlock label="orientation" value={orientation} icon={oriIcon} />
				<MicroBlock label="interested in you" value={interToReq ? 'match' : 'not yet'} icon="arrows-h" />
				<MicroBlock label="popularity" value={popularity} icon="fire" />
				<MicroBlock label="popularity" value={popularity} icon="fire" />
				<MicroBlock label="popularity" value={popularity} icon="fire" />
			</div>
		);
	}
}
