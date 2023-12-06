import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
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
} from '../../util/helpers';
import { sendMessage } from '../../actions/messages';
import { focusOnErrorField } from '../../util/formHelpers';
import RouteLeavingGuard from '../shared/RouteLeavingGuard';
import {
  draftAutoSaveTimeout,
  DefaultFolders,
  ErrorMessages,
} from '../../util/constants';
import { getCategories } from '../../actions/categories';
import EmergencyNote from '../EmergencyNote';
import ComposeFormActionButtons from './ComposeFormActionButtons';
import EditPreferences from './EditPreferences';

const ComposeForm = props => {
  const { draft, recipients } = props;
  const dispatch = useDispatch();
  const history = useHistory();

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

  const isSaving = useSelector(state => state.sm.draftDetails.isSaving);
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

  const formattededSignature = useMemo(
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
      if (recipients?.length) {
        const filteredRecipients = recipients.filter(
          team => team.preferredTeam === true,
        );
        setRecipientsList(prevRecipientsList => [
          ...prevRecipientsList.filter(
            oldRecip =>
              !filteredRecipients.find(newRecip => newRecip.id === oldRecip.id),
          ),
          ...filteredRecipients,
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

  if (draft && recipients && !formPopulated) populateForm();

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
          setNavigationError(null);
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

      const editPopulatedForm =
        messageBody !== draft?.messageBody ||
        selectedRecipient !== draft?.recipientId ||
        category !== draft?.category ||
        subject !== draft?.subject;

      if (blankForm) {
        setUnsavedNavigationError(null);
      } else {
        if (
          (editPopulatedForm && !deleteButtonClicked) ||
          (editPopulatedForm && formPopulated && !deleteButtonClicked)
        ) {
          setUnsavedNavigationError(
            ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR,
          );
        }
        if (
          editPopulatedForm &&
          !deleteButtonClicked &&
          attachments.length > 0
        ) {
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
      deleteButtonClicked,
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
        messageBody !== (draft ? draft.body : '')
      ) {
        e.returnValue = '';
      }
    },
    [draft, selectedRecipient, category, subject, messageBody],
  );

  useEffect(
    () => {
      window.addEventListener('beforeunload', beforeUnloadHandler);
      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    },
    [beforeUnloadHandler],
  );

  return (
    <>
      <EmergencyNote dropDownFlag />

      <form className="compose-form">
        {saveError && (
          <VaModal
            modalTitle={saveError.title}
            onCloseEvent={() => {
              setSaveError(null);
              focusElement(lastFocusableElement);
            }}
            status="warning"
            data-testid="quit-compose-double-dare"
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
          {recipientsList && (
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
            <CategoryInput
              category={category}
              categoryError={categoryError}
              setCategory={setCategory}
              setCategoryError={setCategoryError}
              setUnsavedNavigationError={setUnsavedNavigationError}
            />
          </div>
          <div className="compose-form-div">
            <va-text-input
              label="Subject"
              required
              type="text"
              id="message-subject"
              name="message-subject"
              className="message-subject"
              data-testid="message-subject-field"
              onInput={subjectHandler}
              value={subject}
              error={subjectError}
              data-dd-privacy="mask"
            />
          </div>
          <div className="compose-form-div vads-u-margin-bottom--0">
            <va-textarea
              label="Message"
              required
              id="compose-message-body"
              name="compose-message-body"
              className="message-body"
              data-testid="message-body-field"
              onInput={messageBodyHandler}
              value={messageBody || formattededSignature} // populate with the signature, unless theee is a saved draft
              error={bodyError}
              onFocus={e => {
                setCaretToPos(e.target.shadowRoot.querySelector('textarea'), 0);
              }}
              data-dd-privacy="mask"
            />
          </div>
          <section className="attachments-section">
            <AttachmentsList
              compose
              attachments={attachments}
              setAttachments={setAttachments}
              attachFileSuccess={attachFileSuccess}
              setAttachFileSuccess={setAttachFileSuccess}
              setNavigationError={setNavigationError}
              editingEnabled
            />

            <FileInput
              attachments={attachments}
              setAttachments={setAttachments}
              setAttachFileSuccess={setAttachFileSuccess}
            />
          </section>
          <DraftSavedInfo />
          <ComposeFormActionButtons
            onSend={sendMessageHandler}
            onSaveDraft={(type, e) => saveDraftHandler(type, e)}
            draftId={draft?.messageId}
            formPopulated={formPopulated}
            navigationError={navigationError}
            setNavigationError={setNavigationError}
            setDeleteButtonClicked={setDeleteButtonClicked}
            setUnsavedNavigationError={setUnsavedNavigationError}
            deleteButtonClicked={deleteButtonClicked}
          />
        </div>
      </form>
    </>
  );
};

ComposeForm.propTypes = {
  draft: PropTypes.object,
  recipients: PropTypes.array,
};

export default ComposeForm;
