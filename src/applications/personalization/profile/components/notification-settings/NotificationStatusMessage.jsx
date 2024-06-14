import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const NotificationStatusMessage = ({ children, classes, id }) => {
  // legacy can be removed as a prop when the radio buttons are removed
  const computedClasses = useMemo(
    () => {
      return classNames([
        'vads-u-font-family--sans',
        'vads-u-font-size--base',
        'vads-u-margin-top--2',
        'vads-u-margin-bottom--0p5',
        'vads-u-display--block',
        'vads-u-padding-y--1p5',
        'vads-u-padding-x--2',
        'vads-u-margin-left--neg1p5',
        'focus-ring',
        classes,
      ]);
    },
    [classes],
  );

  const statusMessage = useRef(null);

  useEffect(() => {
    if (statusMessage.current) {
      statusMessage.current.focus();
    }
  }, []);

  return (
    <div id={id} className="vads-u-display--flex">
      <div ref={statusMessage} tabIndex="-1" className={computedClasses}>
        {children}
      </div>
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
