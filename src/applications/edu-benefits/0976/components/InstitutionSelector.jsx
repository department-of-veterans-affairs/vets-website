import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { useValidateFacilityCode } from '../hooks/useValidateFacilityCode';
import { getAtPath } from '../helpers';
import { EmptyCard, DetailsCard } from './InstitutionCards';

export default function InstitutionSelector({ dataPath }) {
  const formData = useSelector(state => state.form.data);
  const { loading, hasError } = useValidateFacilityCode(formData, dataPath);
  const institutionDetails = getAtPath(formData, dataPath);
  const isPresent = [
    institutionDetails?.name,
    institutionDetails?.type,
    institutionDetails?.mailingAddress,
  ].every(Boolean);

  useEffect(() => {
    // Re-focus
    const facilityCodeInput = document
      .querySelector('va-text-input')
      ?.shadowRoot?.querySelector('input');
    if (!loading) focusElement(facilityCodeInput);
  }, [loading]);

  let content;
  if (loading) {
    content = (
      <va-loading-indicator set-focus message="Finding your institution" />
    );
  } else if (hasError || !isPresent) {
    content = (
      <div>
        <p>Institution name and mailing address</p>
        <EmptyCard />
      </div>
    );
  } else {
    content = (
      <div>
        <p>Institution name and mailing address</p>
        <DetailsCard details={institutionDetails} />
      </div>
    );
  }

  return <div aria-live="polite">{content}</div>;
}
