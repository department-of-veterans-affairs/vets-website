import React from 'react';
import { useSelector } from 'react-redux';
import { useValidateFacilityCode } from '../hooks/useValidateFacilityCode';
import { getAtPath } from '../helpers';
import { EmptyCard, DetailsCard } from './InstitutionCards';

export default function InstitutionSelector({ dataPath }) {
  const formData = useSelector(state => state.form.data);
  const { loading, hasError } = useValidateFacilityCode(formData, dataPath);
  const institutionDetails = getAtPath(formData, dataPath);
  const isPresent = [
    institutionDetails.name,
    institutionDetails.type,
    institutionDetails.mailingAddress,
  ].every(Boolean);

  if (loading) {
    return (
      <va-loading-indicator set-focus message="Finding your institution" />
    );
  }

  if (hasError || !isPresent) {
    return (
      <div>
        <p>Institution name and mailing address</p>
        <EmptyCard />
      </div>
    );
  }

  return (
    <div>
      <p>Institution name and mailing address</p>
      <DetailsCard details={institutionDetails} />
    </div>
  );
}
