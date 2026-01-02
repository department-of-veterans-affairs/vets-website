import React from 'react';
import { useSelector } from 'react-redux';
import { useValidateFacilityCode } from '../hooks/useValidateFacilityCode';
import { getAtPath } from '../helpers';
import { INSTITUTION_TYPES } from '../constants';
import FacilityCodeAdditionalInfo from './FacilityCodeAdditionalInfo';

const EmptyCard = (
  <>
    <p>Institution name and mailing address</p>
    <h3>--</h3>
    <p>--</p>
  </>
);

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
    return EmptyCard;
  }

  const {
    street,
    street2,
    street3,
    city,
    state,
    postalCode,
  } = institutionDetails.mailingAddress;

  return (
    <div>
      <p>Institution name and mailing address</p>
      <h3>{institutionDetails.name}</h3>
      <p className="vads-u-margin-bottom--0">{street}</p>
      {street2 && <p className="vads-u-margin-y--0">{street2}</p>}
      {street3 && <p className="vads-u-margin-y--0">{street3}</p>}
      <p className="vads-u-margin-top--0">
        {city}, {state} {postalCode}
      </p>
      <FacilityCodeAdditionalInfo />
      <p>
        <strong>The institution is classified as:</strong>
      </p>
      <p>{INSTITUTION_TYPES[institutionDetails.type] || 'Other'}</p>
    </div>
  );
}
