import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui/focus';

import {
  FIELD_TITLES,
  FIELD_OPTION_IDS,
} from '@@vap-svc/constants/schedulingPreferencesConstants';
import { FIELD_NAMES } from 'platform/user/exportsFile';
import { useSelector } from 'react-redux';

/**
 * Contact method selection page
 * @param {Boolean} error - page submitted & error state
 * @param {Array} options - available contact method options
 * @param {Function} setPageData - updates subtask data
 * @returns {JSX}
 */
const ContactMethodSelect = ({ error, options, setPageData }) => {
  const fieldName = FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD;

  const isLoading = useSelector(
    state => state.vaProfile.schedulingPreferences.loading,
  );
  const data = useSelector(
    state => state.vaProfile.schedulingPreferences[fieldName] || '',
  );
  useEffect(() => {
    focusElement('h1');
  }, []);

  const updatePageData = useCallback(
    value => {
      if (
        value ===
          FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
            .NO_PREFERENCE ||
        value ===
          FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
            .SECURE_MESSAGE
      ) {
        setPageData({
          quickExit: true,
          data: { [fieldName]: value },
        });
      } else {
        setPageData({
          quickExit: false,
          data: { [fieldName]: value || null },
        });
      }
    },
    [setPageData, fieldName],
  );

  useEffect(
    () => {
      if (data) {
        updatePageData(data);
      }
    },
    [data, updatePageData],
  );

  const content = {
    errorMessage: 'Please select a contact method',
  };

  const handlers = {
    setContactMethod: event => {
      const { value } = event.detail;
      updatePageData(value);
    },
  };

  if (isLoading) {
    return <va-loading-indicator message="Loading contact methods..." />;
  }

  return (
    <>
      <VaSelect
        label={FIELD_TITLES[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]}
        name={FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD}
        defaultValue={data || ''}
        value={data || ''}
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
  data: PropTypes.string,
  error: PropTypes.bool,
};

export { ContactMethodSelect };
