import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const IncorrectFormModal = props => {
  const {
    claimantDOB,
    sponsorDateOfBirth,
    applicantHasServiceRecord,
    relationshipToMember,
    showMeb54901990eTextUpdate,
  } = props;

  const [modalVisible, setModalVisible] = useState(true);

  const isApplicantSameAsSponsor =
    claimantDOB && sponsorDateOfBirth && claimantDOB === sponsorDateOfBirth;

  const conditionsCurrentlyMet =
    (relationshipToMember === 'child' &&
      isApplicantSameAsSponsor &&
      showMeb54901990eTextUpdate) ||
    (relationshipToMember === 'spouse' &&
      applicantHasServiceRecord &&
      isApplicantSameAsSponsor &&
      showMeb54901990eTextUpdate);

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
    <>
      <ul className="vads-u-margin-bottom--2">
        <li>
          If you are a Veteran or service member applying on behalf of your
          dependent, your application will be denied. Your dependent will need
          to complete the application from their own ID.me or Login.gov account.
        </li>
        {relationshipToMember === 'child' && (
          <li>
            If you believe you’re an eligible dependent receiving benefits
            through{' '}
            <a
              href="https://milconnect.dmdc.osd.mil/milconnect/"
              target="_blank"
              rel="noopener noreferrer"
            >
              milConnect
            </a>{' '}
            and need more info, contact VA at{' '}
            <a
              href="https://ask.va.gov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask.VA.gov
            </a>
            .
          </li>
        )}
        <li>
          If you are a Veteran or service member applying for a benefit based on
          your own service,{' '}
          <a href={form1990Link} target="_blank" rel="noopener noreferrer">
            apply using VA Form 22-1990
          </a>
          .
        </li>
      </ul>
      <p className="vads-u-margin--0">
        By continuing this claim, you acknowledge your claim may be denied.
      </p>
    </>
  );
  return (
    <VaModal
      modalTitle="This application may not be the best fit for you"
      visible={modalVisible}
      onCloseEvent={handleClose}
      onPrimaryButtonClick={handleClose}
      onSecondaryButtonClick={secondaryClick}
      primaryButtonText="Yes, continue"
      secondaryButtonText="No, exit application"
      status="warning"
      modalClass="vads-u-max-width--5xl"
    >
      {modalContent}
    </VaModal>
  );
};

IncorrectFormModal.propTypes = {
  applicantHasServiceRecord: PropTypes.bool,
  claimantDOB: PropTypes.string,
  relationshipToMember: PropTypes.string,
  showMeb54901990eTextUpdate: PropTypes.bool,
  sponsorDateOfBirth: PropTypes.string,
};

IncorrectFormModal.defaultProps = {
  applicantHasServiceRecord: false,
  claimantDOB: '',
  relationshipToMember: '',
  showMeb54901990eTextUpdate: false,
  sponsorDateOfBirth: '',
};

const mapStateToProps = state => {
  return {
    ...state,
    claimantDOB: state?.data?.formData?.data?.attributes?.claimant?.dateOfBirth,
    sponsorDateOfBirth: state?.form?.data?.dateOfBirth,
    relationshipToMember: state?.form?.data?.relationshipToMember,
    applicantHasServiceRecord:
      state?.data?.formData?.data?.attributes?.serviceData,
    showMeb54901990eTextUpdate:
      state?.featureToggles?.showMeb54901990eTextUpdate,
  };
};

export default connect(mapStateToProps)(IncorrectFormModal);
