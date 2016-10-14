import React				from 'react';

import FontAwesome			from 'react-fontawesome';

import './microBlock.sass';

export default class MicroBlock extends React.Component {

	state = {
		listClass: 'microList',
	}

	render() {
		const { label, value, icon, list } = this.props;
		const { listClass } = this.state;
		const listHTML = list ? list.map((el, key) => <li key={key} className="listEl">{el}</li>) : '';
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
