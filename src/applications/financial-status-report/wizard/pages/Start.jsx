import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { PAGE_NAMES } from '../constants';

const label = 'What’s this debt related to?';
const options = [
  {
    label:
      'VA disability compensation, education, or pension benefit overpayments',
    value: 'request',
  },
  {
    label: 'VA health care copay bills',
    value: 'copays',
  },
  {
    label: 'Separation pay',
    value: 'separation',
  },
  {
    label: 'Attorney fees',
    value: 'attorney',
  },
  {
    label: 'Rogers STEM program',
    value: 'stem',
  },
  {
    label: 'VET TEC program',
    value: 'vettec',
  },
];

const pages = {
  copays: PAGE_NAMES.copays,
  separation: PAGE_NAMES.benefits,
  attorney: PAGE_NAMES.benefits,
  stem: PAGE_NAMES.stem,
  vettec: PAGE_NAMES.vettec,
  request: PAGE_NAMES.request,
};

const Start = ({ setPageState, state = {} }) => {
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
          key={option.value + index}
          id={`start-option-${index}`}
          name="start-option"
          label={option.label}
          value={option.value}
          checked={state.selected === option.value}
          aria-describedby={
            state.selected === option.value ? option.value : null
          }
          className="no-wrap vads-u-margin-y--3 vads-u-margin-left--2"
          uswds
        />
      ))}
    </VaRadio>
  );
};

Start.propTypes = {
  setPageState: PropTypes.func,
  state: PropTypes.object,
};

export default {
  name: PAGE_NAMES.start,
  component: Start,
};
