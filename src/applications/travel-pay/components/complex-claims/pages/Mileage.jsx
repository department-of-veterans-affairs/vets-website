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

  const allExpenses = useSelector(selectAllExpenses);
  const address = useSelector(selectVAPResidentialAddress);
  const isLoadingExpense = useSelector(
    state =>
      isEditMode
        ? selectExpenseUpdateLoadingState(state)
        : selectExpenseCreationLoadingState(state),
  );

  const initialFormStateRef = useRef({ departureAddress: '', tripType: '' });
  const previousHasChangesRef = useRef(false);

  const [formState, setFormState] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showTripTypeError, setShowTripTypeError] = useState(false);
  const [showDepartureAddressError, setShowDepartureAddresError] = useState(
    false,
  );

  // Handle form changes
  const handleFormChange = (event, explicitName) => {
    const name = explicitName ?? event.target?.name ?? event.detail?.name; // rarely used, but safe to include
    const value =
      event?.value ?? event?.detail?.value ?? event.target?.value ?? '';
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Track unsaved changes
  useEffect(
    () => {
      const hasChanges =
        JSON.stringify(formState) !==
        JSON.stringify(initialFormStateRef.current);
      // Only dispatch if the hasChanges value actually changed
      if (hasChanges !== previousHasChangesRef.current) {
        dispatch(setUnsavedExpenseChanges(hasChanges));
        previousHasChangesRef.current = hasChanges;
      }
    },
    [formState, dispatch],
  );

  // Initialize form state for edit or default
  useEffect(
    () => {
      const hasMileageExpense = (allExpenses ?? []).some(
        e => e.expenseType === EXPENSE_TYPE_KEYS.MILEAGE,
      );

      if (expenseId || hasMileageExpense) {
        const initialState = {
          departureAddress: 'home-address',
          tripType: TRIP_TYPES.ROUND_TRIP.key,
        };
        setFormState(initialState);
        initialFormStateRef.current = initialState;
      }
    },
    [allExpenses, expenseId],
  );

  const validatePage = () => {
    const requiredFields = ['departureAddress', 'tripType'];
    const emptyFields = requiredFields.filter(field => !formState[field]);
    if (emptyFields.includes('departureAddress')) {
      setShowDepartureAddresError(true);
    } else {
      setShowDepartureAddresError(false); // Set to false if previously shown
    }
    if (emptyFields.includes('tripType')) {
      setShowTripTypeError(true);
    } else {
      setShowTripTypeError(false); // Set to false if previously shown
    }
    return emptyFields.length === 0;
  };

  const handleContinue = async () => {
    if (!validatePage()) return;

    const expenseData = {
      ...formState,
      expenseType: EXPENSE_TYPE_KEYS.MILEAGE,
    };

    // Check if user selected "another-address" or "one-way"
    if (
      formState.departureAddress === 'another-address' ||
      formState.tripType === TRIP_TYPES.ONE_WAY.key
    ) {
      navigate(`/file-new-claim/${apptId}/${claimId}/unsupported`);
      return;
    }

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

      initialFormStateRef.current = formState;
      dispatch(setUnsavedExpenseChanges(false));

      dispatch(
        setReviewPageAlert({
          title: '',
          description: `You successfully ${
            isEditMode ? 'updated your' : 'added a'
          } ${EXPENSE_TYPES.Mileage.expensePageText} expense.`,
          type: 'success',
        }),
      );
    } catch {
      const verb = isEditMode ? 'edit' : 'add';
      dispatch(
        setReviewPageAlert({
          title: `We couldn't ${verb} this expense right now`,
          description: `We're sorry. We can't ${verb} this expense${
            isEditMode ? '' : ' to your claim'
          }. Try again later.`,
          type: 'error',
        }),
      );
    }

    navigate(`/file-new-claim/${apptId}/${claimId}/review`);
  };

  const handleBack = () => {
    if (isEditMode) {
      setIsModalVisible(true);
    } else {
      navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
    }
  };

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const handleConfirmCancel = () => {
    handleCloseModal();
    dispatch(setUnsavedExpenseChanges(false));
    navigate(
      isEditMode
        ? `/file-new-claim/${apptId}/${claimId}/review`
        : `/file-new-claim/${apptId}/${claimId}/choose-expense`,
    );
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
        name="departureAddress"
        value={formState.departureAddress}
        label="Which address did you depart from?"
        required
        error={showDepartureAddressError ? 'Select a departure address' : null}
        onVaValueChange={handleFormChange}
      >
        <va-radio-option
          label={`${address.addressLine1} ${address.addressLine2 ??
            ''} ${address.addressLine3 ?? ''} ${address.city}, ${
            address.stateCode
          } ${address.zipCode}`}
          value="home-address"
          checked={formState.departureAddress === 'home-address'}
        />
        <va-radio-option
          label="Another address"
          value="another-address"
          checked={formState.departureAddress === 'another-address'}
        />
      </VaRadio>

      <VaRadio
        name="tripType"
        value={formState.tripType}
        label="Was your trip round trip or one way?"
        required
        error={showTripTypeError ? 'Select a trip type' : null}
        onVaValueChange={handleFormChange}
      >
        <va-radio-option
          label={TRIP_TYPES.ROUND_TRIP.label}
          value={TRIP_TYPES.ROUND_TRIP.key}
          checked={formState.tripType === TRIP_TYPES.ROUND_TRIP.key}
        />
        <va-radio-option
          label={TRIP_TYPES.ONE_WAY.label}
          value={TRIP_TYPES.ONE_WAY.key}
          checked={formState.tripType === TRIP_TYPES.ONE_WAY.key}
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
        continueText={isEditMode ? 'Save and continue' : 'Continue'}
        backText={isEditMode ? 'Cancel' : 'Back'}
        className={isEditMode ? 'vads-u-margin-top--2' : ''}
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
