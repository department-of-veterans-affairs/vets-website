import React, { useEffect } from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { acknowledgeDuplicate, toggleModal } from '../actions';

function DuplicateContactInfoModal(props) {
  useEffect(
    () => {
      const allPotentialDuplicates = props?.duplicateEmail?.concat(
        props?.duplicatePhone,
      );
      const filteredPotentialDuplicates = allPotentialDuplicates?.filter(
        entry => entry?.dupe === true && entry.acknowledged === undefined,
      );

      if (filteredPotentialDuplicates?.length === 0) {
        props.toggleModal(false);
      } else if (filteredPotentialDuplicates?.length > 0) {
        props.toggleModal(true);
      }
    },
    [props.duplicateEmail],
  );

  function primaryClick() {
    props.toggleModal();
  }

  function secondaryClick() {
    const acknowledgedDuplicateEmail = props.duplicateEmail.map(email => ({
      ...email,
      acknowledged: true,
    }));

    const acknowledgedDuplicatePhone = props.duplicatePhone.map(phone => ({
      ...phone,
      acknowledged: true,
    }));

    props.acknowledgeDuplicate({
      email: acknowledgedDuplicateEmail,
      phone: acknowledgedDuplicatePhone,
    });
  }

  function modalTitle() {
    let modalText;

    const filteredPotentialDuplicateEmails = props?.duplicateEmail?.filter(
      entry => entry?.dupe === true && entry.acknowledged === undefined,
    );
    const filteredPotentialDuplicatesMobile = props?.duplicatePhone?.filter(
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
    <div>
      <VaModal
        modalTitle={modalTitle()}
        visible={props.openModal}
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
    </div>
  );
}

DuplicateContactInfoModal.propTypes = {
  duplicateEmail: PropTypes.array,
  duplicatePhone: PropTypes.array,
  toggleModal: PropTypes.func,
  openModal: PropTypes.bool,
  email: PropTypes.string,
};

const mapStateToProps = state => ({
  ...state,
  email: state?.form?.data?.email?.email,
  duplicateEmail: state?.data?.duplicateEmail,
  duplicatePhone: state?.data?.duplicatePhone,
  openModal: state?.data?.openModal,
  formData: state?.form?.data,
});

const mapDispatchToProps = {
  setFormData: setData,
  acknowledgeDuplicate,
  toggleModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DuplicateContactInfoModal);
