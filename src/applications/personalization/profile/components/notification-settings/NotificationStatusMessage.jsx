import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const NotificationStatusMessage = ({
  children,
  classes,
  id,
  alert,
  legacy = false,
}) => {
  // legacy can be removed as a prop when the radio buttons are removed
  const computedClasses = useMemo(
    () => {
      return classNames(
        legacy
          ? [classes]
          : [
              'vads-u-font-family--sans',
              'vads-u-font-size--base',
              'vads-u-margin-top--2',
              'vads-u-margin-bottom--0p5',
              'vads-u-display--block',
              'vads-u-padding-y--1p5',
              'vads-u-padding-x--2',
              'vads-u-margin-left--neg1p5',
              classes,
            ],
      );
    },
    [classes, legacy],
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
  legacy: PropTypes.bool,
};
