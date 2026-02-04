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
import useSetPageTitle from '../../../hooks/useSetPageTitle';
import useSetFocus from '../../../hooks/useSetFocus';
import DocumentUpload from './DocumentUpload';
import {
  EXPENSE_TYPES,
  EXPENSE_TYPE_KEYS,
  TRIP_TYPES,
} from '../../../constants';
import {
  createExpense,
  updateExpenseDeleteDocument,
  updateExpense,
  setUnsavedExpenseChanges,
  setReviewPageAlert,
  fetchExpenseSuccess,
  fetchExpenseFailure,
  fetchExpenseStart,
} from '../../../redux/actions';
import {
  selectExpenseUpdateLoadingState,
  selectExpenseCreationLoadingState,
  selectExpenseWithDocument,
  selectDocumentDeleteLoadingState,
  selectExpenseFetchLoadingState,
  selectExpenseBackDestination,
} from '../../../redux/selectors';
import {
  DATE_VALIDATION_TYPE,
  validateRequestedAmount,
  validateReceiptDate,
  validateDescription,
  validateAirTravelFields,
  validateCommonCarrierFields,
  validateLodgingFields,
  validateMealFields,
} from '../../../util/expense-validation-helpers';

import TravelPayButtonPair from '../../shared/TravelPayButtonPair';
import ExpenseMealFields from './ExpenseMealFields';
import ExpenseAirTravelFields from './ExpenseAirTravelFields';
import ExpenseLodgingFields from './ExpenseLodgingFields';
import ExpenseCommonCarrierFields from './ExpenseCommonCarrierFields';
import CancelExpenseModal from './CancelExpenseModal';

