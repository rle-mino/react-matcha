import React				from 'react';
import { Link }				from 'react-router'

import FontAwesome			from 'react-fontawesome';

import './microBlock.sass';

export default class MicroBlock extends React.Component {

	state = {
		listClass: 'microList',
	}

	render() {
		const { label, value, icon, list } = this.props;
		const { listClass } = this.state;
		const listHTML = list ? list.map((el, key) => <li className="listEl" key={key}><Link to={`/matcha/profile/${el}`}>{el}</Link></li>) : '';
		return (
			<div className="micro">
				<div className="microBlock" title={label}>
					<FontAwesome name={icon} className="icon" />
					<div className="value">{value}</div>
				</div>
				{list && (<ul className={listClass} >{listHTML}</ul>)}
			</div>
		);
	}
}
