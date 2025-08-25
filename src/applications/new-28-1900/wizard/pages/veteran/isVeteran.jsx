import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { veteranPathPageNames } from '../pageList';
import { handleChangeAndPageSet } from '../helpers';

const options = [
  { value: veteranPathPageNames.yesHonorableDischarge, label: 'Yes' },
  { value: veteranPathPageNames.noHonorableDischarge, label: 'No' },
];

const isVeteran = ({ setPageState, state = {} }) => {
  const handleValueChange = ({ detail } = {}) => {
    const { value } = detail;
    handleChangeAndPageSet(
      setPageState,
      value,
      options,
      'Did you receive a discharge status other than  dishonorable?',
    );
  };
  return (
    <VaRadio
      id={veteranPathPageNames.isVeteran}
      class="vads-u-margin-y--2"
      label="Did you receive a discharge status other than dishonorable?"
      onVaValueChange={handleValueChange}
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          name="discharge-status"
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
  name: veteranPathPageNames.isVeteran,
  component: isVeteran,
};
