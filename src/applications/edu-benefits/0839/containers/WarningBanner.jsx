import React from 'react';
import { useSelector } from 'react-redux';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import { createBannerMessage } from '../helpers';

export default function WarningBanner({ uiSchema }) {
  const formData = useSelector(state => state.form?.data || {});
  const options = uiSchema?.['ui:options'] || {};
  const { dataPath = 'institutionDetails', isArrayItem = false } = options;

  const index = isArrayItem ? getArrayIndexFromPathName() : null;

  const mainInstitution = formData?.institutionDetails;

  // Get institution details from appropriate path
  const details = isArrayItem
    ? formData?.[dataPath]?.[index] || {}
    : formData?.[dataPath] || {};

  const code = details?.facilityCode;

  const message = createBannerMessage(details, isArrayItem, mainInstitution);

  if (message && code?.length === 8) {
    return (
      <va-alert
        className="vads-u-margin-top--2"
        status="error"
        visible
        background-only
      >
        <p className="vads-u-margin--0">{message}</p>
      </va-alert>
    );
  }

  return null;
}
