import React from 'react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import triageTeams from '../../fixtures/recipients.json';
import categories from '../../fixtures/categories-response.json';
import draftMessage from '../../fixtures/message-draft-response.json';
import oneBlockedRecipient from '../../fixtures/json-triage-mocks/triage-teams-one-blocked-mock.json';
import twoBlockedRecipients from '../../fixtures/json-triage-mocks/triage-teams-two-blocked-mock.json';
import noBlockedRecipients from '../../fixtures/json-triage-mocks/triage-teams-mock.json';
import reducer from '../../../reducers';
import signatureReducers from '../../fixtures/signature-reducers.json';
import ComposeForm from '../../../components/ComposeForm/ComposeForm';
import { Paths, Prompts } from '../../../util/constants';
import { messageSignatureFormatter } from '../../../util/helpers';
import * as messageActions from '../../../actions/messages';
import * as draftActions from '../../../actions/draftDetails';
import {
  inputVaTextInput,
  selectVaRadio,
  selectVaSelect,
} from '../../../util/testUtils';

describe('Compose form component', () => {
  const initialState = {
    sm: {
      triageTeams: { triageTeams },
      categories: { categories },
    },
  };

  const draftState = {
    sm: {
      triageTeams: { triageTeams },
      categories: { categories },
      draftDetails: { draftMessage },
    },
  };

  const setup = (customState, path, props) => {
    return renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} {...props} />,
      {
        initialState: customState,
        reducers: reducer,
        path,
      },
    );
  };

  const getProps = element => {
    let prop;
    Object.keys(element).forEach(key => {
      if (key.match(/^__react[^$]*(\$.+)$/)) {
        prop = key;
      }
    });
    return prop;
  };

  afterEach(() => {
    cleanup();
  });

  it('renders without errors', async () => {
    const screen = setup(initialState, Paths.COMPOSE);
    expect(screen);
  });

  it('displays compose fields if path is /new-message', async () => {
    const screen = setup(initialState, Paths.COMPOSE);

    const recipient = await screen.getByTestId('compose-recipient-select');
    const categoryRadioButtons = await screen.getAllByTestId(
      'compose-category-radio-button',
    );
    const subject = await screen.getByTestId('message-subject-field');
    const body = await screen.getByTestId('message-body-field');

    expect(recipient).to.exist;
    expect(categoryRadioButtons.length).to.equal(6);
    expect(subject).to.exist;
    expect(body).to.exist;
  });

  it('displays Edit List modal if path is /new-message', async () => {
    const screen = setup(initialState, Paths.COMPOSE);

    const editListLink = await screen.getByTestId('edit-preferences-button', {
      selector: 'button',
      exact: true,
    });
    expect(
      document.querySelector('#edit-list').getAttribute('visible'),
    ).to.equal('false');

    fireEvent.click(editListLink);
    const modalContent = await screen.getByText(
      Prompts.Compose.EDIT_PREFERENCES_CONTENT,
    );

    expect(
      document.querySelector('#edit-list').getAttribute('visible'),
    ).to.equal('true');
    expect(
      document.querySelector('.vads-c-action-link--green').getAttribute('href'),
    ).to.equal('https://mhv-syst.myhealth.va.gov/mhv-portal-web/preferences');
    expect(modalContent).to.exist;
    fireEvent.click(document.querySelector('.vads-c-action-link--green'));
  });

  it('displays compose action buttons if path is /new-message', async () => {
    const screen = setup(initialState, Paths.COMPOSE);

    const sendButton = await screen.getByTestId('Send-Button');
    const saveDraftButton = await screen.getByTestId('Save-Draft-Button');

    expect(sendButton).to.exist;
    expect(saveDraftButton).to.exist;
  });

  it('displays error states on empty fields when send button is clicked', async () => {
    const screen = setup(initialState, Paths.COMPOSE);

    const sendButton = screen.getByTestId('Send-Button');

    fireEvent.click(sendButton);

    const recipientInput = await screen.getByTestId('compose-recipient-select');

    const subjectInput = await screen.getByTestId('message-subject-field');
    const subjectInputError = subjectInput[getProps(subjectInput)].error;

    const messageInput = await screen.getByTestId('message-body-field');
    const messageInputError = messageInput[getProps(messageInput)].error;

    expect(recipientInput.error).to.equal('Please select a recipient.');
    expect(subjectInputError).to.equal('Subject cannot be blank.');
    expect(messageInputError).to.equal('Message body cannot be blank.');
  });

  it('displays draft page if path is /draft/:id', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm draft={draftMessage} recipients={triageTeams} />,
      {
        initialState: draftState,
        reducers: reducer,
        path: `/draft/${draftMessage.id}`,
      },
    );

    const deleteButton = await screen.getByTestId('delete-draft-button');

    expect(document.querySelector('form.compose-form')).to.exist;
    expect(deleteButton).to.exist;
  });

  it('renders without errors on send button click', async () => {
    const sendMessageSpy = sinon.spy(messageActions, 'sendMessage');
    const screen = setup(draftState, `/thread/${draftMessage.id}`, {
      draft: draftMessage,
    });

    fireEvent.click(screen.getByTestId('Send-Button'));
    await waitFor(() => {
      expect(sendMessageSpy.calledOnce).to.be.true;
    });
  });

  it('renders without errors on Save Draft button click', async () => {
    const saveDraftSpy = sinon.spy(draftActions, 'saveDraft');
    const screen = setup(draftState, `/thread/${draftMessage.id}`, {
      draft: draftMessage,
    });

    fireEvent.click(screen.getByTestId('Save-Draft-Button'));
    await waitFor(() => {
      expect(saveDraftSpy.calledOnce).to.be.true;
    });
  });

  it('displays user signature on /new-message when signature is enabled', async () => {
    const customState = {
      sm: {
        triageTeams: { triageTeams },
        categories: { categories },
        draftDetails: {},
        preferences: signatureReducers.signatureEnabled,
      },
    };
    const screen = setup(customState, Paths.COMPOSE);

    const messageInput = await screen.getByTestId('message-body-field');

    expect(messageInput)
      .to.have.attribute('value')
      .equal(
        messageSignatureFormatter(signatureReducers.signatureEnabled.signature),
      );
  });

  it('does not display user signature on /new-message when signature is disabled', async () => {
    const customState = {
      sm: {
        ...initialState.sm,
        preferences: signatureReducers.signatureDisabled,
      },
    };
    const screen = setup(customState, Paths.COMPOSE);

    const messageInput = await screen.getByTestId('message-body-field');

    expect(messageInput).to.not.have.attribute('value');
  });

  it('does not append an existing draft message body with enabled signature', async () => {
    const customState = {
      sm: {
        triageTeams: { triageTeams },
        categories: { categories },
        draftDetails: { draftMessage },
        preferences: signatureReducers.signatureEnabled,
      },
    };
    const screen = setup(customState, `/draft/${draftMessage.id}`, {
      draft: draftMessage,
    });

    const messageInput = await screen.getByTestId('message-body-field');

    expect(messageInput)
      .to.have.attribute('value')
      .not.equal(
        messageSignatureFormatter(signatureReducers.signatureEnabled.signature),
      );
  });

  it('displays an error on attempt to save a draft with attachments', async () => {
    const screen = setup(initialState, Paths.COMPOSE);
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const uploader = screen.getByTestId('attach-file-input');

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );
    expect(uploader.files[0].name).to.equal('test.png');
    fireEvent.click(screen.getByTestId('Save-Draft-Button'));
    let modal = null;
    await waitFor(() => {
      modal = screen.getByTestId('quit-compose-double-dare');
    });
    expect(modal).to.exist;
    expect(modal).to.have.attribute(
      'modaltitle',
      "We can't save attachments in a draft message",
    );

    fireEvent.click(
      document.querySelector('va-button[text="Continue editing"]'),
    );
  });

  it('renders without errors to category selection', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );

    await waitFor(() => {
      selectVaRadio(screen.container, 'COVID');
      expect(
        $('va-radio-option[value="COVID"]', screen.container),
      ).to.have.attribute('checked', 'true');
    });
  });

  it('renders without errors to recipient selection', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );
    const val = triageTeams[0].name;
    selectVaSelect(screen.container, val);
    waitFor(() => {
      expect(screen.getByTestId('compose-recipient-select')).to.have.value(val);
    });
  });

  it('renders without errors to subject input', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );
    const val = 'Test Subject';
    inputVaTextInput(screen.container, val);
    await waitFor(() => {
      expect(screen.getByTestId('message-subject-field')).to.have.value(val);
    });
  });

  it('renders without errors to message body input', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );
    const val = 'test body';
    inputVaTextInput(screen.container, val, 'va-textarea');
    await waitFor(() => {
      expect(screen.getByTestId('message-body-field')).to.have.value(val);
    });
  });

  it('adds eventListener if path is /new-message', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );

    const addEventListenerSpy = sinon.spy(window, 'addEventListener');
    expect(addEventListenerSpy.calledWith('beforeunload')).to.be.false;
    fireEvent.input(screen.getByTestId('message-subject-field'), {
      target: { innerHTML: 'test beforeunload event' },
    });

    expect(addEventListenerSpy.calledWith('beforeunload')).to.be.true;
  });

  it('adds eventListener if path is /draft/:id', async () => {
    const state = {
      sm: {
        triageTeams: { triageTeams },
        categories: { categories },
        draftDetails: { draftMessage },
      },
    };
    const screen = renderWithStoreAndRouter(
      <ComposeForm draft={draftMessage} recipients={triageTeams} />,
      {
        initialState: state,
        reducers: reducer,
        path: `/draft/${draftMessage.id}`,
      },
    );

    const addEventListenerSpy = sinon.spy(window, 'addEventListener');
    expect(addEventListenerSpy.calledWith('beforeunload')).to.be.false;
    fireEvent.input(screen.getByTestId('message-subject-field'), {
      target: { innerHTML: 'test beforeunload event' },
    });

    expect(addEventListenerSpy.calledWith('beforeunload')).to.be.true;
  });

  it('does not display BlockedTriageGroupAlert if user is not blocked from groups', async () => {
    const customState = {
      sm: {
        categories: { categories },
        draftDetails: { draftMessage },
        recipients: {
          allRecipients: noBlockedRecipients.mockAllRecipients,
          allowedRecipients: noBlockedRecipients.mockAllowedRecipients,
          blockedRecipients: noBlockedRecipients.mockBlockedRecipients,
          associatedTriageGroupsQty:
            noBlockedRecipients.meta.associatedTriageGroups,
          associatedBlockedTriageGroupsQty:
            noBlockedRecipients.meta.associatedBlockedTriageGroups,
        },
      },
      featureToggles: {},
    };

    customState.featureToggles[
      `${'mhv_secure_messaging_blocked_triage_group_1_0'}`
    ] = true;

    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm
        draft={customDraftMessage}
        recipients={customState.sm.recipients}
      />,
      {
        initialState: customState,
        reducers: reducer,
        path: `/thread/${customDraftMessage.id}`,
      },
    );

    expect(screen.queryByTestId('blocked-triage-group-alert')).to.not.exist;
  });

  it('displays BlockedTriageGroupAlert if saved-draft recipient is blocked from 1 group', async () => {
    const customState = {
      sm: {
        categories: { categories },
        draftDetails: { draftMessage },
        recipients: {
          allRecipients: oneBlockedRecipient.mockAllRecipients,
          allowedRecipients: oneBlockedRecipient.mockAllowedRecipients,
          blockedRecipients: oneBlockedRecipient.mockBlockedRecipients,
          associatedTriageGroupsQty:
            oneBlockedRecipient.meta.associatedTriageGroups,
          associatedBlockedTriageGroupsQty:
            oneBlockedRecipient.meta.associatedBlockedTriageGroups,
        },
      },
      featureToggles: {},
    };

    customState.featureToggles[
      `${'mhv_secure_messaging_blocked_triage_group_1_0'}`
    ] = true;

    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm
        draft={customDraftMessage}
        recipients={customState.sm.recipients}
      />,
      {
        initialState: customState,
        reducers: reducer,
        path: `/thread/${customDraftMessage.id}`,
      },
    );

    expect(screen.findByTestId('blocked-triage-group-alert')).to.exist;
    expect(
      screen.queryByTestId('blocked-triage-group-alert'),
    ).to.have.attribute(
      'trigger',
      "You can't send messages to ***MEDICATION_AWARENESS_100% @ MOH_DAYT29",
    );
  });

  it('displays BlockedTriageGroupAlert with blocked group list if saved-draft recipient is blocked', async () => {
    const customState = {
      sm: {
        categories: { categories },
        draftDetails: { draftMessage },
        recipients: {
          allRecipients: twoBlockedRecipients.mockAllRecipients,
          allowedRecipients: twoBlockedRecipients.mockAllowedRecipients,
          blockedRecipients: twoBlockedRecipients.mockBlockedRecipients,
          associatedTriageGroupsQty:
            twoBlockedRecipients.meta.associatedTriageGroups,
          associatedBlockedTriageGroupsQty:
            twoBlockedRecipients.meta.associatedBlockedTriageGroups,
        },
      },
      featureToggles: {},
    };

    customState.featureToggles[
      `${'mhv_secure_messaging_blocked_triage_group_1_0'}`
    ] = true;

    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm
        draft={customDraftMessage}
        recipients={customState.sm.recipients}
      />,
      {
        initialState: customState,
        reducers: reducer,
        path: `/thread/${customDraftMessage.id}`,
      },
    );

    expect(screen.findByTestId('blocked-triage-group-alert')).to.exist;
    expect(
      screen.queryByTestId('blocked-triage-group-alert'),
    ).to.have.attribute(
      'trigger',
      "You can't send messages to certain providers",
    );
    expect(screen.queryAllByTestId('blocked-triage-group').length).to.equal(2);
  });
});
