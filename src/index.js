import React						from 'react';
import { render }					from 'react-dom';
import { Router, Route, IndexRoute, browserHistory }	from 'react-router';

import App			from './App';
import AppHeader		from './AppHeader';
import Register 		from './register/Register';
import ConfirmMail		from './register/ConfirmMail';
import AddDetails		from './register/AddDetails';
import AddPhotos		from './register/AddPhotos';
import Login			from './auth/Login';
import ForgotPassword		from './auth/ForgotPassword';
import ResetPassWithKey		from './auth/ResetPassWithKey';
import MyProfile		from './profile/MyProfile';
import Search			from './search/search';

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
		<Route path="/matcha" component={AppHeader} >
			<Route path="my_profile" component={MyProfile} />
			<Route path="search" component={Search} />
		</Route>
	</Router>
), document.getElementById('root'));
