import React					from 'react';
import FontAwesome				from 'react-fontawesome';

import './thumbRemovable.sass';

export default class ThumbRemovable extends React.Component {
	state = {
		trashOver: false,
		classCont: 'imgContainer',
	}

	toggleTrash = ({ type }) => this.setState({ trashOver: type.includes('mouseenter') });

	removeEl = (e) => {
		this.setState({ classCont: 'imgContainer leave' });
		setTimeout(async () => {
			// this.setState({ classCont: 'imgContainer' });
			this.props.removeImage();
		}, 300);
	}

	render () {
		const { trashOver, classCont } = this.state;
		return (
			<div className={classCont} >
				<FontAwesome
					name={!!trashOver ? 'trash' : 'trash-o'}
					className="deleteButton"
					onMouseEnter={this.toggleTrash}
					onMouseLeave={this.toggleTrash}
					onClick={this.removeEl}
				/>
				<img src={this.props.src} alt="userIMG" className="image"/>
			</div>
		);
	}
}
