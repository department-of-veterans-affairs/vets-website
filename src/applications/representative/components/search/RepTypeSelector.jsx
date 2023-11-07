import React from 'react';
import PropTypes from 'prop-types';

const RepTypeSelector = ({ onChange }) => {
  const handleRadioButtonSelect = event => {
    onChange({ representativeType: event.detail.value });
  };

  return (
    <>
      <div className="vads-u-margin-top--3">
        <label htmlFor="representative-type" className="vads-u-margin-top--2">
          Type of representative{' '}
          <span className="form-required-span">(*Required)</span>
        </label>
        <va-radio
          error={null}
          header-aria-describedby="Select your Representative type:"
          hint=""
          label=""
          label-header-level="3"
          onVaValueChange={handleRadioButtonSelect}
        >
          <va-radio-option
            label="Veteran Service Organization (VSO)"
            name="VSO"
            value="Veteran Service Organization (VSO)"
            checked
          />
          <va-radio-option label="Attorney" name="Attorney" value="Attorney" />
          <va-radio-option
            label="Claims Agent"
            name="Claims Agent"
            value="Claims Agent"
          />
        </va-radio>

        <div style={{ marginTop: '2em' }}>
          <va-accordion
            disable-analytics={{
              value: 'false',
            }}
            section-heading={{
              value: 'null',
            }}
            uswds={{
              value: 'false',
            }}
            open-single
          >
            <va-accordion-item id="first">
              <h6 slot="headline">
                How can each type of representative help me?
              </h6>
              <p>
                <strong>Veteran Services Organization (VSO)</strong>{' '}
                representatives can help you gather evidence and file your
                claims, decision reviews, and appeals. They can also communicate
                with VA about your case on your behalf. Examples of VSOs include
                the American Legion, County Veteran Service Offices, Disabled
                American Veterans, and Veterans of Foreign Wars.
              </p>
              <p>
                VSO representatives have completed training and passed tests
                about VA claims and benefits. They provide services to Veterans
                and their families at no cost.
              </p>
              <p>
                <strong>Attorneys</strong> usually work on decision reviews and
                appeals, including cases that require legal knowledge. They
                don’t have to take a test about VA claims and benefits, but they
                must be a member in good standing of the bar association.
                Attorneys can charge fees for their services.
              </p>
              <p>
                <strong>Claims agents</strong> usually work on decision reviews
                and appeals. They’re independent professionals who have passed a
                test about VA claims and benefits. Claims agents can charge fees
                for their services.
              </p>
            </va-accordion-item>
          </va-accordion>
        </div>
      </div>
    </>
  );
};

RepTypeSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default RepTypeSelector;
