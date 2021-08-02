import React from 'react';
import ProgressButton from './ProgressButton';

const FormNavButtons = ({ goBack, goForward, submitToContinue }) => (
  <div className="row form-progress-buttons schemaform-buttons">
    <div className="small-6 medium-5 columns">
      {goBack && (
        <ProgressButton
          onButtonClick={goBack}
          buttonText="Back"
          buttonClass="usa-button-secondary"
          beforeText="«"
        />
      )}
    </div>
    <div className="small-6 medium-5 end columns">
      <ProgressButton
        submitButton={submitToContinue}
        onButtonClick={goForward}
        buttonText="Continue"
        buttonClass="usa-button-primary"
        afterText="»"
      />
    </div>
  </div>
);
export default FormNavButtons;