export const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Strip the data URL prefix to get just the base64 data
      const base64Data = reader.result?.split(',')[1] ?? '';
      resolve(base64Data);
    };
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
  const expenseWithDocument = useSelector(
    state => (isEditMode ? selectExpenseWithDocument(state, expenseId) : null),
  );
  const isUpdatingExpense = useSelector(selectExpenseUpdateLoadingState);
  const isCreatingExpense = useSelector(selectExpenseCreationLoadingState);
  const isDeletingDocument = useSelector(selectDocumentDeleteLoadingState);
  const isFetchingExpense = useSelector(
    state => (isEditMode ? selectExpenseFetchLoadingState(state) : false),
  );
  const backDestination = useSelector(selectExpenseBackDestination);

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
  const [extraFieldErrors, setExtraFieldErrors] = useState({});
  const [shouldScrollToError, setShouldScrollToError] = useState(false);

  // Derived state and memoized values
  const isLoadingExpense = isEditMode
    ? isUpdatingExpense || isDeletingDocument
    : isCreatingExpense;

  // Derive expense type from URL before effects (needed in useEffect dependencies)
  const concattedExpenseTypes = Object.values(EXPENSE_TYPE_KEYS)
    .map(key => EXPENSE_TYPES[key].route)
    .join('|');
  const expenseTypeMatch = new RegExp(`.*(${concattedExpenseTypes}).*`);

  const expenseTypeRoute = location.pathname.match(expenseTypeMatch)[1];

  const expenseType = Object.values(EXPENSE_TYPE_KEYS).find(
    key => EXPENSE_TYPES[key].route === expenseTypeRoute,
  );

  const expenseTypeFields = expenseType ? EXPENSE_TYPES[expenseType] : null;

  const isAirTravel = expenseType === EXPENSE_TYPE_KEYS.AIRTRAVEL;
  const isMeal = expenseType === EXPENSE_TYPE_KEYS.MEAL;
  const isCommonCarrier = expenseType === EXPENSE_TYPE_KEYS.COMMONCARRIER;
  const isLodging = expenseType === EXPENSE_TYPE_KEYS.LODGING;

  useSetFocus();

  // Effects
  // Effect 1: Reset loaded flag when expenseId changes
  useEffect(
    () => {
      hasLoadedExpenseRef.current = false;
    },
    [expenseId],
  );

  // Effect 2: In edit mode, fetch expense data from API and load document if present
  // This fetches the full expense with type-specific fields and then loads the document receipt
  useEffect(
    () => {
      if (!isEditMode || !expenseId || hasLoadedExpenseRef.current) {
        return undefined;
      }

      let isMounted = true;

      const loadExpenseAndDocument = async () => {
        try {
          // Step 1: Fetch the expense data
          dispatch(fetchExpenseStart(expenseId));
          const expenseConfig = EXPENSE_TYPES[expenseType];
          const expenseUrl = `${
            environment.API_URL
          }/travel_pay/v0/claims/${claimId}/expenses/${
            expenseConfig.apiRoute
          }/${expenseId}`;
          const expenseResponse = await apiRequest(expenseUrl);
          dispatch(fetchExpenseSuccess(expenseId));
          const fetchedExpense = expenseResponse.data || expenseResponse;

          if (!isMounted) return;

          // Step 2: Hydrate form with expense data
          const initialState = {
            ...fetchedExpense,
            purchaseDate: fetchedExpense.dateIncurred || '',
          };
          setFormState(initialState);
          setPreviousFormState(initialState);
          initialFormStateRef.current = initialState;

          // Step 3: Load document if it exists (use Redux state for document metadata)
          const documentId = expenseWithDocument?.documentId;
          const filename = expenseWithDocument?.receipt?.filename;

          if (documentId && filename) {
            setIsDocumentLoading(true);
            const documentUrl = `${
              environment.API_URL
            }/travel_pay/v0/claims/${claimId}/documents/${documentId}`;
            const documentResponse = await apiRequest(documentUrl);
            const contentType = documentResponse.headers.get('Content-Type');
            const contentLength = documentResponse.headers.get(
              'Content-Length',
            );
            const arrayBuffer = await documentResponse.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: contentType });
            const base64File = await toBase64(blob);

            const receipt = {
              contentType,
              length: contentLength,
              fileName: filename,
              fileData: base64File,
            };

            if (isMounted) {
              setFormState(prev => ({ ...prev, receipt }));
              setPreviousFormState(prev => ({ ...prev, receipt }));
              setExpenseDocument(
                new File([blob], filename, {
                  type: contentType,
                }),
              );
              setPreviousDocumentId(documentId);
            }
          }

          if (isMounted) {
            hasLoadedExpenseRef.current = true;
            dispatch(fetchExpenseSuccess(expenseId));
            setIsDocumentLoading(false);
          }
        } catch (err) {
          // Failed to fetch expense or document
          dispatch(fetchExpenseFailure(err?.toString() ?? '', expenseId));
        }
      };

      loadExpenseAndDocument();

      // Cleanup function to prevent state updates after unmount
      return () => {
        isMounted = false;
      };
    },
    [
      isEditMode,
      expenseId,
      expenseType,
      claimId,
      expenseWithDocument?.documentId,
      expenseWithDocument?.receipt?.filename,
      previousDocumentId,
      dispatch,
    ],
  );

  // Effect 3: Track unsaved changes by comparing current state to initial state
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

  // Effect 4: Scroll to first error after validation and DOM update
  // Using scrollToFirstError on its own fails to find the errors before they have rendered
  useEffect(
    () => {
      if (shouldScrollToError && Object.keys(extraFieldErrors).length > 0) {
        scrollToFirstError({ focusOnAlertRole: true });
        setShouldScrollToError(false);
      }
    },
    [shouldScrollToError, extraFieldErrors],
  );

  const handleFormChange = (event, explicitName) => {
    const name = explicitName ?? event.target?.name ?? event.detail?.name;

    // Extract value
    const value =
      event?.value ?? event?.detail?.value ?? event.target?.value ?? '';

    // Always update formState with the current value (including partial dates)
    // This ensures the field doesn't get cleared on re-render
    const newFormState = { ...formState, [name]: value };
    setFormState(newFormState);

    // For date fields, only run validation if we have a complete date
    const dateFields = [
      'purchaseDate',
      'departureDate',
      'returnDate',
      'checkInDate',
      'checkOutDate',
    ];
    const isDateField = dateFields.includes(name);
    const isCompleteDate = /^\d{4}-\d{2}-\d{2}$/.test(value);

    // Skip validation for partial dates, but still save them to formState
    if (isDateField && !isCompleteDate && value !== '') {
      return;
    }

    // On change: clear errors if field becomes valid, OR update error if field has existing error
    setExtraFieldErrors(prevErrors => {
      const nextErrors = { ...prevErrors };
      const hasExistingError = prevErrors[name];

      // Validate base fields
      if (name === 'purchaseDate') {
        const validationResult = validateReceiptDate(
          value,
          DATE_VALIDATION_TYPE.CHANGE,
        );
        if (validationResult.isValid) {
          delete nextErrors.purchaseDate;
        } else if (hasExistingError && validationResult.purchaseDate) {
          // Update error message if field already has an error
          nextErrors.purchaseDate = validationResult.purchaseDate;
        }
      }

      if (name === 'description') {
        const validationResult = validateDescription(
          value,
          DATE_VALIDATION_TYPE.CHANGE,
        );
        if (validationResult.isValid) {
          delete nextErrors.description;
        } else if (hasExistingError && validationResult.description) {
          nextErrors.description = validationResult.description;
        }
      }

      if (name === 'costRequested') {
        const validationResult = validateRequestedAmount(
          value,
          DATE_VALIDATION_TYPE.CHANGE,
        );
        if (validationResult.isValid) {
          delete nextErrors.costRequested;
        } else if (hasExistingError && validationResult.errors?.costRequested) {
          nextErrors.costRequested = validationResult.errors.costRequested;
        }
      }

      // Run type-specific validations - clear errors if valid, update if has existing error
      let fieldErrors = {};
      if (isAirTravel) {
        fieldErrors = validateAirTravelFields(newFormState, name);
      } else if (isCommonCarrier) {
        fieldErrors = validateCommonCarrierFields(newFormState, name);
      } else if (isLodging) {
        fieldErrors = validateLodgingFields(newFormState, name);
      } else if (isMeal) {
        fieldErrors = validateMealFields(newFormState, name);
      }

      // Clear errors if valid, or update if field already has an error
      Object.keys(fieldErrors).forEach(field => {
        if (fieldErrors[field] === null) {
          delete nextErrors[field];
        } else if (prevErrors[field] && fieldErrors[field]) {
          // Update error message if field already has an error
          nextErrors[field] = fieldErrors[field];
        }
      });

      return nextErrors;
    });
  };

  const handleFormBlur = (event, explicitName) => {
    const name = explicitName ?? event.target?.name ?? event.detail?.name;

    // For date fields, use value from formState instead of event
    const dateFields = [
      'purchaseDate',
      'departureDate',
      'returnDate',
      'checkInDate',
      'checkOutDate',
    ];
    const value = dateFields.includes(name)
      ? formState[name] || ''
      : event?.value ?? event?.detail?.value ?? event.target?.value ?? '';

    // Only validate on blur if the field has a value
    if (!value) {
      return;
    }

    // Run validation on blur - always update errors
    setExtraFieldErrors(prevErrors => {
      const nextErrors = { ...prevErrors };

      // Validate base fields
      if (name === 'purchaseDate') {
        const validationResult = validateReceiptDate(
          value,
          DATE_VALIDATION_TYPE.BLUR,
        );
        if (validationResult.purchaseDate) {
          nextErrors.purchaseDate = validationResult.purchaseDate;
        } else {
          delete nextErrors.purchaseDate;
        }
      }

      if (name === 'description') {
        const validationResult = validateDescription(
          value,
          DATE_VALIDATION_TYPE.BLUR,
        );
        if (validationResult.description) {
          nextErrors.description = validationResult.description;
        } else {
          delete nextErrors.description;
        }
      }

      if (name === 'costRequested') {
        const validationResult = validateRequestedAmount(
          value,
          DATE_VALIDATION_TYPE.BLUR,
        );
        if (validationResult.errors?.costRequested) {
          nextErrors.costRequested = validationResult.errors.costRequested;
        } else {
          delete nextErrors.costRequested;
        }
      }

      // Run type-specific validations - always update errors on blur
      let fieldErrors = {};
      if (isAirTravel) {
        fieldErrors = validateAirTravelFields(formState, name);
      } else if (isCommonCarrier) {
        fieldErrors = validateCommonCarrierFields(formState, name);
      } else if (isLodging) {
        fieldErrors = validateLodgingFields(formState, name);
      } else if (isMeal) {
        fieldErrors = validateMealFields(formState, name);
      }

      // Update errors from validators
      Object.keys(fieldErrors).forEach(field => {
        if (fieldErrors[field]) {
          nextErrors[field] = fieldErrors[field];
        } else {
          delete nextErrors[field];
        }
      });

      return nextErrors;
    });
  };

  const handleOpenCancelModal = () => setIsCancelModalVisible(true);
  const handleCloseCancelModal = () => setIsCancelModalVisible(false);
  const handleConfirmCancel = () => {
    handleCloseCancelModal();
    // Clear unsaved changes when canceling
    dispatch(setUnsavedExpenseChanges(false));
    if (isEditMode || backDestination === 'review') {
      navigate(`/file-new-claim/${apptId}/${claimId}/review`);
    } else {
      navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
    }
  };

  // Validation
  //
  // Field names must match those expected by the expenses_controller in vets-api.
  // The controller converts them to forwards them unchanged to the API.
  const REQUIRED_FIELDS = {
    [EXPENSE_TYPE_KEYS.MEAL]: ['vendorName'],
    [EXPENSE_TYPE_KEYS.LODGING]: ['vendor', 'checkInDate', 'checkOutDate'],
    [EXPENSE_TYPE_KEYS.COMMONCARRIER]: ['carrierType', 'reasonNotUsingPOV'],
    [EXPENSE_TYPE_KEYS.AIRTRAVEL]: [
      'vendorName',
      'tripType',
      'departureDate',
      'departedFrom',
      'arrivedTo',
    ],
  };

  const getRequiredFieldsForPage = () => {
    const base = ['purchaseDate', 'costRequested', 'receipt', 'description'];
    const extra = REQUIRED_FIELDS[expenseType] || [];

    let requiredFields = [...base, ...extra];

    // 🔹 Conditional Air Travel rule
    if (
      isAirTravel &&
      formState.tripType === TRIP_TYPES.ROUND_TRIP.value &&
      !requiredFields.includes('returnDate')
    ) {
      requiredFields = [...requiredFields, 'returnDate'];
    }

    return requiredFields;
  };

  const validatePage = () => {
    // Field names must match those expected by the expenses_controller in vets-api.
    const requiredFields = getRequiredFieldsForPage();

    const emptyFields = requiredFields.filter(field => !formState[field]);

    const errors = {};

    // Receipt validation
    const existingReceiptError = extraFieldErrors.receipt;
    // If no receipt exists AND no prior error exists, set error
    if (!formState.receipt && !existingReceiptError) {
      errors.receipt = 'Select an approved file type under 5MB';
    }

    // Type-specific validations (pass null to validate all fields)
    let fieldErrors = {};
    if (isCommonCarrier) {
      fieldErrors = validateCommonCarrierFields(formState, null);
    } else if (isAirTravel) {
      fieldErrors = validateAirTravelFields(formState, null);
    } else if (isLodging) {
      fieldErrors = validateLodgingFields(formState, null);
    } else if (isMeal) {
      fieldErrors = validateMealFields(formState, null);
    }

    // Add field errors to errors object (only non-null values)
    Object.keys(fieldErrors).forEach(field => {
      if (fieldErrors[field]) {
        errors[field] = fieldErrors[field];
      }
    });

    const dateValidation = validateReceiptDate(
      formState.purchaseDate,
      DATE_VALIDATION_TYPE.SUBMIT,
    );

    const descriptionValidation = validateDescription(
      formState.description,
      DATE_VALIDATION_TYPE.SUBMIT,
    );

    const amountValidation = validateRequestedAmount(
      formState.costRequested,
      DATE_VALIDATION_TYPE.SUBMIT,
    );

    // Merge all validation results into errors
    const finalErrors = {
      ...errors,
      ...(dateValidation.purchaseDate && {
        purchaseDate: dateValidation.purchaseDate,
      }),
      ...(descriptionValidation.description && {
        description: descriptionValidation.description,
      }),
      ...amountValidation.errors,
      ...(existingReceiptError && { receipt: existingReceiptError }),
    };

    setExtraFieldErrors(finalErrors);

    const hasBlockingErrors = Object.values(errors).some(Boolean);

    return (
      emptyFields.length === 0 &&
      dateValidation.isValid &&
      descriptionValidation.isValid &&
      amountValidation.isValid &&
      !hasBlockingErrors
    );
  };

  const isFormChanged =
    JSON.stringify(previousFormState) !== JSON.stringify(formState);

  // Handlers
  const handleContinue = async () => {
    const isValid = validatePage();

    if (!isValid) {
      setShouldScrollToError(true);
      return;
    }
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

      // Determine correct article (a vs an) based on first letter
      const startsWithVowel = /^[aeiou]/i.test(expenseTypeName);
      const article = startsWithVowel ? 'an' : 'a';

      dispatch(
        setReviewPageAlert({
          title: '',
          description: `You successfully ${
            isEditMode ? 'updated your' : `added ${article}`
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
      navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
    }
  };

  const handleFileInputError = e => {
    const { detail } = e;

    if (detail?.error) {
      setExtraFieldErrors(prev => ({
        ...prev,
        receipt: detail.error,
      }));
    }
  };

  const handleDocumentChange = async e => {
    const files = e.detail?.files;

    // User removed the file
    if (!files || files.length === 0) {
      if (expenseDocument) {
        setExpenseDocument(null);

        setFormState(prev => {
          const updated = { ...prev };
          delete updated.receipt;
          return updated;
        });
      }

      // Clear receipt-related errors when file is removed
      setExtraFieldErrors(prev => {
        const next = { ...prev };
        delete next.receipt;
        return next;
      });

      return;
    }

    try {
      const file = files[0];
      const base64File = await toBase64(file);

      // Update document state
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

      // Clear receipt errors ONLY after successful processing
      setExtraFieldErrors(prev => {
        const updated = { ...prev };
        delete updated.receipt; // remove the key safely
        return updated;
      });
    } catch (err) {
      // Treat processing errors like validation errors
      setExtraFieldErrors(prev => ({
        ...prev,
        receipt:
          'There was a problem processing your document. Please try again later.',
      }));
    }
  };

  const pageDescription = isAirTravel
    ? `Upload a receipt or proof of the expense here. If you’re adding a round-trip flight, you only need to add 1 expense. If you have receipts for 2 one-way flights, you’ll need to add 2 separate expenses.`
    : `Upload a receipt or proof of the expense here. If you have multiple ${
        expenseTypeFields.expensePageText
      } expenses, add just 1 on this page. You’ll be able to add more expenses after this.`;

  const dateHintText = isLodging
    ? `Enter the date on your receipt, even if it’s the same as your check in or check out dates.`
    : '';

  const handleAmountBlur = e => {
    const { value } = e.target;

    const validationResult = validateRequestedAmount(
      value,
      DATE_VALIDATION_TYPE.BLUR,
    );

    // Update errors
    setExtraFieldErrors(prev => ({
      ...prev,
      ...validationResult.errors,
    }));

    // Update formatted value if provided
    if (validationResult.formattedValue) {
      setFormState(prev => ({
        ...prev,
        costRequested: validationResult.formattedValue,
      }));
    }
  };

  const pageTitle = expenseTypeFields?.expensePageText
    ? `${expenseTypeFields.expensePageText
        .charAt(0)
        .toUpperCase()}${expenseTypeFields.expensePageText.slice(1)} expense`
    : 'Unknown expense';

  useSetPageTitle(pageTitle);

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
      {isFetchingDocument ||
      isFetchingExpense ||
      (isEditMode && !hasLoadedExpenseRef.current) ? (
        <va-loading-indicator message="Loading expense details..." set-focus />
      ) : (
        <>
          <DocumentUpload
            currentDocument={expenseDocument}
            handleDocumentChange={handleDocumentChange}
            error={extraFieldErrors.receipt}
            onVaFileInputError={handleFileInputError}
          />
          {isMeal && (
            <ExpenseMealFields
              formState={formState}
              onChange={handleFormChange}
              onBlur={handleFormBlur}
              errors={extraFieldErrors}
            />
          )}
          {isLodging && (
            <ExpenseLodgingFields
              formState={formState}
              onChange={handleFormChange}
              onBlur={handleFormBlur}
              errors={extraFieldErrors}
            />
          )}
          {isCommonCarrier && (
            <ExpenseCommonCarrierFields
              formState={formState}
              onChange={handleFormChange}
              errors={extraFieldErrors}
            />
          )}
          {isAirTravel && (
            <ExpenseAirTravelFields
              formState={formState}
              onChange={handleFormChange}
              onBlur={handleFormBlur}
              errors={extraFieldErrors}
            />
          )}
          <VaDate
            label="Date on receipt"
            name="purchaseDate"
            value={formState.purchaseDate || ''}
            required
            hint={dateHintText}
            onDateChange={handleFormChange}
            onDateBlur={handleFormBlur}
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
              onInput={handleFormChange}
              onBlur={handleAmountBlur}
              hint="Enter the amount as dollars and cents (for example, 8.42)"
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
              onBlur={e => {
                const validationResult = validateDescription(
                  e.target.value,
                  DATE_VALIDATION_TYPE.BLUR,
                );
                setExtraFieldErrors(prev => ({
                  ...prev,
                  description: validationResult.description,
                }));
              }}
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
      )}
    </>
  );
};

export default ExpensePage;
