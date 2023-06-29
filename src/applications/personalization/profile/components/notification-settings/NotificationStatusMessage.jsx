import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const NotificationStatusMessage = ({ children, classes, id, alert }) => {
  const isUsingLegacyStylingClass = classes.includes('rb-input-message');
  const computedClasses = classNames(
    ...(isUsingLegacyStylingClass
      ? []
      : [
          'vads-u-font-family--sans',
          'vads-u-font-size--base',
          'vads-u-font-weight--normal',
          'vads-u-margin-top--1',
          'vads-u-display--block',
          'vads-u-padding--2',
          'vads-u-margin-left--neg1p5',
        ]),
    classes,
  );
  return (
    <div
      id={id}
      role={alert ? 'alert' : undefined}
      aria-live={alert ? 'polite' : undefined}
      className="vads-u-display--flex"
    >
      <span className={computedClasses}>{children}</span>
    </div>
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
