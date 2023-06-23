import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const NotificationStatusMessage = ({ children, classes, id, alert }) => {
  return (
    <span
      id={id}
      className={classNames(
        'vads-u-margin-top--0p5',
        'rb-input-message',
        'vads-u-font-weight--bold',
        classes,
      )}
      role={alert ? 'alert' : undefined}
      aria-live={alert ? 'polite' : undefined}
    >
      {children}
    </span>
  );
};

NotificationStatusMessage.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  alert: PropTypes.bool,
  classes: PropTypes.string,
  id: PropTypes.string,
};
