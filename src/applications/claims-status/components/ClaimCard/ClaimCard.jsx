import React from 'react';
import { PropTypes } from 'prop-types';
import { DemoNotation } from '../../demo';

export default function ClaimCard({ title, children, label, subtitle }) {
  return (
    <va-card class="claim-list-item">
      <h3 className="claim-list-item-header vads-u-margin-bottom--2">
        <div>
          {label && (
            <>
              <DemoNotation
                theme="change"
                title="Component addition: Tag - Status"
                before="Red error alert that stacked above the blue alert"
                after="Tag - Status component (va-tag-status error)"
                description={
                  'This change was done to prevent stacking alerts if a Type 2 error occurs and the user also has the blue "We requested more information from you" alert. '
                }
              />
              <span className="vads-u-margin-bottom--1 vads-u-font-family--sans">
                <va-tag-status status="error" text={label} />
              </span>
            </>
          )}
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
