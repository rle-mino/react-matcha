import React					from 'react';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import axios					from 'axios'
import { Link, browserHistory }	from 'react-router';
import apiConnect				from './../apiConnect';

import ThumbRemovable			from '../components/ThumbRemovable';

import './css/addPhoto.sass';

class AddPhotosForm extends React.Component {
	state = {
		photo: [],
		dropStatus: 'SELECT A PHOTO OR DROP IT HERE',
		isHover: 'addPhotoButton',
		mainErr: null,
		isValidIMG: false,
		trashOver: false,
		inpVal: '',
	};

	// called when the picture is converted
	sendPic = async (file) => {
		const data = new FormData();
		data.append('image', file);
		axios({
			url: `${apiConnect}user/add_image`,
			method: 'post',
			data,
			headers: {
				'Content-type': 'multipart/form-data',
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		}).then(({ data }) => {
			const newPhotos = this.state.photo;
			newPhotos.push(`${apiConnect}user/get_img_src/${data.more}`)
			this.setState({ photo: newPhotos });
		}).catch(() => this.setState({ serverResponse: 'AN ERROR OCCURRED' }));
	};

	// called on click
	addByClick = (e) => {
		this.setState({ inpVal: e.target.value });
		const file = e.target.files[0];
		const _URL = window.URL || window.webkitURL;
		const img = new Image();

		if (this.state.photo.length > 4) {
			this.setState({ mainErr: '5 PHOTOS MAX' });
			return (false);
		}
		this.setState({ mainErr: null });
		img.onload = () => {
			this.sendPic(file);
			this.setState({ inpVal: '' });
		};
		img.onerror = () => this.setState({ mainErr: 'PNG OR JPG AUTHORIZED' });
		img.src = _URL.createObjectURL(file);
	};

	// called on drop
	addByDrop = (e) => {
		const file = e.dataTransfer.files[0];
		const _URL = window.URL || window.webkitURL;
		const img = new Image();

		e.preventDefault();
    	e.stopPropagation();
		if (this.state.photo.length > 4) {
			this.setState({ mainErr: '5 PHOTOS MAX' });
			return (false);
		}
		this.setState({ mainErr: null });
		img.onload = async () => {
			this.sendPic(file);
			this.setState({
				dropStatus: 'SELECT A PHOTO OR DROP IT HERE',
				isHover: 'addPhotoButton',
			});
		};
		img.onerror = () => {
			this.setState({
				mainErr: 'PNG OR JPG AUTHORIZED',
				dropStatus: 'SELECT A PHOTO OR DROP IT HERE',
				isHover: 'addPhotoButton',
			});
		};
		if(file) img.src = _URL.createObjectURL(file);
	};

	dragEnter = (e) => {
		e.preventDefault();
		this.setState({
			dropStatus: 'DROP !',
			isHover: 'addPhotoButton isHover',
		});
	};

	dragLeave = (e) => {
		e.preventDefault();
		this.setState({
			dropStatus: 'SELECT A PHOTO OR DROP IT HERE',
			isHover: 'addPhotoButton',
		});
	};

	removeImage = async (src) => {

		const newPhotos = this.state.photo.filter((el) => el !== src);
		this.setState({ photo: newPhotos });
		axios({
			method: 'put',
			url: `${apiConnect}user/remove_image`,
			data: {
				imgID: src.split('/').pop(),
			},
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			}
		}).catch(() => this.setState({ serverResponse: 'AN ERROR OCCURRED' }));
	};

	componentWillMount() {
		axios({
			url: `${apiConnect}user/get_images`,
			method: 'get',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		}).then(({ data }) => {
			if (data.more) {
				const initPhoto = data.more.map((img) => `${apiConnect}user/get_img_src/min/${img}`);
				this.setState({ photo: initPhoto });
			}
		}).catch(() => browserHistory.push('/'));
	}

	stopEdit = (e) => {
		e.preventDefault();
		this.props.setEditComp(null);
	};

	render() {
		const { photo, dropStatus, isHover, mainErr, inpVal } = this.state;
		const imgs = photo.map((src, key) =>
			<ThumbRemovable
				key={key + (Math.random() * (100 - 1) + 1)} src={src}
				removeImage={(e) => this.removeImage(src)}
			/>
		);
		return (
			<div
				className="photoInput"
				onDragOver={(e) => e.preventDefault()}
				onDragEnter={this.dragEnter}
				onDragLeave={this.dragLeave}
				onDrop={this.addByDrop}
			>
				<div className="errorMessageMain">{mainErr}</div>
				<input type="file" id="file" className="addPhotoInput" onChange={this.addByClick} value={inpVal} />
				<label htmlFor="file" className={isHover}>{dropStatus}</label>
				<div className="imgList">{imgs}</div>
				{!this.props.isEditComp && (<Link to="/matcha/my_profile"><div className="mainButton isLNK">GO</div></Link>)}
				{this.props.isEditComp && (<input type="button" className="mainButton" value="SAVE" onClick={this.stopEdit} />)}
			</div>
		)
	}
}

export default ({ isEditComp, updateImages, setEditComp }) => {
	return (
		<ReactCssTransitionGroup
			component="div"
			transitionName="route"
			className={`comp ${isEditComp ? 'editComp' : '' }`}
			transitionAppear={true}
			transitionEnterTimeout={500}
			transitionAppearTimeout={500}
			transitionLeaveTimeout={500}
		>
			{!isEditComp && <h1 className="mainTitle">ADD PHOTOS</h1>}
			<AddPhotosForm isEditComp={isEditComp} updateImages={updateImages} setEditComp={setEditComp} />
		</ReactCssTransitionGroup>
	);
}
