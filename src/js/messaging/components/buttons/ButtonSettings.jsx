import React from 'react';
import { Link } from 'react-router';

class ButtonSettings extends React.Component {
  render() {
    return (
      <Link
          className="va-icon-link msg-btn-settings"
          to="/settings">
        <i className="fa fa-cog"></i>
        <span>Settings</span>
      </Link>
    );
  }
}

export default ButtonSettings;
