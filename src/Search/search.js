import React					from 'react';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import InputRange				from 'react-input-range';

// import MatchInput				from '../components/MatchInput';
import FontAwesome				from 'react-fontawesome';

import './css/search.sass'
import './css/inputRange.sass';

const SearchInput = ({ children, label }) =>
	<div className="searchInput">
		<div className="searchLabel">{label}</div>
		{children}
	</div>

export default class Search extends React.Component {
	state = {
		subDis: false,
		subVal: '&nbsp;',
		clickX: 0,
		clickY: 0,
		rippled: '',
		ageVal: {
			min: 18,
			max: 100,
		},
		popVal: {
			min: 0,
			max: 100,
		},
		distVal: {
			min: 0,
			max: 100,
		},
		tagVal: {
			min: 0,
			max: 100,
		},
	}

	search = (e) => {
		e.preventDefault();
		const data = {
			name: e.target.name.value,
		}
	}

	updateAge = (comp, values) => this.setState({ ageVal: values });
	updatePop = (comp, values) => this.setState({ popVal: values });
	updateDist = (comp, values) => this.setState({ distVal: values });
	updateTag = (comp, values) => this.setState({ tagVal: values });

	ripple = (e) => {
		e.persist();
		const size = 5
		const rect = e.target.getBoundingClientRect();
		const circle = document.createElement('div');
		circle.style.left = `${e.clientX - rect.left}px`;
		circle.style.top = `${e.clientY - rect.top}px`;
		circle.style.width = circle.style.height = `${size}px`;
		circle.className = 'rippled';
		e.target.appendChild(circle);
		setTimeout(() => {
			e.target.removeChild(circle);
		}, 500);
	}

	render() {
		const {
			ageVal,
			popVal,
			distVal,
			tagVal,
			subDis,
		} = this.state;
		return (
			<ReactCssTransitionGroup
				className="matcha"
				component="div"
				transitionName="route"
				transitionAppear={true}
				transitionEnterTimeout={500}
				transitionLeaveTimeout={500}
				transitionAppearTimeout={500}
			>
				<div className="mainTitle">SEARCH</div>
				<form onSubmit={this.search} className="searchForm">
					<div className="label">NAME / USERNAME</div>
					<div className="searchBar">
						<input type="text" name="name" className="textInp" />
						<button type="submit" disabled={subDis} onMouseDown={this.ripple}>
							{/*<div className={`ripple ${rippled}`} style={{left: `${clickX}px`, top: `${clickY}px`, width: `${size}px`, height: `${size}px`}} />*/}
							<FontAwesome name="search" className="searchButton" />
						</button>
					</div>
					<div className="searchBlocks">
						<div className="leftSearch">
							<SearchInput label="AGE">
								<InputRange maxValue={100} minValue={18} value={ageVal} onChange={this.updateAge.bind(this)} />
							</SearchInput>
							<SearchInput label="COMMON TAGS">
								<InputRange maxValue={100} minValue={0} value={tagVal} onChange={this.updateTag.bind(this)} />
							</SearchInput>
						</div>
						<div className="rightSearch">
							<SearchInput label="POPULARITY">
								<InputRange maxValue={100} minValue={0} value={popVal} onChange={this.updatePop.bind(this)} />
							</SearchInput>
							<SearchInput label="DISTANCE">
								<InputRange maxValue={100} minValue={0} value={distVal} onChange={this.updateDist.bind(this)} />
							</SearchInput>
						</div>
					</div>
					<input type="submit" hidden={true} />
				</form>
			</ReactCssTransitionGroup>
		);
	}
}
