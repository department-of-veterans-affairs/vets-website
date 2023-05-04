import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FileInput from './FileInput';
import CategoryInput from './CategoryInput';
import AttachmentsList from '../AttachmentsList';
import { saveDraft } from '../../actions/draftDetails';
import DraftSavedInfo from './DraftSavedInfo';
import useDebounce from '../../hooks/use-debounce';
import DeleteDraft from '../Draft/DeleteDraft';
import { sortRecipients } from '../../util/helpers';
import { sendMessage } from '../../actions/messages';
import { focusOnErrorField } from '../../util/formHelpers';
import RouteLeavingGuard from '../shared/RouteLeavingGuard';
import HowToAttachFiles from '../HowToAttachFiles';
import {
  draftAutoSaveTimeout,
  Categories,
  Prompts,
  ErrorMessages,
} from '../../util/constants';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

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
  const [userSaved, setUserSaved] = useState(false);
  const [navigationError, setNavigationError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [editListModal, setEditListModal] = useState(false);

  const isSaving = useSelector(state => state.sm.draftDetails.isSaving);
  const fullState = useSelector(state => state);

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
            .then(() => history.push('/inbox'))
            .catch(setSendMessageFlag(false));
        } else {
          dispatch(sendMessage(JSON.stringify(messageData), false)).then(() =>
            history.push('/inbox'),
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

  const saveDraftHandler = async type => {
    if (type === 'manual') {
      setUserSaved(true);

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
    const newFieldsString = JSON.stringify({
      rec: selectedRecipient,
      cat: category,
      sub: subject,
      bod: messageBody,
    });

    if (newFieldsString === fieldsString) {
      return;
    }

    setFieldsString(newFieldsString);

    const formData = {
      recipientId: selectedRecipient,
      category,
      subject,
      body: messageBody,
    };

    dispatch(saveDraft(formData, type, draftId));
    if (!attachments.length) setNavigationError(null);
  };

  const sendMessageHandler = async () => {
    // TODO add GA event
    await setMessageInvalid(false);
    if (checkMessageValidity()) {
      setSendMessageFlag(true);
      setNavigationError(null);
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

  const setUnsavedNavigationError = () => {
    setNavigationError({
      ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE,
      confirmButtonText: 'Continue editing',
      cancelButtonText: 'Delete draft',
    });
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

  return (
    <form className="compose-form">
      {saveError && (
        <VaModal
          modalTitle={saveError.title}
          onPrimaryButtonClick={() => setSaveError(null)}
          onCloseEvent={() => setSaveError(null)}
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
      />
      <div className="compose-form-header" data-testid="compose-form-header">
        <h3>{setMessageTitle()}</h3>
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
                href={mhvUrl(isAuthenticatedWithSSOe(fullState), 'preferences')}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  setEditListModal(false);
                }}
              >
                Edit your contact list on the My HealtheVet website
              </a>
            </VaModal>

            <button
              type="button"
              className="link-button edit-input-button"
              onClick={() => setEditListModal(true)}
            >
              Edit List
            </button>
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
            value={messageBody}
            error={bodyError}
          />
        </div>
        <section className="attachments-section">
          <div className="compose-attachments-heading">Attachments</div>
          <HowToAttachFiles />
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
        <DraftSavedInfo userSaved={userSaved} />
        <div className="compose-form-actions vads-u-display--flex">
          <va-button
            text="Send"
            class="vads-u-flex--1 send-button"
            data-testid="Send-Button"
            onClick={sendMessageHandler}
          />
          <va-button
            id="save-draft-button"
            text="Save draft"
            secondary
            class="vads-u-flex--1 save-draft-button"
            data-testid="Save-Draft-Button"
            onClick={() => saveDraftHandler('manual')}
          />
          <div className="vads-u-flex--1">
            {draft && <DeleteDraft draft={draft} />}
          </div>
        </div>
      </div>
    </form>
  );
};

ComposeForm.propTypes = {
  draft: PropTypes.object,
  recipients: PropTypes.array,
};

export default ComposeForm;
