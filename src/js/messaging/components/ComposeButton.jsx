import React from 'react';

class ComposeButton extends React.Component {
  render() {
    return (
      <button
          onClick={this.props.onClick}
          className="va-button-primary rx-compose-button">
        Compose a message
      </button>
    );
  }
}

ComposeButton.propTypes = {
  onClick: React.PropTypes.func
};

export default ComposeButton;
