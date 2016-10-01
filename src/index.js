import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App				from './App';
import Register 		from './auth/Register';
import Login			from './auth/Login';
import ConfirmMail		from './auth/ConfirmMail';
import AddDetails		from './auth/AddDetails';
import ForgotPassword	from './auth/ForgotPassword';
import ResetPassWithKey	from './auth/ResetPassWithKey';
import AddPhotos		from './auth/AddPhotos';

import './master.sass';


render((
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Login} />
			<Route path="register" component={Register} />
			<Route path="confirm_mail" component={ConfirmMail} />
			<Route path="add_details" component={AddDetails} />
			<Route path="forgot_password" component={ForgotPassword} />
			<Route path="reset_password" component={ResetPassWithKey} />
			<Route path="add_photos" component={AddPhotos} />
		</Route>
	</Router>
), document.getElementById('root'));
