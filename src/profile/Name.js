import React						from 'react';
import axios						from 'axios';
import apiConnect					from '../apiConnect';
import ReactCssTransitionGroup		from 'react-addons-css-transition-group';

import FontAwesome					from 'react-fontawesome';
import MatchInput					from '../components/MatchInput';
import ErrorMessage					from '../components/ErrorMessage';

import './name.sass';

class NameEdit extends React.Component {
	state = {
		firstname: null,
		lastname: null,
		subVal: 'SAVE',
		serverResponse: null,
	}

	sendNames = async (e) => {
		e.preventDefault();
		e.persist()
		this.setState({ subVal: 'WAIT', firstname: null, lastname: null, serverResponse: null });
		const response = await axios({
			method: 'put',
			url: `${apiConnect}user/update_profile`,
			data: {
				firstname: e.target.firstname.value,
				lastname: e.target.lastname.value,
			},
			headers: {
				logToken: localStorage.getItem('logToken'),
			},
		});
		if (response.data.status === false) {
			if (response.data.details === 'invalid request') {
				const error = {}
				response.data.error.forEach((el) => {
					error[el.path] = el.error;
				});
				this.setState({ ...error, subVal: 'SAVE' });
			} else this.setState({ serverResponse: response.data.details, subVal: 'SAVE' });
		} else {
			this.setState({ subVal: 'SUCCESS' });
			setTimeout(() => {
				this.props.finish(e);
			}, 1000);
		}
	}

	render() {
		const { firstname, lastname, subVal, serverResponse } = this.state
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
					<MatchInput
						label="FISTNAME"
						inputName="firstname"
						inputType="text"
						value={this.props.firstname}
					>
						{firstname && <ErrorMessage message={firstname} />}
					</MatchInput>
					<MatchInput
						label="LASTNAME"
						inputName="lastname"
						inputType="text"
						value={this.props.lastname}
					>
						{lastname && <ErrorMessage message={lastname} />}
					</MatchInput>
					<input type="submit" className="mainButton" value={subVal} />
					<input name="exit" type="button" className="mainButton" value="CANCEL" onClick={this.props.finish} />
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

	componentWillReceiveProps = (newProps) => {
		const { firstname, lastname, username } = newProps;
		this.setState({ firstname, lastname, username });
	}

	componentWillMont() {
		const { firstname, lastname, username } = this.props;
		this.setState({ firstname, lastname, username });
	}

	render() {
		const { firstname, lastname, username } = this.state;
		return (
			<div className="nameInfo">
				<span className="name">{firstname}</span>
				<span className="name">{username}</span>
				<span className="name">{lastname}</span>
				{this.props.editable && <FontAwesome name='pencil' className="editNamesButton" onClick={this.edit} />}
			</div>
		);
	}
}
