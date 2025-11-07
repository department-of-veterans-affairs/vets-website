import React, { useState, useRef, useEffect } from 'react';
import {
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom-v5-compat';
import {
  VaModal,
  VaButton,
  VaButtonPair,
  VaDate,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { EXPENSE_TYPES } from '../../../constants';
import ExpenseMealFields from './ExpenseMealFields';
import ExpenseAirTravelFields from './ExpenseAirTravelFields';
import ExpenseLodgingFields from './ExpenseLodgingFields';
import ExpenseCommonCarrierFields from './ExpenseCommonCarrierFields';

const ExpensePage = () => {
  const navigate = useNavigate();
  const { apptId, claimId } = useParams();
  const location = useLocation();
  const expenseTypeRoute = location.pathname.split('/').pop();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formState, setFormState] = useState({});
  const [showError, setShowError] = useState(false);
  const errorRef = useRef(null); // ref for the error message

  // Focus the error message when it becomes visible
  useEffect(
    () => {
      if (showError && errorRef.current) {
        errorRef.current.focus();
      }
    },
    [showError],
  );

  const expenseType = Object.keys(EXPENSE_TYPES).find(
    key => EXPENSE_TYPES[key].route === expenseTypeRoute,
  );

  const expenseTypeFields = expenseType ? EXPENSE_TYPES[expenseType] : null;

  const handleFormChange = (event, explicitName) => {
    // Figure out the field name
    const name = explicitName ?? event.target?.name ?? event.detail?.name; // rarely used, but safe to include

    // Figure out the value (covers VA components + normal inputs)
    const value =
      event?.value ?? event?.detail?.value ?? event.target?.value ?? '';

    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigate(`/file-new-claim/${apptId}/${claimId}/review`);
  };

  const REQUIRED_FIELDS = {
    Meal: ['vendor'],
    Lodging: ['vendor', 'checkInDate', 'checkOutDate'],
    Commoncarrier: ['transportationType', 'transportationReason'],
    Airtravel: [
      'vendorName',
      'tripType',
      'departureDate',
      'departureAirport',
      'arrivalDate',
      'arrivalAirport',
    ],
  };

  const validatePage = () => {
    const base = ['date', 'amount'];
    const extra = REQUIRED_FIELDS[expenseType] || [];
    const requiredFields = [...base, ...extra];

    const emptyFields = requiredFields.filter(field => !formState[field]);

    setShowError(emptyFields.length > 0);
    return emptyFields.length === 0;
  };

  const handleContinue = () => {
    const isValid = validatePage();
    if (!isValid) return; // stop navigation if validation fails
    navigate(`/file-new-claim/${apptId}/${claimId}/review`);
  };

  const handleBack = () => {
    navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
  };

  return (
    <>
      <h1>
        {expenseTypeFields?.expensePageText
          ? `${expenseTypeFields.expensePageText
              .charAt(0)
              .toUpperCase()}${expenseTypeFields.expensePageText.slice(
              1,
            )} expense`
          : 'Unknown expense'}
      </h1>
      {showError && (
        <p
          data-testid="expense-page-error"
          ref={errorRef}
          tabIndex={-1} // make focusable
          style={{ color: 'red' }}
        >
          Please fill out all required fields before continuing.
        </p>
      )}
      <p>
        If you have multiple {expenseTypeFields.expensePageText} expenses, add
        just one on this page. You’ll be able to add more expenses after this.
      </p>
      {expenseType === 'Meal' && (
        <ExpenseMealFields formState={formState} onChange={handleFormChange} />
      )}
      {expenseType === 'Lodging' && (
        <ExpenseLodgingFields
          formState={formState}
          onChange={handleFormChange}
        />
      )}
      {expenseType === 'Commoncarrier' && (
        <ExpenseCommonCarrierFields
          formState={formState}
          onChange={handleFormChange}
        />
      )}
      {expenseType === 'Airtravel' && (
        <ExpenseAirTravelFields
          formState={formState}
          onChange={handleFormChange}
        />
      )}
      <VaDate
        label="Date"
        name="date"
        value={formState.date || ''}
        required
        onDateChange={handleFormChange}
      />
      <VaTextInput
        currency
        label="Amount requested"
        name="amount"
        value={formState.amount || ''}
        required
        show-input-error
        onInput={handleFormChange}
        hint="Enter the amount as dollars and cents. For example, 8.42"
      />
      <VaTextInput
        label="Description"
        name="description"
        value={formState.description || ''}
        onInput={handleFormChange}
      />
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
        rightButtonText="Continue"
        leftButtonText="Back"
        onPrimaryClick={handleContinue}
        onSecondaryClick={handleBack}
      />
    </>
  );
};

export default ExpensePage;
