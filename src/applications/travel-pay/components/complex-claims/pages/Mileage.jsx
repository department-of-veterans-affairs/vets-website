import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import { useDispatch, useSelector } from 'react-redux';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectVAPResidentialAddress } from 'platform/user/selectors';
import { createExpense, updateExpense } from '../../../redux/actions';
import {
  selectExpenseUpdateLoadingState,
  selectExpenseCreationLoadingState,
  selectAllExpenses,
} from '../../../redux/selectors';
import TravelPayButtonPair from '../../shared/TravelPayButtonPair';
import { EXPENSE_TYPES, TRIP_TYPES } from '../../../constants';
import CancelExpenseModal from './CancelExpenseModal';

const Mileage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { apptId, claimId, expenseId } = useParams();

  const isLoadingExpense = useSelector(
    state =>
      expenseId
        ? selectExpenseUpdateLoadingState(state)
        : selectExpenseCreationLoadingState(state),
  );

  const allExpenses = useSelector(selectAllExpenses);

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
    navigate(`/file-new-claim/${apptId}/${claimId}/review`);
  };

  const handleContinue = async () => {
    const expenseData = {
      tripType,
      expenseType: EXPENSE_TYPES.Mileage.title,
    };

    // Check if user selected "another-address" or "one-way"
    if (
      departureAddress === 'another-address' ||
      tripType === TRIP_TYPES.ONE_WAY.value
    ) {
      navigate(`/file-new-claim/${apptId}/${claimId}/unsupported`);
    } else {
      try {
        if (expenseId) {
          await dispatch(
            updateExpense(
              claimId,
              EXPENSE_TYPES.Mileage.apiRoute,
              expenseId,
              expenseData,
            ),
          );
        } else {
          await dispatch(
            createExpense(claimId, EXPENSE_TYPES.Mileage.apiRoute, expenseData),
          );
        }
      } catch (error) {
        // Handle error
        // eslint-disable-next-line no-console
        console.error('Error creating expense:', error);
        return; // Don't navigate if there's an error
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
      const hasMileageExpense = (allExpenses ?? []).some(
        e => e.expenseType === EXPENSE_TYPES.Mileage.name,
      );
      if (expenseId ?? hasMileageExpense) {
        setDepartureAddress('home-address');
        setTripType(TRIP_TYPES.ROUND_TRIP.value);
      }
    },
    [claimId, allExpenses, expenseId],
  );

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
            starting address, then compensate you a set amount per mile.
          </li>
          <li>We pay round-trip mileage for your scheduled appointments.</li>
          <li>
            We may only pay return mileage for unscheduled appointments like
            walk-ins and labs.
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
        label="Was your trip round trip or one way?"
        required
      >
        <va-radio-option
          label={TRIP_TYPES.ROUND_TRIP.label}
          value={TRIP_TYPES.ROUND_TRIP.value}
          key="trip-round-trip"
          name="trip-type"
          checked={tripType === TRIP_TYPES.ROUND_TRIP.value}
        />
        <va-radio-option
          label={TRIP_TYPES.ONE_WAY.label}
          value={TRIP_TYPES.ONE_WAY.value}
          key="trip-one-way"
          name="trip-type"
          checked={tripType === TRIP_TYPES.ONE_WAY.value}
        />
      </VaRadio>
      {!expenseId && (
        <CancelExpenseModal
          visible={isModalVisible}
          onCloseEvent={handleCloseModal}
          onOpenModal={handleOpenModal}
          onPrimaryButtonClick={handleCancelModal}
          onSecondaryButtonClick={handleCloseModal}
        />
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
