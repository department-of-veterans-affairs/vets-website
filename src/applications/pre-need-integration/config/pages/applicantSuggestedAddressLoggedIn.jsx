import React from 'react';
import { setReturnState } from 'platform/forms-system/src/js/utilities/data/profile';
import ApplicantSuggestedAddress from './applicantSuggestedAddress';

const ApplicantSuggestedAddressLoggedIn = ({
  goToPath,
  contentAfterButtons,
  data,
  onReviewPage,
  NavButtons,
  contentBeforeButtons,
}) => {
  const handleContinue = () => {
    // Set success state and navigate back to the mailing address card
    setReturnState('address', 'updated');
    goToPath('applicant-mailing-address-logged-in', { force: true });
  };

  const handleBack = () => {
    goToPath('applicant-mailing-address-logged-in/edit-address', {
      force: true,
    });
  };

  if (onReviewPage) {
    return null; // This page shouldn't appear in review mode
  }

  return (
    <div>
      <ApplicantSuggestedAddress formData={data} />
      {contentBeforeButtons}
      <NavButtons
        goBack={handleBack}
        goForward={handleContinue}
        submitToContinue
      />
      {contentAfterButtons}
    </div>
  );
};

export default ApplicantSuggestedAddressLoggedIn;
