/**
 * Shared components used by the VAOS application.
 * @module components
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component that adds a usa-alert info box and customizes the va-alert web component
 *
 * @param {boolean} backgroundOnly Optional, display alert as background only, defaults to false
 * @param {Element} children React children, text or child elements to display in alert body
 * @param {string} headline Optional, alert headline
 * @param {string} level Optional, alert heading display level
 * @param {string} status Alert type
 * @returns div usa-alert or va-alert web component
 */

export default function InfoAlert({
  backgroundOnly = false,
  children,
  headline,
  level = 2,
  status,
}) {
  const H = `h${level}`;
  if (backgroundOnly) {
    return (
      <div
        className={`usa-alert usa-alert-${status} background-color-only vads-u-display--block`}
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
    <va-alert class="vads-u-margin-top--3" status={status}>
      <H className="vads-u-font-size--h3" slot="headline">
        {headline}
      </H>
      <div className="vads-u-font-size--base">{children}</div>
    </va-alert>
  );
}

InfoAlert.propTypes = {
  backgroundOnly: PropTypes.bool,
  children: PropTypes.node,
  headline: PropTypes.string,
  level: PropTypes.string,
  status: PropTypes.oneOf(['info', 'error', 'success', 'warning', 'continue'])
    .isRequired,
};
