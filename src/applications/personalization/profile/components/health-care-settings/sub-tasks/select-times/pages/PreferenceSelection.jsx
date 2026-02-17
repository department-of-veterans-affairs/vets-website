import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui/focus';

import {
  FIELD_NAMES,
  FIELD_TITLES,
  FIELD_OPTION_IDS,
  errorMessages,
} from '@@vap-svc/constants/schedulingPreferencesConstants';
import { useSelector } from 'react-redux';

/**
 * Contact method selection page
 * @param {Boolean} error - page submitted & error state
 * @param {Function} setPageData - updates subtask data
 * @param {Object} pageData - current subtask page data
 * @param {String} noPreferenceValue - value for no preference option
 * @returns {JSX}
 */
const PreferenceSelection = ({
  error,
  setPageData,
  pageData,
  noPreferenceValue,
  data,
  fieldName,
}) => {
  const isLoading = useSelector(
    state => state.vaProfile.schedulingPreferences.loading,
  );

  const [fieldData, setFieldData] = useState('');

  useEffect(() => {
    focusElement('h1');
  }, []);

  const updatePageData = useCallback(
    value => {
      if (value === FIELD_OPTION_IDS[fieldName].NO_PREFERENCE) {
        setPageData({
          quickExit: true,
          data: { [fieldName]: [value] },
        });
      } else {
        setPageData({
          quickExit: false,
          data: { [fieldName]: [value] || [] },
        });
      }
    },
    [setPageData, fieldName],
  );

  useEffect(() => {
    // Prefer explicit edits in pageData when the field is present there.
    // Otherwise fall back to redux `data` prop passed from the container.
    const hasPageValue =
      pageData &&
      pageData.data &&
      Object.prototype.hasOwnProperty.call(pageData.data, fieldName);
    const source = hasPageValue ? pageData.data : data || {};
    const values = (source && source[fieldName]) || source || [];

    // Normalize values to an array
    const vals = Array.isArray(values) ? values : [values];

    // No value -> none selected
    if (!vals || vals.length === 0) {
      setFieldData('');
      return;
    }

    // Single value equals noPreferenceValue -> select noPreference
    if (vals.length === 1 && vals[0] === noPreferenceValue) {
      setFieldData(noPreferenceValue);
      return;
    }

    // Any values (one or more) that don't include noPreferenceValue -> select continue
    if (vals.length >= 1 && !vals.includes(noPreferenceValue)) {
      setFieldData('continue');
      return;
    }

    // Fallback
    setFieldData(vals[0] || '');
  }, [pageData, fieldName, noPreferenceValue, data]);

  const content = {
    errorMessage: errorMessages.noPreferenceSelected,
  };

  const handlers = {
    setTimePreference: event => {
      const { value } = event.detail;
      // update local selected state for immediate UI feedback
      setFieldData(value);
      // inform parent about updated selection
      updatePageData(value);
    },
  };

  if (isLoading) {
    return <va-loading-indicator message="Loading options..." />;
  }

  return (
    <>
      <VaRadio
        label={FIELD_TITLES[fieldName]}
        name={fieldName}
        value={fieldData}
        error={error ? content.errorMessage : null}
        onVaValueChange={handlers.setTimePreference}
        required
      >
        <VaRadioOption
          checked={fieldData === noPreferenceValue}
          key={noPreferenceValue}
          name={fieldName}
          value={noPreferenceValue}
          label="No preference"
        />
        <VaRadioOption
          checked={fieldData === 'continue'}
          key="continue"
          name={fieldName}
          value="continue"
          label={`Select days and times to be ${
            fieldName === FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES
              ? 'contacted'
              : 'scheduled'
          }`}
        />
      </VaRadio>
    </>
  );
};

PreferenceSelection.propTypes = {
  fieldName: PropTypes.string.isRequired,
  noPreferenceValue: PropTypes.string.isRequired,
  pageData: PropTypes.object.isRequired,
  setPageData: PropTypes.func.isRequired,
  data: PropTypes.array,
  error: PropTypes.bool,
};

export default PreferenceSelection;
