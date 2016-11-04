import React			from 'react';
import ripple			from '../../ripple';

export default class ThreeSelector extends React.Component {
	state = {
		firstC: '',
		secondC: '',
		thirdC: '',
	}

	activate = (e) => {
		const { value1, value2, value3 } = this.props;
		const checked = e ? e.target.id : this.props.checked;
		const { firstC, secondC, thirdC } = this.state;
		if (this.props.inpType === 'checkbox') {
			if (checked === value1) {
				this.setState({ firstC: firstC ? '' : 'isChecked' });
			} else if (checked === value2) {
				this.setState({ secondC: secondC ? '' : 'isChecked' });
			} else if (checked === value3) {
				this.setState({ thirdC: thirdC ? '' : 'isChecked' });
			}
		} else {
			this.setState({ firstC: '', secondC: '', thirdC: '' });
			if (checked === value1) {
				this.setState({ firstC: 'isChecked' });
			} else if (checked === value2) {
				this.setState({ secondC: 'isChecked' });
			} else if (checked === value3) {
				this.setState({ thirdC: 'isChecked' });
			}
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
			children,
			inpType,
		} = this.props;
		return (
			<div className={className}>
				<div className="beforeInput">
					<div className="labelRadio">{label}</div>
					{children}
				</div>
				<div className="radioInps">
					<input id={value1} type={inpType ? inpType : 'radio'} name={name} value={value1} onClick={this.activate} defaultChecked={checked === value1} />
				    <label htmlFor={value1} className={`radioInp ${firstC}`} onClick={ripple}>{label1}</label>
					<input id={value2} type={inpType ? inpType : 'radio'} name={name} value={value2} onClick={this.activate} defaultChecked={checked === value2} />
					<label htmlFor={value2} className={`radioInp ${secondC}`} onClick={ripple}>{label2}</label>
				    <input id={value3} type={inpType ? inpType : 'radio'} name={name} value={value3} onClick={this.activate} defaultChecked={checked === value3} />
				    <label htmlFor={value3} className={`radioInp ${thirdC}`} onClick={ripple}>{label3}</label>
				</div>
			</div>
		);
	}
}
