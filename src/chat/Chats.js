import React					from 'react';
import { browserHistory }		from 'react-router';
import axios					from 'axios';
import apiConnect				from '../apiConnect';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';

import RippledButton			from '../components/RippledButton';
// import MatchInput				from '../components/MatchInput';

import './chats.sass';

class ChatRoom extends React.Component {
	sendMessage = (e) => {
		e.preventDefault();
		const messageData = {
			receiver: this.props.to,
			message: e.target.message.value,
		};
		this.props.sendMessage(messageData);
		e.target.message.value = '';
	}

	render() {
		if (!this.props.messages) return (<div></div>);
		const messages = this.props.messages.map((el, key) => {
			return (
				<li key={key}>{el.message}{el.author}</li>
			);
		});
		return(
			<div className="chatRoom">
				<form onSubmit={this.sendMessage}>
					<input type="text" name="message" className="textInp" autoComplete="off"/>
					<RippledButton butType="submit" value="SEND" />
				</form>
				<ReactCssTransitionGroup
					className="messageList"
					component="ul"
					transitionName="route"
					transitionAppear={true}
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}
					transitionAppearTimeout={500}
				>
					{messages}
				</ReactCssTransitionGroup>
			</div>
		)
	}
}

export default class Chat extends React.Component {
	state = {
		rooms: null,
		auth: false,
		data: null,
		selectedChat: 0,
	}

	setChat = (key) => {
		this.setState({ selectedChat: key });
	}

	sendMessage = (messageData) => {
		this.context.socket.emit('send message', messageData);
		const newData = this.state.data.map((room) => {
			if (room.user.username === messageData.receiver) {
				room.messages.unshift({ author: 'me', message: messageData.message });
				return (room);
			} else return (room);
		});
		this.setState({ data: newData });
	};

	componentWillMount() {
		axios.get(`${apiConnect}user/get_self_interest`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`
			}
		}).then(({ data }) => {
			if (data.status === false) {
				if (data.details === 'user unauthorized') browserHistory.push('/');
			} else {
				this.setState({ auth: true, data: data.more, rooms: data.more.map((el, key) => {
					return (
						<li onClick={ () => this.setChat(key) } key={key} className="miniChat">
							<div className="thumbChat" style={{ backgroundImage: `url('${apiConnect}user/get_img_src/${el.user.image}')` }}></div>
							<span>{el.user.username}</span>
						</li>
					);
				}) });
				this.context.socket.on('receive message', (messageData) => {
					const newData = this.state.data.map((room) => {
						if (room.user.username === messageData.author) {
							room.messages.unshift(messageData);
							return (room);
						} else return (room);
					});
					this.setState({ data: newData });
				});
			}
		});
	}
	
	render() {
		const { rooms, auth, data, selectedChat } = this.state;
		if (!auth) return (<div></div>);
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
				<h1 className="mainTitle">CHATS</h1>
				<ul className="rooms">{rooms}</ul>
				{data && <ChatRoom
							messages={data[selectedChat].messages}
							to={data[selectedChat].user.username}
							sendMessage={this.sendMessage}
						/>
				}
			</ReactCssTransitionGroup>
		);
	}
}

Chat.contextTypes = {
	socket: React.PropTypes.object
};
