import React					from 'react';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';

import './css/addPhoto.sass';

class AddPhotoInput extends React.Component {
	state = {
		photo: [],
		dropStatus: 'SELECT A PHOTO OR DROP IT HERE',
		isHover: 'addPhotoButton',
		mainErr: null,
		isValidIMG: false,
	}

	loaded = (e) => {
		const photo = this.state.photo;

		photo.push(e.target.result);
		this.setState({ photo });
	}

	addByClick = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		const _URL = window.URL || window.webkitURL;
		const img = new Image();

		this.setState({ mainErr: null });
		reader.onload = this.loaded;
		img.onload = () => {
			reader.readAsDataURL(file);
		}
		img.onerror = () => {
			this.setState({ mainErr: 'PNG OR JPG AUTHORIZED' });
		}
		img.src = _URL.createObjectURL(file);
	}

	addByDrop = async (e) => {
		const files = e.dataTransfer.files;
		const reader = new FileReader();
		const _URL = window.URL || window.webkitURL;
		const img = new Image();

		e.preventDefault();
    	e.stopPropagation();
		this.setState({ mainErr: null });
		reader.onload = this.loaded;
		img.onload = () => {
			reader.readAsDataURL(files[0]);
			this.setState({
				dropStatus: 'SELECT A PHOTO OR DROP IT HERE',
				isHover: 'addPhotoButton',
			});
		}
		img.onerror = () => {
			this.setState({
				mainErr: 'PNG OR JPG AUTHORIZED',
				dropStatus: 'SELECT A PHOTO OR DROP IT HERE',
				isHover: 'addPhotoButton',
			});
		}
		img.src = _URL.createObjectURL(files[0]);
	}

	removeImage = (e) => {
	}

	dragEnter = (e) => {
		e.preventDefault()
		this.setState({
			dropStatus: 'DROP !',
			isHover: 'addPhotoButton isHover',
		});
	}

	dragLeave = (e) => {
		e.preventDefault();
		this.setState({
			dropStatus: 'SELECT A PHOTO OR DROP IT HERE',
			isHover: 'addPhotoButton',
		});
	}

	render() {
		const { photo, dropStatus, isHover, mainErr } = this.state;
		const imgs = photo.map((el, key) =>
				<div className="imgContainer" key={key}>
					<div className="deleteButton" onClick={this.removeImage}></div>
					<img src={el} alt="userIMG" className="userIMGS"/>
				</div>
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
				<input type="file" id="file" onChange={this.addByClick} />
				<label htmlFor="file" className={isHover}>{dropStatus}</label>
				<ReactCssTransitionGroup
					transitionName="userIMGS"
					className="imgBlock"
					component="div"
					transitionEnterTimeout={300}
					transitionLeaveTimeout={300}
				>
					{imgs}
				</ReactCssTransitionGroup>
			</div>
		)
	}
}

const AddPhotosForm = () =>
		<div>
			<AddPhotoInput />
		</div>


export default () => {
	return (
		<ReactCssTransitionGroup
			component="div"
			transitionName="route"
			className="comp"
			transitionAppear={true}
			transitionEnterTimeout={500}
			transitionAppearTimeout={500}
			transitionLeaveTimeout={500}
		>
			<h1 className="mainTitle">ADD PHOTOS</h1>
			<AddPhotosForm />
		</ReactCssTransitionGroup>
	);
}
