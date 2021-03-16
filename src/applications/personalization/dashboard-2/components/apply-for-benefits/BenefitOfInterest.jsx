import React from 'react';
import PropTypes from 'prop-types';

// import { recordDashboardClick } from '~/applications/personalization/dashboard/helpers';

const BenefitOfInterest = ({ ctaButtonLabel, ctaUrl, title, children }) => {
  return (
    <div
      className="vads-u-display--flex vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--4 medium-screen:vads-u-padding-right--3 vads-u-padding-bottom--3"
      data-testid="benefit-of-interest"
    >
      <div className="vads-u-display--flex vads-u-width--full vads-u-flex-direction--column vads-u-justify-content--space-between vads-u-align-items--flex-start vads-u-background-color--gray-lightest vads-u-padding--2p5">
        {/* This wrapper div is required for layout purposes. The parent uses
        `space-between`, so this first child will be pinned to the top of the
        parent div and the following anchor tag will be pinned to the bottom of
        the parent */}
        <div>
          <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">{title}</h4>
          {children}
        </div>

        <a
          className="usa-button usa-button-primary"
          href={ctaUrl}
          // TODO: determine what to track when clicking to find out more about a benefit
          // onClick={recordDashboardClick(formId, 'continue-button')}
        >
          {ctaButtonLabel}
        </a>
      </div>
    </div>
  );
};

BenefitOfInterest.propTypes = {
  // The label of the CTA button
  ctaButtonLabel: PropTypes.string.isRequired,
  // The URL where users can learn more about this benefit
  ctaUrl: PropTypes.string.isRequired,
  // The title of this benefit
  title: PropTypes.string.isRequired,
};

export default BenefitOfInterest;
