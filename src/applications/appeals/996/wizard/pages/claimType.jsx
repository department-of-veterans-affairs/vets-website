import React from 'react';
import PropTypes from 'prop-types';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import recordEvent from 'platform/monitoring/record-event';

import { SAVED_CLAIM_TYPE } from '../../constants';
import pageNames from './pageNames';

const label =
  'For what type of claim are you requesting a Higher-Level Review?';

const options = [
  {
    value: 'compensation',
    label: 'Disability compensation claim',
    aria: pageNames.startHlr, // aria-describedby fix for #34873
  },
  {
    value: pageNames.other,
    label: 'A claim other than disability compensation',
    aria: pageNames.other,
  },
];

const ClaimType = ({ setPageState, state = {} }) => {
  const onValueChange = ({ detail } = {}) => {
    const { value } = detail;
    recordEvent({
      event: 'howToWizard-formChange',
      'form-field-type': 'form-radio-buttons',
      'form-field-label':
        'For what type of claim are you requesting a Higher-Level Review?',
      'form-field-value': value,
    });

    // Show 'other', or 'startHlr'(v2) page
    const page = pageNames[value !== pageNames.other ? 'startHlr' : 'other'];
    setPageState({ selected: value }, page);

    if (value === pageNames.other) {
      window.sessionStorage.removeItem(SAVED_CLAIM_TYPE);
    } else {
      // Save claim type choice because we need it for submission
      window.sessionStorage.setItem(SAVED_CLAIM_TYPE, value);
    }
  };

  return (
    <VaRadio
      class="vads-u-margin-y--2"
      label={label}
      onVaValueChange={onValueChange}
      uswds
    >
      {options.map(option => (
        <va-radio-option
          key={option.value}
          name="claim-type"
          label={option.label}
          value={option.value}
          checked={state.selected === option.value}
          aria-describedby={
            state.selected === option.value ? option.aria : null
          }
          uswds
        />
      ))}
    </VaRadio>
  );
};

ClaimType.propTypes = {
  setPageState: PropTypes.func,
  state: PropTypes.shape({}),
};

export default {
  name: pageNames.start,
  component: ClaimType,
};
