import React						from 'react';
import axios						from 'axios';
import apiConnect					from '../../apiConnect';

import NameProf						from '../../profile/Name.js';
import ImageProf					from '../../profile/Image.js';
import BioProf						from '../../profile/Bio.js';

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
					logToken: localStorage.getItem('logToken'),
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
			bio,
		} = this.state.data;
		const { editable, profileClass, editComp } = this.state;
		return (
			<div>
				<div className={profileClass} onClick={this.resetEditComp}>
					<div className="topBlock">
						<ImageProf imgs={images} editable={editable}
							setEditComp={this.setEditComp}
							updateImages={this.updateImages}
						/>
						<NameProf
							firstname={firstname} username={username}
							lastname={lastname} editable={editable}
							setEditComp={this.setEditComp}
						/>
					</div>
					<div className="secondBlock">
						<BioProf bio={bio} editable={editable} setEditComp={this.setEditComp} />
					</div>
				</div>
				{editComp}
			</div>
		)
	}
}
