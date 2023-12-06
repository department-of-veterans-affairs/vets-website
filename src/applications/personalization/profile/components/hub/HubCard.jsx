import React from 'react';
import PropTypes from 'prop-types';

export const HubCard = ({ heading, content, children }) => {
  return (
    <va-card>
      <h2 className="vads-u-margin--0 vads-u-font-size--h3">{heading}</h2>
      <p>{content}</p>
      {children}
    </va-card>
  );
};

HubCard.propTypes = {
  content: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
