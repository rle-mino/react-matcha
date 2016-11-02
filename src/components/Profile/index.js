import React						from 'react';
import axios						from 'axios';
import apiConnect					from '../../apiConnect';
import ReactCssTransitionGroup		from 'react-addons-css-transition-group';
import { browserHistory, Link }		from 'react-router';

import NameAgeProf					from '../../profile/NameAge';
import ImageProf					from '../../profile/Image';
import BioProf						from '../../profile/Bio';
import MicroProf					from '../../profile/Micro';
import TagProf						from '../../profile/Tag';
import InterestButton				from '../../profile/InterestButton';

import './profile.sass';

const Confirm = ({next, cancel}) =>
	<ReactCssTransitionGroup
				className="editComp comp"
				transitionName="route"
				transitionAppear={true}
				transitionEnterTimeout={500}
				transitionLeaveTimeout={500}
				transitionAppearTimeout={500}
			>
		<h1 className="mainTitle">ARE YOU SURE?</h1>
		<div className="sureButton">
			<span onClick={next}>YES</span>
		<span onClick={() => cancel(null)}>NO</span>
		</div>
	</ReactCssTransitionGroup>

export default class Profile extends React.Component {
	state = {
		profileClass: 'profile',
		editComp: null,
		data: null,
	}

	componentWillMount() {
		this.setState({ data: this.props.data });
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({ data: newProps.data });
	}

	setEditComp = async (component) => {
		if (this.state.editComp && component && this.state.editComp !== component) return (false);
		if (!component && this.props.editable) {
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

	report = (e) => {
		axios({
			url: `${apiConnect}user/report/fake`,
			method: 'put',
			data: { username: this.state.data.username },
			headers: { Authorization: `Bearer ${localStorage.getItem('logToken')}` }
		}).then(({ data }) => {
			if (data.status === true) {
				browserHistory.push('/matcha/my_profile');
			}
		});
	}

	block = (e) => {
		axios({
			url: `${apiConnect}user/report/block`,
			method: 'put',
			data: { username: this.state.data.username },
			headers: { Authorization: `Bearer ${localStorage.getItem('logToken')}` }
		}).then(({ data }) => {
			if (data.status === true) {
				browserHistory.push('/matcha/my_profile');
			}
		});
	}

	confirm = (e) => {
		if (e.target.className.includes('fake')) {
			this.setEditComp(<Confirm next={this.report} cancel={this.setEditComp} />);
		} else if (e.target.className.includes('block')) {
			this.setEditComp(<Confirm next={this.block} cancel={this.setEditComp} />);
		}
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
			liked,
			alreadyReportAsFake,
			lastConnection,
		} = this.state.data;
		const { editable } = this.props;
		const { profileClass, editComp } = this.state;
		if (!this.state.data) return (<div>LOADING...</div>)
		return (
			<div>
				<div className={profileClass} onClick={this.resetEditComp}>
				<div className="topProf">
					<ImageProf imgs={images} editable={editable}
						setEditComp={this.setEditComp}
					/>
				</div>
					<NameAgeProf
						firstname={firstname} username={username}
						lastname={lastname} age={age} editable={editable}
						setEditComp={this.setEditComp}
					>
					{!editable && (<InterestButton username={username} liked={liked} />)}
					</NameAgeProf>
					<MicroProf popularity={popularity} gender={gender}
						interestedIn={interestedIn} interestedBy={interestedBy}
						orientation={orientation} interToReq={interToReq}
						interestCounter={interestCounter} visiter={visiter}
						location={location} lastConnection={lastConnection}
						setEditComp={this.setEditComp} editable={editable}
					/>
					<BioProf bio={bio} editable={editable} setEditComp={this.setEditComp} />
					<TagProf tags={tags} editable={editable} setEditComp={this.setEditComp} />
					{!editable && <div className="blockReport">
						{!alreadyReportAsFake &&
							<span className="fake" onClick={this.confirm}>REPORT AS FAKE</span>}
							<span className="block" onClick={this.confirm}>BLOCK THIS USER</span>
					</div>}
					{editable &&
						<div className="blockUpdate">
							<Link to="/matcha/update_password">UPDATE YOUR PASSWORD</Link>
							<Link to="/matcha/update_mail">UPDATE YOUR MAIL</Link>
						</div>
					}
				</div>
				{editComp}
			</div>
		)
	}
}
