import PropTypes from 'prop-types';
import React from 'react';

class ButtonManageFolders extends React.Component {
  render() {
    return (
      <button
          className="va-icon-link msg-btn-managefolders"
          onClick={this.props.onClick}>
        <i className="fa fa-folder"></i>
        <span>Manage folders</span>
      </button>
    );
  }
}

ButtonManageFolders.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default ButtonManageFolders;
