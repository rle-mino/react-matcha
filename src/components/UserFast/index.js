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
		const { oriIcon, genderIcon } = this.state;
		return (
			<li className="userFast">
				<div className="fastIMG" style={{
					backgroundImage: `url('${apiConnect}user/get_img_src/${images ? images[0] : 'undef.jpg' }')`,
				}} />
				<div className="fastBottom">
					<div className="fastTop">
						<div title="popularity" className="popDist"><FontAwesome name="fire"/>{popularity}</div>
						<div title="distance(km)" className="popDist">{distance}<FontAwesome name="map-marker"/></div>
					</div>
					<div className="names">
						<span className="firstname">{firstname}</span>
						<span className="lastname">{lastname}</span>
					</div>
					<span className="age">{age}</span>
					<span className="commonTags">{`${commonTags} tag${commonTags > 1 ? 's' : ''} in common`}</span>
					<div className="popOriGender">
						<span><FontAwesome name={oriIcon} />{orientation}</span>
						<span><FontAwesome name={genderIcon} />{gender}</span>
					</div>
				</div>
			</li>
		);
	}
}