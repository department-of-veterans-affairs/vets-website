import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { serviceMemberPathPageNames } from '../pageList';
import { handleChangeAndPageSet } from '../helpers';

const options = [
  { value: serviceMemberPathPageNames.yesHonorableDischargeSM, label: 'Yes' },
  { value: serviceMemberPathPageNames.noHonorableDischargeSM, label: 'No' },
];

const isServiceMember = ({ setPageState, state = {} }) => {
  const handleValueChange = ({ detail } = {}) => {
    const { value } = detail;
    handleChangeAndPageSet(
      setPageState,
      value,
      options,
      'Do you expect to receive an honorable discharge?',
    );
  };
  return (
    <VaRadio
      id={serviceMemberPathPageNames.isServiceMember}
      class="vads-u-margin-y--2"
      label="Do you expect to receive an honorable discharge?"
      onVaValueChange={handleValueChange}
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          name="honorable-discharge"
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
  name: serviceMemberPathPageNames.isServiceMember,
  component: isServiceMember,
};
