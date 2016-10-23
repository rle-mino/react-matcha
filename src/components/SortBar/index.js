import React                from 'react';
import ripple				from '../../ripple';

import './sortBar.sass';

export default class SortBar extends React.Component {

	render() {
		const { defaultSort } = this.props;
		return (
			<div className="sortBar">
				<div className="label">SORT BY</div>
				<div className="sortButtons">
					<input type="radio" value="popularity" id="popularity" name="sort" defaultChecked={ defaultSort === 'popularity'} />
					<label htmlFor="popularity" onClick={ripple}>POPULARITY</label>
					<input type="radio" value="commonTags" id="commonTags" name="sort" defaultChecked={ defaultSort === 'commonTags'} />
					<label htmlFor="commonTags" onClick={ripple}>COMMON TAGS</label>
					<input type="radio" value="age" id="age" name="sort" defaultChecked={ defaultSort === 'age'} />
					<label htmlFor="age" onClick={ripple}>AGE</label>
					<input type="radio" value="distance" id="distance" name="sort" defaultChecked={ defaultSort === 'sort'} />
					<label htmlFor="distance" onClick={ripple}>DISTANCE</label>
				</div>
			</div>
		)
	}
}