import React from 'react';
import PropTypes from 'prop-types';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';

const DisabilityConfirmation = props => {
  const { goBack, goForward } = props;

  return (
    <va-alert
      status="info"
      class="vads-u-margin-x--neg2p5 vads-u-margin-top--2p5"
      uswds
    >
      <h3 slot="headline">
        Confirm that you don’t want to provide your household financial
        information
      </h3>
      <p>
        <strong>
          If you’re not eligible for VA health care based on enhanced
          eligibility status,
        </strong>{' '}
        we need your financial information to decide if you’re eligible based on
        your income.
      </p>
      <p>
        <strong>
          If you’re eligible based on enhanced eligibility status,
        </strong>{' '}
        you don’t have to share your financial information for eligibility. But
        if you don’t share this information, we may not be able to decide if you
        qualify for no copays, free medications, or travel reimbursement.
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
            onButtonClick={goForward}
            buttonText="Confirm"
            afterText="»"
          />
        </div>
      </div>
    </va-alert>
  );
};

DisabilityConfirmation.propTypes = {
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default DisabilityConfirmation;
