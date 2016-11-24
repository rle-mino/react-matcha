import React											from 'react';
import { render }										from 'react-dom';
import { Router, Route, IndexRoute, browserHistory }	from 'react-router';

import App												from './App';
import FhF												from './FhF';
import AppHeader										from './AppHeader';
import Register 										from './register/Register';
import ConfirmMail										from './register/ConfirmMail';
import AddDetails										from './register/AddDetails';
import AddPhotos										from './register/AddPhotos';
import Login											from './auth/Login';
import ForgotPassword									from './auth/ForgotPassword';
import ResetPassWithKey									from './auth/ResetPassWithKey';
import Logout											from './auth/Logout';
import MyProfile										from './profile/MyProfile';
import Search											from './Search/search';
import Suggest											from './suggestion/Suggest';
import ProfileExt										from './profile/Profile';
import UpdatePassword									from './auth/UpdatePassword';
import UpdateMail										from './auth/UpdateMail';
import Chat												from './chat/Chats';

// import 'normalize-css';
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
			<Route path="suggestion" component={Suggest} />
			<Route path="profile/:username" component={ProfileExt} />
			<Route path="update_password" component={UpdatePassword} />
			<Route path="update_mail" component={UpdateMail} />
			<Route path="chats" component={Chat} />
			<Route path="logout" component={Logout} />
		</Route>
		<Route path="*" component={FhF} />
	</Router>
), document.getElementById('root'));
