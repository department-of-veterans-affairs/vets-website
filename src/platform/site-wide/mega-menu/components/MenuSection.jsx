import React from 'react';
import PropTypes from 'prop-types';

import SubMenu from './SubMenu';

class MenuSection extends React.Component {
  render() {
    const show = this.props.currentSection === this.props.title;

    return (
      <li>
        <button
          className="vetnav-level2"
          aria-haspopup="true"
          aria-controls="vetnav-disability"
          aria-expanded={show}
          onClick={() => this.props.updateCurrentSection(this.props.title)}>{this.props.title}</button>
        <SubMenu data={this.props.links} show={show}></SubMenu>
      </li>
    );
  }
}

MenuSection.propTypes = {
  title: PropTypes.string.isRequired,
  updateCurrentSection: PropTypes.func.isRequired
};

MenuSection.defaultProps = {
};

export default MenuSection;
