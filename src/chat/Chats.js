import React					from 'react';
import ReactDOM					from 'react-dom';
import { browserHistory }		from 'react-router';
import axios					from 'axios';
import apiConnect				from '../apiConnect';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';

import RippledButton			from '../components/RippledButton';

import './chats.sass';

const checkLastChar = (last) => {
	return (
		!((last >= 'A' && last <= 'Z') ||
		(last >= 'a' && last <= 'z') ||
		(last >= '0' && last <= '9') ||
		last === '?' || last === '!') && last !== ' ');
};

class ChatRoom extends React.Component {

	sendMessage = async (e) => {
		e.preventDefault();
		e.persist();
		if (!e.target.message.value.match(/[A-Za-z0-9?!]/)) return (false);
		if (e.target.message.value === '' || !e.target.message.value) return (false);
		const messageData = {
			recipient: this.props.to,
			message: e.target.message.value,
		};
		await this.props.sendMessage(messageData);
		e.target.message.value = '';
		this.scrollBottom();
	}

	handleChange = (e) => {
		const { value } = e.target;
		const lastChar = e.target.value.slice(-1);
		if (checkLastChar(lastChar)) {
			e.target.value = value.substring(0, value.length - 1);
			return (false);
		}
	}

	scrollBottom = () => {
		const chat = ReactDOM.findDOMNode(this);
		if (chat) {
			const messageList = chat.querySelector('ul');
			if (messageList) messageList.scrollTop = messageList.scrollHeight;
		}
	}

	componentDidMount() {
		this.scrollBottom();
	}

	componentWillReceiveProps = (newProps) => {
		setTimeout(() => this.scrollBottom(), 20);
	} 

	render() {
		if (!this.props.messages) return (<div></div>);
		const messages = this.props.messages.map((el, key) =>
				<li key={key} className={`message ${el.author === this.props.to ? 'to' : 'me' }`}>
					{el.message}
				</li>
		);
		return(
			<div className="chatRoom">
				<ul className="messageList">
					{messages}
				</ul>
				<form onSubmit={this.sendMessage}>
					<input type="text" name="message" className="textInp" autoComplete="off" onChange={this.handleChange}/>
					<RippledButton butType="submit" value="SEND" />
				</form>
			</div>
		);
	}
}

export default class Chat extends React.Component {
	_mounted = false;

	state = {
		rooms: null,
		auth: false,
		data: null,
		selectedChat: 0,
	}

	setChat = async (key, e) => {
		await this.setState({ selectedChat: key, rooms: this.drawRoom(this.state.data, key) });
	}

	sendMessage = async (messageData) => {
		this.context.socket.emit('send message', messageData);
		const newData = this.state.data.map((room) => {

			if (room.user.username === messageData.recipient) {
				room.messages.push({ author: 'me', message: messageData.message });
				return (room);
			} else return (room);
		});
		await this.setState({ data: newData });
	};

	drawRoom = (data, selected) => {
		return data.map((el, key) =>
			<li onClick={ (e) => this.setChat(key, e) } key={key} className="miniChat">
				<div
					className={`thumbChat ${selected === key ? 'selected' : ''}`}
					style={{ backgroundImage: `url('${apiConnect}user/get_img_src/${el.user.image}')` }}
				></div>
				<span>{el.user.username}</span>
			</li>
		);
	}

	componentWillMount() {
		axios.get(`${apiConnect}user/get_self_interest`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`
			}
		}).then(({ data }) => {
			if (!this._mounted) return (false);
			
			if (data.status === false) {
				if (data.details === 'user unauthorized') browserHistory.push('/');
			} else {
				this.setState({
					auth: true,
					data: data.more,
					rooms: this.drawRoom(data.more, this.state.selectedChat)
				});
				if (!this.context.socket) return (false);
				this.context.socket.on('receive message', (messageData) => {
					const newData = this.state.data.map((room) => {

						if (room.user.username === messageData.author) {
							room.messages.push(messageData);
							return (room);
						} else return (room);
					});
					this.setState({ data: newData });
				});
			}
		});
	}
	
	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	render() {
		const { rooms, auth, data, selectedChat } = this.state;
		if (!auth) return (<div></div>);
		if (data && data.length === 0) {
			return (
				<ReactCssTransitionGroup
					className="comp"
					component="div"
					transitionName="route"
					transitionAppear={true}
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}
					transitionAppearTimeout={500}
				>
					<h1 className="mainTitle">NO AVAILABLE CHAT</h1>
					<p className="noChatMess">YOU MUST BE CONNECTED WITH AT LEAST ONE USER TO CHAT</p>				
				</ReactCssTransitionGroup>
			);
		}
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
				<h1 className="mainTitle">CHAT</h1>
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
