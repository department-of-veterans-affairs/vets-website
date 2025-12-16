import React, { useState, useRef, useEffect } from 'react';
import {
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom-v5-compat';
import { useDispatch, useSelector } from 'react-redux';
import { scrollToFirstError } from 'platform/utilities/scroll';
import {
  VaDate,
  VaTextInput,
  VaButton,
  VaTextarea,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import DocumentUpload from './DocumentUpload';
import { EXPENSE_TYPES, EXPENSE_TYPE_KEYS } from '../../../constants';
import {
  createExpense,
  updateExpenseDeleteDocument,
  updateExpense,
  setUnsavedExpenseChanges,
  setReviewPageAlert,
} from '../../../redux/actions';
import {
  selectExpenseUpdateLoadingState,
  selectExpenseCreationLoadingState,
  selectExpenseWithDocument,
  selectDocumentDeleteLoadingState,
} from '../../../redux/selectors';
import {
  DATE_VALIDATION_TYPE,
  validateReceiptDate,
  validateDescription,
  validateRequestedAmount,
} from '../../../util/expense-validation-helpers';

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

  const isEditMode = !!expenseId;

  // Redux hooks
  const dispatch = useDispatch();
  const expense = useSelector(
    state => (isEditMode ? selectExpenseWithDocument(state, expenseId) : null),
  );
  const isUpdatingExpense = useSelector(selectExpenseUpdateLoadingState);
  const isCreatingExpense = useSelector(selectExpenseCreationLoadingState);
  const isDeletingDocument = useSelector(selectDocumentDeleteLoadingState);

  // Refs
  const initialFormStateRef = useRef({});
  const previousHasChangesRef = useRef(false);
  const hasLoadedExpenseRef = useRef(false);

  // State
  const [formState, setFormState] = useState({});
  const [previousFormState, setPreviousFormState] = useState({});
  const [expenseDocument, setExpenseDocument] = useState(null);
  const [isFetchingDocument, setIsDocumentLoading] = useState(false);
  const [previousDocumentId, setPreviousDocumentId] = useState(null);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [extraFieldErrors, setExtraFieldErrors] = useState({});

  // Derived state and memoized values
  const isLoadingExpense = isEditMode
    ? isUpdatingExpense || isDeletingDocument
    : isCreatingExpense;
  const filename = expense?.receipt?.filename;

  // Effects
  // Effect 1: Hydrate form fields once when initialFormState is ready
  useEffect(
    () => {
      if (expenseId && expense && !hasLoadedExpenseRef.current) {
        const initialState = {
          ...expense,
          purchaseDate: expense.dateIncurred || '',
        };
        setFormState(initialState);
        initialFormStateRef.current = initialState;
        hasLoadedExpenseRef.current = true;
      }
    },
    [expenseId, expense],
  );

  // Effect 2: Load document once when documentId is available
  useEffect(
    () => {
      if (!isEditMode || !expense?.documentId || !filename) return undefined;
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
    [isEditMode, expense?.documentId, claimId, filename, previousDocumentId],
  );

  // Effect 3: Focus error message when it becomes visible
  useEffect(
    () => {
      if (!extraFieldErrors) return;

      scrollToFirstError({ focusOnAlertRole: true });
    },
    [extraFieldErrors],
  );

  // Track unsaved changes by comparing current state to initial state
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
    const value = (
      event?.value ??
      event?.detail?.value ??
      event.target?.value ??
      ''
    ).toString();

    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenCancelModal = () => setIsCancelModalVisible(true);
  const handleCloseCancelModal = () => setIsCancelModalVisible(false);
  const handleConfirmCancel = () => {
    handleCloseCancelModal();
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
    const base = ['purchaseDate', 'costRequested', 'receipt', 'description'];
    const extra = REQUIRED_FIELDS[expenseType] || [];
    const requiredFields = [...base, ...extra];

    const emptyFields = requiredFields.filter(field => !formState[field]);

    const isDateValid = validateReceiptDate(
      formState.purchaseDate,
      DATE_VALIDATION_TYPE.SUBMIT,
      setExtraFieldErrors,
    );
    const isDescriptionValid = validateDescription(
      formState.description,
      setExtraFieldErrors,
      DATE_VALIDATION_TYPE.SUBMIT,
    );
    const isAmountValid = validateRequestedAmount(
      formState.costRequested,
      setExtraFieldErrors,
      DATE_VALIDATION_TYPE.SUBMIT,
    );

    // Extra validation for specific fields
    return (
      emptyFields.length === 0 &&
      isDateValid &&
      isDescriptionValid &&
      isAmountValid
    );
  };

  const isFormChanged =
    JSON.stringify(previousFormState) !== JSON.stringify(formState);

  const handleContinue = async () => {
    if (!validatePage()) return;

    const expenseConfig = EXPENSE_TYPES[expenseType];

    try {
      // Check if form fields changed
      if (isEditMode && isFormChanged) {
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
      } else if (!isEditMode) {
        // Create new expense
        await dispatch(
          createExpense(claimId, expenseConfig.apiRoute, formState),
        );
      }
      // Reset initial state reference to current state after successful save
      initialFormStateRef.current = formState;
      dispatch(setUnsavedExpenseChanges(false));

      // Set success alert
      const expenseTypeName = expenseConfig.expensePageText
        ? `${expenseConfig.expensePageText} expense`
        : 'expense';

      dispatch(
        setReviewPageAlert({
          title: '',
          description: `You successfully ${
            isEditMode ? 'updated your' : 'added a'
          } ${expenseTypeName}.`,
          type: 'success',
        }),
      );
    } catch (error) {
      // Set alert
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
    // navigate to review page for success and error
    navigate(`/file-new-claim/${apptId}/${claimId}/review`);
  };

  const handleBack = () => {
    if (isEditMode) {
      setIsCancelModalVisible(true);
    } else {
      // TODO: Add logic to determine where the user came from and direct them back to the correct location
      // navigate(`/file-new-claim/${apptId}/${claimId}/review`);
      navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
    }
  };

  const handleDocumentChange = async e => {
    setUploadError(''); // Clear any previous errors

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
      try {
        const file = files[0]; // Get the first (and only) file

        const base64File = await toBase64(file);

        // Change or add document
        setExpenseDocument(file);

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
      } catch (err) {
        setUploadError(
          'There was a problem processing your document. Please try again later.',
        );
      }
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

  const handleAmountInput = e => {
    handleFormChange(e); // update formState
    const { value } = e.target;
    validateRequestedAmount(
      value,
      setExtraFieldErrors,
      DATE_VALIDATION_TYPE.CHANGE,
      setFormState,
    );
  };

  const handleAmountBlur = e => {
    const { value } = e.target;

    validateRequestedAmount(
      value,
      setExtraFieldErrors,
      DATE_VALIDATION_TYPE.BLUR,
      setFormState,
    );
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

      <p>{pageDescription}</p>
      <DocumentUpload
        loading={isFetchingDocument}
        currentDocument={expenseDocument}
        handleDocumentChange={handleDocumentChange}
        uploadError={uploadError}
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
        onDateChange={e => {
          handleFormChange(e);
          validateReceiptDate(
            e.detail.target?.value,
            DATE_VALIDATION_TYPE.CHANGE,
            setExtraFieldErrors,
          );
        }}
        onDateBlur={e =>
          validateReceiptDate(
            e.detail.target?.value,
            DATE_VALIDATION_TYPE.BLUR,
            setExtraFieldErrors,
          )
        }
        {...extraFieldErrors.purchaseDate && {
          error: extraFieldErrors.purchaseDate,
        }}
      />

      <div className="currency-input-wrapper vads-u-margin-top--2">
        <span className="currency-symbol">$</span>
        <VaTextInput
          className="currency-input-field"
          label="Amount requested"
          name="costRequested"
          value={formState.costRequested || ''}
          required
          show-input-error
          inputmode="decimal"
          pattern="^[0-9]*(\.[0-9]{0,2})?$"
          onInput={handleAmountInput}
          onBlur={handleAmountBlur}
          hint="Enter the amount as dollars and cents. For example, 8.42"
          {...extraFieldErrors.costRequested && {
            error: extraFieldErrors.costRequested,
          }}
        />
      </div>
      <div className="vads-u-margin-top--2">
        <VaTextarea
          label="Description"
          name="description"
          value={formState.description || ''}
          required
          hint="5-2,000 characters allowed"
          onBlur={e =>
            validateDescription(
              e.target.value,
              setExtraFieldErrors,
              DATE_VALIDATION_TYPE.BLUR,
            )
          }
          onInput={handleFormChange}
          {...extraFieldErrors.description && {
            error: extraFieldErrors.description,
          }}
        />
      </div>
      {!isEditMode && (
        <VaButton
          secondary
          text="Cancel adding this expense"
          onClick={handleOpenCancelModal}
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
        visible={isCancelModalVisible}
        onCloseEvent={handleCloseCancelModal}
        onPrimaryButtonClick={handleConfirmCancel}
        onSecondaryButtonClick={handleCloseCancelModal}
        isEditMode={isEditMode}
      />
    </>
  );
};

export default ExpensePage;
