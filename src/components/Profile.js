import React						from 'react'

import NameInfo						from './Name.js'

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

	blur = () => this.setState({ profileClass: this.state.profileClass.includes('isBlurred') ?
									'profile' : 'profile isBlurred' });

	setEditComp = (component) => {
		if (this.state.editComp && component && this.state.editComp !== component) return (false);
		this.setState({ editComp: component })
	};

	render() {
		const {
			firstname,
			username,
			lastname,
		} = this.state.data;
		const { editable, profileClass, editComp } = this.state;
		return (
			<div>
				<div className={profileClass}>
					<NameInfo
						firstname={firstname} username={username}
						lastname={lastname} editable={editable}
						blur={this.blur} setEditComp={this.setEditComp}
					/>
				</div>
				{editComp}
			</div>
		)
	}
}
