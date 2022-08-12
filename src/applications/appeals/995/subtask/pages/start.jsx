import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import recordEvent from 'platform/monitoring/record-event';

import { BASE_URL } from '../../constants';
import pageNames from './pageNames';

const content = {
  groupLabel: 'For what type of claim are you requesting a Supplemental Claim?',
  errorMessage: 'Please choose a benefit type',
};

const options = [
  {
    value: 'compensation',
    label: 'Disability compensation claim',
  },
  {
    value: pageNames.other,
    label: 'Claim other than disability compensation',
  },
];

const optionValues = options.map(option => option.value);

const getNextPage = data =>
  data?.benefitType === optionValues[0]
    ? `${BASE_URL}/introduction` // valid benefit type, go to intro page
    : pageNames.other; // benefit type not supported

const validate = ({ benefitType } = {}) => optionValues.includes(benefitType);

/**
 * Benefit type page
 * @param {Object} data - subtask data
 * @param {Boolean} error - page submitted & error state
 * @param {Function} setPageData - updates subtask data
 * @returns {JSX}
 */
const BenefitType = ({ data = {}, error, setPageData }) => {
  const handlers = {
    setBenefitType: ({ target }) => {
      const { value } = target;
      setPageData({ benefitType: value || null });

      recordEvent({
        event: 'howToWizard-formChange',
        'form-field-type': 'form-radio-buttons',
        'form-field-label':
          'For what benefit type are you requesting a Supplemental Claim?',
        'form-field-value': value,
      });
    },
  };

  return (
    <>
      <h1 className="vads-u-margin-bottom--0">
        Is Supplemental Claim VA Form 20-0995 what I need?
      </h1>
      <p>
        Use this form if you disagree with our decision on your claim and have
        new and relevant evidence to submit.
      </p>
      <p>Answer a question to get started.</p>
      <VaRadio
        label={content.groupLabel}
        error={error ? content.errorMessage : null}
        onRadioOptionSelected={handlers.setBenefitType}
      >
        {options.map(({ value, label }) => (
          <VaRadioOption
            key={value}
            className="vads-u-margin-y--2"
            name="benefitType"
            id={value}
            value={value}
            label={label}
            checked={value === data.benefitType}
          />
        ))}
      </VaRadio>
    </>
  );
};

BenefitType.propTypes = {
  data: PropTypes.shape({}),
  error: PropTypes.bool,
  setPageData: PropTypes.func,
};

export default {
  name: pageNames.start,
  component: BenefitType,
  validate,
  back: null,
  next: getNextPage,
};
