import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import { EXPENSE_TYPES, EXPENSE_TYPE_KEYS } from '../../../constants';
import {
  createExpense,
  updateExpenseDeleteDocument,
  updateExpense,
} from '../../../redux/actions';
import {
  selectExpenseUpdateLoadingState,
  selectExpenseCreationLoadingState,
  selectExpenseWithDocument,
  selectDocumentDeleteLoadingState,
} from '../../../redux/selectors';

import TravelPayButtonPair from '../../shared/TravelPayButtonPair';
import ExpenseMealFields from './ExpenseMealFields';
import ExpenseAirTravelFields from './ExpenseAirTravelFields';
import ExpenseLodgingFields from './ExpenseLodgingFields';
import ExpenseCommonCarrierFields from './ExpenseCommonCarrierFields';
import CancelExpenseModal from './CancelExpenseModal';

const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const ExpensePage = () => {
  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { apptId, claimId, expenseId } = useParams();

  // Redux hooks
  const dispatch = useDispatch();
  const expense = useSelector(
    state => (expenseId ? selectExpenseWithDocument(state, expenseId) : null),
  );
  const isUpdatingExpense = useSelector(selectExpenseUpdateLoadingState);
  const isCreatingExpense = useSelector(selectExpenseCreationLoadingState);
  const isDeletingDocument = useSelector(selectDocumentDeleteLoadingState);

  // Refs
  const errorRef = useRef(null);

  // State
  const [formState, setFormState] = useState({});
  const [previousFormState, setPreviousFormState] = useState({});
  const [expenseDocument, setExpenseDocument] = useState(null);
  const [isFetchingDocument, setIsDocumentLoading] = useState(false);
  const [previousDocumentId, setPreviousDocumentId] = useState(null);
  const [fieldsInitialized, setFieldsInitialized] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showError, setShowError] = useState(false);

  // Derived state and memoized values
  const isLoadingExpense = expenseId
    ? isUpdatingExpense || isDeletingDocument
    : isCreatingExpense;
  const filename = expense?.receipt?.filename;
  const initialFormState = useMemo(
    () => {
      if (!expenseId || !expense) return {};
      return {
        ...expense,
        purchaseDate: expense.dateIncurred || '',
      };
    },
    [expenseId, expense],
  );

  // Effects
  // Effect 1: Hydrate form fields once when initialFormState is ready
  useEffect(
    () => {
      if (!fieldsInitialized && Object.keys(initialFormState).length > 0) {
        setFormState(initialFormState);
        setPreviousFormState(initialFormState);
        setFieldsInitialized(true);
      }
    },
    [fieldsInitialized, initialFormState, navigate, location.pathname],
  );

  // Effect 2: Load document once when documentId is available
  useEffect(
    () => {
      if (!expenseId || !expense?.documentId || !filename) return undefined;
      if (previousDocumentId === expense.documentId) return undefined; // Already loaded

      let isMounted = true;

      const loadDocument = async () => {
        setIsDocumentLoading(true);

        try {
          const documentUrl = `${
            environment.API_URL
          }/travel_pay/v0/claims/${claimId}/documents/${expense.documentId}`;
          const response = await apiRequest(documentUrl);
          const contentType = response.headers.get('Content-Type');
          const contentLength = response.headers.get('Content-Length');
          const arrayBuffer = await response.arrayBuffer();
          const blob = new Blob([arrayBuffer], { type: contentType });
          const base64File = await toBase64(blob);

          const receipt = {
            contentType,
            length: contentLength,
            fileName: filename,
            fileData: base64File,
          };

          // Only update state if component is still mounted
          if (isMounted) {
            setFormState(prev => ({ ...prev, receipt }));
            setPreviousFormState(prev => ({ ...prev, receipt }));
            setExpenseDocument(
              new File([blob], filename, { type: contentType }),
            );
            setPreviousDocumentId(expense.documentId); // Mark as loaded only on success
          }
        } catch (err) {
          // Failed to fetch document
        } finally {
          // Always reset loading state, even if unmounted
          // This prevents the loading spinner from getting stuck
          setIsDocumentLoading(false);
        }
      };

      loadDocument();

      // Cleanup function to prevent state updates after unmount
      return () => {
        isMounted = false;
      };
    },
    [expenseId, expense?.documentId, claimId, filename, previousDocumentId],
  );

  // Effect 3: Focus error message when it becomes visible
  useEffect(
    () => {
      if (showError && errorRef.current) {
        errorRef.current.focus();
      }
    },
    [showError],
  );

  // Derived values for expense type
  const expenseTypeMatcher = new RegExp(
    `.*(${Object.values(EXPENSE_TYPE_KEYS)
      .map(key => EXPENSE_TYPES[key].route)
      .join('|')}).*`,
  );
  const expenseTypeRoute = location.pathname.match(expenseTypeMatcher)[1];

  const expenseType = Object.values(EXPENSE_TYPE_KEYS).find(
    key => EXPENSE_TYPES[key].route === expenseTypeRoute,
  );

  const expenseTypeFields = expenseType ? EXPENSE_TYPES[expenseType] : null;

  const handleFormChange = (event, explicitName) => {
    const name = explicitName ?? event.target?.name ?? event.detail?.name; // rarely used, but safe to include
    const value =
      event?.value ?? event?.detail?.value ?? event.target?.value ?? '';

    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

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

  const isFormChanged =
    JSON.stringify(previousFormState) !== JSON.stringify(formState);

  const handleContinue = async () => {
    if (!validatePage()) return;

    const expenseConfig = EXPENSE_TYPES[expenseType];

    try {
      // Check if form fields changed
      if (expenseId && isFormChanged) {
        // Check if document has changed
        if (previousFormState.receipt !== formState.receipt) {
          // Update expense and document and remove previous document
          await dispatch(
            updateExpenseDeleteDocument(
              claimId,
              previousDocumentId,
              expenseConfig.apiRoute,
              expenseId,
              formState,
            ),
          );
        } else {
          // Remove document from the formState so we dont re-add it
          // eslint-disable-next-line no-unused-vars
          const { receipt, ...formStateWithoutReceipt } = formState;

          // UpdateExpense
          await dispatch(
            updateExpense(
              claimId,
              expenseConfig.apiRoute,
              expenseId,
              formStateWithoutReceipt,
            ),
          );
        }
      } else if (!expenseId) {
        // Create new expense
        await dispatch(
          createExpense(claimId, expenseConfig.apiRoute, formState),
        );
      }

      // Navigate after all async operations complete successfully
      navigate(`/file-new-claim/${apptId}/${claimId}/review`);
    } catch (error) {
      // TODO: Handle error - don't navigate if there's an error
    }
  };

  const handleBack = () => {
    if (expenseId) {
      navigate(`/file-new-claim/${apptId}/${claimId}/review`);
    } else {
      navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
    }
  };

  const handleDocumentChange = async e => {
    const files = e.detail?.files;
    // Delete document
    if (!files || files.length === 0) {
      // If document exists but no files then user deleted the previous document
      if (expenseDocument) {
        setExpenseDocument(null);
        setFormState(prev => {
          // Remove document from the formState so we dont re-add it
          // eslint-disable-next-line no-unused-vars
          const { receipt, ...formStateWithoutReceipt } = prev;
          return formStateWithoutReceipt;
        });
      }
    } else {
      // Change or add document
      const file = files[0]; // Get the first (and only) file
      setExpenseDocument(file);

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
    }
  };

  const isAirTravel = expenseType === EXPENSE_TYPE_KEYS.AIRTRAVEL;
  const isMeal = expenseType === EXPENSE_TYPE_KEYS.MEAL;
  const isCommonCarrier = expenseType === EXPENSE_TYPE_KEYS.COMMONCARRIER;
  const isLodging = expenseType === EXPENSE_TYPE_KEYS.LODGING;

  const pageDescription = isAirTravel
    ? `Upload a receipt or proof of the expense here. If youre adding a round-trip flight, you only need to add 1 expense. If you have receipts for 2 one-way flights, you’ll need to add 2 separate expenses.`
    : `Upload a receipt or proof of the expense here. If you have multiple ${
        expenseTypeFields.expensePageText
      } expenses, add just 1 on this page. You’ll be able to add more expenses after this.`;

  const dateHintText = isLodging
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
        loading={isFetchingDocument}
        currentDocument={expenseDocument}
        handleDocumentChange={handleDocumentChange}
      />
      {isMeal && (
        <ExpenseMealFields formState={formState} onChange={handleFormChange} />
      )}
      {isLodging && (
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
