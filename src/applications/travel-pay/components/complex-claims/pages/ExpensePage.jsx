import React, { useState, useRef, useEffect } from 'react';
import {
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom-v5-compat';
import { useDispatch, useSelector } from 'react-redux';
import {
  VaDate,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import DocumentUpload from './DocumentUpload';
import { EXPENSE_TYPES } from '../../../constants';
import { createExpense, updateExpense } from '../../../redux/actions';
import {
  selectExpenseUpdateLoadingState,
  selectExpenseCreationLoadingState,
} from '../../../redux/selectors';
import TravelPayButtonPair from '../../shared/TravelPayButtonPair';
import ExpenseMealFields from './ExpenseMealFields';
import ExpenseAirTravelFields from './ExpenseAirTravelFields';
import ExpenseLodgingFields from './ExpenseLodgingFields';
import ExpenseCommonCarrierFields from './ExpenseCommonCarrierFields';
import CancelExpenseModal from './CancelExpenseModal';

const ExpensePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { apptId, claimId, expenseId } = useParams();
  const location = useLocation();
  const expenseTypeMatcher = new RegExp(
    `.*(${Object.keys(EXPENSE_TYPES)
      .map(key => EXPENSE_TYPES[key].route)
      .join('|')}).*`,
  );
  const expenseTypeRoute = location.pathname.match(expenseTypeMatcher)[1];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formState, setFormState] = useState({});
  const [showError, setShowError] = useState(false);
  const errorRef = useRef(null); // ref for the error message

  const isLoadingExpense = useSelector(
    state =>
      expenseId
        ? selectExpenseUpdateLoadingState(state)
        : selectExpenseCreationLoadingState(state),
  );

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
  };

  const handleCancelModal = () => {
    handleCloseModal();
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
      'returnDate',
      'arrivalAirport',
    ],
  };

  const validatePage = () => {
    const base = ['date', 'amount', 'receipt'];
    const extra = REQUIRED_FIELDS[expenseType] || [];
    const requiredFields = [...base, ...extra];

    const emptyFields = requiredFields.filter(field => !formState[field]);

    setShowError(emptyFields.length > 0);
    return emptyFields.length === 0;
  };

  const handleContinue = async () => {
    const isValid = validatePage();
    if (!isValid) return;

    const expenseConfig = EXPENSE_TYPES[expenseType];

    try {
      if (expenseId) {
        await dispatch(
          updateExpense(claimId, expenseConfig.apiRoute, expenseId, formState),
        );
      } else {
        await dispatch(
          createExpense(claimId, expenseConfig.apiRoute, formState),
        );
      }
      navigate(`/file-new-claim/${apptId}/${claimId}/review`);
    } catch (error) {
      // TODO: Handle error
    }
  };

  const handleBack = () => {
    if (expenseId) {
      navigate(`/file-new-claim/${apptId}/${claimId}/review`);
    } else {
      navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
    }
  };

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleDocumentUpload = async e => {
    const files = e.detail?.files;
    // Check if we have files for upload
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0]; // Get the first (and only) file
    const base64File = await toBase64(file);
    // Sync into formState so validation works
    setFormState(prev => ({
      ...prev,
      receipt: {
        contentType: file.type,
        length: file.size,
        fileName: file.name,
        fileData: base64File,
      },
    }));
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
        Upload a receipt or proof of the expense here. If you have multiple{' '}
        {expenseTypeFields.expensePageText} expenses, add just one on this page.
        You’ll be able to add more expenses after this.
      </p>
      <DocumentUpload handleDocumentUpload={handleDocumentUpload} />
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
        label="Date on receipt"
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

export default ExpensePage;
