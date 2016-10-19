import React                    from 'react';

import './rippledButton.sass';

export default class RippledButton extends React.Component {
    ripple = (e) => {
        e.persist();
		const size = 5
		const rect = e.target.getBoundingClientRect();
		const circle = document.createElement('div');
		circle.style.left = `${e.clientX - rect.left}px`;
		circle.style.top = `${e.clientY - rect.top}px`;
		circle.style.width = circle.style.height = `${size}px`;
		circle.className = 'rippled';
		e.target.appendChild(circle);
		setTimeout(() => {
			e.target.removeChild(circle);
            if (this.props.onClick) this.props.onClick(e);
		}, 500);
    }
    
    render() {
        return (
            <button
                type={this.props.butType} className={`${this.props.className || 'mainButton'}`}
                onClick={this.ripple} disabled={this.props.disabled}
            >
                {this.props.value}
                {this.props.children}
            </button>
        );
    }
} 