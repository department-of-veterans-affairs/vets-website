import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';

import { BASE_URL } from '../../constants';
import pageNames from './pageNames';

const content = {
  groupLabel: 'What type of claim are you filing a Supplemental Claim for?',
  errorMessage: 'You must choose a claim type.',
};

const options = [
  {
    value: 'compensation',
    label: 'Disability compensation claim',
  },
  {
    value: pageNames.other,
    label: 'Another type of claim (not a disability claim)',
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
        'form-field-label':
          'For what benefit type are you requesting a Supplemental Claim?',
        'form-field-value': value,
      });
    },
  };

  return (
    <>
      <h1 className="vads-u-margin-bottom--0">File a Supplemental Claim</h1>
      <div className="schemaform-subtitle vads-u-font-size--lg">
        VA Form 20-0995
      </div>
      <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--0">
        Is this the form I need?
      </h2>
      <p>
        Use this Supplemental Claim form (VA 20-0995) if you disagree with our
        decision on your claim and you meet at least 1 of these requirements:
      </p>
      <ul>
        <li>
          You have new and relevant evidence to submit, <strong>or</strong>
        </li>
        <li>
          You would like VA to review your claim based on a new law (such as the{' '}
          <a href="/pact">PACT Act</a>
          ).
        </li>
      </ul>
      <va-additional-info
        trigger="What are other decision review options?"
        uswds
      >
        <p className="vads-u-padding-bottom--1">
          If you don’t think this is the right form for you, find out about
          other decision review options.
        </p>
        <a href="/resources/choosing-a-decision-review-option/">
          Learn about choosing a decision review option
        </a>
      </va-additional-info>

      <VaRadio
        label={content.groupLabel}
        error={error ? content.errorMessage : null}
        onVaValueChange={handlers.setBenefitType}
        required
        label-header-level="2"
        uswds
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
            uswds
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
