import React						from 'react'
import ReactCssTransitionGroup		from 'react-addons-css-transition-group';
import axios						from 'axios';
import apiConnect					from '../apiConnect';

import BioInput						from '../components/BioInput';
import ErrorMessage					from '../components/ErrorMessage';
import FontAwesome					from 'react-fontawesome';

import './css/bio.sass';

class BioEdit extends React.Component {
	state = {
		subVal: 'SAVE',
		subDis: false,
		serverResponse: null,
		bio: null,
	}

	saveBio = async (e) => {
		e.preventDefault();
		this.setState({ bio: null, subVal: 'WAIT', subDis: true })
		const response = await axios({
			method: 'put',
			url: `${apiConnect}user/update_profile`,
			data: {
				bio: e.target.bio.value,
			},
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		});
		if (response.data.status === false) {
			if (response.data.details.includes('invalid request')) {
				const error = [];
				response.data.error.forEach((err) => error[err.path] = err.error)
				this.setState({ ...error, subVal: 'SAVE', subDis: false });
			} else this.setState({ serverResponse: response.data.details, subVal: 'SAVE', subDis: false });
		} else {
			this.setState({ subVal: 'SUCCESS' });
			setTimeout(() => {
				this.props.setEditComp(null);
			}, 1000);
		}
	}

	cancel = (e) => {
		e.preventDefault();
		this.props.setEditComp(null);
	}

	render() {
		const { subVal, serverResponse, bio, subDis } = this.state;
		return (
			<ReactCssTransitionGroup
				className="editComp comp"
				transitionName="route"
				transitionAppear={true}
				transitionEnterTimeout={500}
				transitionLeaveTimeout={500}
				transitionAppearTimeout={500}
			>
				<div className="errorMessageMain">{serverResponse}</div>
				<form onSubmit={this.saveBio}>
					<BioInput bio={this.props.bio} >
						<ErrorMessage message={bio}/>
					</BioInput>
					<input type="submit" value={subVal} className="mainButton" disabled={subDis}/>
					<input type="button" value="CANCEL" className="mainButton" onClick={this.cancel} />
				</form>
			</ReactCssTransitionGroup>
		);
	}
}

export default class BioProf extends React.Component {
	state = {
		inEdit: false,
	}

	edit = (e) => {
		e.preventDefault();
		this.props.setEditComp(<BioEdit bio={this.props.bio} setEditComp={this.props.setEditComp} />)
	}

	render() {
		return (
			<div className="bioProf">
				<div className="beforeBio">
					<h2 className="bioLabel">BIO</h2>
					{this.props.editable && (<FontAwesome name="pencil" className="editBioButton" onClick={this.edit} />)}
				</div>
				<p className="bio">{this.props.bio}</p>
			</div>
		);
	}
}
