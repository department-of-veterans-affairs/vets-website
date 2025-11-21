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
  const hasLoadedDocumentRef = useRef(false);

  const { apptId, claimId, expenseId } = useParams();

  const location = useLocation();
  const skipHydration = location.state?.skipHydration;
  console.log({ skipHydration });
  console.log({ location });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showError, setShowError] = useState(false);
  const [document, setDocument] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [previousDocumentId, setPreviousDocumentId] = useState(null);

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

  const [formState, setFormState] = useState(initialFormState);
  const [previousFormState, setPreviousFormState] = useState(initialFormState);

  const filename = expense?.receipt?.filename;

  // useEffect(
  //   () => {
  //     // --- 1. Bail out early if required data isn't ready
  //     console.log('test', hasLoadedDocumentRef.current);
  //     if (!expenseId || !expense) return;
  //     console.log('test2', hasLoadedExpenseRef.current);

  //     if (skipHydration) {
  //       navigate(location.pathname, { replace: true, state: {} });
  //       return;
  //     }
  //     // --- 2. Hydrate form state ONCE per expense (initial load)
  //     if (!hasLoadedExpenseRef.current) {
  //       console.log('test3');

  //       const hydratedForm = {
  //         ...expense,
  //         purchaseDate: expense.dateIncurred || '',
  //       };

  //       setFormState(hydratedForm);
  //       setPreviousFormState(hydratedForm);
  //       hasLoadedExpenseRef.current = true;
  //     }

  //     // --- 3. Load existing document if present
  //     if (expense.documentId && !hasLoadedDocumentRef.current) {
  //       hasLoadedDocumentRef.current = true; // avoid double-fetch
  //       setPreviousDocumentId(expense.documentId);
  //       setDocumentLoading(true);

  //       const documentUrl = `${
  //         environment.API_URL
  //       }/travel_pay/v0/claims/${claimId}/documents/${expense.documentId}`;

  //       apiRequest(documentUrl)
  //         .then(response => {
  //           const contentType = response.headers.get('Content-Type');
  //           const contentLength = response.headers.get('Content-Length');

  //           return response.arrayBuffer().then(arrayBuffer => {
  //             const blob = new Blob([arrayBuffer], { type: contentType });

  //             return toBase64(blob).then(base64File => {
  //               const updatedForm = prev => ({
  //                 ...prev,
  //                 receipt: {
  //                   contentType,
  //                   length: contentLength,
  //                   fileName: filename,
  //                   fileData: base64File,
  //                 },
  //               });

  //               setFormState(updatedForm);
  //               setPreviousFormState(updatedForm);

  //               const file = new File([blob], filename, { type: contentType });
  //               setDocument(file);

  //               setDocumentLoading(false);
  //             });
  //           });
  //         })
  //         .catch(err => {
  //           console.error('Failed to fetch document:', err);
  //           setDocumentLoading(false);
  //         });
  //     }
  //   },
  //   [
  //     expenseId,
  //     expense,
  //     claimId,
  //     filename,
  //     skipHydration,
  //     location.pathname,
  //     navigate,
  //   ],
  // );

  useEffect(
    () => {
      if (!expenseId || !expense?.documentId || skipHydration) return;
      console.log('test');
      console.log({ skipHydration });

      if (!filename) return;

      const loadDocument = async () => {
        setDocumentLoading(true);
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

          const updatedForm = prev => ({
            ...prev,
            receipt: {
              contentType,
              length: contentLength,
              fileName: filename,
              fileData: base64File,
            },
          });

          setFormState(updatedForm);
          setPreviousFormState(updatedForm);
          setDocument(new File([blob], filename, { type: contentType }));
          setPreviousDocumentId(expense.documentId);
        } catch (err) {
          console.error('Failed to fetch document:', err);
        } finally {
          setDocumentLoading(false);
        }
      };

      loadDocument();
    },
    [expenseId, expense?.documentId, claimId, filename, skipHydration],
  );

  const expenseTypeMatcher = new RegExp(
    `.*(${Object.values(EXPENSE_TYPE_KEYS)
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

    console.log({ formState });
    console.log({ previousFormState });
    console.log({ previousDocumentId });
    console.log({ isFormChanged });
    console.log(
      `in continue hasLoadedExpenseRef.current`,
      hasLoadedExpenseRef.current,
    );

    try {
      if (expenseId) {
        // Check if form fields changed
        if (isFormChanged) {
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
            console.log('updateExpense');
            console.log('deleteDocument');
          } else {
            // Remove document from the formState so we dont re-add it
            delete formState.receipt;
            // UpdateExpense
            await dispatch(
              updateExpense(
                claimId,
                expenseConfig.apiRoute,
                expenseId,
                formState,
              ),
            );
          }
        }
      } else {
        await dispatch(
          createExpense(claimId, expenseConfig.apiRoute, formState),
        );
      }
      // navigate(`/file-new-claim/${apptId}/${claimId}/review`);
      navigate(`/file-new-claim/${apptId}/${claimId}/review`, {
        state: { skipHydration: true },
      });
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

  const handleDocumentChange = async e => {
    const files = e.detail?.files;
    // Check if we have files for upload
    if (!files || files.length === 0) {
      // If document exists but no files then user deleted the previous document
      if (document) {
        setDocument(null);
        // delete formState.receipt;
        setFormState(prev => {
          const copy = { ...prev };
          delete copy.receipt;
          return copy;
        });
      }
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
        loading={documentLoading}
        currentDocument={document}
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
