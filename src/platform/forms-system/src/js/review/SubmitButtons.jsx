import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import ProgressButton from '../components/ProgressButton';
import { timeFromNow } from '../utilities/date';

// components
import { Column, Row, } from 'platform/forms/components/common/grid';

export default function SubmitButtons(props) {
  const {
    onBack,
    onSubmit,
    preSubmitSection,
    renderErrorMessage,
    submission,
  } = props;
  let submitButton;
  let submitMessage;
  if (submission.status === false) {
    submitButton = (
      <ProgressButton
        onButtonClick={onSubmit}
        buttonText="Submit application"
        buttonClass="usa-button-primary"
      />
    );
  } else if (submission.status === 'submitPending') {
    submitButton = (
      <ProgressButton
        onButtonClick={onSubmit}
        buttonText="Sending..."
        disabled
        buttonClass="usa-button-disabled"
      />
    );
  } else if (submission.status === 'applicationSubmitted') {
    submitButton = (
      <ProgressButton
        onButtonClick={onSubmit}
        buttonText="Submitted"
        disabled
        buttonClass="form-button-green"
        beforeText="&#10003;"
      />
    );
  } else if (submission.status === 'clientError') {
    submitButton = (
      <ProgressButton
        onButtonClick={onSubmit}
        buttonText="Submit application"
        buttonClass="usa-button-primary"
      />
    );
    submitMessage = (
      <div className="usa-alert usa-alert-error schemaform-failure-alert">
        <div className="usa-alert-body">
          <p className="schemaform-warning-header">
            <strong>
              We’re sorry, there was an error connecting to VA.gov.
            </strong>
          </p>
          <p>Please check your Internet connection and try again.</p>
        </div>
      </div>
    );
  } else if (submission.status === 'throttledError') {
    submitButton = (
      <ProgressButton
        onButtonClick={onSubmit}
        buttonText="Submit application"
        buttonClass="usa-button-primary"
      />
    );
    submitMessage = (
      <div className="usa-alert usa-alert-error schemaform-failure-alert">
        <div className="usa-alert-body">
          <p className="schemaform-warning-header">
            <strong>We’ve run into a problem</strong>
          </p>
          <p>
            We’re sorry. Your submission didn’t go through because we received
            too many requests from you. Please wait{' '}
            {timeFromNow(moment.unix(submission.extra))} and submit your request
            again.
          </p>
        </div>
      </div>
    );
  } else if (submission.status === 'validationError') {
    submitButton = (
      <ProgressButton
        onButtonClick={onSubmit}
        buttonText="Submit application"
        buttonClass="usa-button-primary"
      />
    );
    submitMessage = (
      <div className="usa-alert usa-alert-error schemaform-failure-alert">
        <div className="usa-alert-body">
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
        </div>
      </div>
    );
  } else {
    if (renderErrorMessage) {
      submitMessage = renderErrorMessage();
    } else {
      submitMessage = (
        <div className="usa-alert usa-alert-error schemaform-failure-alert">
          <div className="usa-alert-body">
            <p className="schemaform-warning-header">
              <strong>We’re sorry, the application didn’t go through.</strong>
            </p>
            <p>
              You’ll have to start over. We suggest you wait 1 day while we fix
              this problem.
            </p>
          </div>
        </div>
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      submitButton = (
        <Column classNames="small-6 usa-width-one-half medium-6">
          <a onClick={onSubmit}>Submit again</a>
        </Column>
      );
    }

    return (
      <>
        <Row>
          <Column classNames="small-12 medium-12" role="alert">
            {submitMessage}
          </Column>
        </Row>
        {preSubmitSection}
        <Row classNames="form-progress-buttons schemaform-back-buttons">
          <Column classNames="small-6 usa-width-one-half medium-6">
            <a href="/">
              <button className="usa-button-primary">Go Back to VA.gov</button>
            </a>
          </Column>
          {submitButton}
        </Row>
      </>
    );
  }
  return (
    <>
      <Row>
        <Column role="alert">
          {submitMessage}
        </Column>
      </Row>
      {preSubmitSection}
      <Row classNames="form-progress-buttons">
        <Column classNames="small-6 medium-5">
          <ProgressButton
            onButtonClick={onBack}
            buttonText="Back"
            buttonClass="usa-button-secondary"
            beforeText="«"
          />
        </Column>
        <Column classNames="small-6 medium-5">{submitButton}</Column>
        <Column classNames="small-1 medium-1 end">
          <div className="hidden">&nbsp;</div>
        </Column>
      </Row>
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
