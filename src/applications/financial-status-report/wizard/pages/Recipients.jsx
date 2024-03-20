import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { PAGE_NAMES } from '../constants';

const label = 'Which of these best describes the person who has this debt?';
const options = [
  {
    value: 'active-duty',
    label: 'Active-duty service member',
  },
  {
    value: 'veteran',
    label: 'Veteran',
  },
  {
    value: 'national-guard',
    label: 'Member of the National Guard or Reserve',
  },
  {
    value: 'spouse',
    label: 'Spouse',
  },
  {
    value: 'dependent',
    label: 'Dependent',
  },
];

const pages = {
  'active-duty': PAGE_NAMES.submit,
  spouse: PAGE_NAMES.dependents,
  dependent: PAGE_NAMES.dependents,
  veteran: PAGE_NAMES.submit,
  'national-guard': PAGE_NAMES.submit,
};

const Recipients = ({ setPageState, state = {} }) => {
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
          id={`recipients-option-${index}`}
          name="recipients-option"
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

Recipients.propTypes = {
  setPageState: PropTypes.func,
  state: PropTypes.object,
};

export default {
  name: PAGE_NAMES.recipients,
  component: Recipients,
};
