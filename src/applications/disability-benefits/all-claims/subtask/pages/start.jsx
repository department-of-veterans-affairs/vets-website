import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// import recordEvent from 'platform/monitoring/record-event';

import pageNames from './pageNames';

const dataKey = 'view:isActiveDuty';

const content = {
  label: 'Are you on active duty right now?',
  errorMessage: 'Please choose a selection',
};

// values should be strings
const options = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

const optionValues = options.map(option => option.value);

const getNextPage = data =>
  data[dataKey] === optionValues[0] ? pageNames.rad : pageNames.appeals;

const validate = data => optionValues.includes(data[dataKey]);

/**
 * Active duty page
 * @param {Object} data - subtask data
 * @param {Boolean} error - page submitted & error state
 * @param {Function} setPageData - updates subtask data
 * @returns {JSX}
 */
const ActiveDuty = ({ data = {}, error, setPageData }) => {
  const handlers = {
    setActiveDutyChoice: ({ target }) => {
      const { value } = target;
      setPageData({ [dataKey]: value || null });

      /* Discuss with Analytics
      recordEvent({
        event: 'howToWizard-formChange',
        'form-field-type': 'form-radio-buttons',
        'form-field-label': label,
        'form-field-value': value === pageNames.rad ? 'yes-bdd' : 'no-appeals',
      });
      */
    },
  };

  return (
    <>
      <h1>Is VA Form 21-526EZ the form I need?</h1>
      <p>
        Use this form to file for disability benefits for an illness or injury
        that was caused by&mdash;or got worse because of&mdash;your active
        military service. If you’re still on active duty, you can file for
        disability benefits under the Benefits Delivery at Discharge program.
        This program allows you to file for benefits 180 to 90 days before you
        leave the military.
      </p>
      <p>
        Not sure you’re eligible for VA disability benefits?{' '}
        <a href="/disability/eligibility/">
          Find out if you’re eligible for disability compensation
        </a>
      </p>
      <p>Answer a few questions to get started.</p>
      <VaRadio
        label={content.label}
        error={error ? content.errorMessage : null}
        onRadioOptionSelected={handlers.setActiveDutyChoice}
      >
        {options.map(({ value, label }) => (
          <VaRadioOption
            key={value}
            className="vads-u-margin-y--2"
            name="activeDuty"
            id={value}
            value={value}
            label={label}
            checked={value === data[dataKey]}
            uswds={false}
          />
        ))}
      </VaRadio>
    </>
  );
};

ActiveDuty.propTypes = {
  data: PropTypes.shape({}),
  error: PropTypes.bool,
  setPageData: PropTypes.func,
};

export default {
  name: pageNames.start,
  component: ActiveDuty,
  validate,
  back: null,
  next: getNextPage,
};
