import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import classNames from 'classnames';

/**
 * Custom alert similar to VAAlert that allows to set the icon.
 * @property {*} children the children components to include inside the alert
 * @property {bool} disableAnalitics true to disable analytics
 * @property {string} headline the text for the headline of the alert
 * @property {*} recordEvent the function to record the event
 * @property {string} status the status of the alert ('info', 'success', 'warning' or 'continue')
 * @property {string} icon the name of the icon for the alert
 */
const CustomAlert = ({
  children,
  disableAnalitics = false,
  headline,
  recordEvent,
  status = 'info',
  icon = 'info',
}) => {
  useEffect(
    () => {
      if (!disableAnalitics) {
        recordEvent({
          event: 'nav-alert-box-load',
          action: 'load',
          'alert-box-headline': headline,
          'alert-box-status': status,
        });
      }
    },
    [disableAnalitics, headline, recordEvent, status],
  );

  const alertClasses = classNames({
    'mhv-c-reg-alert usa-alert vads-u-display--flex vads-u-align-items--flex-start': true,
    'vads-u-justify-content--center vads-u-flex-direction--row vads-u-margin-bottom--3': true,
    'mhv-u-reg-alert-warning': status === 'warning',
    'mhv-u-reg-alert-success': status === 'continue' || status === 'success',
    'mhv-u-reg-alert-info': status === 'info',
  });

  return (
    <div className={alertClasses}>
      <va-icon icon={icon} size={4} />
      <div className="mhv-u-reg-alert-col vads-u-flex-direction--col">
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
          {headline}
        </h2>
        <div className="mhv-u-reg-alert-body" role="presentation">
          {children}
        </div>
      </div>
    </div>
  );
};

CustomAlert.defaultProps = {
  recordEvent: recordEventFn,
};

CustomAlert.propTypes = {
  children: PropTypes.any.isRequired,
  headline: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['info', 'success', 'warning', 'continue'])
    .isRequired,
  disableAnalitics: PropTypes.bool,
  recordEvent: PropTypes.func,
};

export default CustomAlert;
