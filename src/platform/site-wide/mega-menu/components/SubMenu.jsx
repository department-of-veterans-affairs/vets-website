import React from 'react';
import PropTypes from 'prop-types';

const SubMenu = ({ data, show }) => {
  const { rowOne, rowTwo, rowThree } = data;
  if (show) {
    return (
      <div>
        <ul
          className="vetnav-panel vetnav-panel--submenu panel-1"
          id="vetnav-disability"
          role="menu"
          aria-label="Disability">
          <li className="panel-title">{rowOne.title}</li>
          { rowOne.links.map((link, i) => (
            <li key={`${link.href}-${i}`}><a href={link.href}>{link.text}</a></li>
          ))}
        </ul>
        <ul
          className="vetnav-panel vetnav-panel--submenu panel-2"
          id="vetnav-disability"
          role="menu"
          aria-label="Disability">
          <li className="panel-title">{rowTwo.title}</li>
          { rowTwo.links.map((link, i) => (
            <li key={`${link.href}-${i}`}><a href={link.href}>{link.text}</a></li>
          ))}
        </ul>
        <div
          className="vetnav-panel vetnav-panel--submenu panel-3"
          id="vetnav-disability"
          role="menu"
          aria-label="Disability">
          <img src={rowThree.img.src} alt={rowThree.img.alt}></img>
          <a href={rowThree.link.href}>{rowThree.link.text}</a>
          <p>{rowThree.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div></div>
  );

};

SubMenu.propTypes = {
  data: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};

SubMenu.defaultProps = {
};

export default SubMenu;
