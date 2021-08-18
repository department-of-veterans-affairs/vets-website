import React from 'react';
import PropTypes from 'prop-types';

import { recordDashboardClick } from '~/applications/personalization/dashboard/helpers';

import CTALink from '../CTALink';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';

/**
 * Returns a copy of the passed-in string with the first letter capitalized
 *
 * @param {string} input - word to capitalize
 * @returns {string} - the input string with the first letter capitalized
 */
const capitalizeFirstLetter = input => {
  const capitalizedFirstLetter = input[0].toUpperCase();
  return `${capitalizedFirstLetter}${input.slice(1)}`;
};

const ApplicationInProgress = ({
  continueUrl,
  expirationDate,
  formId,
  formTitle,
  lastOpenedDate,
  presentableFormId,
}) => {
  return (
    <DashboardWidgetWrapper>
      <div
        className="vads-u-display--flex vads-u-margin-bottom--3"
        data-testid="application-in-progress"
      >
        <div className="vads-u-display--flex vads-u-width--full vads-u-flex-direction--column vads-u-justify-content--space-between vads-u-align-items--flex-start vads-u-background-color--gray-lightest vads-u-padding--2p5">
          <div className="vads-u-width--full">
            <p
              id={formId}
              className="vads-u-text-transform--uppercase vads-u-margin-y--0"
            >
              {presentableFormId}
            </p>
            <h4
              aria-describedby={formId}
              className="vads-u-font-size--h3 vads-u-margin-top--0"
            >
              {capitalizeFirstLetter(formTitle)}
            </h4>
            <div className="vads-u-display--flex">
              <i
                aria-hidden="true"
                className={`fas fa-fw fa-exclamation-circle vads-u-margin-right--1 vads-u-margin-top--0p5`}
              />
              <span className="sr-only">Alert: </span>
              <div>
                <p className="vads-u-margin-top--0">
                  Application expires on: {expirationDate}
                </p>
                <p>Last opened on: {lastOpenedDate}</p>
              </div>
            </div>
          </div>
          <CTALink
            ariaLabel={`Continue your ${formTitle}`}
            text="Continue your application"
            href={continueUrl}
            onClick={recordDashboardClick(formId, 'continue-button')}
          />
        </div>
      </div>
    </DashboardWidgetWrapper>
  );
};

ApplicationInProgress.propTypes = {
  // The URL that lets the user continue their application
  continueUrl: PropTypes.string.isRequired,
  // The display-ready application expiration date
  expirationDate: PropTypes.string.isRequired,
  // The Form ID for Google Analytics tracking purposes
  formId: PropTypes.string.isRequired,
  // String to use as the main "headline" of the component
  formTitle: PropTypes.string.isRequired,
  // The display-ready date when the application was last opened by the user
  lastOpenedDate: PropTypes.string.isRequired,
  // String to show at the very top of the component, usually `Form ${formId}`
  presentableFormId: PropTypes.string.isRequired,
};

export default ApplicationInProgress;
