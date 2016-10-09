import React			from 'react';

export default class ThreeSelector extends React.Component {
	state = {
		firstC: '',
		secondC: '',
		thirdC: '',
	}

	activate = (e) => {
		const { value1, value2 } = this.props;
		const checked = e ? e.target.id : this.props.checked;
		this.setState({ firstC: '', secondC: '', thirdC: '' });
		if (checked === value1) {
			this.setState({ firstC: 'isChecked' });
		} else if (checked === value2) {
			this.setState({ secondC: 'isChecked' });
		} else {
			this.setState({ thirdC: 'isChecked' });
		}
	}

	componentDidMount() {
		this.activate(null);
	}

	render () {
		const { firstC, secondC, thirdC } = this.state;
		const {
			value1,
			value2,
			value3,
			label1,
			label2,
			label3,
			name,
			label,
			className,
			checked,
			errorMessage
		} = this.props;
		return (
			<div className={className}>
				<div className="beforeInput">
					<div className="labelRadio">{label}</div>
					{errorMessage}
				</div>
				<div className="radioInps">
					<input id={value1} type="radio" name={name} value={value1} onClick={this.activate} defaultChecked={checked === value1} />
				    <label htmlFor={value1} className={`radioInp ${firstC}`}>{label1}</label>
					<input id={value2} type="radio" name={name} value={value2} onClick={this.activate} defaultChecked={checked === value2}/>
					<label htmlFor={value2} className={`radioInp ${secondC}`}>{label2}</label>
				    <input id={value3} type="radio" name={name} value={value3} onClick={this.activate} defaultChecked={checked === value3}/>
				    <label htmlFor={value3} className={`radioInp ${thirdC}`}>{label3}</label>
				</div>
			</div>
		);
	}
}