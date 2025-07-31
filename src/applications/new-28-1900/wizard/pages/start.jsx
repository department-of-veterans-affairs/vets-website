import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  startingPageName,
  veteranPathPageNames,
  serviceMemberPathPageNames,
  otherPathPageNames,
} from './pageList';
import { handleChangeAndPageSet } from './helpers';

const options = [
  { value: veteranPathPageNames.isVeteran, label: 'Veteran' },
  {
    value: serviceMemberPathPageNames.isServiceMember,
    label: 'Current service member',
  },
  { value: otherPathPageNames.isOther, label: 'Neither of these' },
];

const StartPage = ({ setPageState, state = {} }) => {
  const handleValueChange = ({ detail } = {}) => {
    const { value } = detail;
    handleChangeAndPageSet(
      setPageState,
      value,
      options,
      'Which of these describes you?',
    );
  };
  return (
    <VaRadio
      class="vads-u-margin-y--2"
      label="Which of these describes you?"
      onVaValueChange={handleValueChange}
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          name="describes-you"
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
  name: startingPageName.start,
  component: StartPage,
};
