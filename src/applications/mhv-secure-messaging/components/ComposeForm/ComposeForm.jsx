import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { validateNameSymbols } from 'platform/forms-system/src/js/web-component-patterns/fullNamePattern';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { renderMHVDowntime } from '@department-of-veterans-affairs/mhv/exports';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import FileInput from './FileInput';
import CategoryInput from './CategoryInput';
import LockedCategoryDisplay from './LockedCategoryDisplay';
import AttachmentsList from '../AttachmentsList';
import { saveDraft } from '../../actions/draftDetails';
import DraftSavedInfo from './DraftSavedInfo';
import useDebounce from '../../hooks/use-debounce';
import {
  messageSignatureFormatter,
  setCaretToPos,
  navigateToFolderByFolderId,
  dateFormat,
  buildRxRenewalMessageBody,
  scrollToTop,
} from '../../util/helpers';
import { sendMessage } from '../../actions/messages';
import { focusOnErrorField } from '../../util/formHelpers';
import RouteLeavingGuard from '../shared/RouteLeavingGuard';
import {
  draftAutoSaveTimeout,
  DefaultFolders,
  ErrorMessages,
  Recipients,
  ParentComponent,
  RecipientStatus,
  BlockedTriageAlertStyles,
  FormLabels,
  downtimeNotificationParams,
  Alerts,
  MessageHintText,
} from '../../util/constants';
import EmergencyNote from '../EmergencyNote';
import ComposeFormActionButtons from './ComposeFormActionButtons';
import BlockedTriageGroupAlert from '../shared/BlockedTriageGroupAlert';
import ViewOnlyDraftSection from './ViewOnlyDraftSection';
import { Categories } from '../../util/inputContants';
import { getCategories } from '../../actions/categories';
import ElectronicSignature from './ElectronicSignature';
import RecipientsSelect from './RecipientsSelect';
import EditSignatureLink from './EditSignatureLink';
import useFeatureToggles from '../../hooks/useFeatureToggles';
import {
  clearDraftInProgress,
  updateDraftInProgress,
} from '../../actions/threadDetails';
import SelectedRecipientTitle from './SelectedRecipientTitle';
import AddYourMedicationInfoWarning from './AddYourMedicationInfoWarning';
import useNavigationError from '../../hooks/useNavigationError';

