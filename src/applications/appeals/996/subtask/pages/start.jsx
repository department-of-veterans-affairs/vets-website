import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { focusElement } from '~/platform/utilities/ui';
import recordEvent from '~/platform/monitoring/record-event';

import { BASE_URL } from '../../constants';
import { PageTitle } from '../../content/title';

import pageNames from './pageNames';

const content = {
  groupLabel:
    'What type of claim are you requesting a Higher-Level Review for?',
  errorMessage: 'You must choose a claim type.',
};

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
  useEffect(() => {
    setTimeout(() => {
      focusElement('#main h2');
    });
  }, []);
  const handlers = {
    setBenefitType: event => {
      const { value } = event.detail;
      setPageData({ benefitType: value || null });

      recordEvent({
        event: 'howToWizard-formChange',
        'form-field-type': 'form-radio-buttons',
        'form-field-label': content.groupLabel,
        'form-field-value': value,
      });
    },
  };

  return (
    <>
      <PageTitle />
      <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--0">
        Is this the form I need?
      </h2>
      <p>
        Use this form if you disagree with VA’s decision on your initial or
        supplemental claim, and want to request a new review of your case by a
        higher-level reviewer. You can’t submit any new evidence with a
        Higher-Level Review.
      </p>
      <va-additional-info trigger="What are other decision review options?">
        <p className="vads-u-padding-bottom--1">
          If you don’t think this is the right form for you, there other
          decision review options.
        </p>
        <va-link
          disable-analytics
          href="/resources/choosing-a-decision-review-option/"
          text="Learn about choosing a decision review option"
        />
      </va-additional-info>

      <VaRadio
        label={content.groupLabel}
        error={error ? content.errorMessage : null}
        onVaValueChange={handlers.setBenefitType}
        required
        label-header-level="2"
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
