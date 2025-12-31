import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui/focus';

import {
  FIELD_TITLES,
  FIELD_OPTION_IDS,
} from '@@vap-svc/constants/schedulingPreferencesConstants';
import { FIELD_NAMES } from 'platform/user/exportsFile';

/**
 * Contact method selection page
 * @param {Object} data - subtask data
 * @param {Boolean} error - page submitted & error state
 * @param {Function} setPageData - updates subtask data
 * @returns {JSX}
 */
const ContactMethodSelect = ({ data = {}, error, options, setPageData }) => {
  useEffect(() => {
    focusElement('h1');
  }, []);

  const fieldName = FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD;

  const content = {
    title:
      'How should we contact you to schedule your health care appointments?',
    description:
      'This helps us know the best way to contact you when we need to schedule, reschedule, or cancel your health care appointments.',
    errorMessage: 'Please select a contact method',
  };

  const handlers = {
    setContactMethod: event => {
      const { value } = event.detail;
      if (
        value ===
          FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
            .NO_PREFERENCE ||
        value ===
          FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
            .SECURE_MESSAGE
      ) {
        setPageData({ quickExit: true, data: { [fieldName]: value } });
      } else {
        setPageData({ quickExit: false, data: { [fieldName]: value || null } });
      }
    },
  };

  return (
    <>
      <VaSelect
        label={FIELD_TITLES[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]}
        name={FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD}
        value={data[fieldName] || ''}
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

ContactMethodSelect.propTypes = {
  options: PropTypes.array.isRequired,
  setPageData: PropTypes.func.isRequired,
  data: PropTypes.object,
  error: PropTypes.bool,
};

export { ContactMethodSelect };
