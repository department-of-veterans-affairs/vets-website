import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { validateNameSymbols } from 'platform/forms-system/src/js/web-component-patterns/fullNamePattern';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { renderMHVDowntime } from '@department-of-veterans-affairs/mhv/exports';
import { datadogRum } from '@datadog/browser-rum';
import FileInput from './FileInput';
import CategoryInput from './CategoryInput';
import AttachmentsList from '../AttachmentsList';
import { saveDraft } from '../../actions/draftDetails';
import DraftSavedInfo from './DraftSavedInfo';
import useDebounce from '../../hooks/use-debounce';
import {
  messageSignatureFormatter,
  setCaretToPos,
  navigateToFolderByFolderId,
  resetUserSession,
  dateFormat,
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
} from '../../util/constants';
import EmergencyNote from '../EmergencyNote';
import ComposeFormActionButtons from './ComposeFormActionButtons';
import EditPreferences from './EditPreferences';
import BlockedTriageGroupAlert from '../shared/BlockedTriageGroupAlert';
import ViewOnlyDraftSection from './ViewOnlyDraftSection';
import { RadioCategories } from '../../util/inputContants';
import { getCategories } from '../../actions/categories';
import ElectronicSignature from './ElectronicSignature';
import RecipientsSelect from './RecipientsSelect';

