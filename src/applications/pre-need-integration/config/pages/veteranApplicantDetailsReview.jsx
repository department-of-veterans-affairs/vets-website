import React from 'react';
import VeteranApplicantDetailsCard from '../../components/VeteranApplicantDetailsCard';

const ReviewDescription = () => (
  <div>
    <h3>Review your information</h3>
    <p>
      We have your information on file. Please review it below and confirm it’s
      correct before continuing.
    </p>
    <VeteranApplicantDetailsCard showHeader={false} />
  </div>
);

export function uiSchema() {
  return {
    'ui:description': ReviewDescription,
  };
}

export const schema = {
  type: 'object',
  properties: {},
};
