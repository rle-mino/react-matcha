import React						from 'react';
import axios						from 'axios';
import apiConnect					from '../apiConnect';
import ReactCssTransitionGroup		from 'react-addons-css-transition-group';

import FontAwesome					from 'react-fontawesome';
import MatchInput					from '../components/MatchInput';
import ErrorMessage					from '../components/ErrorMessage';
import ThreeSelector				from '../components/ThreeSelector';

import './css/nameGenderOri.sass';

class NameEdit extends React.Component {
	state = {
		firstname: null,
		lastname: null,
		gender: null,
		orientation: null,
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
		const response = await axios({
			method: 'put',
			url: `${apiConnect}user/update_profile`,
			data: {
				firstname: e.target.firstname.value,
				lastname: e.target.lastname.value,
				gender: e.target.gender.value,
				orientation: e.target.orientation.value,
			},
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		});
		if (response.data.status === false) {
			if (response.data.details === 'invalid request') {
				const error = {}
				response.data.error.forEach((el) => {
					error[el.path] = el.error;
				});
				this.setState({ ...error, subVal: 'SAVE', subDis: false });
			} else {
				this.setState({
					serverResponse: response.data.details,
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
	}

	render() {
		const {
			firstname,
			lastname,
			gender,
			orientation,
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
					<ThreeSelector name="gender" label="GENDER"
						value1="male" label1="MALE"
						value2="other" label2="OTHER"
						value3="female" label3="FEMALE"
						checked={this.props.gender}
						className="genderSelector"
					>
						{gender && (<ErrorMessage message={gender} />)}
					</ThreeSelector>
					<ThreeSelector name="orientation" label="ORIENTATION"
						value1="gay" label1="GAY"
						value2="bisexual" label2="BISEXUAL"
						value3="straight" label3="STRAIGHT"
						checked={this.props.orientation}
						className="orientationSelector"
					>
						{!!orientation && (<ErrorMessage message={orientation} />)}
					</ThreeSelector>
					<input type="submit" className="mainButton" value={subVal} disabled={subDis}/>
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
		const { firstname, lastname, gender, orientation } = this.props;
		if (e.target.className.includes('editSaveButton') && this.state.inEdit) return (false);
		this.props.setEditComp(<NameEdit finish={this.finish} firstname={firstname} lastname={lastname} gender={gender} orientation={orientation} />);
		this.setState({ inEdit: true });
	}

	finish = (e) => {
		this.props.setEditComp(null);
		this.setState({ inEdit: false });
	}

	componentWillReceiveProps = (newProps) => {
		const { firstname, lastname, username, gender, orientation } = newProps;
		this.setState({ firstname, lastname, username, gender, orientation });
	}

	render() {
		const { firstname, lastname, username, gender, orientation } = this.state;
		return (
			<div className="nameGenderOriProf">
			{this.props.editable && <FontAwesome name='pencil' className="editNamesButton" onClick={this.edit} />}
				<div className="names">
					<span className="name">{firstname}</span>
					<span className="name">{lastname}</span>
				</div>
				<div className="userGendOri">
					<span className="gender">{gender}</span>
					<span className="username">{username}</span>
					<span className="orientation">{orientation}</span>
				</div>
			</div>
		);
	}
}
