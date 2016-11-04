import React                    from 'react';
import ripple                    from '../../ripple';

import './rippledButton.sass';

export default class RippledButton extends React.Component {
    clickHandle = (e) => {
		ripple(e);
		if (this.props.event) this.props.event(e);
	}

	render() {
        return (
            <button
                type={this.props.butType} className={`${this.props.className || 'mainButton'}`}
                onClick={this.clickHandle} disabled={this.props.disabled}
            >
                {this.props.value}
                {this.props.children}
            </button>
        );
    }
}