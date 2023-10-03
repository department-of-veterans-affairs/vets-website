import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export const HubCard = ({ heading, content, children, className }) => {
  const classes = classNames(
    'vads-l-col--12 medium-screen:vads-l-col--6',
    className,
  );
  return (
    <div className={classes}>
      <va-card>
        <div>
          <h2 className="vads-u-margin--0 vads-u-font-size--h3">{heading}</h2>
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
