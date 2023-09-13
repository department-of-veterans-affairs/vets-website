import React from 'react';
import PropTypes from 'prop-types';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import recordEvent from 'platform/monitoring/record-event';

const DisabilityConfirmation = ({ data, goBack, goForward }) => {
  // use logging to compare number of short forms started vs completed
  const onConfirm = () => {
    recordEvent({
      event: 'hca-short-form-flow',
    });
    goForward(data);
  };

  return (
    <va-alert
      class="vads-u-margin-x--neg2p5 vads-u-margin-top--2p5"
      status="info"
      background-only
    >
      <h3 className="vads-u-margin-top--0">
        Confirm that you receive service-connected pay for a 50% or higher
        disability rating
      </h3>
      <p>
        You selected that you currently receive service-connected disability pay
        for a 50% or higher disability rating. This means that you meet one of
        our eligibility criteria and we don’t need to ask your questions about
        other criteria, like income and military service.
      </p>
      <div className="row form-progress-buttons schemaform-buttons">
        <div className="small-5 medium-4 columns">
          <ProgressButton
            buttonClass="hca-button-progress usa-button-secondary"
            onButtonClick={goBack}
            buttonText="Back"
            beforeText="«"
          />
        </div>
        <div className="small-5 medium-4 end columns">
          <ProgressButton
            buttonClass="hca-button-progress usa-button-primary"
            onButtonClick={onConfirm}
            buttonText="Confirm"
            afterText="»"
          />
        </div>
      </div>
    </va-alert>
  );
};

DisabilityConfirmation.propTypes = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default DisabilityConfirmation;
