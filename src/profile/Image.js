import React						from 'react';
import apiConnect					from '../apiConnect';

import FontAwesome					from 'react-fontawesome';
import AddPhotos					from '../register/AddPhotos';

import './css/image.sass';

export default class ImageProf extends React.Component {
	state = {
		selectedImage: null,
		availableImages: [],
		inEdit: false,
	}

	edit = (e) => {
		if (e.target.className.includes('editSaveButton') && this.state.inEdit) {
			return (false)
		};
		this.props.setEditComp(<AddPhotos isEditComp={true}
									updateImages={this.props.updateImages}
									setEditComp={this.props.setEditComp}
								/>);
	}

	componentWillReceiveProps = (newProps) => {
		let images = []
		if (!newProps.imgs) {
			for (let i; i < 5; i++) {
				images[i] = 'undef.jpg';
			}
		} else {
			if (newProps.imgs.length < 5) {
				images = [...newProps.imgs];
				let i = images.length;
				while (i < 5) {
					images[i] = 'undef.jpg';
					i++;
				}
			} else {
				images = newProps.imgs
			}
		}
		this.setState({
			availableImages: images,
			selectedImage: images[0],
		});;
	}

	setImage = (e) => {
		let image = e.target.style.backgroundImage;
		image = image.split('/').pop();
		image = image.substring(image.length - 2, 0);
		if (!image.includes('undef.jpg')) {
			this.setState({ selectedImage: image });
		}
	}

	render() {
		const { selectedImage, availableImages } = this.state;
		const imgList = availableImages.map((img, key) => {
			return (
				<li key={key} className="img" onClick={this.setImage}>
					<div className="imgSingle" style={{backgroundImage:`url('${apiConnect}user/get_img_src/min/${img}')`}}/>
				</li>);
		})
		return (
			<div className="imageProf">
				<ul className="listIMG">
					{imgList}
				</ul>
				{selectedImage && (
					<div
						className="selectedImage"
						style={{backgroundImage:`url('${apiConnect}user/get_img_src/${selectedImage}')`}}
						alt="user"
					>
					{this.props.editable && (
						<FontAwesome
							name="pencil"
							className="editImageButton"
							onClick={this.edit}
						/>
					)}
					</div>
				)}

			</div>
		);
	}
}
