import React			from 'react';
import apiConnect		from '../../apiConnect';

import FontAwesome		from 'react-fontawesome';
import './userFast.sass';

export default class UserFast extends React.Component {
	state = {
		oriIcon: 'genderless',
		genderIcon: 'genderles',
	}

	getGenderIcon = (gender) => {
		if (gender === 'male') this.setState({ genderIcon: 'mars' });
		else if (gender === 'female') this.setState({ genderIcon: 'venus' });
	}

	getOriIcon = (ori, gender) => {
		if (ori === 'straight') this.setState({ oriIcon: 'venus-mars' });
		else if (ori === 'gay' && gender === 'male') this.setState({ oriIcon: 'mars-double' });
		else if (ori === 'gay' && gender === 'female') this.setState({ oriIcon: 'venus-double' });
		else this.setState({ oriIcon: 'intersex' });
	}

	componentWillReceiveProps = (newProps) => {
		this.getGenderIcon(newProps.data.gender);
		this.getOriIcon(newProps.data.orientation, newProps.data.gender);
	}

	componentWillMount() {
		this.getGenderIcon(this.props.data.gender);
		this.getOriIcon(this.props.data.orientation, this.props.data.gender);
	}

	render() {
		const {
			age,
			distance,
			firstname,
			lastname,
			gender,
			orientation,
			commonTags,
			popularity,
			images,
		} = this.props.data;
		return (
			<li className="userFast">
				<div className="fastTop">
					<div title="popularity" className="popDist"><FontAwesome name="fire"/>{popularity}</div>
					<div title="distance(km)" className="popDist">{distance}<FontAwesome name="map-marker"/></div>
				</div>
				<div className="fastIMG" style={{
					backgroundImage: `url('${apiConnect}user/get_img_src/min/${images.length ? images[0] : 'undef.jpg' }')`,
				}} />
				<div className="fastBottom">
					<div className="names">
						<span className="firstname">{firstname}</span>
						<span className="lastname">{lastname}</span>
					</div>
					<span className="age">{age}</span>
					<div className="bottom">
						<span title="tags in common" className="commonTags">{commonTags}</span>
						<span>{gender}</span>
						<span>{orientation}</span>
					</div>
				</div>
			</li>
		);
	}
}