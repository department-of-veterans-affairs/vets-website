import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const IncorrectFormModal = props => {
  const {
    claimantDOB,
    sponsorDateOfBirth,
    applicantHasServiceRecord,
    relationshipToMember,
  } = props;

  const [modalVisible, setModalVisible] = useState(true);

  const isApplicantSameAsSponsor =
    claimantDOB && sponsorDateOfBirth && claimantDOB === sponsorDateOfBirth;

  const conditionsCurrentlyMet =
    (relationshipToMember === 'child' && isApplicantSameAsSponsor) ||
    (relationshipToMember === 'spouse' &&
      applicantHasServiceRecord &&
      isApplicantSameAsSponsor);

  useEffect(
    () => {
      setModalVisible(conditionsCurrentlyMet);
    },
    [
      claimantDOB,
      sponsorDateOfBirth,
      applicantHasServiceRecord,
      relationshipToMember,
      conditionsCurrentlyMet,
    ],
  );
  const handleClose = () => {
    setModalVisible(false);
  };

  function secondaryClick() {
    window.location.href = '/';
  }

  const form1990Link = '/education/apply-for-gi-bill-form-22-1990/introduction';
  const modalContent = (
    <div>
      <p>
        If you are a service member applying on behalf of your dependent, your
        application will be denied. Your dependent will need to complete the
        application from their own Login.gov or ID.me account.
      </p>
      <p>
        Or If you are a service member applying for a benefit based on your own
        service,{' '}
        <a href={form1990Link} target="_blank" rel="noopener noreferrer">
          apply using VA Form 22-1990
        </a>
        .
      </p>
      <p>By continuing this claim, you acknowledge your claim may be denied.</p>
    </div>
  );
  return (
    <VaModal
      modalTitle="This application may not be the best fit for you"
      visible={modalVisible}
      onCloseEvent={secondaryClick}
      onPrimaryButtonClick={handleClose}
      onSecondaryButtonClick={secondaryClick}
      primaryButtonText="Yes, continue"
      secondaryButtonText="No, exit application"
      status="warning"
    >
      {modalContent}
    </VaModal>
  );
};

const mapStateToProps = state => {
  return {
    ...state,
    claimantDOB: state?.data?.formData?.data.attributes?.claimant.dateOfBirth,
    sponsorDateOfBirth: state?.form?.data?.dateOfBirth,
    relationshipToMember: state?.form?.data?.relationshipToMember,
    applicantHasServiceRecord:
      state?.data?.formData?.data.attributes?.serviceData,
  };
};

export default connect(mapStateToProps)(IncorrectFormModal);
