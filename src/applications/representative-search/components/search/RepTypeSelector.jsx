import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { updateSearchQuery } from '../../actions';

const RepTypeSelector = ({ representativeType }) => {
  const dispatch = useDispatch();
  const handleRadioButtonSelect = event => {
    dispatch(updateSearchQuery({ representativeType: event.detail.value }));
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
  representativeType: PropTypes.string,
};

export default RepTypeSelector;
