import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const IncorrectFormModal = props => {
  const { formData } = props;

  const [modalVisible, setModalVisible] = useState(true);
  const claimantDOB = formData?.dateOfBirth;
  const claimantHasServiceData = formData?.serviceData?.length > 0;
  const sponsors = formData?.sponsors?.transferOfEntitlement;
  const sponsorDOBs = Array.isArray(sponsors)
    ? sponsors.map(sponsor => sponsor.dateOfBirth)
    : [];
  const relationShipToMember = formData?.relationShipToMember;

  const isChildMatch =
    relationShipToMember === 'child' &&
    claimantDOB &&
    sponsorDOBs.includes(claimantDOB);

  const isSpouseMatch =
    relationShipToMember === 'spouse' &&
    claimantHasServiceData &&
    claimantDOB &&
    sponsorDOBs.includes(claimantDOB);
  const shouldShowModal = isChildMatch || isSpouseMatch;
  useEffect(
    () => {
      if (shouldShowModal) {
        setModalVisible(true);
      } else {
        setModalVisible(false);
      }
    },
    [shouldShowModal],
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

const mapStateToProps = state => ({
  ...state,
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(IncorrectFormModal);
