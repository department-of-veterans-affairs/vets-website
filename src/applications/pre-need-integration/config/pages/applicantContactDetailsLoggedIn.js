import React from 'react';
import ApplicantContactInfoCard from '../../components/ApplicantContactInfoCard';

const ApplicantContactDetailsLoggedIn = ({
  data,
  onReviewPage,
  goToPath,
  goBack,
  goForward,
  NavButtons,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const handleEdit = field => {
    if (field === 'phone') {
      goToPath('applicant-contact-details-logged-in/edit-phone', {
        force: true,
      });
    } else if (field === 'email') {
      goToPath('applicant-contact-details-logged-in/edit-email', {
        force: true,
      });
    }
  };

  if (onReviewPage) {
    const { email, phoneNumber } = data?.application?.claimant || {};
    const formatPhone = phone => {
      if (!phone) return 'Not provided';
      // Phone is now a string, just return it as is
      return phone;
    };

    return (
      <div>
        <div className="review-row">
          <dt>Phone number</dt>
          <dd>{formatPhone(phoneNumber)}</dd>
        </div>
        <div className="review-row">
          <dt>Email address</dt>
          <dd>{email || 'Not provided'}</dd>
        </div>
      </div>
    );
  }

  return (
    <div>
      {contentBeforeButtons}
      <ApplicantContactInfoCard
        formData={data}
        onEdit={handleEdit}
        content="We have your contact information on file. Please review and update as needed."
      />
      <NavButtons goBack={goBack} goForward={goForward} />
      {contentAfterButtons}
    </div>
  );
};

export default ApplicantContactDetailsLoggedIn;
