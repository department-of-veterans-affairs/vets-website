import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import { BASE_URL, FORM_ID } from '../../constants';
import { title995 } from '../../content/title';
import {
  getNextPage,
  options,
  PAGE_NAMES,
  recordBenefitTypeEvent,
  validateBenefitType,
} from '../../../shared/utils/start-page';

export const content = {
  groupLabel: 'What type of claim are you filing a Supplemental Claim for?',
  errorMessage: 'You must choose a claim type.',
};

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
    },
  };

  return (
    <>
      <h1 className="vads-u-margin-bottom--0">{title995}</h1>
      <div className="schemaform-subtitle vads-u-font-size--lg">{FORM_ID}</div>
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
          <va-link disable-analytics href="/pact" text="PACT Act" />
          ).
        </li>
      </ul>
      <va-additional-info trigger="What are other decision review options?">
        <p className="vads-u-padding-bottom--1">
          If you don’t think this is the right form for you, find out about
          other decision review options.
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
  name: PAGE_NAMES.start,
  component: BenefitType,
  validate: ({ benefitType } = {}) => validateBenefitType(benefitType),
  back: null,
  next: data => getNextPage(BASE_URL, data),
  onContinue: ({ benefitType }) =>
    recordBenefitTypeEvent(benefitType, content.groupLabel),
};