const ComposeForm = props => {
  const { pageTitle, headerRef, draft, recipients, signature } = props;
  const {
    noAssociations,
    allTriageGroupsBlocked,
    allowedRecipients,
  } = recipients;
  const dispatch = useDispatch();
  const history = useHistory();

  const [recipientsList, setRecipientsList] = useState(allowedRecipients);
  const [selectedRecipientId, setSelectedRecipientId] = useState(null);
  const [isSignatureRequired, setIsSignatureRequired] = useState(null);
  const [checkboxMarked, setCheckboxMarked] = useState(false);

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
  const [category, setCategory] = useState(null);
  const [categoryError, setCategoryError] = useState('');
  const [bodyError, setBodyError] = useState(null);
  const [recipientError, setRecipientError] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [signatureError, setSignatureError] = useState('');
  const [checkboxError, setCheckboxError] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [electronicSignature, setElectronicSignature] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [formPopulated, setFormPopulated] = useState(false);
  const [fieldsString, setFieldsString] = useState('');
  const [sendMessageFlag, setSendMessageFlag] = useState(false);
  const [messageInvalid, setMessageInvalid] = useState(false);
  const [navigationError, setNavigationError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [lastFocusableElement, setLastFocusableElement] = useState(null);
  const [modalVisible, updateModalVisible] = useState(false);
  const [attachFileSuccess, setAttachFileSuccess] = useState(false);
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState(null);

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

  const attachmentScanError = useMemo(
    () =>
      alertsList.filter(
        alert =>
          alert.content === Alerts.Message.ATTACHMENT_SCAN_FAIL &&
          alert.isActive,
      ).length > 0,
    [alertsList],
  );

  const localStorageValues = useMemo(() => {
    return {
      atExpires: localStorage.atExpires,
      hasSession: localStorage.hasSession,
      sessionExpiration: localStorage.sessionExpiration,
      userFirstName: localStorage.userFirstName,
    };
  }, []);

  const { signOutMessage, timeoutId } = resetUserSession(localStorageValues);

  const noTimeout = () => {
    clearTimeout(timeoutId);
  };

  useEffect(
    () => {
      if (!categories) {
        dispatch(getCategories());
      }
    },
    [categories, dispatch],
  );

  const formattedSignature = useMemo(
    () => {
      return messageSignatureFormatter(signature);
    },
    [signature],
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
          confirmButtonText:
            ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT.editDraft,
          cancelButtonText:
            ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT.saveDraft,
        });
      }
      if (typeOfError === ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR) {
        setNavigationError({
          ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE,
          confirmButtonText: 'Continue editing',
          cancelButtonText: 'Delete draft',
        });
      }
    },
    [setNavigationError],
  );

  useEffect(
    () => {
      if (allowedRecipients?.length > 0) {
        setRecipientsList([...allowedRecipients]);
      }

      if (!draft) {
        setCategory(null);
        setSubject('');
        setMessageBody('');
      }
    },
    [recipients, draft, allowedRecipients],
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

  useEffect(
    () => {
      const today = dateFormat(new Date(), 'YYYY-MM-DD');
      if (sendMessageFlag && isSaving !== true) {
        scrollToTop();
        const messageData = {
          category,
          body: `${messageBody} ${
            electronicSignature
              ? `\n\n${electronicSignature}\nSigned electronically on ${today}.`
              : ``
          }`,
          subject,
        };
        messageData[`${'draft_id'}`] = draft?.messageId;
        messageData[`${'recipient_id'}`] = selectedRecipientId;

        let sendData;
        if (attachments.length > 0) {
          sendData = new FormData();
          sendData.append('message', JSON.stringify(messageData));
          attachments.map(upload => sendData.append('uploads[]', upload));
        } else {
          sendData = JSON.stringify(messageData);
        }
        dispatch(sendMessage(sendData, attachments.length > 0))
          .then(() => {
            setTimeout(() => {
              navigateToFolderByFolderId(
                currentFolder?.folderId || DefaultFolders.INBOX.id,
                history,
              );
            }, 1000);
            // Timeout neccessary for UCD requested 1 second delay
          })
          .catch(() => setSendMessageFlag(false), scrollToTop());
      }
    },
    [sendMessageFlag, isSaving, scrollToTop],
  );

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

  const recipientExists = useCallback(
    recipientId => {
      return recipientsList.findIndex(item => +item.id === +recipientId) > -1;
    },
    [recipientsList],
  );

  //  Populates form fields with recipients and categories
  const populateForm = () => {
    if (recipientExists(draft.recipientId)) {
      setSelectedRecipientId(draft.recipientId);
    } else {
      const newRecipient = {
        id: draft?.recipientId,
        name: draft?.recipientName,
      };
      setRecipientsList(prevRecipientsList => [
        ...prevRecipientsList,
        newRecipient,
      ]);
      setSelectedRecipientId(newRecipient.id);
    }
    setCategory(draft.category);
    setSubject(draft.subject);
    setMessageBody(draft.body);
    if (draft.attachments) {
      setAttachments(draft.attachments);
    }
    setFormPopulated(true);
    setFieldsString(
      JSON.stringify({
        rec: draft.recipientId,
        cat: draft.category,
        sub: draft.subject,
        bod: draft.body,
      }),
    );
  };

  if (draft && !formPopulated) populateForm();

  const checkMessageValidity = useCallback(
    () => {
      let messageValid = true;
      let signatureValid = true;
      let checkboxValid = true;

      if (
        selectedRecipientId === '0' ||
        selectedRecipientId === '' ||
        !selectedRecipientId
      ) {
        setRecipientError(ErrorMessages.ComposeForm.RECIPIENT_REQUIRED);
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
      if (isSignatureRequired && !electronicSignature) {
        setSignatureError(ErrorMessages.ComposeForm.SIGNATURE_REQUIRED);
        signatureValid = false;
      }
      if (isSignatureRequired && !checkboxMarked) {
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
      isSignatureRequired,
      electronicSignature,
      checkboxMarked,
      setMessageInvalid,
    ],
  );

  const saveDraftHandler = useCallback(
    async (type, e) => {
      const {
        messageValid,
        signatureValid,
        checkboxValid,
      } = checkMessageValidity();
      const validSignatureNotRequired =
        messageValid && !isSignatureRequired && !savedDraft;

      if (type === 'manual') {
        if (validSignatureNotRequired) {
          setNavigationError(null);
          setSavedDraft(true);
          setLastFocusableElement(e?.target);
        } else focusOnErrorField();
        setUnsavedNavigationError(
          ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR,
        );

        const getErrorType = () => {
          const hasAttachments = attachments.length > 0;
          const hasValidSignature =
            isSignatureRequired && electronicSignature !== '';
          const verifyAllFieldsAreValid =
            (messageValid &&
              signatureValid &&
              checkboxValid &&
              isSignatureRequired) ||
            (!isSignatureRequired && messageValid && validSignatureNotRequired);

          let errorType = null;

          if (hasAttachments && hasValidSignature && verifyAllFieldsAreValid) {
            errorType =
              ErrorMessages.ComposeForm
                .UNABLE_TO_SAVE_DRAFT_SIGNATURE_OR_ATTACHMENTS;
          } else if (hasAttachments && verifyAllFieldsAreValid) {
            errorType =
              ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT;
          } else if (!validSignatureNotRequired && verifyAllFieldsAreValid) {
            errorType =
              ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_SIGNATURE;
          }

          if (errorType) {
            setSaveError(errorType);
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
          }
        };
        getErrorType();
      }

      const draftId = draft && draft.messageId;
      const newFieldsString = JSON.stringify({
        rec: parseInt(debouncedRecipient || selectedRecipientId, 10),
        cat: debouncedCategory || category,
        sub: debouncedSubject || subject,
        bod: debouncedMessageBody || messageBody,
      });

      if (type === 'auto' && newFieldsString === fieldsString) {
        return;
      }
      setFieldsString(newFieldsString);

      const formData = {
        recipientId: selectedRecipientId,
        category,
        subject,
        body: messageBody,
      };
      if (
        (messageValid && !isSignatureRequired) ||
        (isSignatureRequired && messageValid && saveError !== null)
      ) {
        dispatch(saveDraft(formData, type, draftId));
      }
    },
    [
      checkMessageValidity,
      isSignatureRequired,
      savedDraft,
      saveError,
      draft,
      debouncedRecipient,
      selectedRecipientId,
      debouncedCategory,
      category,
      debouncedSubject,
      subject,
      debouncedMessageBody,
      messageBody,
      fieldsString,
      messageInvalid,
      setUnsavedNavigationError,
      attachments.length,
      electronicSignature,
      checkboxError,
      dispatch,
    ],
  );

  const sendMessageHandler = useCallback(
    async e => {
      const {
        messageValid,
        signatureValid,
        checkboxValid,
      } = checkMessageValidity();

      // TODO add GA event
      await setMessageInvalid(false);
      await setSendMessageFlag(false);
      const validSignatureNotRequired = messageValid && !isSignatureRequired;
      const isSignatureValid =
        isSignatureRequired && messageValid && signatureValid && checkboxValid;

      if (validSignatureNotRequired || isSignatureValid) {
        setSendMessageFlag(true);
        setNavigationError(null);
        setLastFocusableElement(e.target);
      } else {
        setSendMessageFlag(false);
        focusOnErrorField();
      }
    },
    [checkMessageValidity, isSignatureRequired],
  );

  useEffect(
    () => {
      const isBlankForm = () =>
        messageBody === '' &&
        subject === '' &&
        Number(selectedRecipientId) === 0 &&
        category === null &&
        attachments.length === 0;

      const isSavedEdits = () =>
        messageBody === draft?.body &&
        Number(selectedRecipientId) === draft?.recipientId &&
        category === draft?.category &&
        subject === draft?.subject;

      const isEditPopulatedForm = () =>
        (messageBody !== draft?.body ||
          selectedRecipientId !== draft?.recipientId ||
          category !== draft?.category ||
          subject !== draft?.subject) &&
        !isBlankForm() &&
        !isSavedEdits();

      const unsavedDraft = isEditPopulatedForm() && !deleteButtonClicked;
      if (!isEditPopulatedForm() || !isSavedEdits()) {
        setSavedDraft(false);
      }

      let error = null;
      if (isBlankForm() || savedDraft) {
        error = null;
      } else {
        if (unsavedDraft) {
          setSavedDraft(false);
          error = ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR;
        }
        if (unsavedDraft && attachments.length > 0) {
          error =
            ErrorMessages.Navigation.UNABLE_TO_SAVE_DRAFT_ATTACHMENT_ERROR;
          updateModalVisible(false);
        }
      }
      setUnsavedNavigationError(error);
    },
    [
      attachments,
      category,
      checkMessageValidity,
      deleteButtonClicked,
      draft?.category,
      draft?.messageBody,
      draft?.recipientId,
      draft?.subject,
      formPopulated,
      messageBody,
      selectedRecipientId,
      subject,
      savedDraft,
      setUnsavedNavigationError,
      draft?.body,
    ],
  );

  useEffect(
    () => {
      if (
        debouncedRecipient &&
        debouncedCategory &&
        debouncedSubject &&
        debouncedMessageBody &&
        !modalVisible
      ) {
        saveDraftHandler('auto');
        setUnsavedNavigationError();
        // test
      }
    },
    [
      debouncedCategory,
      debouncedMessageBody,
      debouncedSubject,
      debouncedRecipient,
      saveDraftHandler,
      modalVisible,
    ],
  );

  const recipientHandler = useCallback(
    recipient => {
      setSelectedRecipientId(recipient?.id ? recipient.id.toString() : '0');

      if (recipient.id !== '0') {
        if (recipient.id) setRecipientError('');
        setUnsavedNavigationError();
      }
    },
    [setRecipientError, setUnsavedNavigationError],
  );

  const subjectHandler = e => {
    setSubject(e.target.value);
    if (e.target.value) setSubjectError('');
    setUnsavedNavigationError();
  };

  const messageBodyHandler = e => {
    setMessageBody(e.target.value);
    if (e.target.value) setBodyError('');
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

  const beforeUnloadHandler = useCallback(
    e => {
      if (
        selectedRecipientId?.toString() !==
          (draft ? draft?.recipientId.toString() : '0') ||
        category !== (draft ? draft?.category : null) ||
        subject !== (draft ? draft?.subject : '') ||
        messageBody !== (draft ? draft?.body : '') ||
        attachments.length
      ) {
        e.preventDefault();
        window.onbeforeunload = () => signOutMessage;
        e.returnValue = true;
      } else {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        window.onbeforeunload = null;
        e.returnValue = false;
        noTimeout();
      }
    },
    [
      draft,
      selectedRecipientId,
      category,
      subject,
      messageBody,
      attachments,
      timeoutId,
    ],
  );

  useEffect(
    () => {
      window.addEventListener('beforeunload', beforeUnloadHandler);
      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        window.onbeforeunload = null;
        noTimeout();
      };
    },
    [beforeUnloadHandler],
  );

  if (sendMessageFlag === true) {
    return (
      <va-loading-indicator
        message="Sending message..."
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
        {saveError && (
          <VaModal
            modalTitle={saveError.title}
            onCloseEvent={() => {
              setSaveError(null);
              focusElement(lastFocusableElement);
              datadogRum.addAction('Save Error Modal Closed');
            }}
            status="warning"
            data-testid="quit-compose-double-dare"
            data-dd-action-name="Save Error Modal"
            visible
          >
            <p>{saveError.p1}</p>
            {saveError.p2 && <p>{saveError.p2}</p>}
            {saveError?.editDraft && (
              <va-button
                text={saveError.editDraft}
                onClick={() => {
                  setSavedDraft(false);
                  setSaveError(null);
                }}
                data-dd-action-name={`${saveError.editDraft} Button`}
              />
            )}
            {saveError?.saveDraft && (
              <va-button
                secondary
                class="vads-u-margin-y--1p5"
                text={saveError.saveDraft}
                data-dd-action-name={`${saveError.saveDraft} Button`}
                onClick={() => {
                  saveDraftHandler('manual');
                  setSaveError(null);
                }}
              />
            )}
          </VaModal>
        )}
        <RouteLeavingGuard
          when={!!navigationError}
          modalVisible={modalVisible}
          updateModalVisible={updateModalVisible}
          navigate={path => {
            history.push(path);
          }}
          shouldBlockNavigation={() => {
            return !!navigationError;
          }}
          title={navigationError?.title}
          p1={navigationError?.p1}
          p2={navigationError?.p2}
          confirmButtonText={navigationError?.confirmButtonText}
          cancelButtonText={navigationError?.cancelButtonText}
          saveDraftHandler={saveDraftHandler}
        />
        <div>
          {!noAssociations &&
            !allTriageGroupsBlocked && (
              <div
                className="
                  vads-u-border-top--1px
                  vads-u-padding-top--3
                  vads-u-margin-top--3
                  vads-u-margin-bottom--neg2"
              >
                <BlockedTriageGroupAlert
                  alertStyle={BlockedTriageAlertStyles.ALERT}
                  parentComponent={ParentComponent.COMPOSE_FORM}
                  currentRecipient={currentRecipient}
                />
              </div>
            )}

          {recipientsList &&
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
              />
            )}

          <div className="compose-form-div">
            {noAssociations || allTriageGroupsBlocked ? (
              <ViewOnlyDraftSection
                title={FormLabels.CATEGORY}
                body={`${RadioCategories[(draft?.category)].label}: ${
                  RadioCategories[(draft?.category)].description
                }`}
              />
            ) : (
              <CategoryInput
                categories={categories}
                category={category}
                categoryError={categoryError}
                setCategory={setCategory}
                setCategoryError={setCategoryError}
                setUnsavedNavigationError={setUnsavedNavigationError}
                setNavigationError={setNavigationError}
              />
            )}
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
                  />

                  <FileInput
                    attachments={attachments}
                    setAttachments={setAttachments}
                    setAttachFileSuccess={setAttachFileSuccess}
                    attachmentScanError={attachmentScanError}
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
            setDeleteButtonClicked={setDeleteButtonClicked}
            setNavigationError={setNavigationError}
            setUnsavedNavigationError={setUnsavedNavigationError}
            savedComposeDraft={!!draft}
          />
          <EditPreferences />
        </div>
      </form>
    </>
  );
};

ComposeForm.propTypes = {
  draft: PropTypes.object,
  recipients: PropTypes.object,
  signature: PropTypes.object,
};

export default ComposeForm;
