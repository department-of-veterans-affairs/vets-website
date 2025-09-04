import React from 'react';
import VeteranApplicantDetailsCard from '../../components/VeteranApplicantDetailsCard';

const ReviewDescription = () => (
  <div>
    <h3>Review applicant information</h3>
    <p>
      We have the applicant’s information on file. Please review it below and
      confirm it’s correct before continuing.
    </p>
    <VeteranApplicantDetailsCard showHeader={false} />
  </div>
);

export function uiSchema() {
  return {
    'ui:description': ReviewDescription,
    'view:veteranApplicantDetailsReviewPreparer': {
      'ui:title': ' ',
      'ui:widget': 'hidden',
    },
  };
}

export const schema = {
  type: 'object',
  properties: {
    'view:veteranApplicantDetailsReviewPreparer': {
      type: 'boolean',
      default: true,
    },
  },
};
