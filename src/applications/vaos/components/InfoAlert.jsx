import React from 'react';
import PropTypes from 'prop-types';

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
