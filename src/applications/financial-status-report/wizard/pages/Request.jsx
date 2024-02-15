import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { PAGE_NAMES } from '../constants';

const label = 'What do you want to do for this debt?';
const options = [
  {
    value: PAGE_NAMES.payment,
    label: 'Make a payment on a debt',
  },
  {
    value: PAGE_NAMES.decision,
    label: 'Report an error or a disagreement with a VA decision',
  },
  {
    value: PAGE_NAMES.recipients,
    label: 'Request debt relief (a waiver or compromise offer)',
  },
  {
    value: PAGE_NAMES.repayment,
    label: 'Request an extended monthly payment plan',
  },
  {
    value: PAGE_NAMES.reconsider,
    label: 'Ask VA to reconsider the decision on my waiver request',
  },
];

const Request = ({ setPageState, state = {} }) => {
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
      className="vads-u-margin-y--2 "
      label={label}
      onVaValueChange={handleOptionChange}
      uswds
    >
      {options.map((option, index) => (
        <VaRadioOption
          key={`${option.value}-${index}`}
          id={`reconsider-option-${index}`}
          name="reconsider-option"
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

Request.propTypes = {
  setPageState: PropTypes.func,
  state: PropTypes.object,
};

export default {
  name: PAGE_NAMES.request,
  component: Request,
};
