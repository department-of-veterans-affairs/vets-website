import React from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { serviceMemberPathPageNames } from '../pageList';
import { handleChangeAndPageSet } from '../helpers';

const options = [
  { value: serviceMemberPathPageNames.yesIDES, label: 'Yes' },
  { value: serviceMemberPathPageNames.noIDES, label: 'No' },
];

const noVaMemorandum = ({ setPageState, state = {} }) => {
  const handleValueChange = ({ detail } = {}) => {
    const { value } = detail;
    handleChangeAndPageSet(
      setPageState,
      value,
      options,
      'Are you in the Integrated Disability Evaluation System (IDES) or going through Physical Evaluation Board process?',
    );
  };
  return (
    <VaRadio
      id={serviceMemberPathPageNames.noVaMemorandum}
      class="vads-u-margin-y--2"
      label="Are you in the Integrated Disability Evaluation System (IDES), or going through the Physical Evaluation Board process?"
      onVaValueChange={handleValueChange}
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          name="ides-or-peb"
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
  name: serviceMemberPathPageNames.noVaMemorandum,
  component: noVaMemorandum,
};
