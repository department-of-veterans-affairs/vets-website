import React from 'react';
import { useSelector } from 'react-redux';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';

export default function AdditionalInstitutionWarningBanner() {
  const formData = useSelector(state => state.form?.data || {});

  const index = getArrayIndexFromPathName();

  const currentItem = formData?.additionalInstitutionDetails?.[index] || {};
  const notIHL = currentItem.ihlEligible === false;

  let message = '';

  if (notIHL) {
    message =
      'This institution is unable to participate in the Yellow Ribbon Program.';
  }

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
