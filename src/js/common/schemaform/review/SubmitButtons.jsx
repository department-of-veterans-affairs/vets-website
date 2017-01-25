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
      <div className="usa-alert usa-alert-error">
        <div className="usa-alert-body">
          <p><strong>Due to a system error, we weren't able to process your application. Please try again later.</strong></p>
          <p>We apologize for the inconvenience. If you'd like to complete this form by phone, please call 877-222-VETS (8387) and press 2, M-F 7:00 a.m.to 7:00 p.m. (CST), Sat 9:00 a.m. to 5:30 p.m. (CST).</p>
        </div>
      </div>
    );
    submitButton = (
      <ProgressButton
          onButtonClick={onSubmit}
          buttonText="Send Failed"
          disabled
          buttonClass="usa-button-secondary form-button-disabled"
          beforeText="x"/>
    );
  }
  return (
    <div>
      <div className="usa-grid-full form-progress-buttons">
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
