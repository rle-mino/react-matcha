import React						from 'react';
import axios						from 'axios';
import apiConnect					from '../apiConnect';

import FontAwesome					from 'react-fontawesome';
import MatchInput					from './MatchInput';
import ErrorMessage					from './ErrorMessage';

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
				response.data.more.forEach((el) => {
					error[el.path] = el.error;
				});
				this.setState({ ...error, subVal: 'SAVE' });
			} else this.setState({ serverResponse: response.data.details, subVal: 'SAVE' });
		} else {
			this.setState({ subVal: 'SUCCESS' });
			setTimeout(() => {
				this.props.next(e);
			}, 1000);
		}
	}

	render() {
		const { firstname, lastname, subVal, serverResponse } = this.state
		return (
			<div className="nameEdit comp">
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
					<input name="exit" type="button" className="mainButton" value="CANCEL" onClick={this.props.next} />
				</form>
			</div>
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
		this.props.blur();
		this.props.setEditComp(this.state.inEdit ?
			null : <NameEdit next={this.edit} firstname={firstname} lastname={lastname} />);
		this.setState({ inEdit: this.state.inEdit ? false : true });
	}

	render() {
		const { firstname, lastname, username } = this.props;
		return (
			<div className="nameInfo">
				<span className="name">{firstname}</span>,
				<span className="name">{username}</span>,
				<span className="name">{lastname}</span>
				{this.props.editable && <FontAwesome name='pencil' className="editSaveButton" onClick={this.edit} />}
			</div>
		);
	}
}
