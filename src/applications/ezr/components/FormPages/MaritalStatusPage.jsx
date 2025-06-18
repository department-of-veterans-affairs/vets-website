import React, { useState, useEffect } from 'react';
import {
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import PropTypes from 'prop-types';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

const MaritalStatusPage = props => {
  const {
    goForward,
    goBack,
    setFormData,
    data,
    NavButtons,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;
  const [modal, setModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    data['view:maritalStatus'].maritalStatus,
  );

  useEffect(
    () => {
      setSelectedStatus(data['view:maritalStatus'].maritalStatus);
    },
    [data],
  );

  // Current marital status from form data.
  const currentMaritalStatus = data['view:maritalStatus'].maritalStatus;

  // Check if marital status is Married or Separated.
  const isMarriedOrSeparated = status =>
    status === 'Married' || status === 'Separated';

  // Marital status schema from form schema.
  const { maritalStatus: maritalStatusSchema } = ezrSchema.properties;
  const prefilled = data?.metadata?.prefill || false;

  // Modal content.
  const modalTitle = 'Marital Status Changed';
  const modalCancelDescription =
    'Your marital status has been updated. This may affect your benefits eligibility.';
  const primaryButtonText = 'Continue';
  const secondaryButtonText = 'Cancel';

  // Event handlers.
  const handlers = {
    onCancel: () => {
      setModal(false);
      setSelectedStatus(currentMaritalStatus);
    },
    onConfirm: () => {
      setModal(false);
      goForward(data);
    },
    onChange: event => {
      setSelectedStatus(event.detail.value);
    },
    handleGoForward: () => {
      if (
        isMarriedOrSeparated(currentMaritalStatus) &&
        !isMarriedOrSeparated(selectedStatus)
      ) {
        setModal(true);
      } else {
        setFormData({
          ...data,
          'view:maritalStatus': {
            maritalStatus: selectedStatus,
          },
        });
        goForward(data);
      }
    },
  };

  return (
    <div>
      <PrefillMessage formContext={{ prefilled }}>
        <p>
          We’ve prefilled some of your information from your account. If you
          need to correct anything, you can edit the form fields below.
        </p>
      </PrefillMessage>
      <VaSelect
        onVaSelect={handlers.onChange}
        required
        label="Marital Status"
        name="maritalStatus"
        options={maritalStatusSchema.enum}
        value={selectedStatus}
      >
        {maritalStatusSchema.enum.map(status => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </VaSelect>
      <VaModal
        modalTitle={modalTitle}
        visible={modal}
        primaryButtonText={primaryButtonText}
        secondaryButtonText={secondaryButtonText}
        onPrimaryButtonClick={handlers.onConfirm}
        onSecondaryButtonClick={handlers.onCancel}
        onCloseEvent={handlers.onCancel}
        status="warning"
        clickToClose
        uswds
      >
        <p className="vads-u-margin--0">{modalCancelDescription}</p>
      </VaModal>
      {contentBeforeButtons}
      <NavButtons goForward={handlers.handleGoForward} goBack={goBack} />
      {contentAfterButtons}
    </div>
  );
};

MaritalStatusPage.propTypes = {
  NavButtons: PropTypes.func.isRequired,
  data: PropTypes.shape({
    'view:maritalStatus': PropTypes.shape({
      maritalStatus: PropTypes.string,
    }),
  }).isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default MaritalStatusPage;
