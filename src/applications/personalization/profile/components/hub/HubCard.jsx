import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export const HubCard = ({ heading, content, children, className }) => {
  const classes = classNames('vads-l-col--6', className);
  return (
    <div className={classes}>
      <va-card>
        <div>
          <h3 className="vads-u-margin--0">{heading}</h3>
          <p>{content}</p>
          {children}
        </div>
      </va-card>
    </div>
  );
};

HubCard.propTypes = {
  content: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
};
