import React from 'react';
import ProgressButton from '../../components/form-elements/ProgressButton';
import SaveFormLink from '../SaveFormLink';

export default function SubmitButtons(props) {
  const {
    errorMessage,
    errorText,
    onBack,
    onSubmit,
    submission,
    locationPathname,
    form,
    user,
    saveAndRedirectToReturnUrl,
    toggleLoginModal,
    sipEnabled,
  } = props;
  // Pulling this out to here so LoginModal doesn't get re-created on state change
  //  since saving happens in LoginModal.componentWillReceiveProps()
  const saveLink = (<SaveFormLink
    locationPathname={locationPathname}
    form={form}
    user={user}
    saveAndRedirectToReturnUrl={saveAndRedirectToReturnUrl}
    toggleLoginModal={toggleLoginModal}>
    save your application
  </SaveFormLink>);
  const Message = errorMessage;
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
  } else if (submission.status === 'clientError') {
    submitButton = (
      <ProgressButton
        onButtonClick={onSubmit}
        buttonText="Submit Application"
        buttonClass="usa-button-primary"/>
    );
    submitMessage = (
      <div className="usa-alert usa-alert-error schemaform-failure-alert">
        <div className="usa-alert-body">
          <p className="schemaform-warning-header"><strong>We’re sorry, there was an error connecting to Vets.gov.</strong></p>
          <p>Please check your Internet connection and try again. If the problem persists, please contact the Vets.gov Help Desk.</p>
        </div>
      </div>
    );
  } else if (submission.status === 'validationError') {
    submitButton = (
      <ProgressButton
        onButtonClick={onSubmit}
        buttonText="Submit Application"
        buttonClass="usa-button-primary"/>
    );
    submitMessage = (
      <div className="usa-alert usa-alert-error schemaform-failure-alert">
        <div className="usa-alert-body">
          <p className="schemaform-warning-header"><strong>We’re sorry. Some information in your application is missing or not valid.</strong></p>
          <p>Please check each section of your application to make sure you’ve filled out all the information that is required.</p>
        </div>
      </div>
    );
  } else {
    if (errorMessage) {
      submitMessage = <Message/>;
    } else if (sipEnabled) {
      let InlineErrorComponent;
      if (typeof errorText === 'function') {
        InlineErrorComponent = errorText;
      } else if (typeof errorText === 'string') {
        InlineErrorComponent = () => <p>{errorText}</p>;
      } else {
        InlineErrorComponent = () => <p>If it still doesn’t work, please call the Vets.gov Help Desk at <a href="1-855-574-7286">1-855-574-7286</a> (TTY: <a href="+18008778339">1-800-877-8339</a>). We’re here Monday–Friday, 8:00 a.m.–8:00 p.m. (ET).</p>;
      }
      submitMessage = (
        <div className="usa-alert usa-alert-error schemaform-failure-alert">
          <div className="usa-alert-body">
            <p className="schemaform-warning-header"><strong>We’re sorry, the application didn’t go through.</strong></p>
            <p>We’re working to fix the problem, but it may take us a little while. Please {saveLink} and try submitting it again tomorrow.</p>
            {!user.login.currentlyLoggedIn && <p>If you don’t have an account, you’ll have to start over. Please try submitting your application again tomorrow.</p>}
            <InlineErrorComponent/>
          </div>
        </div>
      );
    } else {
      submitMessage = (
        <div className="usa-alert usa-alert-error schemaform-failure-alert">
          <div className="usa-alert-body">
            <p className="schemaform-warning-header"><strong>We’re sorry, the application didn’t go through.</strong></p>
            <p>You’ll have to start over. We suggest you wait 1 day while we fix this problem.</p>
          </div>
        </div>
      );
    }

    if (__BUILDTYPE__ !== 'production') {
      submitButton = (
        <div className="small-6 usa-width-one-half medium-6 columns">
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
          <div className="small-6 usa-width-one-half medium-6 columns">
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
            buttonClass="usa-button-secondary"
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
