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
          onClick={()=> {}}>{this.props.title}</button>
        <div>
          <ul
            className="vetnav-panel vetnav-panel--submenu panel-1"
            id="vetnav-disability"
            role="menu"
            aria-label="Disability">
            <li className="panel-title">Get Health Care Benefits</li>
            <li>Link 1</li>
            <li>Link 1</li>
            <li>Link 1</li>
            <li>Link 1</li>
            <li>Link 1</li>
          </ul>
          <ul
            className="vetnav-panel vetnav-panel--submenu panel-2"
            id="vetnav-disability"
            role="menu"
            aria-label="Disability">
            <li className="panel-title">Manage Your Health Benefits</li>
            <li>Link 2</li>
            <li>Link 2</li>
            <li>Link 2</li>
            <li>Link 2</li>
          </ul>
          <div
            className="vetnav-panel vetnav-panel--submenu panel-3"
            id="vetnav-disability"
            role="menu"
            aria-label="Disability">
            <img src="http://via.placeholder.com/228x128" alt="dog"></img>
            <a href="#">Learn About the Veterans Choice Program</a>
            <p>
              If you are already enrolled in VA health care, the Veterans
              Choice Program allows you to receive health care within
              your community
            </p>
          </div>
        </div>
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
