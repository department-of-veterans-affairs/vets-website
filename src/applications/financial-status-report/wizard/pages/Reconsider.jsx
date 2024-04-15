import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { PAGE_NAMES } from '../constants';

const label = 'How do you want us to reconsider the decision?';
const options = [
  {
    value: PAGE_NAMES.waivers,
    label:
      'I want to ask the Committee of Waivers and Compromises to reconsider my waiver.',
  },
  {
    value: PAGE_NAMES.appeals,
    label: "I want appeal the decision with the Board of Veterans' Appeals.",
  },
];

const Reconsider = ({ setPageState, state = {} }) => {
  const handleOptionChange = ({ detail } = {}) => {
    const { value } = detail;
    recordEvent({
      event: 'howToWizard-formChange',
      'form-field-type': 'form-radio-buttons',
      'form-field-label': label,
      'form-field-value': value,
    });
    setPageState({ selected: value }, value);
  };

  return (
    <VaRadio
      className="vads-u-margin-y--2"
      label={label}
      onVaValueChange={handleOptionChange}
      uswds
    >
      {options.map((option, index) => (
        <VaRadioOption
          key={`${option.value}-${index}`}
          id={`decision-option-${index}`}
          name="decision-option"
          label={option.label}
          value={option.value}
          checked={state.selected === option.value}
          ariaDescribedby={
            state.selected === option.value ? option.value : null
          }
          className="no-wrap  vads-u-margin-y--3 vads-u-margin-left--2 "
          uswds
        />
      ))}
    </VaRadio>
  );
};

Reconsider.propTypes = {
  setPageState: PropTypes.func,
  state: PropTypes.object,
};
export default {
  name: PAGE_NAMES.reconsider,
  component: Reconsider,
};
