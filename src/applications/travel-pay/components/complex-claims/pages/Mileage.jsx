import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import { useDispatch, useSelector } from 'react-redux';
import {
  VaModal,
  VaButton,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectVAPResidentialAddress } from 'platform/user/selectors';
import { createExpense, updateExpense } from '../../../redux/actions';
import {
  selectAppointment,
  selectClaimDetails,
} from '../../../redux/selectors';
import { formatDateTime } from '../../../util/dates';
import TravelPayButtonPair from '../../shared/TravelPayButtonPair';

const Mileage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { apptId, claimId, expenseId } = useParams();

  const isLoadingExpense = useSelector(
    state => state.travelPay.expense?.isLoading,
  );

  const appointmentData = useSelector(selectAppointment);
  const { data: claimDetails } = useSelector(state =>
    selectClaimDetails(state, claimId),
  );

  const address = useSelector(selectVAPResidentialAddress);

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

  const handleCancelModal = () => {
    handleCloseModal();
    navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
  };

  const handleContinue = async () => {
    // Create mileage expense data
    const expenseData = {
      departureAddress: departureAddress === 'home-address' ? address : 'other',
      tripType,
      expenseType: 'mileage',
    };

    // Check if user selected "another-address" or "one-way"
    if (departureAddress === 'another-address' || tripType === 'one-way') {
      // eslint-disable-next-line no-console
      console.log('Special case detected - would redirect to different page');
    } else {
      try {
        if (expenseId) {
          await dispatch(
            updateExpense(claimId, 'mileage', expenseId, expenseData),
          );
        } else {
          await dispatch(createExpense(claimId, 'mileage', expenseData));
        }
      } catch (error) {
        // Handle error
        // eslint-disable-next-line no-console
        console.error('Error creating expense:', error);
      }
      navigate(`/file-new-claim/${apptId}/${claimId}/review`);
    }
  };

  const handleBack = () => {
    if (expenseId) {
      navigate(`/file-new-claim/${apptId}/${claimId}/review`);
    } else {
      navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
    }
  };

  useEffect(
    () => {
      const hasMileageExpense = (claimDetails?.expenses ?? []).some(
        e => e.expenseType === 'mileage',
      );
      if (expenseId ?? hasMileageExpense) {
        setDepartureAddress('home-address');
        setTripType('round-trip');
      }
    },
    [claimId, claimDetails, expenseId],
  );

  return (
    <>
      <h1>Mileage</h1>

      {appointmentData && (
        <div className="vads-u-margin-bottom--3">
          <p className="vads-u-font-weight--bold vads-u-margin-bottom--1">
            Appointment information
          </p>
          <p className="vads-u-margin-y--0">
            {(() => {
              if (!appointmentData.localStartTime) {
                return 'Appointment information not available';
              }
              const [formattedDate, formattedTime] = formatDateTime(
                appointmentData.localStartTime,
                true,
              );
              return `${formattedDate} at ${formattedTime} appointment`;
            })()}
          </p>
          {appointmentData.location?.attributes?.name && (
            <p className="vads-u-margin-y--0">
              {appointmentData.location.attributes.name}
            </p>
          )}
        </div>
      )}

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
      {!expenseId && (
        <>
          <VaModal
            modalTitle="Cancel adding this expense"
            onCloseEvent={handleCloseModal}
            onPrimaryButtonClick={handleCancelModal}
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
        </>
      )}
      <TravelPayButtonPair
        continueText={expenseId ? 'Save and continue' : 'Continue'}
        backText={expenseId ? 'Cancel' : 'Back'}
        className={expenseId && 'vads-u-margin-top--2'}
        onBack={handleBack}
        onContinue={handleContinue}
        loading={isLoadingExpense}
      />
    </>
  );
};

export default Mileage;
