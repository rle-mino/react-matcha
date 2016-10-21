import React			from 'react';
import apiConnect		from '../../apiConnect';

import FontAwesome		from 'react-fontawesome';
import './userFast.sass';

export default class UserFast extends React.Component {
	render() {
		console.log(this.props.data);
		const {
			age,
			dist,
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
					<div title="distance(km)" className="popDist">{dist}<FontAwesome name="map-marker"/></div>
				</div>
				<div className="fastIMG" style={{
					backgroundImage: `url('${apiConnect}user/get_img_src/${images ? images[0] : 'undef.jpg' }')`,
				}} />
				<div className="fastBottom">
					<div className="names">
						<span className="firstname">{firstname}</span>
						<span className="lastname">{lastname}</span>
					</div>
					<span className="age">{age}</span>
					<div className="popOriGender">
						<span>{orientation}</span>
						<span>{gender}</span>
					</div>
				</div>
			</li>
		);
	}
}