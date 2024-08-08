import React from 'react';
import PropTypes from 'prop-types';

const NextEvent = ({ description, showSeparator, title }) => (
  <li className="next-event">
    <h3>{title}</h3>
    <div>{description}</div>
    {showSeparator && <span className="sidelines">or</span>}
  </li>
);

NextEvent.propTypes = {
  description: PropTypes.element.isRequired,
  showSeparator: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default NextEvent;
