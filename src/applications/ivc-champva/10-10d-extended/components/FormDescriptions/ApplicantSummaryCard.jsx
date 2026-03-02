import React from 'react';
import { format, isValid, parseISO } from 'date-fns';

const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

const formatDob = dob => {
  if (!dob) return '';
  const date = parseISO(dob);
  return isValid(date) ? format(date, 'MM/dd/yyyy') : '';
};

const ApplicantSummaryCard = item => {
  const {
    applicantDob,
    applicantPhone = '',
    applicantAddress: { street, city, state } = {},
    applicantRelationshipToSponsor: {
      relationshipToVeteran,
      otherRelationshipToVeteran,
    } = {},
  } = item ?? {};

  const relationship = capitalize(
    relationshipToVeteran === 'other'
      ? otherRelationshipToVeteran
      : relationshipToVeteran,
  );

  const address = [street, city && state ? `${city}, ${state}` : city || state]
    .filter(Boolean)
    .join(' ');

  return (
    <ul className="no-bullets">
      <li>
        <strong>Date of birth:</strong> {formatDob(applicantDob)}
      </li>
      <li>
        <strong>Address:</strong> {address}
      </li>
      <li>
        <strong>Phone number:</strong> {applicantPhone}
      </li>
      <li>
        <strong>Relationship to Veteran:</strong> {relationship}
      </li>
    </ul>
  );
};

export default ApplicantSummaryCard;
