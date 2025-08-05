import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { serviceMemberPathPageNames } from '../pageList';
import { handleChangeAndPageSet } from '../helpers';

const options = [
  { value: serviceMemberPathPageNames.yesVaMemorandum, label: 'Yes' },
  { value: serviceMemberPathPageNames.noVaMemorandum, label: 'No' },
];

const yesHonorableDischargeSM = ({ setPageState, state = {} }) => {
  const handleValueChange = ({ detail } = {}) => {
    const { value } = detail;
    handleChangeAndPageSet(
      setPageState,
      value,
      options,
      'Do you have a VA memorandum rating of 20% or higher?',
    );
  };
  return (
    <VaRadio
      id={serviceMemberPathPageNames.yesHonorableDischargeSM}
      class="vads-u-margin-y--2"
      label="Do you have a VA memorandum rating of 20% or higher?"
      onVaValueChange={handleValueChange}
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          name="memorandum-rating"
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
  name: serviceMemberPathPageNames.yesHonorableDischargeSM,
  component: yesHonorableDischargeSM,
};
