import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import { useDispatch, useSelector } from 'react-redux';
import {
  VaRadio,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectVAPResidentialAddress } from 'platform/user/selectors';
import {
  createExpense,
  updateExpense,
  setUnsavedExpenseChanges,
  setReviewPageAlert,
} from '../../../redux/actions';
import {
  selectExpenseUpdateLoadingState,
  selectExpenseCreationLoadingState,
  selectAllExpenses,
} from '../../../redux/selectors';
import TravelPayButtonPair from '../../shared/TravelPayButtonPair';
import {
  EXPENSE_TYPE_KEYS,
  EXPENSE_TYPES,
  TRIP_TYPES,
} from '../../../constants';
import CancelExpenseModal from './CancelExpenseModal';

const Mileage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { apptId, claimId, expenseId } = useParams();

  const isEditMode = !!expenseId;
  const isLoadingExpense = useSelector(
    state =>
      isEditMode
        ? selectExpenseUpdateLoadingState(state)
        : selectExpenseCreationLoadingState(state),
  );

  const allExpenses = useSelector(selectAllExpenses);

  const address = useSelector(selectVAPResidentialAddress);

  const [departureAddress, setDepartureAddress] = useState('');
  const [tripType, setTripType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const initialStateRef = useRef({ departureAddress: '', tripType: '' });
  const previousHasChangesRef = useRef(false);

  const handleDepartureAddressChange = event => {
    setDepartureAddress(event.detail.value);
  };

  const handleTripTypeChange = event => {
    setTripType(event.detail.value);
  };

  // Track unsaved changes by comparing current state to initial state
  useEffect(
    () => {
      const currentState = { departureAddress, tripType };
      const hasChanges =
        JSON.stringify(currentState) !==
        JSON.stringify(initialStateRef.current);
      // Only dispatch if the hasChanges value actually changed
      if (hasChanges !== previousHasChangesRef.current) {
        dispatch(setUnsavedExpenseChanges(hasChanges));
        previousHasChangesRef.current = hasChanges;
      }
    },
    [departureAddress, tripType, dispatch],
  );

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleConfirmCancel = () => {
    handleCloseModal();
    // Clear unsaved changes when canceling
    dispatch(setUnsavedExpenseChanges(false));
    if (isEditMode) {
      // TODO: Add logic to determine where the user came from and direct them back to the correct location
      // navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
      navigate(`/file-new-claim/${apptId}/${claimId}/review`);
    } else {
      // TODO: Add logic to determine where the user came from and direct them back to the correct location
      navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
      // navigate(`/file-new-claim/${apptId}/${claimId}/review`);
    }
  };

  const handleContinue = async () => {
    const expenseData = {
      tripType,
      expenseType: EXPENSE_TYPE_KEYS.MILEAGE,
    };

    // Check if user selected "another-address" or "one-way"
    if (
      departureAddress === 'another-address' ||
      tripType === TRIP_TYPES.ONE_WAY.key
    ) {
      navigate(`/file-new-claim/${apptId}/${claimId}/unsupported`);
    } else {
      try {
        if (isEditMode) {
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

        // Reset initial state reference to current state after successful save
        initialStateRef.current = { departureAddress, tripType };
        dispatch(setUnsavedExpenseChanges(false));

        // Set success alert in Redux
        dispatch(
          setReviewPageAlert({
            title: '',
            description: `You successfully ${
              isEditMode ? 'updated your' : 'added a'
            } ${EXPENSE_TYPES.Mileage.expensePageText} expense.`,
            type: 'success',
          }),
        );
      } catch (error) {
        // Set error alert
        const verb = isEditMode ? 'edit' : 'add';
        dispatch(
          setReviewPageAlert({
            title: `We couldn't ${verb} this expense right now`,
            description: `We're sorry. We can't ${
              isEditMode ? 'edit' : 'add'
            } this expense${
              isEditMode ? '' : ' to your claim'
            }. Try again later.`,
            type: 'error',
          }),
        );
      }
      navigate(`/file-new-claim/${apptId}/${claimId}/review`);
    }
  };

  const handleBack = () => {
    if (isEditMode) {
      setIsModalVisible(true);
    } else {
      // TODO: Add logic to determine where the user came from and direct them back to the correct location
      // navigate(`/file-new-claim/${apptId}/${claimId}/review`);
      navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
    }
  };

  useEffect(
    () => {
      const hasMileageExpense = (allExpenses ?? []).some(
        e => e.expenseType === EXPENSE_TYPE_KEYS.MILEAGE,
      );
      if (expenseId ?? hasMileageExpense) {
        const initialState = {
          departureAddress: 'home-address',
          tripType: TRIP_TYPES.ROUND_TRIP.key,
        };
        setDepartureAddress(initialState.departureAddress);
        setTripType(initialState.tripType);
        initialStateRef.current = initialState;
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
          value={TRIP_TYPES.ROUND_TRIP.key}
          key="trip-round-trip"
          name="trip-type"
          checked={tripType === TRIP_TYPES.ROUND_TRIP.key}
        />
        <va-radio-option
          label={TRIP_TYPES.ONE_WAY.label}
          value={TRIP_TYPES.ONE_WAY.key}
          key="trip-one-way"
          name="trip-type"
          checked={tripType === TRIP_TYPES.ONE_WAY.key}
        />
      </VaRadio>

      {!isEditMode && (
        <VaButton
          secondary
          text="Cancel adding this expense"
          onClick={handleOpenModal}
          className="vads-u-display--flex vads-u-margin-y--2 travel-pay-complex-expense-cancel-btn"
        />
      )}
      <TravelPayButtonPair
        continueText={expenseId ? 'Save and continue' : 'Continue'}
        backText={expenseId ? 'Cancel' : 'Back'}
        className={expenseId ? 'vads-u-margin-top--2' : ''}
        onBack={handleBack}
        onContinue={handleContinue}
        loading={isLoadingExpense}
      />
      <CancelExpenseModal
        visible={isModalVisible}
        onCloseEvent={handleCloseModal}
        onPrimaryButtonClick={handleConfirmCancel}
        onSecondaryButtonClick={handleCloseModal}
        isEditMode={isEditMode}
      />
    </>
  );
};

export default Mileage;
