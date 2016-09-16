import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App		from './App';
import Register from './auth/Register';
import Login	from './auth/Login';

import './master.css';

render((
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Login} />
			<Route path="register" component={Register} />
		</Route>
	</Router>
), document.getElementById('root'));
