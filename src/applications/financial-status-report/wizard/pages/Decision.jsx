import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { PAGE_NAMES } from '../constants';

const pages = {
  error: PAGE_NAMES.error,
  wrong: PAGE_NAMES.error,
  disagree: PAGE_NAMES.disagree,
};

const label = 'Which of these issues do you want to report?';
const options = [
  {
    value: 'disagree',
    label: 'I disagree with the VA decision that resulted in this debt.',
  },
  {
    value: 'error',
    label: 'I think this debt is due to an error.',
  },
  {
    value: 'wrong',
    label: 'I think the amount of this debt is wrong.',
  },
];

const Decision = ({ setPageState, state = {} }) => {
  const handleOptionChange = ({ detail } = {}) => {
    const { value } = detail;
    recordEvent({
      event: 'howToWizard-formChange',
      'form-field-type': 'form-radio-buttons',
      'form-field-label': label,
      'form-field-value': value,
    });
    setPageState({ selected: value }, pages[value]);
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
          className="no-wrap vads-u-margin-y--3 vads-u-margin-left--2 "
          uswds
        />
      ))}
    </VaRadio>
  );
};

Decision.propTypes = {
  setPageState: PropTypes.func,
  state: PropTypes.object,
};

export default {
  name: PAGE_NAMES.decision,
  component: Decision,
};
