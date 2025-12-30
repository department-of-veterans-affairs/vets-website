import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui/focus';

import {
  FIELD_NAMES,
  FIELD_TITLES,
} from '@@vap-svc/constants/schedulingPreferencesConstants';
import { schedulingPreferenceOptions } from 'platform/user/profile/vap-svc/util/health-care-settings/schedulingPreferencesUtils';

const dataKey = FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD;

const content = {
  title: 'How should we contact you to schedule your health care appointments?',
  description:
    'This helps us know the best way to contact you when we need to schedule, reschedule, or cancel your health care appointments.',
  errorMessage: 'Please select a contact method',
};

const optionsMap = schedulingPreferenceOptions(dataKey);
// console.log(optionsMap);
const options = Object.entries(optionsMap).map(([value, label]) => ({
  value: String(value),
  label,
}));
// console.log(options);
const optionValues = options.map(option => option.value);

const validate = data => optionValues.includes(data?.[dataKey]);

/**
 * Contact method selection page
 * @param {Object} data - subtask data
 * @param {Boolean} error - page submitted & error state
 * @param {Function} setPageData - updates subtask data
 * @returns {JSX}
 */
const Start = ({ data = {}, error, setPageData }) => {
  useEffect(() => {
    focusElement('h1');
  }, []);

  const handlers = {
    setContactMethod: event => {
      const { value } = event.detail;
      setPageData({ [dataKey]: value || null });
    },
  };

  return (
    <>
      <VaSelect
        label={FIELD_TITLES[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]}
        name={FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD}
        value={data[dataKey] || ''}
        error={error ? content.errorMessage : null}
        onVaSelect={handlers.setContactMethod}
        required
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </VaSelect>
    </>
  );
};

Start.propTypes = {
  setPageData: PropTypes.func.isRequired,
  data: PropTypes.object,
  error: PropTypes.bool,
};

export default Start;
export { validate, dataKey };
