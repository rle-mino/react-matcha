import React						from 'react'
import axios						from 'axios';
import apiConnect					from '../apiConnect';

import BioInput						from '../components/BioInput';
import ErrorMessage					from '../components/ErrorMessage';
import RippledButton				from '../components/RippledButton';
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
		if (e.target.bio.value.length > 1000) {
			this.setState({ bio: '1000 LETTERS MAX', subVal: 'SAVE', subDis: false });
			return (false);
		}
		axios({
			method: 'put',
			url: `${apiConnect}user/update_profile`,
			data: {
				bio: e.target.bio.value,
			},
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		}).then(({ data }) => {
			if (data.status === false) {
				if (data.details.includes('invalid request')) {
					const error = [];
					data.error.forEach((err) => error[err.path] = err.error)
					this.setState({ ...error, subVal: 'SAVE', subDis: false });
				} else this.setState({ serverResponse: data.details, subVal: 'SAVE', subDis: false });
			} else {
				this.setState({ subVal: 'SUCCESS' });
				setTimeout(() => {
					this.props.setEditComp(null);
				}, 1000);
			}
		}).catch(() => this.setState({ serverResponse: 'AN ERROR OCCURRED', subDis: false }));
	}

	cancel = (e) => {
		e.preventDefault();
		this.props.setEditComp(null);
	}

	render() {
		const { subVal, serverResponse, bio, subDis } = this.state;
		return (
			<div className="editComp comp">
				<div className="errorMessageMain">{serverResponse}</div>
				<form onSubmit={this.saveBio}>
					<BioInput bio={this.props.bio}>
						<ErrorMessage message={bio}/>
					</BioInput>
					<RippledButton butType="submit" value={subVal} disabled={subDis} />
					<RippledButton butType="button" value="CANCEL" event={this.cancel} />
				</form>
			</div>
		);
	}
}

export default class BioProf extends React.Component {
	state = {
		inEdit: false,
		bioClass: 'bio',
	}

	edit = (e) => {
		e.preventDefault();
		if (!this.props.editable) return (false);
		this.props.setEditComp(<BioEdit bio={this.props.bio} setEditComp={this.props.setEditComp} />)
	}

	showEditable = () => this.setState({ bioClass: 'bio editHover' });

	hideEditable = () => this.setState({ bioClass: 'bio' });

	render() {
		const { bioClass } = this.state;
		return (
			<div className="bioProf" onDoubleClick={this.edit}>
				<div className="beforeBio">
					<h2 className="bioLabel">BIO</h2>
					{this.props.editable && (<FontAwesome name="pencil"
					className="editBioButton" onClick={this.edit}
					onMouseEnter={this.showEditable} onMouseLeave={this.hideEditable}/>)}
				</div>
				<p className={bioClass}>{this.props.bio || 'NO BIO YET'}</p>
			</div>
		);
	}
}
