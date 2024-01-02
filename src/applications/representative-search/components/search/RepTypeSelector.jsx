import React from 'react';
import PropTypes from 'prop-types';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { claimsAgentIsEnabled } from '../../config';

const RepTypeSelector = ({ onChange, representativeType }) => {
  const handleRadioButtonSelect = event => {
    onChange({ representativeType: event.detail.value });
  };

  return (
    <>
      <div className="vads-u-margin-top--3 rep-type-radio-group">
        <VaRadio
          error={null}
          hint=""
          label="Type of accredited representative"
          required
          label-header-level=""
          onVaValueChange={handleRadioButtonSelect}
        >
          <va-radio-option
            label="Veteran Service Officer"
            name="group"
            value="officer"
            checked={representativeType === 'officer'}
            radioOptionSelected={handleRadioButtonSelect}
            vaValueChange={handleRadioButtonSelect}
          />
          <va-radio-option
            label="Attorney"
            name="group"
            value="attorney"
            checked={representativeType === 'attorney'}
            radioOptionSelected={handleRadioButtonSelect}
            vaValueChange={handleRadioButtonSelect}
          />
          {claimsAgentIsEnabled && (
            <va-radio-option
              label="Claims agent"
              name="group"
              value="claim_agents"
              checked={representativeType === 'claim_agents'}
              radioOptionSelected={handleRadioButtonSelect}
              vaValueChange={handleRadioButtonSelect}
            />
          )}
        </VaRadio>

        <div style={{ marginTop: '2em' }}>
          <va-accordion
            disable-analytics={{
              value: 'false',
            }}
            section-heading={{
              value: 'null',
            }}
            uswds
            open-single
          >
            <va-accordion-item id="first">
              <h3 slot="headline" style={{ fontSize: '16px' }}>
                How can each type of accredited representative help me?
              </h3>
              <p>
                <strong>Veteran Service Officer (VSO)</strong> representatives
                can help you gather evidence and file your claims, decision
                reviews, and appeals. They can also communicate with VA about
                your case on your behalf. Examples of VSOs include the American
                Legion, County Veteran Service Offices, Disabled American
                Veterans, and Veterans of Foreign Wars.
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
              {claimsAgentIsEnabled && (
                <p>
                  <strong>Claims agents</strong> usually work on decision
                  reviews and appeals. They’re independent professionals who
                  have passed a test about VA claims and benefits. Claims agents
                  can charge fees for their services.
                </p>
              )}
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
