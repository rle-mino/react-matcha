import React					from 'react';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import InputRange				from 'react-input-range';

import MatchInput				from '../components/MatchInput';

import './css/search.sass'
import './css/inputRange.sass';

const SearchInput = ({ children, label }) =>
	<div className="searchInput">
		<div className="searchLabel">{label}</div>
		{children}
	</div>

export default class Search extends React.Component {
	state = {
		ageVal: {
			min: 18,
			max: 100,
		},
		popVal: {
			min: 0,
			max: 100,
		},
	}

	search = (e) => {
		e.preventDefault();
	}

	updateAge = (comp, values) => this.setState({ ageVal: values });
	updatePop = (comp, values) => this.setState({ popVal: values });

	render() {
		const { ageVal, popVal, distVal, tagsVal } = this.state;
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
					<MatchInput inputType="text" inputName="name" label="NAME / USERNAME" />
					<div className="searchBlocks">
						<div className="leftSearch">
							<SearchInput label="AGE">
								<InputRange maxValue={100} minValue={18} value={ageVal} onChange={this.updateAge.bind(this)}/>
							</SearchInput>
						</div>
						<div className="rightSearch">
							<SearchInput label="POPULARITY">
								<InputRange maxValue={100} minValue={0} value={popVal} onChange={this.updatePop.bind(this)}/>
							</SearchInput>
						</div>
					</div>
					{/*
					// location
					// tags commmuns
					*/}
					<input type="submit" hidden={true} />
				</form>
			</ReactCssTransitionGroup>
		);
	}
}
