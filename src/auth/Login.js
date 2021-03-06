import React						from 'react';
import { Link, browserHistory }		from 'react-router';
import axios						from 'axios';
import apiConnect					from '../apiConnect';


import MatchInput					from '../components/MatchInput';
import ErrorMessage					from '../components/ErrorMessage';
import RippledButton                from '../components/RippledButton';

import './css/login.sass';

class LoginForm extends React.Component {

    state = {
        isPending: false,
        displayResponse: false,
        serverStatus: null,
        buttonValue: 'SIGN IN',
        username: null,
        password: null,
        mainErr: 'errorMessageMain',
    };

    login = async(e) => {
        e.preventDefault();
		const { username, password } = e.target;
        this.setState({
            isPending: true,
            buttonValue: 'WAIT',
            username: null,
            password: null,
            mainErr: 'errorMessageMain',
            serverResponse: null,
        });
		if (username.value && username.value.length > 30) {
			this.setState({
				username: '30 CHARACTERS MAX',
				isPending: false,
				buttonValue: 'SIGN IN',
			});
			return (false);
		}
		if (password.value && password.value.length > 30) {
			this.setState({
				password: '30 CHARACTERS MAX',
				isPending: false,
				buttonValue: 'SIGN IN',
			});
			return (false);
		}
        axios({
            method: 'put',
            url: `${apiConnect}user/login`,
            data: {
                username: username.value,
                password: password.value,
            },
        }).then(({ data, headers }) => {
            this.setState({
                buttonValue: data.status
                    ? 'SUCCESS'
                    : 'SIGN IN',
                serverResponse: data.details,
            });
            if (data.status === false) {
                this.setState({ isPending: false });
                if (data.details === 'invalid request') {
                    this.setState({ serverResponse: null });
                    const error = {};
                    data.error.forEach((err) => error[err.path] = err.error.toUpperCase());
                    this.setState({ ...error, buttonValue: 'SIGN IN', isPending: false });
                } else {
                    this.setState({ mainErr: 'errorMessageMain' });
                }
                if (data.details.match(/not activated$/g)) {
                    setTimeout(() => browserHistory.push('confirm_mail'), 1000);
                }
            } else {
                localStorage.setItem('logToken', headers['x-access-token']);
                this.setState({ serverResponse: null });
                setTimeout(() => browserHistory.push('/matcha/my_profile'), 1000);
            }
        }).catch(() => this.setState({ buttonValue: 'ERROR', serverResponse: 'AN ERROR OCCURRED' }));
    };

    render() {
        const {
            isPending,
            username,
            password,
            serverResponse,
            buttonValue,
            mainErr,
        } = this.state;
        return (
            <div>
                <div className={mainErr}>{serverResponse}</div>
                <form id="loginForm" onSubmit={this.login}>
                    <MatchInput label="USERNAME" inputType="text" inputName="username">
                        <ErrorMessage message={username}/>
                    </MatchInput>
                    <MatchInput label="PASSWORD" inputType="password" inputName="password">
                        <ErrorMessage message={password}/>
                    </MatchInput>
                    <RippledButton butType="submit" value={buttonValue} disabled={isPending} />
                </form>
            </div>
        );
    }
};

export default class Login extends React.Component {
	state = {
		auth: true,
	}

	checkAuth = async () => {
		const { data } = await axios.get(`${apiConnect}user/checkAuth`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		});
		if (data.status === true) browserHistory.push('/matcha/my_profile');
		else this.setState({ auth: false });
	}

	componentWillMount() {
		this.checkAuth();
	}

	render() {
		const { auth } = this.state;
		if (auth) return (<div></div>)
        return (
            <div className="comp">
                <h1 className="mainTitle">LOGIN</h1>
                <LoginForm/>
                <div className="otherOptions">
                    <Link to="register">
                        <div className="register otherOption">REGISTER</div>
                    </Link>
                    <Link to="forgot_password">
                        <div className="forgot otherOption">FORGOT PASSWORD?</div>
                    </Link>
                </div>
            </div>
        );
    }
}
