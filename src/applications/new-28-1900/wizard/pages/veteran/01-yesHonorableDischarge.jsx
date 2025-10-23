import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { veteranPathPageNames } from '../pageList';
import { handleChangeAndPageSet } from '../helpers';

const options = [
  { value: veteranPathPageNames.yesDisabilityRating, label: 'Yes' },
  { value: veteranPathPageNames.noDisabilityRating, label: 'No' },
];

const yesHonorableDischarge = ({ setPageState, state = {} }) => {
  const handleValueChange = ({ detail } = {}) => {
    const { value } = detail;
    handleChangeAndPageSet(
      setPageState,
      value,
      options,
      'Do you have a service-connected disability rating of 10% or higher',
    );
  };
  return (
    <VaRadio
      id={veteranPathPageNames.yesHonorableDischarge}
      class="vads-u-margin-y--2"
      label="Do you have a service-connected disability rating of 10% or higher?"
      onVaValueChange={handleValueChange}
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          name="disability-rating"
          label={option.label}
          value={option.value}
          checked={state.selected === option.value}
          aria-describedby={
            state.selected === option.value ? option.value : null
          }
        />
      ))}
    </VaRadio>
  );
};

export default {
  name: veteranPathPageNames.yesHonorableDischarge,
  component: yesHonorableDischarge,
};