const ComposeForm = props => {
  const { pageTitle, draft, recipients, signature, alertSlot } = props;
  const {
    noAssociations,
    allTriageGroupsBlocked,
    allowedRecipients,
  } = recipients;
  const dispatch = useDispatch();
  const history = useHistory();
  const headerRef = useRef();

  const { draftInProgress } = useSelector(state => state.sm.threadDetails);
  const { prescription } = useSelector(state => state.sm);
  const {
    renewalPrescription,
    rxError = prescription.error,
    redirectPath,
  } = prescription;
  const renewalPrescriptionIsLoading = useSelector(
    state => state.sm.prescription.isLoading,
  );
  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);
  const {
    largeAttachmentsEnabled,
    cernerPilotSmFeatureFlag,
    mhvSecureMessagingCuratedListFlow,
  } = useFeatureToggles();

  const [recipientsList, setRecipientsList] = useState(allowedRecipients);
  const [selectedRecipientId, setSelectedRecipientId] = useState(
    draftInProgress?.recipientId || null,
  );
  const [isSignatureRequired, setIsSignatureRequired] = useState(null);
  const [checkboxMarked, setCheckboxMarked] = useState(false);
  const [attachFileError, setAttachFileError] = useState(null);
  const [formPopulated, setFormPopulated] = useState(false);
  const [sendMessageFlag, setSendMessageFlag] = useState(false);
  const [isAutoSave, setIsAutoSave] = useState(true);
  const initialTextareaValueRef = useRef(
    draftInProgress?.body?.length ? draftInProgress.body : undefined,
  );
  const prefillClearedReportedRef = useRef(false);
  const prefillEditedReportedRef = useRef(false);

  const recipientExists = useCallback(
    recipientId => {
      return recipientsList.findIndex(item => +item.id === +recipientId) > -1;
    },
    [recipientsList],
  );

  const ohTriageGroup = useCallback(
    recipientId => {
      return (
        recipients?.allowedRecipients.find(r => +r.id === +recipientId)
          ?.ohTriageGroup || false
      );
    },
    [recipients?.allowedRecipients],
  );

  const useLargeAttachments = useMemo(
    () => {
      return (
        largeAttachmentsEnabled || (cernerPilotSmFeatureFlag && ohTriageGroup)
      );
    },
    [largeAttachmentsEnabled, cernerPilotSmFeatureFlag, ohTriageGroup],
  );

  const isRxRenewalDraft = useMemo(
    () => renewalPrescription?.prescriptionId || rxError,
    [renewalPrescription, rxError],
  );

  const navigateToRxCallback = useCallback(
    () => {
      if (redirectPath) {
        window.location.replace(redirectPath);
      }
    },
    [redirectPath],
  );

  useEffect(
    () => {
      if (isRxRenewalDraft) {
        const messageSubject = 'Renewal Needed';
        const messageBody = buildRxRenewalMessageBody(
          renewalPrescription,
          rxError,
        );

        dispatch(
          updateDraftInProgress({
            body: messageBody,
            subject: messageSubject,
            category: Categories.MEDICATIONS.value,
          }),
        );

        recordEvent({ event: 'sm_editor_prefill_loaded' });
      }
    },
    [renewalPrescription, isRxRenewalDraft, rxError, dispatch],
  );

  useEffect(
    () => {
      // Consider draftInProgress "empty" if it has no recipientId
      const isDraftInProgressEmpty =
        !draftInProgress ||
        Object.keys(draftInProgress).length === 0 ||
        (!draftInProgress.careSystemVhaId &&
          !draftInProgress.careSystemName &&
          !draftInProgress.recipientId &&
          !draftInProgress.recipientName);

      if (isDraftInProgressEmpty && draft && !sendMessageFlag) {
        const careTeam =
          recipients?.allowedRecipients?.find(
            team => draft?.recipientId === team.id,
          ) || null;
        const careSystem = ehrDataByVhaId[(careTeam?.stationNumber)] || null;

        if (recipientExists(draft?.recipientId)) {
          dispatch(
            updateDraftInProgress({
              careSystemVhaId:
                draftInProgress?.careSystemVhaId || careSystem?.vhaId,
              careSystemName:
                draftInProgress?.careSystemName || careSystem?.vamcSystemName,
              recipientId: draftInProgress?.recipientId || draft.recipientId,
              recipientName:
                draftInProgress?.recipientName ||
                draft.suggestedNameDisplay ||
                draft.recipientName,
              ohTriageGroup: ohTriageGroup(draft.recipientId),
              category: draftInProgress?.category || draft.category,
              subject: draftInProgress?.subject || draft.subject,
              body: draftInProgress?.body || draft.body,
              messageId: draftInProgress?.messageId || draft.messageId,
            }),
          );
        } else {
          dispatch(
            updateDraftInProgress({
              careSystemVhaId: null,
              careSystemName: null,
              recipientId: null,
              recipientName: null,
              category: draftInProgress?.category || draft.category,
              subject: draftInProgress?.subject || draft.subject,
              body: draftInProgress?.body || draft.body,
              messageId: draftInProgress.messageId || draft.messageId,
            }),
          );
        }
      }
    },
    [
      draft,
      dispatch,
      ehrDataByVhaId,
      recipients?.allowedRecipients,
      recipientExists,
      ohTriageGroup,
      draftInProgress,
      sendMessageFlag,
    ],
  );

  useEffect(
    () => {
      if (selectedRecipientId) {
        setIsSignatureRequired(
          allowedRecipients.some(
            r => +r.id === +selectedRecipientId && r.signatureRequired,
          ) || false,
        );
      }
    },
    [selectedRecipientId, allowedRecipients],
  );
  const [category, setCategory] = useState(draftInProgress?.category || null);
  const [categoryError, setCategoryError] = useState('');
  const [bodyError, setBodyError] = useState(null);
  const [recipientError, setRecipientError] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [signatureError, setSignatureError] = useState('');
  const [checkboxError, setCheckboxError] = useState('');
  const [subject, setSubject] = useState(draftInProgress?.subject || '');
  const [messageBody, setMessageBody] = useState(draftInProgress?.body || '');
  const [electronicSignature, setElectronicSignature] = useState('');
  const [attachments, setAttachments] = useState([]);
  const attachmentsRef = useRef(attachments);
  const [fieldsString, setFieldsString] = useState('');
  const [messageInvalid, setMessageInvalid] = useState(false);
  const navigationError = draftInProgress?.navigationError;
  const setNavigationError = useCallback(
    error => {
      dispatch(updateDraftInProgress({ navigationError: error }));
    },
    [dispatch],
  );
  const setSaveError = useCallback(
    error => {
      dispatch(updateDraftInProgress({ saveError: error }));
    },
    [dispatch],
  );
  const [lastFocusableElement, setLastFocusableElement] = useState(null);
  const navigationErrorModalVisible =
    draftInProgress?.navigationErrorModalVisible;
  const [attachFileSuccess, setAttachFileSuccess] = useState(false);
  const savedDraft = draftInProgress?.savedDraft;
  const setSavedDraft = useCallback(
    value => {
      dispatch(updateDraftInProgress({ savedDraft: value }));
    },
    [dispatch],
  );
  const [currentRecipient, setCurrentRecipient] = useState(null);
  const [comboBoxInputValue, setComboBoxInputValue] = useState('');

  const { isSaving } = useSelector(state => state.sm.threadDetails);
  const categories = useSelector(state => state.sm.categories?.categories);
  const alertStatus = useSelector(state => state.sm.alerts?.alertFocusOut);
  const currentFolder = useSelector(state => state.sm.folders?.folder);
  const debouncedSubject = useDebounce(subject, draftAutoSaveTimeout);
  const debouncedMessageBody = useDebounce(messageBody, draftAutoSaveTimeout);
  const debouncedCategory = useDebounce(category, draftAutoSaveTimeout);
  const debouncedRecipient = useDebounce(
    selectedRecipientId,
    draftAutoSaveTimeout,
  );
  const alertsList = useSelector(state => state.sm.alerts.alertList);

  useEffect(
    () => {
      if (
        initialTextareaValueRef.current === undefined &&
        messageBody &&
        messageBody.length > 0
      ) {
        initialTextareaValueRef.current = messageBody;
      }
    },
    [messageBody],
  );

  const formattedSignature = useMemo(
    () => {
      return messageSignatureFormatter(signature);
    },
    [signature],
  );

  useEffect(
    () => {
      if (
        initialTextareaValueRef.current === undefined &&
        !messageBody &&
        formattedSignature
      ) {
        initialTextareaValueRef.current = formattedSignature;
      }
    },
    [formattedSignature, messageBody],
  );

  const validMessageType = {
    SAVE: 'save',
    SEND: 'send',
  };

  const attachmentScanError = useMemo(
    () =>
      alertsList.filter(
        alert =>
          alert.content === Alerts.Message.ATTACHMENT_SCAN_FAIL &&
          alert.isActive,
      ).length > 0,
    [alertsList],
  );

  useEffect(
    () => {
      attachmentsRef.current = attachments;
    },
    [attachments],
  );

  useEffect(
    () => {
      if (!categories) {
        dispatch(getCategories());
      }
    },
    [categories, dispatch],
  );

  const setUnsavedNavigationError = useCallback(
    typeOfError => {
      if (typeOfError === null) {
        setNavigationError(null);
      }
      if (
        typeOfError ===
        ErrorMessages.Navigation.UNABLE_TO_SAVE_DRAFT_ATTACHMENT_ERROR
      ) {
        setNavigationError({
          ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT,
          p1: '',
        });
      }
      if (typeOfError === ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR) {
        setNavigationError({
          ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE,
        });
      }
      if (typeOfError === ErrorMessages.Navigation.CONT_SAVING_DRAFT_ERROR) {
        setNavigationError({
          ...ErrorMessages.ComposeForm.CONT_SAVING_DRAFT,
        });
      }
      if (
        typeOfError === ErrorMessages.Navigation.CONT_SAVING_DRAFT_CHANGES_ERROR
      ) {
        setNavigationError({
          ...ErrorMessages.ComposeForm.CONT_SAVING_DRAFT_CHANGES,
        });
      }
      if (
        typeOfError ===
        ErrorMessages.Navigation.UNABLE_TO_SAVE_DRAFT_SIGNATURE_ERROR
      ) {
        setNavigationError({
          ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_SIGNATURE,
        });
      }
    },
    [setNavigationError],
  );

  const renderCategorySection = useMemo(
    () => {
      if (noAssociations || allTriageGroupsBlocked) {
        return (
          <ViewOnlyDraftSection
            title={FormLabels.CATEGORY}
            body={`${Categories[(draft?.category)].label}: ${
              Categories[(draft?.category)].description
            }`}
          />
        );
      }
      if (isRxRenewalDraft) {
        return <LockedCategoryDisplay />;
      }
      return (
        <CategoryInput
          categories={categories}
          category={category}
          categoryError={categoryError}
          setCategory={setCategory}
          setCategoryError={setCategoryError}
          setUnsavedNavigationError={setUnsavedNavigationError}
          setNavigationError={setNavigationError}
        />
      );
    },
    [
      noAssociations,
      allTriageGroupsBlocked,
      isRxRenewalDraft,
      draft?.category,
      categories,
      category,
      categoryError,
      setUnsavedNavigationError,
      setNavigationError,
    ],
  );

  useEffect(
    () => {
      if (allowedRecipients?.length > 0) {
        setRecipientsList([...allowedRecipients]);
      }
    },
    [allowedRecipients],
  );

  useEffect(
    () => {
      if (draft) {
        const tempRecipient = {
          recipientId: draft.recipientId,
          name: draft.triageGroupName,
          type: Recipients.CARE_TEAM,
          status: RecipientStatus.ALLOWED,
        };

        setCurrentRecipient(tempRecipient);
      }
      // The Blocked Triage Group alert should stay visible until the draft is sent or user navigates away
    },
    [draft],
  );

  const send = useCallback(
    async () => {
      setSendMessageFlag(true);
      if (isSaving !== true) {
        scrollToTop();
        const today = dateFormat(new Date(), 'YYYY-MM-DD');
        const messageData = {
          category: draftInProgress.category,
          body: `${draftInProgress.body} ${
            electronicSignature
              ? `\n\n--------------------------------------------------\n\n${electronicSignature}\nSigned electronically on ${today}.`
              : ''
          }`,
          subject: draftInProgress.subject,
        };
        messageData[`${'draft_id'}`] = draft?.messageId;
        messageData[`${'recipient_id'}`] = draftInProgress.recipientId;

        let sendData;
        if (attachmentsRef.current.length > 0) {
          sendData = new FormData();
          sendData.append('message', JSON.stringify(messageData));
          attachmentsRef.current.forEach(upload =>
            sendData.append('uploads[]', upload),
          );
        } else {
          sendData = JSON.stringify(messageData);
        }

        try {
          setIsAutoSave(false);
          await dispatch(
            sendMessage(
              sendData,
              attachmentsRef.current.length > 0,
              draftInProgress.ohTriageGroup,
              !!redirectPath, // suppress alert when redirectPath exists
            ),
          );
          dispatch(clearDraftInProgress());
          setTimeout(() => {
            if (redirectPath) {
              navigateToRxCallback();
            } else {
              navigateToFolderByFolderId(
                currentFolder?.folderId || DefaultFolders.INBOX.id,
                history,
              );
            }
          }, 1000);
          // Timeout necessary for UCD requested 1 second delay
        } catch (err) {
          setSendMessageFlag(false);
          scrollToTop();
          setIsAutoSave(true);
        }
      }
    },
    [
      currentFolder?.folderId,
      dispatch,
      draft?.messageId,
      draftInProgress.body,
      draftInProgress.category,
      draftInProgress.ohTriageGroup,
      draftInProgress.recipientId,
      draftInProgress.subject,
      electronicSignature,
      history,
      isSaving,
      navigateToRxCallback,
      redirectPath,
    ],
  );

  useEffect(() => {
    if (headerRef.current) {
      focusElement(headerRef.current);
    }
  }, []);

  useEffect(
    () => {
      if (messageInvalid) {
        focusOnErrorField();
      }
    },
    [messageInvalid],
  );

  useEffect(
    () => {
      if (alertStatus) {
        focusElement(lastFocusableElement);
      }
    },
    [alertStatus, lastFocusableElement],
  );

  //  Populates form fields with recipients and categories
  const populateForm = useCallback(
    () => {
      if (recipientExists(draftInProgress?.recipientId)) {
        setSelectedRecipientId(draftInProgress.recipientId);
      }
      setCategory(draftInProgress?.category ?? draft.category);
      setSubject(draftInProgress?.subject ?? draft.subject);
      setMessageBody(draftInProgress?.body ?? draft.body);

      if (draft?.attachments) {
        setAttachments(draft.attachments);
      }
      setFormPopulated(true);
      setFieldsString(
        JSON.stringify({
          rec: draftInProgress.recipientId,
          cat: draftInProgress.category,
          sub: draftInProgress.subject,
          bod: draftInProgress.body,
        }),
      );
    },
    [recipientExists, draftInProgress, draft],
  );

  useEffect(
    () => {
      if (
        draftInProgress?.category &&
        draftInProgress?.subject &&
        draftInProgress?.body &&
        !formPopulated
      )
        populateForm();
    },
    [draftInProgress, formPopulated, populateForm],
  );

  const checkMessageValidity = useCallback(
    checkValidType => {
      let messageValid = true;
      let signatureValid = true;
      let checkboxValid = true;

      if (
        selectedRecipientId === '0' ||
        selectedRecipientId === '' ||
        !selectedRecipientId
      ) {
        if (mhvSecureMessagingCuratedListFlow) {
          if (comboBoxInputValue === '') {
            setRecipientError(ErrorMessages.ComposeForm.RECIPIENT_REQUIRED);
          } else {
            setRecipientError(
              ErrorMessages.ComposeForm.VALID_RECIPIENT_REQUIRED,
            );
          }
        } else {
          setRecipientError(ErrorMessages.ComposeForm.RECIPIENT_REQUIRED);
        }
        messageValid = false;
      }
      if (!subject || subject === '') {
        setSubjectError(ErrorMessages.ComposeForm.SUBJECT_REQUIRED);
        messageValid = false;
      }
      if (messageBody === '' || messageBody.match(/^[\s]+$/)) {
        setBodyError(ErrorMessages.ComposeForm.BODY_REQUIRED);
        messageValid = false;
      }
      if (!category || category === '') {
        setCategoryError(ErrorMessages.ComposeForm.CATEGORY_REQUIRED);
        messageValid = false;
      }
      if (
        checkValidType === validMessageType.SEND &&
        isSignatureRequired &&
        !electronicSignature
      ) {
        setSignatureError(ErrorMessages.ComposeForm.SIGNATURE_REQUIRED);
        signatureValid = false;
      }
      if (
        checkValidType === validMessageType.SEND &&
        isSignatureRequired &&
        !checkboxMarked
      ) {
        setCheckboxError(ErrorMessages.ComposeForm.CHECKBOX_REQUIRED);
        checkboxValid = false;
      }

      setMessageInvalid(!messageValid);
      return { messageValid, signatureValid, checkboxValid };
    },
    [
      selectedRecipientId,
      subject,
      messageBody,
      category,
      validMessageType.SEND,
      isSignatureRequired,
      electronicSignature,
      checkboxMarked,
      comboBoxInputValue,
      mhvSecureMessagingCuratedListFlow,
    ],
  );

  const constructFormData = useCallback(
    () => {
      return {
        recipientId: draftInProgress.recipientId,
        category: draftInProgress.category,
        subject: draftInProgress.subject,
        body: draftInProgress.body,
      };
    },
    [draftInProgress],
  );

  const saveDraftHandler = useCallback(
    async (type, e) => {
      const {
        messageValid,
        signatureValid,
        checkboxValid,
      } = checkMessageValidity(validMessageType.SAVE);

      if (type === 'manual') {
        recordEvent({
          event: 'cta-button-click',
          'button-click-label': 'Save Draft',
        });
        const getErrorType = () => {
          const hasAttachments = attachmentsRef.current.length > 0;
          const hasValidSignature =
            isSignatureRequired && electronicSignature !== '';
          const verifyAllFieldsAreValid =
            (messageValid &&
              signatureValid &&
              checkboxValid &&
              isSignatureRequired) ||
            (!isSignatureRequired && messageValid);

          if (hasAttachments && hasValidSignature && verifyAllFieldsAreValid) {
            return ErrorMessages.ComposeForm
              .UNABLE_TO_SAVE_DRAFT_SIGNATURE_OR_ATTACHMENTS;
          }

          if (hasAttachments && verifyAllFieldsAreValid) {
            return ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT;
          }

          if (verifyAllFieldsAreValid && hasValidSignature) {
            return ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_SIGNATURE;
          }

          return null;
        };

        const errorType = getErrorType();

        setSaveError(errorType);
        setSavedDraft(true);

        if (errorType) {
          if (
            errorType.title !==
            ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_SIGNATURE.title
          ) {
            setNavigationError({
              ...errorType,
              confirmButtonText: 'Continue editing',
              cancelButtonText: 'Delete draft',
            });
          }
          if (!messageValid) {
            focusOnErrorField();
          }
          return;
        }

        setNavigationError(null);
        setLastFocusableElement(e?.target);
      }

      const draftId = draft?.messageId;
      const formData = constructFormData();

      const newFieldsString = JSON.stringify({
        rec: parseInt(debouncedRecipient || draftInProgress.recipientId, 10),
        cat: debouncedCategory || category,
        sub: debouncedSubject || subject,
        bod: debouncedMessageBody || messageBody,
      });

      // For auto-save, skip if message is invalid or no fields changed
      if (type === 'auto') {
        if (!messageValid || newFieldsString === fieldsString) {
          return;
        }
        setFieldsString(newFieldsString);
      }

      if (messageValid) {
        setSavedDraft(false);
        setSaveError(null);
        dispatch(saveDraft(formData, type, draftId));
      }
    },
    [
      checkMessageValidity,
      validMessageType.SAVE,
      draft?.messageId,
      constructFormData,
      debouncedRecipient,
      draftInProgress.recipientId,
      debouncedCategory,
      category,
      debouncedSubject,
      subject,
      debouncedMessageBody,
      messageBody,
      setSaveError,
      setSavedDraft,
      setNavigationError,
      isSignatureRequired,
      electronicSignature,
      fieldsString,
      dispatch,
    ],
  );

  const sendMessageHandler = useCallback(
    async e => {
      const {
        messageValid,
        signatureValid,
        checkboxValid,
      } = checkMessageValidity(validMessageType.SEND);

      // TODO add GA event
      await setMessageInvalid(false);
      await setSendMessageFlag(false);
      const validSignatureNotRequired = messageValid && !isSignatureRequired;
      const isSignatureValid =
        isSignatureRequired && messageValid && signatureValid && checkboxValid;

      if (validSignatureNotRequired || isSignatureValid) {
        send();
        setNavigationError(null);
        setLastFocusableElement(e.target);
      } else {
        setSendMessageFlag(false);
        focusOnErrorField();
      }
    },
    [
      checkMessageValidity,
      validMessageType.SEND,
      isSignatureRequired,
      send,
      setNavigationError,
      setLastFocusableElement,
    ],
  );

  // Navigation error hook - manages navigation error state based on form state
  useNavigationError({
    messageBody,
    subject,
    selectedRecipientId,
    category,
    attachments,
    draft,
    savedDraft,
    isSignatureRequired,
    setUnsavedNavigationError,
  });

  useEffect(
    () => {
      if (
        isAutoSave === true &&
        debouncedRecipient &&
        debouncedCategory &&
        debouncedSubject &&
        debouncedMessageBody &&
        !navigationErrorModalVisible
      ) {
        saveDraftHandler('auto');
        setUnsavedNavigationError();
      }
    },
    [
      debouncedCategory,
      debouncedMessageBody,
      debouncedSubject,
      debouncedRecipient,
      saveDraftHandler,
      navigationErrorModalVisible,
      setUnsavedNavigationError,
      isAutoSave,
    ],
  );

  const recipientHandler = useCallback(
    recipient => {
      setSelectedRecipientId(recipient?.id ? recipient.id.toString() : '0');

      if (recipient?.id !== '0') {
        if (recipient?.id) setRecipientError('');
        setUnsavedNavigationError();
      }
    },
    [setRecipientError, setUnsavedNavigationError],
  );

  const subjectHandler = e => {
    setSubject(e.target.value);
    dispatch(
      updateDraftInProgress({
        subject: e.target.value,
      }),
    );
    if (e.target.value) setSubjectError('');
    setUnsavedNavigationError();
  };

  const messageBodyHandler = e => {
    const newValue = e.target.value;
    if (
      newValue === '' &&
      !prefillClearedReportedRef.current &&
      initialTextareaValueRef.current &&
      initialTextareaValueRef.current.length > 0
    ) {
      recordEvent({ event: 'sm_editor_prefill_deleted' });
      prefillClearedReportedRef.current = true;
    }
    if (
      newValue !== '' &&
      !prefillEditedReportedRef.current &&
      initialTextareaValueRef.current !== undefined &&
      initialTextareaValueRef.current !== newValue
    ) {
      recordEvent({ event: 'sm_editor_prefill_edited' });
      prefillEditedReportedRef.current = true;
    }
    setMessageBody(newValue);
    dispatch(
      updateDraftInProgress({
        body: newValue,
      }),
    );
    if (newValue) setBodyError('');
    setUnsavedNavigationError();
  };

  const electronicSignatureHandler = e => {
    setElectronicSignature(e.target.value);

    let validationError = null;
    const addError = err => {
      validationError = err;
    };
    validateNameSymbols({ addError }, e.target.value);
    if (validationError !== null) {
      setSignatureError(validationError);
    } else {
      setSignatureError('');
    }
    setUnsavedNavigationError();
  };

  const electronicCheckboxHandler = e => {
    setCheckboxMarked(e.detail.checked);
  };

  if (renewalPrescriptionIsLoading) {
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
      />
    );
  }

  if (sendMessageFlag === true) {
    return (
      <va-loading-indicator
        message={
          useLargeAttachments
            ? 'Do not refresh the page. Sending message...'
            : 'Sending message...'
        }
        setFocus
        data-testid="sending-indicator"
      />
    );
  }

  return (
    <>
      <h1 className="page-title vads-u-margin-top--0" ref={headerRef}>
        {pageTitle}
      </h1>

      {alertSlot}

      <DowntimeNotification
        appTitle={downtimeNotificationParams.appTitle}
        dependencies={[externalServices.mhvPlatform, externalServices.mhvSm]}
        render={renderMHVDowntime}
      />

      {noAssociations || allTriageGroupsBlocked ? (
        <BlockedTriageGroupAlert
          alertStyle={BlockedTriageAlertStyles.ALERT}
          parentComponent={ParentComponent.COMPOSE_FORM}
          currentRecipient={currentRecipient}
        />
      ) : (
        <EmergencyNote dropDownFlag />
      )}

      <form className="compose-form" id="sm-compose-form">
        <RouteLeavingGuard saveDraftHandler={saveDraftHandler} type="compose" />
        <div>
          {!mhvSecureMessagingCuratedListFlow &&
            !noAssociations &&
            !allTriageGroupsBlocked && (
              <div
                className={`vads-u-border-top--1px vads-u-padding-top--3 vads-u-margin-top--3 ${
                  recipientError
                    ? 'vads-u-margin-bottom--2'
                    : 'vads-u-margin-bottom--neg2'
                }`}
              >
                <BlockedTriageGroupAlert
                  alertStyle={BlockedTriageAlertStyles.ALERT}
                  parentComponent={ParentComponent.COMPOSE_FORM}
                  currentRecipient={currentRecipient}
                />
              </div>
            )}
          <AddYourMedicationInfoWarning isVisible={rxError != null} />
          {!mhvSecureMessagingCuratedListFlow &&
            recipientsList &&
            !noAssociations &&
            !allTriageGroupsBlocked && (
              <RecipientsSelect
                recipientsList={recipientsList}
                onValueChange={recipientHandler}
                error={recipientError}
                defaultValue={+selectedRecipientId}
                isSignatureRequired={isSignatureRequired}
                setCheckboxMarked={setCheckboxMarked}
                setElectronicSignature={setElectronicSignature}
                setComboBoxInputValue={setComboBoxInputValue}
                currentRecipient={currentRecipient}
              />
            )}
          {mhvSecureMessagingCuratedListFlow && (
            <SelectedRecipientTitle draftInProgress={draftInProgress} />
          )}
          <div className="compose-form-div vads-u-margin-y--3">
            {renderCategorySection}
          </div>
          <div className="compose-form-div">
            {noAssociations || allTriageGroupsBlocked ? (
              <ViewOnlyDraftSection title={FormLabels.SUBJECT} body={subject} />
            ) : (
              <va-text-input
                label={FormLabels.SUBJECT}
                required
                type="text"
                id="message-subject"
                name="message-subject"
                class="message-subject"
                data-testid="message-subject-field"
                onInput={subjectHandler}
                value={subject}
                error={subjectError}
                data-dd-privacy="mask"
                data-dd-action-name="Subject (Required) Input Field"
                maxlength="50"
                uswds
                charcount
              />
            )}
          </div>
          <div className="compose-form-div vads-u-margin-bottom--0">
            {noAssociations || allTriageGroupsBlocked ? (
              <ViewOnlyDraftSection
                title={FormLabels.MESSAGE}
                body={messageBody || formattedSignature}
              />
            ) : (
              <va-textarea
                label={FormLabels.MESSAGE}
                required
                id="compose-message-body"
                name="compose-message-body"
                class="message-body"
                hint={(() => {
                  if (rxError) {
                    return MessageHintText.RX_RENEWAL_ERROR;
                  }
                  if (renewalPrescription?.prescriptionId) {
                    return MessageHintText.RX_RENEWAL_SUCCESS;
                  }
                  return null;
                })()}
                data-testid="message-body-field"
                onInput={messageBodyHandler}
                value={messageBody || formattedSignature} // populate with the signature, unless there is a saved draft
                error={bodyError}
                onFocus={e => {
                  setCaretToPos(
                    e.target.shadowRoot.querySelector('textarea'),
                    0,
                  );
                }}
                data-dd-privacy="mask"
                data-dd-action-name="Message (Required) Textbox"
              />
            )}
          </div>

          <EditSignatureLink />

          {recipientsList &&
            (!noAssociations &&
              !allTriageGroupsBlocked && (
                <section className="attachments-section">
                  <AttachmentsList
                    compose
                    attachments={attachments}
                    setAttachments={setAttachments}
                    attachFileSuccess={attachFileSuccess}
                    setAttachFileSuccess={setAttachFileSuccess}
                    setNavigationError={setNavigationError}
                    editingEnabled
                    attachmentScanError={attachmentScanError}
                    attachFileError={attachFileError}
                    setAttachFileError={setAttachFileError}
                    isOhTriageGroup={draftInProgress?.ohTriageGroup}
                  />

                  <FileInput
                    attachments={attachments}
                    setAttachments={setAttachments}
                    setAttachFileSuccess={setAttachFileSuccess}
                    attachmentScanError={attachmentScanError}
                    attachFileError={attachFileError}
                    setAttachFileError={setAttachFileError}
                    isOhTriageGroup={draftInProgress?.ohTriageGroup}
                  />
                </section>
              ))}
          {isSignatureRequired && (
            <ElectronicSignature
              nameError={signatureError}
              checkboxError={checkboxError}
              onInput={electronicSignatureHandler}
              onCheckboxCheck={electronicCheckboxHandler}
              checked={checkboxMarked}
              electronicSignature={electronicSignature}
            />
          )}
          <DraftSavedInfo />
          <ComposeFormActionButtons
            cannotReply={noAssociations || allTriageGroupsBlocked}
            draftId={draft?.messageId}
            draftsCount={1}
            formPopulated={formPopulated}
            navigationError={navigationError}
            onSaveDraft={(type, e) => saveDraftHandler(type, e)}
            onSend={sendMessageHandler}
            setNavigationError={setNavigationError}
            setUnsavedNavigationError={setUnsavedNavigationError}
            savedComposeDraft={!!draft}
            redirectPath={redirectPath}
          />
        </div>
      </form>
    </>
  );
};

ComposeForm.propTypes = {
  alertSlot: PropTypes.node,
  draft: PropTypes.object,
  headerRef: PropTypes.object,
  pageTitle: PropTypes.string,
  recipients: PropTypes.object,
  signature: PropTypes.object,
};

export default ComposeForm;
