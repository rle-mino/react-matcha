import React						from 'react';
import axios						from 'axios';
import apiConnect					from '../apiConnect';
import ReactCssTransitionGroup		from 'react-addons-css-transition-group';

import FontAwesome					from 'react-fontawesome';
import MatchInput					from '../components/MatchInput';
import ErrorMessage					from '../components/ErrorMessage';
import RippledButton				from '../components/RippledButton';

import './css/nameAge.sass';

class NameEdit extends React.Component {
	state = {
		firstname: null,
		lastname: null,
		subVal: 'SAVE',
		serverResponse: null,
		subDis: false,
	}

	sendNames = async (e) => {
		e.preventDefault();
		e.persist()
		this.setState({
			subVal: 'WAIT',
			firstname: null,
			lastname: null,
			serverResponse: null,
			subDis: true,
		});
		axios({
			method: 'put',
			url: `${apiConnect}user/update_profile`,
			data: {
				firstname: e.target.firstname.value,
				lastname: e.target.lastname.value,
			},
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		}).then(({ data }) => {
			if (data.status === false) {
				if (data.details === 'invalid request') {
					const error = {}
					data.error.forEach((el) => {
						error[el.path] = el.error;
					});
					this.setState({ ...error, subVal: 'SAVE', subDis: false });
				} else {
					this.setState({
						serverResponse: data.details,
						subVal: 'SAVE',
						subDis: false,
					});
				}
			} else {
				this.setState({ subVal: 'SUCCESS' });
				setTimeout(() => {
					this.props.finish(e);
				}, 1000);
			}
		}).catch(() => this.setState({ serverResponse: 'AN ERROR OCCURRED', subVal: 'ERROR' }));
	}

	render() {
		const {
			firstname,
			lastname,
			subVal,
			serverResponse,
			subDis,
		} = this.state
		return (
			<ReactCssTransitionGroup
				className="editComp comp"
				transitionName="route"
				transitionAppear={true}
				transitionEnterTimeout={500}
				transitionAppearTimeout={500}
				transitionLeaveTimeout={500}
			>
				<div className="errorMessageMain">{serverResponse}</div>
				<form onSubmit={this.sendNames}>
					<MatchInput label="FISTNAME" inputName="firstname"
					inputType="text" value={this.props.firstname}>
						{firstname && <ErrorMessage message={firstname} />}
					</MatchInput>
					<MatchInput label="LASTNAME" inputName="lastname"
					inputType="text" value={this.props.lastname}>
						{lastname && <ErrorMessage message={lastname} />}
					</MatchInput>
					<RippledButton butType="submit" value={subVal} disabled={subDis} />
					<RippledButton butType="button" value="CANCEL" event={this.props.finish} />
				</form>
			</ReactCssTransitionGroup>
		);
	}
}

export default class NameInfo extends React.Component {
	state = {
		inEdit: false,
	}

	edit = (e) => {
		const { firstname, lastname } = this.props;
		if (e.target.className.includes('editSaveButton') && this.state.inEdit) return (false);
		this.props.setEditComp(<NameEdit finish={this.finish} firstname={firstname} lastname={lastname} />);
		this.setState({ inEdit: true });
	}

	finish = (e) => {
		this.props.setEditComp(null);
		this.setState({ inEdit: false });
	}

	render() {
		const { firstname, lastname, username, age, editable } = this.props;
		return (
			<div className="nameAgeProf">
				<div className="names">
					<span className="name">{firstname}</span>
					<span className="name">
						{lastname}
						{editable && <FontAwesome name='pencil' className="editNamesButton" onClick={this.edit} />}
						{this.props.children}
					</span>
				</div>
				<div className="userAge">
					<span className="box3 username">{username}</span>
					<span className="box3 pipe">|</span>
					<span className="box3 age">{age}</span>
				</div>
			</div>
		);
	}
}
