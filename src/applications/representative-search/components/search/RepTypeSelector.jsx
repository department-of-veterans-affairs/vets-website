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
            label="Accredited VSO representative"
            name="group"
            value="representative"
            checked={representativeType === 'representative'}
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
            value="claims_agent"
            checked={representativeType === 'claims_agent'}
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
