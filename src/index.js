import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App			from './App';
import Register 	from './auth/Register';
import Login		from './auth/Login';
import ConfirmMail	from './auth/ConfirmMail';
import AddDetails	from './auth/AddDetails';

import './master.css';


render((
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Login} />
			<Route path="register" component={Register} />
			<Route path="confirm_mail" component={ConfirmMail} />
			<Route path="add_details" component={AddDetails} />
		</Route>
	</Router>
), document.getElementById('root'));
