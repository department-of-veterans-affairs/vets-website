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

export const ALERT_ICONS = Object.freeze({
  [DASHBOARD_ALERT_TYPES.closed]: 'warning',
  [DASHBOARD_ALERT_TYPES.decision]: 'warning',
  [DASHBOARD_ALERT_TYPES.enrolled]: 'check',
  [DASHBOARD_ALERT_TYPES.inProgress]: 'description',
  [DASHBOARD_ALERT_TYPES.update]: 'warning',
});

const DashboardAlert = ({
  children,
  content,
  headline,
  status,
  statusHeadline,
  statusInfo,
  subheadline,
  id,
}) => {
  const classes = classNames(
    'dashboard-alert',
    `dashboard-alert-${status}`,
    'vads-u-margin-bottom--3',
  );

  const alertContent = content || children;
  const alertIcon = ALERT_ICONS[status] || 'warning';
  const headerId = `dashboard-alert-header-${id}`;

  return (
    <div aria-labelledby={headerId} role="region" className={classes}>
      <div>
        {subheadline && (
          <div className="vads-u-margin-bottom--1 heading-desc">
            {subheadline}
          </div>
        )}
        <h3 id={headerId} className="vads-u-margin--0">
          {headline}
        </h3>
      </div>
      <section className="status vads-u-display--flex">
        <div className="status-icon-container vads-u-flex--auto">
          <va-icon icon={alertIcon} />
        </div>
        <div className="vads-u-flex--1">
          <div className="vads-u-line-height--3 vads-u-font-size--h3 vads-u-font-family--sans vads-u-font-weight--bold">
            {statusHeadline}
          </div>
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
  headline: PropTypes.string.isRequired,

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

  /**
   * Unique id for the alert, used to construct ids used by aria attributes
   */
  id: PropTypes.string.isRequired,
};

export default DashboardAlert;
