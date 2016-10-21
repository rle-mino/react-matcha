import React			from 'react';
import apiConnect		from '../../apiConnect';

import './userFast.sass';

export default class UserFast extends React.Component {
	render() {
		console.log(this.props.data);
		const {
			age,
			dist,
			firstname,
			lastname,
			username,
			gender,
			orientation,
			popularity,
			images,
		} = this.props.data;
		return (
			<li className="userFast">
				<div className="fastIMG" style={{
					backgroundImage: `url('${apiConnect}user/get_img_src/${images ? images[0] : 'undef.jpg' }')`,
				}} />
				<div className="fastBottom">
					<div className="names">
						<span>{firstname}</span>
						<span>{age}</span>
						<span>{lastname}</span>
					</div>
				</div>
			</li>
		);
	}
}