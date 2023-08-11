import React, { useState, useEffect, useMemo } from 'react';
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
  navigateToFolderByFolderId,
  messageSignatureFormatter,
  sortRecipients,
} from '../../util/helpers';
import { sendMessage } from '../../actions/messages';
import { focusOnErrorField } from '../../util/formHelpers';
import RouteLeavingGuard from '../shared/RouteLeavingGuard';
import {
  draftAutoSaveTimeout,
  Categories,
  Prompts,
  ErrorMessages,
} from '../../util/constants';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { getCategories } from '../../actions/categories';
import EmergencyNote from '../EmergencyNote';
import ComposeFormActionButtons from './ComposeFormActionButtons';

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
  const [sendMessageFlag, setSendMessageFlag] = useState(false);
  const [messageInvalid, setMessageInvalid] = useState(false);
  const [userSaved, setUserSaved] = useState(false);
  const [navigationError, setNavigationError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [editListModal, setEditListModal] = useState(false);
  const [lastFocusableElement, setLastFocusableElement] = useState(null);

  const isSaving = useSelector(state => state.sm.draftDetails.isSaving);
  const alertStatus = useSelector(state => state.sm.alerts?.alertFocusOut);
  const fullState = useSelector(state => state);
  const currentFolder = useSelector(state => state.sm.folders.folder);
  const signature = useSelector(state => state.sm.preferences.signature);
  const debouncedSubject = useDebounce(subject, draftAutoSaveTimeout);
  const debouncedMessageBody = useDebounce(messageBody, draftAutoSaveTimeout);
  const attachmentNames = attachments.reduce((currentString, item) => {
    return currentString + item.name;
  }, '');

  const {
    OTHER,
    COVID,
    APPOINTMENTS,
    MEDICATIONS,
    TEST_RESULTS,
    EDUCATION,
  } = Categories;

  const formattededSignature = useMemo(
    () => {
      return messageSignatureFormatter(signature);
    },
    [signature],
  );

  const setUnsavedNavigationError = typeOfError => {
    if (typeOfError === 'attachment') {
      setNavigationError({
        ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT,
        confirmButtonText:
          ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT.editDraft,
        cancelButtonText:
          ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT.saveDraft,
      });
    } else {
      setNavigationError({
        ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE,
        confirmButtonText: 'Continue editing',
        cancelButtonText: 'Delete draft',
      });
    }
  };

  useEffect(
    () => {
      dispatch(getCategories());
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (attachments.length > 0) {
        setUnsavedNavigationError('attachment');
      }
    },
    [attachments],
  );

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
        setSelectedRecipient('');
        setSubject('');
        setMessageBody('');
        setCategory('');
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
          draftId: draft?.messageId,
        };
        messageData[`${'recipient_id'}`] = selectedRecipient;
        if (attachments.length) {
          const sendData = new FormData();
          sendData.append('message', JSON.stringify(messageData));
          attachments.map(upload => sendData.append('uploads[]', upload));
          dispatch(sendMessage(sendData, true))
            .then(() =>
              navigateToFolderByFolderId(currentFolder?.folderId || 0, history),
            )
            .catch(setSendMessageFlag(false));
        } else {
          dispatch(sendMessage(JSON.stringify(messageData), false)).then(() =>
            navigateToFolderByFolderId(currentFolder?.folderId || 0, history),
          );
        }
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

  // Populates form fields with recipients and categories
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
  };

  if (draft && recipients && !formPopulated) populateForm();

  const setMessageTitle = () => {
    const casedCategory =
      category ===
      (COVID ||
        OTHER ||
        APPOINTMENTS ||
        MEDICATIONS ||
        TEST_RESULTS ||
        EDUCATION)
        ? Categories[category]
        : 'New message';

    if (category && subject) {
      return `${Categories[category]}: ${subject}`;
    }
    if (category && !subject) {
      return `${Categories[category]}:`;
    }
    if (!category && subject) {
      return subject;
    }
    return `${casedCategory}`;
  };

  const checkMessageValidity = () => {
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
  };

  const saveDraftHandler = async (type, e) => {
    if (type === 'manual') {
      setUserSaved(true);
      setLastFocusableElement(e.target);
      await setMessageInvalid(false);
      if (checkMessageValidity()) {
        setNavigationError(null);
      }
      if (attachments.length) {
        setSaveError(ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT);
        setNavigationError(null);
      }
    }

    const draftId = draft && draft.messageId;

    const formData = {
      recipientId: selectedRecipient,
      category,
      subject,
      body: messageBody,
    };

    if (checkMessageValidity() === true) {
      dispatch(saveDraft(formData, type, draftId));
    }
    if (!attachments.length) setNavigationError(null);
  };

  const sendMessageHandler = async e => {
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
  };

  useEffect(
    () => {
      if (
        selectedRecipient &&
        category &&
        debouncedSubject &&
        debouncedMessageBody &&
        !sendMessageFlag
      ) {
        saveDraftHandler('auto');
      }
    },
    [
      attachmentNames,
      category,
      debouncedMessageBody,
      debouncedSubject,
      selectedRecipient,
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

  return (
    <>
      <EmergencyNote dropDownFlag />

      <form className="compose-form">
        {saveError && (
          <VaModal
            modalTitle={saveError.title}
            onPrimaryButtonClick={() => setSaveError(null)}
            onCloseEvent={() => {
              setSaveError(null);
              focusElement(lastFocusableElement);
            }}
            primaryButtonText="Continue editing"
            status="warning"
            data-testid="quit-compose-double-dare"
            visible
          >
            <p>{saveError.p1}</p>
            {saveError.p2 && <p>{saveError.p2}</p>}
          </VaModal>
        )}
        <RouteLeavingGuard
          when={!!navigationError}
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
        <div
          className="compose-form-header"
          data-testid="compose-form-header"
          data-dd-privacy="mask"
        >
          <h2 className="vads-u-margin--0 vads-u-font-size--lg">
            {setMessageTitle()}
          </h2>
        </div>
        <div className="compose-inputs-container">
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

              <VaModal
                id="edit-list"
                modalTitle={Prompts.Compose.EDIT_LIST_TITLE}
                name="edit-list"
                visible={editListModal}
                onCloseEvent={() => setEditListModal(false)}
                status="warning"
              >
                <p>{Prompts.Compose.EDIT_LIST_CONTENT}</p>
                <a
                  className="vads-c-action-link--green"
                  href={mhvUrl(
                    isAuthenticatedWithSSOe(fullState),
                    'preferences',
                  )}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    setEditListModal(false);
                  }}
                >
                  Edit your contact list on the My HealtheVet website
                </a>
              </VaModal>

              <va-button
                id="edit-list-button"
                text="Edit list"
                label="Edit list"
                secondary=""
                class="vads-u-flex--1 save-draft-button vads-u-margin-bottom--1 hydrated"
                data-testid="Edit-List-Button"
                onClick={() => setEditListModal(true)}
              />
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
          <div className="compose-form-div">
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
              data-dd-privacy="mask"
            />
          </div>
          <section className="attachments-section">
            <AttachmentsList
              compose
              attachments={attachments}
              setAttachments={setAttachments}
              editingEnabled
            />

            <FileInput
              attachments={attachments}
              setAttachments={setAttachments}
            />
          </section>
          <DraftSavedInfo userSaved={userSaved} attachments={attachments} />
          <ComposeFormActionButtons
            onSend={sendMessageHandler}
            onSaveDraft={(type, e) => saveDraftHandler(type, e)}
            draftId={draft?.messageId}
            setNavigationError={setNavigationError}
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
