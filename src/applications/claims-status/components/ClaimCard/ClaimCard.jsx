import React from 'react';
import { PropTypes } from 'prop-types';

export default function ClaimCard({ title, children, label, subtitle }) {
  return (
    <va-card class="claim-list-item" uswds="false">
      <h3 className="claim-list-item-header vads-u-margin-bottom--2">
        <div role="text">
          {label && <span className="usa-label">{label}</span>}
          {title}
          {subtitle && (
            <span className="vads-u-margin-top--0p5 submitted-on">
              {subtitle}
            </span>
          )}
        </div>
      </h3>
      {children}
    </va-card>
  );
}

ClaimCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  label: PropTypes.string,
  subtitle: PropTypes.string,
};
