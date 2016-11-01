import React from 'react';

class ButtonCreateFolder extends React.Component {
  render() {
    return (
      <button
          className="usa-button-unstyled msg-btn-newfolder"
          onClick={this.props.onClick}
          type="button">
        <i className="fa fa-plus"></i>
        &nbsp;Create new folder
      </button>
    );
  }
}

ButtonCreateFolder.propTypes = {
  onClick: React.PropTypes.func.isRequired
};

export default ButtonCreateFolder;

