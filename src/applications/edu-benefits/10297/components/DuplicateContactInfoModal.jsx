import React, { useEffect } from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { acknowledgeDuplicate, toggleModal } from '../actions';

function DuplicateContactInfoModal(props) {
  const {
    duplicateEmail,
    duplicatePhone,
    acknowledge,
    toggle,
    openModal,
  } = props;

  useEffect(
    () => {
      const allPotentialDuplicates = duplicateEmail?.concat(duplicatePhone);
      const filteredPotentialDuplicates = allPotentialDuplicates?.filter(
        entry => entry?.dupe === true && entry.acknowledged === undefined,
      );

      if (filteredPotentialDuplicates?.length === 0) {
        toggle(false);
      } else if (filteredPotentialDuplicates?.length > 0) {
        toggle(true);
      }
    },
    [duplicateEmail, duplicatePhone, toggle],
  );

  function primaryClick() {
    toggle(false);
  }

  function secondaryClick() {
    const acknowledgedDuplicateEmail = duplicateEmail.map(email => ({
      ...email,
      acknowledged: true,
    }));

    const acknowledgedDuplicatePhone = duplicatePhone.map(phone => ({
      ...phone,
      acknowledged: true,
    }));

    acknowledge({
      email: acknowledgedDuplicateEmail,
      phone: acknowledgedDuplicatePhone,
    });
  }

  function modalTitle() {
    let modalText;

    const filteredPotentialDuplicateEmails = duplicateEmail?.filter(
      entry => entry?.dupe === true && entry.acknowledged === undefined,
    );
    const filteredPotentialDuplicatesMobile = duplicatePhone?.filter(
      entry => entry?.dupe === true && entry.acknowledged === undefined,
    );

    if (
      filteredPotentialDuplicateEmails?.length > 0 &&
      filteredPotentialDuplicatesMobile.length > 0
    ) {
      modalText =
        'We have this mobile phone number and email on file for another person with education benefits';
    } else if (filteredPotentialDuplicateEmails?.length > 0) {
      modalText =
        'We have this email on file for another person with education benefits';
    } else if (filteredPotentialDuplicatesMobile?.length > 0) {
      modalText =
        'We have this mobile phone number on file for another person with education benefits';
    }

    return modalText;
  }

  return (
    <VaModal
      modalTitle={modalTitle()}
      visible={openModal}
      onCloseEvent={secondaryClick}
      onPrimaryButtonClick={primaryClick}
      onSecondaryButtonClick={secondaryClick}
      primaryButtonText="Back"
      secondaryButtonText="Continue"
      status="warning"
    >
      <p>
        <b>This will impact how we:</b>
      </p>

      <ul>
        <li>Contact you if we have questions about your application</li>
        <li>Tell you important information about your benefits</li>
        <li>Prompt you to verify your enrollment</li>
      </ul>
    </VaModal>
  );
}

DuplicateContactInfoModal.propTypes = {
  acknowledge: PropTypes.func,
  duplicateEmail: PropTypes.array,
  duplicatePhone: PropTypes.array,
  email: PropTypes.string,
  openModal: PropTypes.bool,
  toggle: PropTypes.func,
};

const mapStateToProps = state => ({
  email: state?.form?.data?.email?.email,
  duplicateEmail: state?.data?.duplicateEmail,
  duplicatePhone: state?.data?.duplicatePhone,
  openModal: state?.data?.openModal,
  formData: state?.form?.data,
});

const mapDispatchToProps = {
  setFormData: setData,
  acknowledge: acknowledgeDuplicate,
  toggle: toggleModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DuplicateContactInfoModal);
