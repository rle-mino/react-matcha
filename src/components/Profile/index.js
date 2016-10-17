import React						from 'react';
import axios						from 'axios';
import apiConnect					from '../../apiConnect';

import NameAgeProf					from '../../profile/NameAge';
import ImageProf					from '../../profile/Image';
import BioProf						from '../../profile/Bio';
import MicroProf					from '../../profile/Micro';
import TagProf						from '../../profile/Tag';

import './profile.sass';

export default class Profile extends React.Component {
	state = {
		data: {},
		editable: false,
		profileClass: 'profile',
		editComp: null,
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({ data: newProps.data, editable: newProps.editable });
	}

	componentWillMont() {
		this.setState({ data: this.props.data, editable: this.props.editable });
	}

	setEditComp = async (component) => {
		if (this.state.editComp && component && this.state.editComp !== component) return (false);
		if (!component) {
			const response = await axios({
				method: 'get',
				url: `${apiConnect}user/singular/all`,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('logToken')}`,
				},
			});
			if (response.data.status === true) {
				this.setState({ data: response.data.more });
			}
		}
		this.setState({ editComp: component, profileClass: this.state.profileClass.includes('isBlurred') ?
										'profile' : 'profile isBlurred' });
	};

	resetEditComp = (e) => {
		e.preventDefault();
		if (this.state.editComp) this.setState({ editComp: null, profileClass: 'profile' });
	}

	render() {
		const {
			firstname,
			username,
			lastname,
			images,
			age,
			bio,
			orientation,
			gender,
			popularity,
			interestCounter,
			interToReq,
			interestedIn,
			interestedBy,
			location,
			visiter,
			tags,
		} = this.state.data;
		console.log(this.state.data);
		const { editable, profileClass, editComp } = this.state;
		return (
			<div>
				<div className={profileClass} onClick={this.resetEditComp}>
					<ImageProf imgs={images} editable={editable}
						setEditComp={this.setEditComp}
						updateImages={this.updateImages}
					/>
					<NameAgeProf
						firstname={firstname} username={username}
						lastname={lastname} age={age} editable={editable}
						setEditComp={this.setEditComp}
					/>
					<MicroProf popularity={popularity} gender={gender}
						interestedIn={interestedIn} interestedBy={interestedBy}
						orientation={orientation} interToReq={interToReq}
						interestCounter={interestCounter} visiter={visiter}
						location={location}
						setEditComp={this.setEditComp} editable={editable}
					/>
					<BioProf bio={bio} editable={editable} setEditComp={this.setEditComp} />
					<TagProf tags={tags} editable={editable} setEditComp={this.setEditComp} />
				</div>
				{editComp}
			</div>
		)
	}
}
