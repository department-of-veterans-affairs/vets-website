import React from 'react';
import * as Sentry from '@sentry/browser';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// Production and staging have unique identifiers for the survey; provided by Medallia team
// TODO update production number once we receive it
const PRODUCTION_SURVEY_NUMBER = 41;
const STAGING_SURVEY_NUMBER = 41;

/**
 * SurveyInformation - Displays informational text and a button to launch Medallia survey modal
 * @return {React Component}
 */

const SurveyInformation = () => {
  const isProduction = environment.isProduction();

  // showForm/loadForm use specific survey numbers for each environment
  const surveyNumber = isProduction
    ? PRODUCTION_SURVEY_NUMBER
    : STAGING_SURVEY_NUMBER;
  const formCanLoad = !!window.KAMPYLE_ONSITE_SDK?.loadForm(surveyNumber);

  // TODO disable in production until survey is ready
  if (formCanLoad && !isProduction) {
    return (
      <div>
        <p>
          We would appreciate feedback on your experience filling out this form.
        </p>
        <VaButton
          onClick={window.KAMPYLE_ONSITE_SDK?.showForm(surveyNumber)}
          text="Provide feedback"
          uswds
        />
      </div>
    );
  }

  if (!formCanLoad) {
    Sentry.withScope(scope => {
      const message = '5655 Error loading end of form survey';
      scope.setContext(message, {
        KAMPYLE_ONSITE_SDK: window.KAMPYLE_ONSITE_SDK,
        showForm: window.KAMPYLE_ONSITE_SDK?.showForm(41),
      });
      Sentry.captureMessage(message);
    });
  }

  return null;
};

export default SurveyInformation;
