import React from 'react';
import PropTypes from 'prop-types';

export default function InfoAlert({
  backgroundOnly = false,
  children,
  headline,
  status,
}) {
  if (backgroundOnly) {
    return (
      <div
        className={`usa-alert usa-alert-${status} background-color-only vads-u-display--block`}
      >
        <div className="usa-alert-body">
          {headline && <h3 className="usa-alert-heading">{headline}</h3>}
          <div className="usa-alert-text">{children}</div>
        </div>
      </div>
    );
  }
  return (
    <va-alert status={status}>
      <h2 className="vads-u-font-size--h3" slot="headline">
        {headline}
      </h2>
      <div className="vads-u-font-size--base">{children}</div>
    </va-alert>
  );
}

InfoAlert.propTypes = {
  backgroundOnly: PropTypes.bool,
  children: PropTypes.node,
  headline: PropTypes.string,
  status: PropTypes.oneOf(['info', 'error', 'success', 'warning', 'continue'])
    .isRequired,
};
