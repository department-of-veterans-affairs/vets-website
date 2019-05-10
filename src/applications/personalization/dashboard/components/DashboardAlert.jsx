import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

export const DASHBOARD_ALERT_TYPES = Object.freeze({
  closed: 'closed', // Black, exclamation mark
  decision: 'decision', // Red, exclamation mark
  enrolled: 'enrolled', // Green, checkmark
  inProgress: 'in-progress', // Blue, pause (TBD)
  update: 'update', // Gold, exclamation
});

const DashboardAlert = ({
  children,
  content,
  headline,
  status,
  statusHeadline,
  statusInfo,
  subheadline,
}) => {
  const classes = classNames('dashboard-alert', `dashboard-alert-${status}`);

  const alertContent = content || children;

  return (
    <div className={classes}>
      <header>
        {subheadline && <h4>{subheadline}</h4>}
        <h3>{headline}</h3>
      </header>
      <section className="status vads-u-display--flex">
        <div className="status-icon-container vads-u-flex--auto">
          <i />
        </div>
        <div className="vads-u-flex--1">
          <h3>{statusHeadline}</h3>
          {statusInfo && <p>{statusInfo}</p>}
        </div>
      </section>
      <section className="content">{alertContent}</section>
    </div>
  );
};

DashboardAlert.propTypes = {
  /**
   * Determines the alert icon and color of the icon and horizontal rule lines
   */
  status: PropTypes.oneOf(Object.values(DASHBOARD_ALERT_TYPES)).isRequired,

  /**
   * Body content of the alert, which can also be passed via children.
   */
  content: PropTypes.node,

  /**
   * Main headline at the top of the alert
   */
  headline: PropTypes.string,

  /**
   * Headline for the status section of the alert, below the main `headline`
   */
  statusHeadline: PropTypes.string,

  /**
   * Additional info for the status section of the alert
   */
  statusInfo: PropTypes.string,

  /**
   * Main subheadline that sits _above_ the `headline` in smaller text
   */
  subheadline: PropTypes.string,
};

export default DashboardAlert;
