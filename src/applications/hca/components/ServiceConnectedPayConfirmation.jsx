import React from 'react';
import PropTypes from 'prop-types';

import ProgressButton from '~/platform/forms-system/src/js/components/ProgressButton';

const ServiceConnectedPayConfirmation = ({ goBack, goForward }) => {
  const FormNavButtons = () => (
    <div className="row form-progress-buttons schemaform-buttons">
      <div className="small-6 medium-5 columns">
        {goBack && (
          <ProgressButton
            // eslint-disable-next-line react/jsx-no-bind
            onButtonClick={goBack}
            buttonText="Back"
            buttonClass="usa-button-secondary"
            beforeText="«"
          />
        )}
      </div>
      <div className="small-6 medium-5 end columns">
        <ProgressButton
          onButtonClick={goForward}
          buttonText="Confirm"
          buttonClass="usa-button-primary"
          afterText="»"
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="hca-id-form-wrapper vads-u-margin-bottom--2 vads-u-margin-x--neg1p5">
        <div className="vads-u-background-color--primary-alt-lightest vads-u-padding-top--1 vads-u-padding-bottom--2p5  vads-u-margin-bottom--3">
          <div className="vads-u-padding-x--4">
            <h3>
              Please confirm that you receive service-connected pay for a 50% or
              higher disability rating.
            </h3>
            <p>
              You selected that you currently receive service-connected
              disability pay for a 50% or higher disability rating. Because your
              rating is 50% or higher, we can ask you fewer questions.
            </p>
            <p>
              <strong>Note:</strong> We’ll confirm your information when we
              receive your application.
            </p>
            <div className="vads-u-margin-y--4">
              <va-additional-info trigger="Why do I need to confirm my disability pay?">
                We want to make sure that we ask you all the questions we need
                to make a decision about your application. This helps you get a
                decision faster and avoids the need to ask you for more
                information later.
              </va-additional-info>
            </div>
            <FormNavButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceConnectedPayConfirmation;

ServiceConnectedPayConfirmation.propTypes = {
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};
