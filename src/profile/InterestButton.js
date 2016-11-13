import React				from 'react';
import axios				from 'axios';
import apiConnect			from '../apiConnect';

import './css/interestButton.sass';

export default class InterestButton extends React.Component {
	state = {
		liked: false,
		popup: null,
	}

	componentWillMount() {
		this.setState({ liked: this.props.liked });
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({ liked: newProps.liked });
	}

	like = (e) => {
		this.setState({ popup: null });
		axios({
			url: `${apiConnect}user/update_interest`,
			method: 'put',
			data: { username: this.props.username },
			headers: { Authorization: `Bearer ${localStorage.getItem('logToken')}` },
		}).then(({ data }) => {
			if (data.status === false) {
				if (data.details.includes('needs to upload at least one image')) {
					this.setState({ popup: 'YOU HAVE TO UPLOAD AT LEAST ONE IMAGE' });
				} else this.setState({ popup: data.details.toUpperCase() });
			} else {
				this.setState({ liked: !this.state.liked });
			}
		})
	}

	render() {
		const { liked, popup } = this.state;
		return (
			<div className="interestBlock">
				<div className={!popup ? 'invisible' : 'visible'}>
					<div className="popup">{popup}</div>
					<div className="popupAfter"/>
				</div>
				<button className={`interest ${liked ? 'interested' : ''}`} onClick={this.like} />
			</div>
		);
	}
}