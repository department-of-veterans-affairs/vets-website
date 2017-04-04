import React from 'react';
import ProgressButton from '../../components/form-elements/ProgressButton';

export default function SubmitButtons({ submission, onSubmit, onBack }) {
  let submitButton;
  let submitMessage;
  if (submission.status === false) {
    submitButton = (
      <ProgressButton
          onButtonClick={onSubmit}
          buttonText="Submit Application"
          buttonClass="usa-button-primary"/>
    );
  } else if (submission.status === 'submitPending') {
    submitButton = (
      <ProgressButton
          onButtonClick={onSubmit}
          buttonText="Sending..."
          disabled
          buttonClass="usa-button-disabled"/>
    );
  } else if (submission.status === 'applicationSubmitted') {
    submitButton = (
      <ProgressButton
          onButtonClick={onSubmit}
          buttonText="Submitted"
          disabled
          buttonClass="form-button-green"
          beforeText="&#10003;"/>
    );
  } else {
    submitMessage = (
      <div className="usa-alert usa-alert-error schemaform-failure-alert">
        <div className="usa-alert-body">
          <p className="schemaform-warning-header"><strong>We're sorry, the application didn't go through.</strong></p>
          <p>You'll have to start over. We suggest you wait 1 day while we fix this problem.</p>
        </div>
      </div>
    );

    if (__BUILDTYPE__ !== 'production') {
      submitButton = (
        <div className="small-6 medium-6 columns">
          <a onClick={onSubmit}>Submit again</a>
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="small-12 medium-12 columns">
            {submitMessage}
          </div>
        </div>
        <div className="row form-progress-buttons schemaform-back-buttons">
          <div className="small-6 medium-6 columns">
            <a href="/">
              <button className="usa-button-primary">Go Back to Vets.gov</button>
            </a>
          </div>
          {submitButton}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="row form-progress-buttons">
        <div className="small-6 medium-5 columns">
          <ProgressButton
              onButtonClick={onBack}
              buttonText="Back"
              buttonClass="usa-button-outline"
              beforeText="«"/>
        </div>
        <div className="small-6 medium-5 columns">
          {submitButton}
        </div>
        <div className="small-1 medium-1 end columns">
          <div className="hidden">&nbsp;</div>
        </div>
      </div>
      <div className="row">
        <div className="columns">
        {submitMessage}
        </div>
      </div>
    </div>
  );
}
