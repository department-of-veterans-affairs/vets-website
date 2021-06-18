import React from 'react';
import PropTypes from 'prop-types';

import CTALink from '../CTALink';

// import { recordDashboardClick } from '~/applications/personalization/dashboard/helpers';

const BenefitOfInterest = ({
  ctaButtonLabel,
  ctaUrl,
  title,
  children,
  icon,
  onClick,
}) => {
  return (
    <div
      className="vads-u-display--flex vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--4 medium-screen:vads-u-padding-right--3 vads-u-padding-bottom--3"
      data-testid="benefit-of-interest"
    >
      <div className="vads-u-display--flex vads-u-width--full vads-u-flex-direction--column vads-u-justify-content--space-between vads-u-align-items--flex-start">
        {/* This wrapper div is required for layout purposes. The parent uses
        `space-between`, so this first child will be pinned to the top of the
        parent div and the following anchor tag will be pinned to the bottom of
        the parent */}
        <div className="vads-u-width--full">
          <div className="vads-u-display--flex">
            <i
              className={`icon-small icon-heading hub-icon-${icon} hub-background-${icon} white vads-u-margin-right--1 vads-u-flex--auto`}
            />
            <h4 className="vads-u-font-size--h3 vads-u-margin-y--0">{title}</h4>
          </div>
          {children}
        </div>

        {/*
        TODO: determine what to track when clicking to find out more about a
        benefit onClick={recordDashboardClick(formId, 'continue-button')}
        */}
        <CTALink text={ctaButtonLabel} href={ctaUrl} onClick={onClick} />
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
