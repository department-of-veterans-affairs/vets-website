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
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import DocumentUpload from './DocumentUpload';
import { EXPENSE_TYPES } from '../../../constants';
import { createExpense, updateExpense } from '../../../redux/actions';
import {
  selectExpenseUpdateLoadingState,
  selectExpenseCreationLoadingState,
  selectExpenseWithDocument,
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
  const hasLoadedExpenseRef = useRef(false);
  const { apptId, claimId, expenseId } = useParams();
  const location = useLocation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formState, setFormState] = useState({});
  const [showError, setShowError] = useState(false);
  const [document, setDocument] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(false);
  const errorRef = useRef(null); // ref for the error message

  const isLoadingExpense = useSelector(
    state =>
      expenseId
        ? selectExpenseUpdateLoadingState(state)
        : selectExpenseCreationLoadingState(state),
  );

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const expense = useSelector(
    state => (expenseId ? selectExpenseWithDocument(state, expenseId) : null),
  );

  const { filename } = expense?.receipt ?? {};

  useEffect(
    () => {
      if (!expenseId || !expense?.documentId) return;

      const documentUrl = `${
        environment.API_URL
      }/travel_pay/v0/claims/${claimId}/documents/${expense.documentId}`;

      setDocumentLoading(true);

      apiRequest(documentUrl)
        .then(response => {
          const contentType = response.headers.get('Content-Type');
          const contentLength = response.headers.get('Content-Length');

          response.arrayBuffer().then(arrayBuffer => {
            const blob = new Blob([arrayBuffer], {
              type: response.headers.get('Content-Type'),
            });
            toBase64(blob).then(base64File => {
              setFormState(prev => ({
                ...prev,
                receipt: {
                  contentType,
                  length: contentLength,
                  fileName: filename,
                  fileData: base64File,
                },
              }));
              const file = new File([blob], filename, {
                type: contentType,
              });
              setDocument(file);
            });
          });

          setDocumentLoading(false);
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch document:', err);
          setDocumentLoading(false);
        });
    },
    [expenseId, claimId, expense?.documentId, filename],
  );

  useEffect(
    () => {
      if (expenseId && expense && !hasLoadedExpenseRef.current) {
        setFormState({
          ...expense,
          purchaseDate: expense.dateIncurred || '',
        });
        hasLoadedExpenseRef.current = true;
      }
    },
    [expenseId, expense],
  );

  const expenseTypeMatcher = new RegExp(
    `.*(${Object.keys(EXPENSE_TYPES)
      .map(key => EXPENSE_TYPES[key].route)
      .join('|')}).*`,
  );
  const expenseTypeRoute = location.pathname.match(expenseTypeMatcher)[1];

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

  // Field names must match those expected by the expenses_controller in vets-api.
  // The controller converts them to forwards them unchanged to the API.
  const REQUIRED_FIELDS = {
    Meal: ['vendorName'],
    Lodging: ['vendor', 'checkInDate', 'checkOutDate'],
    Commoncarrier: ['carrierType', 'reasonNotUsingPOV'],
    Airtravel: [
      'vendorName',
      'tripType',
      'departureDate',
      'departedFrom',
      'returnDate',
      'arrivedTo',
    ],
  };

  const validatePage = () => {
    // Field names must match those expected by the expenses_controller in vets-api.
    const base = ['purchaseDate', 'costRequested', 'receipt'];
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

  const handleDocumentUpload = async e => {
    const files = e.detail?.files;
    // Check if we have files for upload
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0]; // Get the first (and only) file
    setDocument(file);
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

  const AIR_TRAVEL_KEY = Object.keys(EXPENSE_TYPES).find(
    key => EXPENSE_TYPES[key].route === 'air-travel',
  );
  const isAirTravel = expenseType === AIR_TRAVEL_KEY;
  const MEAL_KEY = Object.keys(EXPENSE_TYPES).find(
    key => EXPENSE_TYPES[key].route === 'meal',
  );
  const isMeal = expenseType === MEAL_KEY;
  const COMMON_CARRIER_KEY = Object.keys(EXPENSE_TYPES).find(
    key => EXPENSE_TYPES[key].route === 'common-carrier',
  );
  const isCommonCarrier = expenseType === COMMON_CARRIER_KEY;

  const pageDescription = isAirTravel
    ? `Upload a receipt or proof of the expense here. If youre adding a round-trip flight, you only need to add 1 expense. If you have receipts for 2 one-way flights, you’ll need to add 2 separate expenses.`
    : `Upload a receipt or proof of the expense here. If you have multiple ${
        expenseTypeFields.expensePageText
      } expenses, add just 1 on this page. You’ll be able to add more expenses later.`;

  const dateHintText =
    expenseType === EXPENSE_TYPES.Lodging.title
      ? `Enter the date on your receipt, even if it’s the same as your check in or check out dates.`
      : '';

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
      <p>{pageDescription}</p>
      <DocumentUpload
        loading={documentLoading}
        currentDocument={document}
        handleDocumentUpload={handleDocumentUpload}
      />
      {isMeal && (
        <ExpenseMealFields formState={formState} onChange={handleFormChange} />
      )}
      {expenseType === EXPENSE_TYPES.Lodging.title && (
        <ExpenseLodgingFields
          formState={formState}
          onChange={handleFormChange}
        />
      )}
      {isCommonCarrier && (
        <ExpenseCommonCarrierFields
          formState={formState}
          onChange={handleFormChange}
        />
      )}
      {isAirTravel && (
        <ExpenseAirTravelFields
          formState={formState}
          onChange={handleFormChange}
        />
      )}
      <VaDate
        label="Date on receipt"
        name="purchaseDate"
        value={formState.purchaseDate || ''}
        required
        hint={dateHintText}
        onDateChange={handleFormChange}
      />
      <VaTextInput
        currency
        label="Amount requested"
        name="costRequested"
        value={formState.costRequested || ''}
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
