import React from 'react';
import PropTypes from 'prop-types';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const RepTypeSelector = ({ onChange, representativeType }) => {
  const handleRadioButtonSelect = event => {
    onChange({ representativeType: event.detail.value });
  };

  return (
    <>
      <div className="rep-type-radio-group">
        <VaRadio
          error={null}
          hint=""
          required
          label="Type of accredited representative"
          label-header-level=""
          onVaValueChange={handleRadioButtonSelect}
        >
          <va-radio-option
            label="Accredited Veterans Service Officer (VSO)"
            name="group"
            value="veteran_service_officer"
            checked={representativeType === 'veteran_service_officer'}
            radioOptionSelected={handleRadioButtonSelect}
            vaValueChange={handleRadioButtonSelect}
          />
          <va-radio-option
            label="Accredited attorney"
            name="group"
            value="attorney"
            checked={representativeType === 'attorney'}
            radioOptionSelected={handleRadioButtonSelect}
            vaValueChange={handleRadioButtonSelect}
          />
          <va-radio-option
            label="Accredited claims agent"
            name="group"
            value="claim_agents"
            checked={representativeType === 'claim_agents'}
            radioOptionSelected={handleRadioButtonSelect}
            vaValueChange={handleRadioButtonSelect}
          />
        </VaRadio>
      </div>
    </>
  );
};

RepTypeSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  representativeType: PropTypes.string,
};

export default RepTypeSelector;
