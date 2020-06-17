// libs
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// platform - forms components
import ErrorMessage from 'platform/forms/components/review/ErrorMessage';

// platform - forms-system
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import { timeFromNow } from 'platform/forms-system/src/js/utilities/date';

// TODO: should probably be a common const somewhere..
const SUBMISSION_STATUSES = {
  applicationSubmitted: 'applicationSubmitted',
  clientError: 'clientError',
  submitPending: 'submitPending',
  throttledError: 'throttledError',
  validationError: 'validationError',
};

export default function SubmitButtons(props) {
  const { onBack, onSubmit, preSubmitSection, submission } = props;

  let submitButton;
  let submitMessage;

  const submissionStatus = submission.status;

  switch (submissionStatus) {
    case false:
      submitButton = (
        <ProgressButton
          onButtonClick={onSubmit}
          buttonText="Submit application"
          buttonClass="usa-button-primary"
        />
      );
      break;
    case SUBMISSION_STATUSES.submitPending:
      submitButton = (
        <ProgressButton
          onButtonClick={onSubmit}
          buttonText="Sending..."
          disabled
          buttonClass="usa-button-disabled"
        />
      );
      break;
    case SUBMISSION_STATUSES.applicationSubmitted:
      submitButton = (
        <ProgressButton
          onButtonClick={onSubmit}
          buttonText="Submitted"
          disabled
          buttonClass="form-button-green"
          beforeText="&#10003;"
        />
      );
      break;
    case SUBMISSION_STATUSES.clientError:
      submitButton = (
        <ProgressButton
          onButtonClick={onSubmit}
          buttonText="Submit application"
          buttonClass="usa-button-primary"
        />
      );
      submitMessage = (
        <ErrorMessage active>
          <p className="schemaform-warning-header">
            <strong>
              We’re sorry, there was an error connecting to VA.gov.
            </strong>
          </p>
          <p>Please check your Internet connection and try again.</p>
        </ErrorMessage>
      );
      break;
    case SUBMISSION_STATUSES.throttledError:
      submitButton = (
        <ProgressButton
          onButtonClick={onSubmit}
          buttonText="Submit application"
          buttonClass="usa-button-primary"
        />
      );
      submitMessage = (
        <ErrorMessage active>
          <p className="schemaform-warning-header">
            <strong>We’ve run into a problem</strong>
          </p>
          <p>
            We’re sorry. Your submission didn’t go through because we received
            too many requests from you. Please wait{' '}
            {timeFromNow(moment.unix(submission.extra))} and submit your request
            again.
          </p>
        </ErrorMessage>
      );
      break;
    case SUBMISSION_STATUSES.validationError:
      submitButton = (
        <ProgressButton
          onButtonClick={onSubmit}
          buttonText="Submit application"
          buttonClass="usa-button-primary"
        />
      );
      submitMessage = (
        <ErrorMessage active>
          <p className="schemaform-warning-header">
            <strong>
              We’re sorry. Some information in your application is missing or
              not valid.
            </strong>
          </p>
          <p>
            Please check each section of your application to make sure you’ve
            filled out all the information that is required.
          </p>
        </ErrorMessage>
      );
      break;
    default:
      submitMessage = (
        <ErrorMessage active>
          <p className="schemaform-warning-header">
            <strong>We’re sorry, the application didn’t go through.</strong>
          </p>
          <p>
            You’ll have to start over. We suggest you wait 1 day while we fix
            this problem.
          </p>
        </ErrorMessage>
      );
      if (process.env.NODE_ENV !== 'production') {
        submitButton = (
          <div className="small-6 usa-width-one-half medium-6 columns">
            <a onClick={onSubmit}>Submit again</a>
          </div>
        );
      }
      break;
  }

  return (
    <>
      <div className="row">
        <div className="columns">{submitMessage}</div>
      </div>
      {preSubmitSection}
      <div className="row form-progress-buttons">
        <div className="small-6 medium-5 columns">
          <ProgressButton
            onButtonClick={onBack}
            buttonText="Back"
            buttonClass="usa-button-secondary"
            beforeText="«"
          />
        </div>
        <div className="small-6 medium-5 columns">{submitButton}</div>
        <div className="small-1 medium-1 end columns">
          <div className="hidden">&nbsp;</div>
        </div>
      </div>
    </>
  );
}

SubmitButtons.propTypes = {
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
  preSubmitSection: PropTypes.element,
  renderErrorMessage: PropTypes.func,
  submission: PropTypes.object,
};
