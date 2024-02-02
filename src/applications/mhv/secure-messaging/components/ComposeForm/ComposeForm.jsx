import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  VaAlert,
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
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
  sortRecipients,
  resetUserSession,
  updateTriageGroupRecipientStatus,
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
} from '../../util/constants';
import { getCategories } from '../../actions/categories';
import EmergencyNote from '../EmergencyNote';
import ComposeFormActionButtons from './ComposeFormActionButtons';
import RemoveAttachmentModal from '../Modals/RemoveAttachmentModal';
import EditPreferences from './EditPreferences';
import BlockedTriageGroupAlert from '../shared/BlockedTriageGroupAlert';
import ViewOnlyDraftSection from './ViewOnlyDraftSection';
import { RadioCategories } from '../../util/inputContants';

const ComposeForm = props => {
  const { draft, recipients } = props;
  const { noAssociations, allTriageGroupsBlocked } = recipients;
  const dispatch = useDispatch();
  const history = useHistory();

  const attachFileAlertRef = useRef();

  const defaultRecipientsList = [{ id: 0, name: ' ' }];
  const [recipientsList, setRecipientsList] = useState(defaultRecipientsList);
  const [selectedRecipient, setSelectedRecipient] = useState(
    defaultRecipientsList[0].id,
  );
  const [category, setCategory] = useState(null);
  const [categoryError, setCategoryError] = useState('');
  const [bodyError, setBodyError] = useState(null);
  const [recipientError, setRecipientError] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
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
  const attachmentReference = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAttachmentRemoved, setIsAttachmentRemoved] = useState(false);
  const [removedAttachmentName, setRemovedAttachmentName] = useState('');
  const [fileToRemove, setFileToRemove] = useState(null);
  const [recentlyRemovedFile, setRecentlyRemovedFile] = useState(false);
  const [focusedElement, setFocusedElement] = useState(null);
  const [
    showBlockedTriageGroupAlert,
    setShowBlockedTriageGroupAlert,
  ] = useState(false);
  const [blockedTriageGroupList, setBlockedTriageGroupList] = useState([]);

  const { isSaving } = useSelector(state => state.sm.threadDetails);
  const alertStatus = useSelector(state => state.sm.alerts?.alertFocusOut);
  const currentFolder = useSelector(state => state.sm.folders?.folder);
  const signature = useSelector(state => state.sm.preferences.signature);
  const debouncedSubject = useDebounce(subject, draftAutoSaveTimeout);
  const debouncedMessageBody = useDebounce(messageBody, draftAutoSaveTimeout);
  const debouncedCategory = useDebounce(category, draftAutoSaveTimeout);
  const debouncedRecipient = useDebounce(
    selectedRecipient,
    draftAutoSaveTimeout,
  );

  const mhvSecureMessagingBlockedTriageGroup1p0 = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingBlockedTriageGroup1p0
      ],
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

  const formattedSignature = useMemo(
    () => {
      return messageSignatureFormatter(signature);
    },
    [signature],
  );

  useEffect(
    () => {
      dispatch(getCategories());
    },
    [dispatch],
  );

  const setUnsavedNavigationError = typeOfError => {
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
  };

  useEffect(
    () => {
      if (recipients.allowedRecipients.length > 0) {
        setRecipientsList([
          ...defaultRecipientsList,
          ...recipients.allowedRecipients,
        ]);
      }

      if (!draft) {
        setSelectedRecipient('0');
        setCategory(null);
        setSubject('');
        setMessageBody('');
      }
    },
    [recipients, draft],
  );

  useEffect(() => {
    if (mhvSecureMessagingBlockedTriageGroup1p0) {
      if (draft) {
        const tempRecipient = {
          recipientId: draft.recipientId,
          name: draft.triageGroupName,
          type: Recipients.CARE_TEAM,
          status: RecipientStatus.ALLOWED,
        };

        const {
          isAssociated,
          formattedRecipient,
        } = updateTriageGroupRecipientStatus(recipients, tempRecipient);

        if (!isAssociated) {
          setShowBlockedTriageGroupAlert(true);
          setBlockedTriageGroupList([
            formattedRecipient,
            ...recipients.blockedRecipients,
          ]);
        } else if (recipients.associatedBlockedTriageGroupsQty > 0) {
          setShowBlockedTriageGroupAlert(true);
          setBlockedTriageGroupList(recipients.blockedRecipients);
        }
      } else {
        setShowBlockedTriageGroupAlert(
          recipients.associatedBlockedTriageGroupsQty > 0,
        );
        setBlockedTriageGroupList(recipients.blockedRecipients);
      }
    }
    // The Blocked Triage Group alert should stay visible until the draft is sent or user navigates away
  }, []);

  useEffect(
    () => {
      if (sendMessageFlag && isSaving !== true) {
        const messageData = {
          category,
          body: messageBody,
          subject,
        };
        messageData[`${'draft_id'}`] = draft?.messageId;
        messageData[`${'recipient_id'}`] = selectedRecipient;

        let sendData;
        if (attachments.length > 0) {
          sendData = new FormData();
          sendData.append('message', JSON.stringify(messageData));
          attachments.map(upload => sendData.append('uploads[]', upload));
        } else {
          sendData = JSON.stringify(messageData);
        }
        dispatch(sendMessage(sendData, attachments.length > 0))
          .then(() =>
            navigateToFolderByFolderId(
              currentFolder?.folderId || DefaultFolders.INBOX.id,
              history,
            ),
          )
          .catch(setSendMessageFlag(false));
      }
    },
    [sendMessageFlag, isSaving],
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
    [alertStatus],
  );

  const recipientExists = recipientId => {
    return recipientsList.findIndex(item => +item.id === +recipientId) > -1;
  };

  useEffect(
    () => {
      if (attachments.length === 0) {
        setAttachFileSuccess(false);
      }
    },
    [attachments],
  );

  useEffect(
    () => {
      focusElement(focusedElement);
    },
    [focusedElement],
  );

  useEffect(
    () => {
      if (attachFileSuccess && attachFileAlertRef.current.shadowRoot) {
        setTimeout(() => {
          setFocusedElement(
            document.querySelector('#close-success-alert-button'),
          );
        }, 300);
      }
    },
    [attachFileSuccess, attachments, attachFileAlertRef],
  );

  //  Populates form fields with recipients and categories
  const populateForm = () => {
    if (!recipientExists(draft.recipientId)) {
      const newRecipient = {
        id: draft.recipientId,
        name: draft.recipientName,
      };
      setRecipientsList(prevRecipientsList => [
        ...prevRecipientsList,
        newRecipient,
      ]);
      setSelectedRecipient(newRecipient.id);
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

  const removeAttachment = file => {
    const newAttArr = attachments?.filter(item => {
      if (item.name !== file.name) {
        return true;
      }
      return item.size !== file.size;
    });
    setRemovedAttachmentName(file.name);
    setAttachments(newAttArr);
    setIsAttachmentRemoved(true);
    setAttachFileSuccess(false);

    setFocusedElement(
      document
        .querySelector('.attach-file-button')
        .shadowRoot.querySelector('button'),
    );

    if (newAttArr.some(item => item.name !== file.name)) {
      setRecentlyRemovedFile(true);
    }
  };

  if (draft && !formPopulated) populateForm();

  const checkMessageValidity = useCallback(
    () => {
      let messageValid = true;
      if (
        selectedRecipient === '0' ||
        selectedRecipient === '' ||
        !selectedRecipient
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
      setMessageInvalid(!messageValid);
      return messageValid;
    },
    [category, messageBody, selectedRecipient, subject],
  );

  const saveDraftHandler = useCallback(
    async (type, e) => {
      if (type === 'manual') {
        setLastFocusableElement(e.target);
        await setMessageInvalid(false);
        if (checkMessageValidity() === true) {
          setUnsavedNavigationError(null);
          setSavedDraft(true);
        } else
          setUnsavedNavigationError(
            ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR,
          );

        if (attachments.length > 0) {
          setSaveError(
            ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT,
          );
          setNavigationError({
            ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE,
            confirmButtonText: 'Continue editing',
            cancelButtonText: 'Delete draft',
          });
        }
      }

      const draftId = draft && draft.messageId;
      const newFieldsString = JSON.stringify({
        rec: parseInt(debouncedRecipient || selectedRecipient, 10),
        cat: debouncedCategory || category,
        sub: debouncedSubject || subject,
        bod: debouncedMessageBody || messageBody,
      });

      if (type === 'auto' && newFieldsString === fieldsString) {
        return;
      }
      setFieldsString(newFieldsString);

      const formData = {
        recipientId: selectedRecipient,
        category,
        subject,
        body: messageBody,
      };

      if (checkMessageValidity() === true) {
        dispatch(saveDraft(formData, type, draftId));
      }
    },
    [
      attachments.length,
      category,
      checkMessageValidity,
      debouncedCategory,
      debouncedMessageBody,
      debouncedRecipient,
      debouncedSubject,
      dispatch,
      draft,
      fieldsString,
      messageBody,
      selectedRecipient,
      subject,
    ],
  );

  const sendMessageHandler = useCallback(
    async e => {
      // TODO add GA event
      await setMessageInvalid(false);
      await setSendMessageFlag(false);
      if (checkMessageValidity()) {
        setSendMessageFlag(true);
        setNavigationError(null);
        setLastFocusableElement(e.target);
      } else {
        setSendMessageFlag(false);
      }
    },
    [checkMessageValidity],
  );

  useEffect(
    () => {
      const blankForm =
        messageBody === '' &&
        subject === '' &&
        (selectedRecipient === 0 || selectedRecipient === '0') &&
        category === null &&
        attachments.length === 0;

      const savedEdits =
        messageBody === draft?.body &&
        Number(selectedRecipient) === draft?.recipientId &&
        category === draft?.category &&
        subject === draft?.subject;

      const editPopulatedForm =
        (messageBody !== draft?.body ||
          selectedRecipient !== draft?.recipientId ||
          category !== draft?.category ||
          subject !== draft?.subject) &&
        !blankForm &&
        !savedEdits;

      if (editPopulatedForm === false) {
        setSavedDraft(false);
      }

      const unsavedDraft = editPopulatedForm && !deleteButtonClicked;

      if (blankForm || savedDraft) {
        setUnsavedNavigationError(null);
      } else {
        if (unsavedDraft) {
          setSavedDraft(false);
          setUnsavedNavigationError(
            ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR,
          );
        }
        if (unsavedDraft && attachments.length > 0) {
          setUnsavedNavigationError(
            ErrorMessages.Navigation.UNABLE_TO_SAVE_DRAFT_ATTACHMENT_ERROR,
          );
          updateModalVisible(false);
        }
      }
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
      selectedRecipient,
      subject,
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
        setUnsavedNavigationError(null);
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

  const handleSuccessAlertClose = () => {
    setAttachFileSuccess(false);
    if (attachments.length > 0) {
      setFocusedElement(
        document.querySelector('.attachments-list').firstChild.firstChild
          .lastChild,
      );
    } else {
      setFocusedElement(
        document
          .querySelector('.attach-file-button')
          .shadowRoot.querySelector('button'),
      );
    }
  };

  const recipientHandler = e => {
    setSelectedRecipient(e.detail.value);
    if (e.detail.value !== '0') {
      if (e.detail.value) setRecipientError('');
      setUnsavedNavigationError();
    }
  };

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

  const beforeUnloadHandler = useCallback(
    e => {
      if (
        selectedRecipient.toString() !==
          (draft ? draft.recipientId.toString() : '0') ||
        category !== (draft ? draft.category : null) ||
        subject !== (draft ? draft.subject : '') ||
        messageBody !== (draft ? draft.body : '') ||
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
      selectedRecipient,
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

  return (
    <>
      {mhvSecureMessagingBlockedTriageGroup1p0 &&
      (showBlockedTriageGroupAlert &&
        (noAssociations || allTriageGroupsBlocked)) ? (
        <BlockedTriageGroupAlert
          blockedTriageGroupList={blockedTriageGroupList}
          alertStyle={BlockedTriageAlertStyles.ALERT}
          parentComponent={ParentComponent.COMPOSE_FORM}
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
            }}
            status="warning"
            data-testid="quit-compose-double-dare"
            data-dd-action-name="Save Error Modal Closed"
            visible
          >
            <p>{saveError.p1}</p>
            {saveError.p2 && <p>{saveError.p2}</p>}
            <va-button
              text="Continue editing"
              onClick={() => setSaveError(null)}
            />
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
          <EditPreferences />

          {mhvSecureMessagingBlockedTriageGroup1p0 &&
            (showBlockedTriageGroupAlert &&
              (!noAssociations && !allTriageGroupsBlocked) && (
                <div
                  className="
                  vads-u-border-top--1px
                  vads-u-padding-top--3
                  vads-u-margin-top--3
                  vads-u-margin-bottom--neg2"
                >
                  <BlockedTriageGroupAlert
                    blockedTriageGroupList={blockedTriageGroupList}
                    alertStyle={BlockedTriageAlertStyles.ALERT}
                    parentComponent={ParentComponent.COMPOSE_FORM}
                  />
                </div>
              ))}

          {mhvSecureMessagingBlockedTriageGroup1p0
            ? recipientsList &&
              (!noAssociations &&
                !allTriageGroupsBlocked && (
                  <>
                    <VaSelect
                      enable-analytics
                      id="recipient-dropdown"
                      label="To"
                      name="to"
                      value={selectedRecipient}
                      onVaSelect={recipientHandler}
                      class="composeSelect"
                      data-testid="compose-recipient-select"
                      error={recipientError}
                      data-dd-privacy="mask"
                      data-dd-action-name="Compose Recipient Dropdown List"
                    >
                      {sortRecipients(recipientsList)?.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </VaSelect>
                  </>
                ))
            : recipientsList && (
                <>
                  <VaSelect
                    enable-analytics
                    id="recipient-dropdown"
                    label="To"
                    name="to"
                    value={selectedRecipient}
                    onVaSelect={recipientHandler}
                    class="composeSelect"
                    data-testid="compose-recipient-select"
                    error={recipientError}
                    data-dd-privacy="mask"
                    data-dd-action-name="Compose Recipient Dropdown List"
                  >
                    {sortRecipients(recipientsList)?.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </VaSelect>
                </>
              )}

          <div className="compose-form-div">
            {mhvSecureMessagingBlockedTriageGroup1p0 &&
            (noAssociations || allTriageGroupsBlocked) ? (
              <ViewOnlyDraftSection
                title={FormLabels.CATEGORY}
                body={`${RadioCategories[(draft?.category)].label}: ${
                  RadioCategories[(draft?.category)].description
                }`}
              />
            ) : (
              <CategoryInput
                category={category}
                categoryError={categoryError}
                setCategory={setCategory}
                setCategoryError={setCategoryError}
                setUnsavedNavigationError={setUnsavedNavigationError}
              />
            )}
          </div>
          <div className="compose-form-div">
            {mhvSecureMessagingBlockedTriageGroup1p0 &&
            (noAssociations || allTriageGroupsBlocked) ? (
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
                data-dd-action-name="Compose Message Subject Input Field"
              />
            )}
          </div>
          <div className="compose-form-div vads-u-margin-bottom--0">
            {mhvSecureMessagingBlockedTriageGroup1p0 &&
            (noAssociations || allTriageGroupsBlocked) ? (
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
                data-dd-action-name="Compose Message Body Textbox"
              />
            )}
          </div>
          {mhvSecureMessagingBlockedTriageGroup1p0
            ? recipientsList &&
              (!noAssociations &&
                !allTriageGroupsBlocked && (
                  <section className="attachments-section">
                    {attachFileSuccess &&
                      attachments.length > 0 && (
                        <VaAlert
                          aria-live="polite"
                          aria-label="file successfully attached"
                          ref={attachFileAlertRef}
                          background-only
                          className="file-attached-success vads-u-margin-top--2"
                          data-testid="file-attached-success-alert"
                          disable-analytics
                          full-width="false"
                          show-icon
                          status="success"
                          onCloseEvent={handleSuccessAlertClose}
                        >
                          <p className="vads-u-margin-bottom--0">
                            File attached
                          </p>
                          <button
                            className="close-success-alert-button vads-u-padding--0p5"
                            id="close-success-alert-button"
                            data-testid="close-success-alert-button"
                            aria-label="Close notification"
                            type="button"
                            onClick={() => {
                              setAttachFileSuccess(false);
                              handleSuccessAlertClose();
                            }}
                          >
                            <i
                              className="fas fa-times-circle vads-u-color--black"
                              style={{ fontSize: '2.4rem' }}
                              alt="Close notification icon"
                              aria-hidden="true"
                              role="presentation"
                            />
                          </button>
                        </VaAlert>
                      )}
                    <AttachmentsList
                      attachFileSuccess={attachFileSuccess}
                      attachments={attachments}
                      compose
                      editingEnabled
                      recentlyRemovedFile={recentlyRemovedFile}
                      setAttachFileSuccess={setAttachFileSuccess}
                      setAttachments={setAttachments}
                      setFileToRemove={setFileToRemove}
                      setFocusedElement={setFocusedElement}
                      setIsModalVisible={setIsModalVisible}
                      setNavigationError={setNavigationError}
                    />
                    {/* Maybe move RemoveAttachmentModal here so that it doesn't render in other components */}
                    <RemoveAttachmentModal
                      visible={isModalVisible}
                      onClose={() => {
                        setIsModalVisible(false);
                        setIsAttachmentRemoved(false);
                      }}
                      onDelete={() => {
                        setNavigationError();
                        setIsModalVisible(false);
                        removeAttachment(fileToRemove);
                      }}
                      data-testid="remove-attachment-modal"
                      file={attachments}
                    />
                    {isAttachmentRemoved ? (
                      <>
                        <div
                          ref={attachmentReference}
                          role="status"
                          aria-live="polite"
                          className="sr-only"
                          id="attachment-removed-successfully"
                          data-dd-privacy="mask"
                        >
                          {`File ${removedAttachmentName} successfully removed. Attach file, button.`}
                        </div>
                      </>
                    ) : null}
                    <FileInput
                      attachments={attachments}
                      setAttachments={setAttachments}
                      setAttachFileSuccess={setAttachFileSuccess}
                    />
                  </section>
                ))
            : recipientsList && (
                <section className="attachments-section">
                  {attachFileSuccess &&
                    attachments.length > 0 && (
                      <VaAlert
                        aria-live="polite"
                        aria-label="file successfully attached"
                        ref={attachFileAlertRef}
                        background-only
                        className="file-attached-success vads-u-margin-top--2"
                        data-testid="file-attached-success-alert"
                        disable-analytics
                        full-width="false"
                        show-icon
                        status="success"
                        onCloseEvent={handleSuccessAlertClose}
                      >
                        <p className="vads-u-margin-bottom--0">File attached</p>
                        <button
                          className="close-success-alert-button vads-u-padding--0p5"
                          id="close-success-alert-button"
                          data-testid="close-success-alert-button"
                          aria-label="Close notification"
                          type="button"
                          onClick={() => {
                            setAttachFileSuccess(false);
                            handleSuccessAlertClose();
                          }}
                        >
                          <i
                            className="fas fa-times-circle vads-u-color--black"
                            style={{ fontSize: '2.4rem' }}
                            alt="Close notification icon"
                            aria-hidden="true"
                            role="presentation"
                          />
                        </button>
                      </VaAlert>
                    )}
                  <AttachmentsList
                    attachFileAlertRef={attachFileAlertRef}
                    attachFileSuccess={attachFileSuccess}
                    attachments={attachments}
                    compose
                    editingEnabled
                    recentlyRemovedFile={recentlyRemovedFile}
                    setAttachFileSuccess={setAttachFileSuccess}
                    setAttachments={setAttachments}
                    setFileToRemove={setFileToRemove}
                    setFocusedElement={setFocusedElement}
                    setIsModalVisible={setIsModalVisible}
                    setNavigationError={setNavigationError}
                  />
                  <RemoveAttachmentModal
                    visible={isModalVisible}
                    onClose={() => {
                      setIsModalVisible(false);
                      setIsAttachmentRemoved(false);
                    }}
                    onDelete={() => {
                      setNavigationError();
                      setIsModalVisible(false);
                      removeAttachment(fileToRemove);
                    }}
                    data-testid="remove-attachment-modal"
                  />
                  {isAttachmentRemoved ? (
                    <>
                      <div
                        ref={attachmentReference}
                        role="status"
                        aria-live="polite"
                        className="sr-only"
                        id="attachment-removed-successfully"
                        data-dd-privacy="mask"
                      >
                        {`File ${removedAttachmentName} successfully removed. Attach file, button.`}
                      </div>
                    </>
                  ) : null}
                  <FileInput
                    attachments={attachments}
                    setAttachments={setAttachments}
                    setAttachFileSuccess={setAttachFileSuccess}
                  />
                </section>
              )}

          <DraftSavedInfo />
          <ComposeFormActionButtons
            cannotReply={
              mhvSecureMessagingBlockedTriageGroup1p0
                ? noAssociations || allTriageGroupsBlocked
                : false
            }
            deleteButtonClicked={deleteButtonClicked}
            draftId={draft?.messageId}
            draftsCount={1}
            formPopulated={formPopulated}
            navigationError={navigationError}
            onSaveDraft={(type, e) => saveDraftHandler(type, e)}
            onSend={sendMessageHandler}
            setDeleteButtonClicked={setDeleteButtonClicked}
            setNavigationError={setNavigationError}
            setUnsavedNavigationError={setUnsavedNavigationError}
          />
        </div>
      </form>
    </>
  );
};

ComposeForm.propTypes = {
  draft: PropTypes.object,
  recipients: PropTypes.object,
};

export default ComposeForm;
