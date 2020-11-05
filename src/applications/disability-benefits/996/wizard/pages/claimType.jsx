import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { SAVED_CLAIM_TYPE } from '../../constants';
import pageNames from './pageNames';

const label =
  'For what type of claim are you requesting a Higher-Level Review?';

const options = [
  {
    value: 'compensation',
    label: 'Disability compensation claim',
  },
  {
    value: pageNames.other,
    label: 'A claim other than disability compensation',
  },
];

const name = 'higher-level-review-option';

const ClaimType = ({ setPageState, state = {} }) => {
  const setState = ({ value }) => {
    // Show 'other' or 'legacyChoice' page
    const page =
      pageNames[value !== pageNames.other ? 'legacyChoice' : 'other'];
    setPageState({ selected: value }, page);

    if (value === pageNames.other) {
      window.sessionStorage.removeItem(SAVED_CLAIM_TYPE);
    } else {
      // Save claim type choice because we need it for submission
      window.sessionStorage.setItem(SAVED_CLAIM_TYPE, value);
    }
  };

  return (
    <ErrorableRadioButtons
      name={name}
      label={label}
      id={name}
      options={options}
      onValueChange={setState}
      value={{ value: state.selected }}
    />
  );
};

export default {
  name: pageNames.claimType,
  component: ClaimType,
};
