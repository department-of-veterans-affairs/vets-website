import React from 'react';
import PropTypes from 'prop-types';

class MenuSection extends React.Component {
  render() {
    return (
      <li>
        <button
          className="vetnav-level2"
          role="button"
          aria-haspopup="true"
          aria-controls="vetnav-disability"
          onClick="recordEvent({ event: 'nav-header-second-level' });">{this.props.title}</button>
          <ul
            className="vetnav-panel vetnav-panel--submenu"
            id="vetnav-disability"
            role="menu"
            aria-label="Disability">
            {this.props.children}
          </ul>
      </li>
    );
  }
}

MenuSection.propTypes = {
  title: PropTypes.string.isRequired,
};

MenuSection.defaultProps = {
};

export default MenuSection;
