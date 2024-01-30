import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import recordEvent from 'platform/monitoring/record-event';

import pageNames from './pageNames';

const dataKey = 'view:claimType';

const content = {
  label: 'New claim or disagreeing?',
  errorMessage: 'Please select a type of claim',
};

const options = [
  {
    value: pageNames.fileClaim,
    label:
      'I’m filing a claim for a new condition or for a condition that’s gotten worse.',
  },
  {
    value: pageNames.disagreeFileClaim,
    label: 'I’m disagreeing with a VA decision on my claim.',
  },
];

const optionValues = options.map(option => option.value);

const validate = data => optionValues.includes(data[dataKey]);

const getNextPage = data => (validate(data) ? data[dataKey] : '');

/**
 * Appeals page
 * @param {Object} data - subtask data
 * @param {Boolean} error - page submitted & error state
 * @param {Function} setPageData - updates subtask data
 * @returns {JSX}
 */
const AppealsPage = ({ data = {}, error, setPageData }) => {
  const handlers = {
    setAppealChoice: ({ target }) => {
      const { value } = target;
      setPageData({ [dataKey]: value || null });

      recordEvent({
        event: 'howToWizard-formChange',
        'form-field-type': 'form-radio-buttons',
        'form-field-label': content.label,
        'form-field-value':
          value === pageNames.fileClaim ? 'new-worse' : 'disagreeing',
      });
    },
  };

  return (
    <>
      <h1 className="vads-u-margin-bottom--0">
        Are you filing a new claim or are you disagreeing with a VA decision on
        an earlier claim?
      </h1>
      <VaRadio
        label={content.label}
        error={error ? content.errorMessage : null}
        onRadioOptionSelected={handlers.setAppealChoice}
      >
        {options.map(({ value, label }) => (
          <VaRadioOption
            key={value}
            className="vads-u-margin-y--2"
            name="appealChoice"
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

AppealsPage.propTypes = {
  data: PropTypes.shape({}),
  error: PropTypes.bool,
  setPageData: PropTypes.func,
};

export default {
  name: pageNames.appeals,
  component: AppealsPage,
  validate,
  back: pageNames.start,
  next: getNextPage,
};
