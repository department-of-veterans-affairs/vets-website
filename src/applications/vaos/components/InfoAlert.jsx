/**
 * Shared components used by the VAOS application.
 * @module components
 */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Component that adds a usa-alert info box and customizes the va-alert web component
 *
 * @param {boolean} backgroundOnly Optional, display alert as background only, defaults to false
 * @param {Element} children React children, text or child elements to display in alert body
 * @param {string} className Additional classes to add to the alert, required to apply classes to va-alert via class
 * @param {string} headline Optional, alert headline
 * @param {string} level Optional, alert heading display level
 * @param {string} status Alert type
 * @returns div usa-alert or va-alert web component
 */

export default function InfoAlert({
  backgroundOnly = false,
  children,
  className = '',
  headline,
  level = 2,
  status,
  addRole = undefined,
}) {
  const H = `h${level}`;
  if (backgroundOnly) {
    return (
      <div
        className={classnames(
          `usa-alert usa-alert-${status} background-color-only vads-u-display--block vads-u-width--auto`,
          className,
        )}
      >
        <div className="usa-alert-body">
          {headline && (
            <H className="usa-alert-heading vads-u-font-size--h3">{headline}</H>
          )}
          <div className="usa-alert-text">{children}</div>
        </div>
      </div>
    );
  }
  return (
    <va-alert
      role={addRole || undefined}
      class={className}
      status={status}
      uswds
    >
      {headline && (
        <H className="vads-u-font-size--h3" slot="headline">
          {headline}
        </H>
      )}
      <div>{children}</div>
    </va-alert>
  );
}

InfoAlert.propTypes = {
  status: PropTypes.oneOf(['info', 'error', 'success', 'warning', 'continue'])
    .isRequired,
  addRole: PropTypes.string,
  backgroundOnly: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  headline: PropTypes.string,
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
