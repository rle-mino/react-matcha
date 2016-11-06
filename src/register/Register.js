import React					from 'react';
import axios					from 'axios';
import { Link, browserHistory }	from 'react-router';
import apiConnect				from '../apiConnect.js';

import MatchInput				from '../components/MatchInput';
import ErrorMessage				from '../components/ErrorMessage';
import DateInput				from '../components/DateInput';
import RippledButton			from '../components/RippledButton';

import './css/register.sass';

class FormRegister extends React.Component {
	state = {
		username: null,
		password: null,
		passVReq: null,
		passVInval: null,
		firstname: null,
		lastname: null,
		birthdate: null,
		birthInval: null,
		mail: null,
		mailVReq: null,
		mailVInval: null,
		serverResponse: null,
		mainButtonDis: false,
		mainButtonValue: 'REGISTER',
	}

	register = async (e) => {
		e.preventDefault();
		e.persist();
		const response = await axios.get('http://ip-api.com/json');
		let location = null;
		if (response.status === 200) {
			location = {
				lat: response.data.lat,
				lng: response.data.lon,
			};
		}
		this.setState({
			username: null,
			password: null,
			passVReq: null,
			passVInval: null,
			firstname: null,
			lastname: null,
			birthdate: null,
			birthInval: null,
			mail: null,
			mailVReq: null,
			mailVInval: null,
			serverResponse: null,
			mainButtonDis: true,
			mainButtonValue: 'WAIT',
		});
		if (e.target.password.value !== e.target.passwordVerif.value ||
			e.target.mail.value !== e.target.mailVerif.value) {
				this.setState({
					passVInval: e.target.password.value !== e.target.passwordVerif.value,
					mailVInval: e.target.mail.value !== e.target.mailVerif.value,
					mainButtonDis: false,
					mainButtonValue: 'REGISTER',
				})
				return (false);
			}
		if (!!this.state.passVInval || !!this.state.mailVInval || !!this.state.birthInval) {
			this.setState({ mainButtonDis: false, mainButtonValue: 'REGISTER' });
			return false;
		} else {
			const day = e.target.day.value < 10 ? `0${e.target.day.value}` : e.target.day.value;
			const birthdate = `${e.target.month.value}-${day}-${e.target.year.value}`;
			axios({
				method: 'post',
				url: `${apiConnect}user/register`,
				data: {
					username: e.target.username.value,
					firstname: e.target.firstname.value,
					lastname: e.target.lastname.value,
					password: e.target.password.value,
					birthdate: birthdate,
					mail: e.target.mail.value,
					location,
				},
			}).then(({ data }) => {
				if (data.status === false) {
					if (data.details === 'invalid request') {
						const error = {};
						data.error.forEach((err) => {
							error[err.path] = err.error.toUpperCase();
						});
						this.setState({ mainButtonValue: 'REGISTER', mainButtonDis: false, ...error });
					} else {
						this.setState({ serverResponse: data.details, mainButtonValue: 'REGISTER', mainButtonDis: false });
					}
				} else {
					this.setState({ mainButtonValue: 'SUCCESS' });
					setTimeout(() => browserHistory.push('confirm_mail'), 1000);
				}
			}).catch(() => this.setState({ mainButtonValue: 'ERROR', serverResponse: 'AN ERROR OCCURRED' }));
		}
	};

	render() {
		const {
			username,
			password,
			firstname,
			lastname,
			mail,
			birthdate,
			passVReq,
			passVInval,
			serverResponse,
			mailVReq,
			mailVInval,
			mainButtonValue,
			mainButtonDis,
		} = this.state;
		return (
			<form onSubmit={this.register}>
				<div className="errorMessageMain">{serverResponse}</div>
				<MatchInput
					label="USERNAME"
					inputType="text"
					inputName="username"
				>
					{(username && (<ErrorMessage message={username} />))}
				</MatchInput>
				<MatchInput
					label="PASSWORD"
					inputType="password"
					inputName="password"
				>
					{(password && (<ErrorMessage message={password} />))}
				</MatchInput>
				<MatchInput
					label="VERIFY PASSWORD"
					inputType="password"
					inputName="passwordVerif"
				>
					{(passVReq && (<ErrorMessage message="REQUIRED" />)) ||
					(passVInval && (<ErrorMessage message="INVALID" />))}
				</MatchInput>
				<MatchInput
					label="FIRSTNAME"
					inputType="text"
					inputName="firstname"
				>
					{(firstname && (<ErrorMessage message={firstname} />))}
				</MatchInput>
				<MatchInput
					label="LASTNAME"
					inputType="text"
					inputName="lastname"
				>
					{(lastname && (<ErrorMessage message={lastname} />))}
				</MatchInput>
				<DateInput label="BIRTHDATE">
					{(birthdate && (<ErrorMessage message={birthdate} />))}
				</DateInput>
				<MatchInput
					label="MAIL"
					inputType="text"
					inputName="mail"
				>
					{(mail && (<ErrorMessage message={mail} />))}
				</MatchInput>
				<MatchInput
					label="VERIFY MAIL"
					inputType="text"
					inputName="mailVerif"
				>
					{(mailVReq && (<ErrorMessage message="REQUIRED"/>)) ||
					(mailVInval && (<ErrorMessage message="INVALID" />))}
				</MatchInput>
				<RippledButton butType="submit" value={mainButtonValue} disabled={mainButtonDis} />
			</form>
		);
	}
}

export default () =>
	<div className="comp">
		<h1 className="mainTitle">REGISTER</h1>
		<FormRegister />
		<div className="otherOptions">
			<Link to="/"><div className="otherOption centered">ALREADY REGISTERED</div></Link>
		</div>
	</div>
