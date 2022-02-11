import React from 'react';
import { connect } from 'react-redux';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

import recordEvent from 'platform/monitoring/record-event';

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

const ClaimType = ({ setPageState, state = {}, hlrV2 }) => {
  const setState = ({ value }) => {
    recordEvent({
      event: 'howToWizard-formChange',
      'form-field-type': 'form-radio-buttons',
      'form-field-label':
        'For what type of claim are you requesting a Higher-Level Review?',
      'form-field-value': value,
    });

    // Show 'other', or 'legacyChoice'(v1)/'legacyNo'(v2) page
    const hlrV2Page = hlrV2 ? 'legacyNo' : 'legacyChoice';
    const page = pageNames[value !== pageNames.other ? hlrV2Page : 'other'];
    setPageState({ selected: value }, page);

    if (value === pageNames.other) {
      window.sessionStorage.removeItem(SAVED_CLAIM_TYPE);
    } else {
      // Save claim type choice because we need it for submission
      window.sessionStorage.setItem(SAVED_CLAIM_TYPE, value);
    }
  };

  // aria-describedby fix for #34873
  const ariaDescribedby = [
    hlrV2 ? pageNames.legacyNo : pageNames.legacyChoice,
    pageNames.other,
  ];

  return (
    <RadioButtons
      name={name}
      label={label}
      id={name}
      options={options}
      onValueChange={setState}
      value={{ value: state.selected }}
      ariaDescribedby={ariaDescribedby}
    />
  );
};

const mapStateToProps = state => ({
  hlrV2: state.featureToggles.hlrV2,
});

export default {
  name: pageNames.start,
  component: connect(mapStateToProps)(ClaimType),
};
