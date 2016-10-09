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
		marginLeft: 0,
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
			images = ['undef.jpg'];
		} else {
			images = newProps.imgs
		}
		this.setState({
			availableImages: images,
		});;
	}

	componentDidMount = () => {
		setInterval(() => {;
			const newMargin = (this.state.marginLeft + 300) % (this.state.availableImages.length * 300);
			this.setState({ marginLeft: newMargin });
		}, 4000);
	}

	render() {
		const { availableImages, marginLeft } = this.state;
		const imgList = availableImages.map((img, key) => {
			return (
				<li key={key} className="img" onClick={this.setImage}>
					<div className="imgSingle" style={{backgroundImage:`url('${apiConnect}user/get_img_src/${img}')`}}/>
				</li>);
		})
		return (
			<div className="imageProf">
				<div className="visibleImage">
					{this.props.editable && (
						<FontAwesome
							name="camera"
							className="editImageButton"
							onClick={this.edit}
						/>
					)}
					<ul className="listIMG" style={{marginLeft: `-${marginLeft}px`}}>
						{imgList}
					</ul>
				</div>
			</div>
		);
	}
}
