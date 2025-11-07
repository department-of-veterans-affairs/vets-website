import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import {
  VaModal,
  VaButton,
  VaButtonPair,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const Mileage = () => {
  const navigate = useNavigate();
  const { apptId, claimId } = useParams();

  // TODO: Remove placeholder data
  const address = {
    addressLine1: '345 Home Address St.',
    addressLine2: 'Apt. 123',
    addressLine3: '#67',
    city: 'San Francisco',
    countryName: 'United States',
    stateCode: 'CA',
    zipCode: '94118',
  };

  const [departureAddress, setDepartureAddress] = useState('');
  const [tripType, setTripType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDepartureAddressChange = event => {
    setDepartureAddress(event.detail.value);
  };

  const handleTripTypeChange = event => {
    setTripType(event.detail.value);
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleContinue = () => {
    // Check if user selected "another-address" or "one-way"
    if (departureAddress === 'another-address' || tripType === 'one-way') {
      // TODO: Replace with actual redirect logic for special cases
      // Example: navigate('/address-input-page') or navigate('/one-way-confirmation')
      // For now, just prevent default continue action
      // eslint-disable-next-line no-console
      console.log('Special case detected - would redirect to different page');
    } else {
      navigate(`/file-new-claim/${apptId}/${claimId}/review`);
    }
  };

  const handleBack = () => {
    navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
  };

  return (
    <>
      <h1>Mileage</h1>
      <va-additional-info
        class="vads-u-margin-y--3"
        trigger="How we calculate mileage"
      >
        <ul>
          <li>
            Mileage accounts for the gas you spent on this trip. You won’t need
            to upload a receipt for gas.
          </li>
          <li>
            We calculate the miles you drove to the appointment based on your
            starting address, then compensate you a set amount per mile
          </li>
          <li>We pay round-trip mileage for your scheduled appointments</li>
          <li>
            We may only pay return mileage for unscheduled appointments like
            walk-ins and labs
          </li>
        </ul>
        <va-link
          external
          href="https://www.va.gov/resources/reimbursed-va-travel-expenses-and-mileage-rate/#mileage-reimbursement-rate"
          text="Check current mileage rates"
        />
      </va-additional-info>
      <VaRadio
        id="departure-address"
        onVaValueChange={handleDepartureAddressChange}
        value={departureAddress}
        label="Which address did you depart from?"
        required
      >
        <va-radio-option
          label={`${address.addressLine1} ${address.addressLine2 ??
            ''} ${address.addressLine3 ?? ''} ${address.city}, ${
            address.stateCode
          } ${address.zipCode}`}
          value="home-address"
          name="departure-address"
          checked={departureAddress === 'home-address'}
        />
        <va-radio-option
          label="Another address"
          value="another-address"
          name="departure-address"
          checked={departureAddress === 'another-address'}
        />
      </VaRadio>
      <VaRadio
        id="trip-type"
        onVaValueChange={handleTripTypeChange}
        value={tripType}
        label="Which address did you depart from?"
        required
      >
        <va-radio-option
          label="Round trip"
          value="round-trip"
          key="trip-round-trip"
          name="trip-type"
          checked={tripType === 'round-trip'}
        />
        <va-radio-option
          label="One way"
          value="one-way"
          key="trip-one-way"
          name="trip-type"
          checked={tripType === 'one-way'}
        />
      </VaRadio>
      <VaModal
        modalTitle="Cancel adding this expense"
        onCloseEvent={handleCloseModal}
        onPrimaryButtonClick={handleCloseModal}
        onSecondaryButtonClick={handleCloseModal}
        primaryButtonText="Yes, cancel"
        secondaryButtonText="No, continue adding this expense"
        status="warning"
        visible={isModalVisible}
      >
        <p>
          If you cancel, you’ll lose the information you entered about this
          expense and will be returned to the review page.
        </p>
      </VaModal>
      <VaButton
        secondary
        text="Cancel adding this expense"
        onClick={handleOpenModal}
        className="vads-u-display--flex vads-u-margin-y--2 travel-pay-complex-expense-cancel-btn"
      />
      <VaButtonPair
        class="vads-u-margin-y--2"
        continue
        disable-analytics
        onPrimaryClick={handleContinue}
        onSecondaryClick={handleBack}
      />
    </>
  );
};

export default Mileage;
