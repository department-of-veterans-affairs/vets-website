import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { commonReducer } from 'platform/startup/store';
import {
  mockApiRequest,
  inputVaTextInput,
} from '@department-of-veterans-affairs/platform-testing/helpers';
// recordEvent ultimately pushes to window.dataLayer; we assert on that side effect
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import triageTeams from '../../fixtures/recipients.json';
import categories from '../../fixtures/categories-response.json';
import draftMessage from '../../fixtures/message-draft-response.json';
import oneBlockedRecipient from '../../fixtures/json-triage-mocks/triage-teams-one-blocked-mock.json';
import twoBlockedRecipients from '../../fixtures/json-triage-mocks/triage-teams-two-blocked-mock.json';
import noBlockedRecipients from '../../fixtures/json-triage-mocks/triage-teams-mock.json';
import lostAssociation from '../../fixtures/json-triage-mocks/triage-teams-lost-association.json';
import noAssociationsAtAll from '../../fixtures/json-triage-mocks/triage-teams-no-associations-at-all-mock.json';
import blockedFacility from '../../fixtures/json-triage-mocks/triage-teams-facility-blocked-mock.json';
import blockedFacilityAndTeam from '../../fixtures/json-triage-mocks/triage-teams-facility-and-team-blocked-mock.json';
import allBlockedAssociations from '../../fixtures/json-triage-mocks/triage-teams-all-blocked-mock.json';
import reducer from '../../../reducers';
import signatureReducers from '../../fixtures/signature-reducers.json';
import * as threadDetailsActions from '../../../actions/threadDetails';
import ComposeForm from '../../../components/ComposeForm/ComposeForm';
import {
  Paths,
  Prompts,
  ElectronicSignatureBox,
  ErrorMessages,
  DefaultFolders,
  MessageHintText,
} from '../../../util/constants';
import { messageSignatureFormatter } from '../../../util/helpers';
import * as messageActions from '../../../actions/messages';
import * as draftActions from '../../../actions/draftDetails';
import * as categoriesActions from '../../../actions/categories';
import * as helperUtils from '../../../util/helpers';
import threadDetailsReducer from '../../fixtures/threads/reply-draft-thread-reducer.json';
import {
  getProps,
  selectVaSelect,
  checkVaCheckbox,
} from '../../../util/testUtils';
import { drupalStaticData } from '../../fixtures/cerner-facility-mock-data.json';

describe('Compose form component', () => {
  let stub;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    if (stub) {
      stub.restore();
      stub = null;
    }
    if (sandbox) {
      sandbox.restore();
    }
    cleanup();
  });
  const stubUseFeatureToggles = value => {
    const useFeatureToggles = require('../../../hooks/useFeatureToggles');
    stub = sandbox.stub(useFeatureToggles, 'default').returns(value);
    return stub;
  };

  const initialState = {
    sm: {
      triageTeams: { triageTeams },
      categories: { categories },
      recipients: {
        allRecipients: noBlockedRecipients.mockAllRecipients,
        allowedRecipients: noBlockedRecipients.mockAllowedRecipients,
        blockedRecipients: noBlockedRecipients.mockBlockedRecipients,
        associatedTriageGroupsQty:
          noBlockedRecipients.associatedTriageGroupsQty,
        associatedBlockedTriageGroupsQty:
          noBlockedRecipients.associatedBlockedTriageGroupsQty,
        noAssociations: noBlockedRecipients.noAssociations,
        allTriageGroupsBlocked: noBlockedRecipients.allTriageGroupsBlocked,
      },
      preferences: { signature: {} },
      prescription: {
        renewalPrescription: undefined,
        redirectPath: undefined,
        error: undefined,
        isLoading: false,
      },
    },
    drupalStaticData,
    featureToggles: {},
  };

  const draftState = {
    sm: {
      triageTeams: { triageTeams },
      categories: { categories },
      threadDetails: {
        ...threadDetailsReducer.threadDetails,
        draftInProgress: {
          recipientId: threadDetailsReducer.threadDetails.drafts[0].recipientId,
          recipientName:
            threadDetailsReducer.threadDetails.drafts[0].recipientName,
          category: threadDetailsReducer.threadDetails.drafts[0].category,
          subject: threadDetailsReducer.threadDetails.drafts[0].subject,
          body: threadDetailsReducer.threadDetails.drafts[0].body,
        },
      },
      recipients: {
        allRecipients: noBlockedRecipients.mockAllRecipients,
        allowedRecipients: noBlockedRecipients.mockAllowedRecipients,
        blockedRecipients: noBlockedRecipients.mockBlockedRecipients,
        associatedTriageGroupsQty:
          noBlockedRecipients.associatedTriageGroupsQty,
        associatedBlockedTriageGroupsQty:
          noBlockedRecipients.associatedBlockedTriageGroupsQty,
        noAssociations: noBlockedRecipients.noAssociations,
        allTriageGroupsBlocked: noBlockedRecipients.allTriageGroupsBlocked,
      },
      prescription: {
        renewalPrescription: undefined,
        redirectPath: undefined,
        error: undefined,
        isLoading: false,
      },
    },
    drupalStaticData,
    featureToggles: {},
  };
  const setup = (customState, path, props) => {
    return renderWithStoreAndRouter(
      <ComposeForm
        recipients={initialState.sm.recipients}
        categories={categories}
        {...props}
      />,
      {
        initialState: customState,
        reducers: reducer,
        path,
      },
    );
  };

  it('renders without errors', async () => {
    const screen = setup(initialState, Paths.COMPOSE);
    expect(screen);
  });

  it('records prefilling analytics when Rx renewal draft loads', async () => {
    window.dataLayer = [];
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        prescription: {
          ...initialState.sm.prescription,
          renewalPrescription: {
            prescriptionId: 123,
          },
        },
      },
    };

    setup(customState, Paths.COMPOSE);

    await waitFor(() => {
      expect(
        window.dataLayer?.some(e => e?.event === 'sm_editor_prefill_loaded'),
      ).to.be.true;
    });
  });

  it('records analytics when user clears prefilled textarea', async () => {
    window.dataLayer = [];
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        preferences: signatureReducers.signatureEnabled,
        threadDetails: {
          ...threadDetailsReducer.threadDetails,
          draftInProgress: {
            ...threadDetailsReducer.threadDetails.draftInProgress,
          },
        },
      },
    };

    const screen = setup(customState, Paths.COMPOSE, {
      ...signatureReducers.signatureEnabled,
    });

    const messageEl = await screen.getByTestId('message-body-field');
    // Ensure prefilled (signature) value is present
    expect(messageEl).to.have.attribute('value');

    // Clear the textarea value using testing-library helper (empty string triggers 'deleted' event)
    inputVaTextInput(screen.container, '', 'va-textarea');

    await waitFor(() => {
      const hasClearedEvent = window.dataLayer?.some(
        e => e?.event === 'sm_editor_prefill_deleted',
      );
      expect(hasClearedEvent).to.be.true;
    });
  });

  it('records analytics when user edits prefilled textarea (non-empty)', async () => {
    window.dataLayer = [];
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        preferences: signatureReducers.signatureEnabled,
        threadDetails: {
          ...threadDetailsReducer.threadDetails,
          draftInProgress: {
            ...threadDetailsReducer.threadDetails.draftInProgress,
          },
        },
      },
    };

    const screen = setup(customState, Paths.COMPOSE, {
      ...signatureReducers.signatureEnabled,
    });

    const messageEl = await screen.getByTestId('message-body-field');
    expect(messageEl).to.have.attribute('value');

    // Change value to something different (non-empty)
    inputVaTextInput(screen.container, 'Edited content', 'va-textarea');

    await waitFor(() => {
      const hasEditedEvent = window.dataLayer?.some(
        e => e?.event === 'sm_editor_prefill_edited',
      );
      expect(hasEditedEvent).to.be.true;
    });
  });

  it('displays compose fields if path is /new-message', async () => {
    const screen = setup(initialState, Paths.COMPOSE);

    const recipient = await screen.getByTestId('compose-recipient-select');
    const categoryDropdown = await screen.getByTestId(
      'compose-message-categories',
    );
    const subject = await screen.getByTestId('message-subject-field');
    const body = await screen.getByTestId('message-body-field');

    expect(recipient).to.exist;
    expect(categoryDropdown).to.exist;
    expect(subject).to.exist;
    expect(body).to.exist;
  });

  it('displays compose action buttons if path is /new-message', async () => {
    const screen = setup(initialState, Paths.COMPOSE);

    const sendButton = await screen.getByTestId('send-button');
    const saveDraftButton = await screen.getByTestId('save-draft-button');

    expect(sendButton).to.exist;
    expect(saveDraftButton).to.exist;
  });

  it('displays error states on empty fields when send button is clicked', async () => {
    const screen = setup(initialState, Paths.COMPOSE);

    const sendButton = screen.getByTestId('send-button');

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
    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
    };

    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        threadDetails: {
          ...draftState.sm.threadDetails,
          drafts: [customDraftMessage],
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm
        draft={customDraftMessage}
        recipients={customState.sm.recipients}
      />,
      {
        initialState: customState,
        reducers: reducer,
        path: `/draft/${customDraftMessage.id}`,
      },
    );

    const deleteButton = await screen.getByTestId('delete-draft-button');

    expect(document.querySelector('form.compose-form')).to.exist;
    expect(deleteButton).to.exist;
  });

  it('renders without errors on send button click', async () => {
    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
    };

    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        threadDetails: {
          ...draftState.sm.threadDetails,
          drafts: [customDraftMessage],
        },
      },
    };

    const sendMessageSpy = sandbox.spy(messageActions, 'sendMessage');
    const screen = setup(customState, `/thread/${customDraftMessage.id}`, {
      draft: customDraftMessage,
      recipients: customState.sm.recipients,
    });

    fireEvent.click(screen.getByTestId('send-button'));
    await waitFor(() => {
      expect(sendMessageSpy.calledOnce).to.be.true;
      sendMessageSpy.restore();
    });
  });

  it('clears draftInProgress on send button click', async () => {
    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
    };

    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        draftDetails: { customDraftMessage },
      },
    };

    const clearDraftInProgressSpy = sandbox.spy(
      threadDetailsActions,
      'clearDraftInProgress',
    );

    const screen = setup(customState, `/thread/${customDraftMessage.id}`, {
      draft: customDraftMessage,
      recipients: customState.sm.recipients,
    });

    mockApiRequest({});
    fireEvent.click(screen.getByTestId('send-button'));

    await waitFor(() => {
      expect(clearDraftInProgressSpy.calledOnce).to.be.true;
      clearDraftInProgressSpy.restore();
    });
  });

  it('renders sending message spinner without errors', async () => {
    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
    };

    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        threadDetails: {
          ...draftState.sm.threadDetails,
          drafts: [customDraftMessage],
        },
      },
    };

    const screen = setup(customState, `/thread/${customDraftMessage.id}`, {
      draft: customDraftMessage,
      recipients: customState.sm.recipients,
    });
    expect(screen.queryByTestId('sending-indicator')).to.equal(null);
    fireEvent.click(screen.getByTestId('send-button'));
    await waitFor(() => {
      expect(screen.getByTestId('sending-indicator')).to.have.attribute(
        'message',
        'Sending message...',
      );
    });
  });

  it('renders sending message spinner without errors with largeAttachmentsEnabled feature flag ', async () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: true,
    });
    useFeatureTogglesStub;

    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
    };

    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        threadDetails: {
          ...draftState.sm.threadDetails,
          drafts: [customDraftMessage],
        },
      },
    };

    const screen = setup(customState, `/thread/${customDraftMessage.id}`, {
      draft: customDraftMessage,
      recipients: customState.sm.recipients,
    });
    expect(screen.queryByTestId('sending-indicator')).to.equal(null);
    fireEvent.click(screen.getByTestId('send-button'));
    await waitFor(() => {
      expect(screen.getByTestId('sending-indicator')).to.have.attribute(
        'message',
        'Do not refresh the page. Sending message...',
      );
    });
  });

  it('renders without errors on Save Draft button click', async () => {
    const saveDraftSpy = sandbox.spy(draftActions, 'saveDraft');
    const screen = setup(draftState, `/thread/${draftMessage.id}`, {
      draft: draftMessage,
      recipients: draftState.sm.recipients,
      isSignatureRequired: false,
      messageValid: true,
    });

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('save-draft-button'));
      expect(saveDraftSpy.calledOnce).to.be.true;
    });
  });

  it('displays user signature on /new-message when signature is enabled', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        triageTeams: { triageTeams },
        categories: { categories },
        threadDetails: {
          drafts: [],
          draftInProgress: {},
        },
        preferences: signatureReducers.signatureEnabled,
      },
    };
    const screen = setup(customState, Paths.COMPOSE, {
      ...signatureReducers.signatureEnabled,
    });

    const messageInput = await screen.getByTestId('message-body-field');

    expect(messageInput)
      .to.have.attribute('value')
      .equal(
        messageSignatureFormatter(signatureReducers.signatureEnabled.signature),
      );
  });

  it('does not display user signature on /new-message when signature is disabled', async () => {
    const customState = {
      ...initialState,
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
    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
    };

    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        triageTeams: { triageTeams },
        categories: { categories },
        threadDetails: {
          ...draftState.sm.threadDetails,
          drafts: [customDraftMessage],
        },
        preferences: signatureReducers.signatureEnabled,
      },
      featureToggles: {},
    };

    const screen = setup(customState, `/draft/${customDraftMessage.id}`, {
      draft: customDraftMessage,
    });

    const messageInput = await screen.getByTestId('message-body-field');

    await waitFor(() => {
      expect(messageInput)
        .to.have.attribute('value')
        .not.equal(
          messageSignatureFormatter(
            signatureReducers.signatureEnabled.signature,
          ),
        );
    });
  });

  it('displays an error on attempt to save a draft with attachments', async () => {
    const customProps = {
      ...draftMessage,
      messageValid: true,
      isSignatureRequired: false,
    };
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        threadDetails: {
          draftInProgress: {
            recipientId:
              threadDetailsReducer.threadDetails.drafts[0].recipientId,
            recipientName:
              threadDetailsReducer.threadDetails.drafts[0].recipientName,
            category: threadDetailsReducer.threadDetails.drafts[0].category,
            subject: threadDetailsReducer.threadDetails.drafts[0].subject,
            body: threadDetailsReducer.threadDetails.drafts[0].body,
          },
        },
      },
    };
    const screen = setup(customState, Paths.COMPOSE, { draft: customProps });
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const uploader = screen.getByTestId('attach-file-input');

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );
    expect(uploader.files[0].name).to.equal('test.png');
    let modal = null;

    fireEvent.click(screen.getByTestId('save-draft-button'));
    await waitFor(() => {
      modal = screen.queryByTestId('navigation-warning-modal');
      expect(modal).to.exist;
    });
    expect(modal).to.have.attribute(
      'modal-title',
      "We can't save attachments in a draft message",
    );

    fireEvent.click(document.querySelector('va-button[text="Edit draft"]'));
  });

  it('renders without errors to category selection', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm
        recipients={initialState.sm.recipients}
        categories={categories}
      />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );

    await waitFor(() => {
      selectVaSelect(
        screen.container,
        'COVID',
        'va-select[data-testid="compose-message-categories"]',
      );
      expect(screen.getByTestId('compose-message-categories')).to.exist;
    });
  });

  it('renders a loading indicator if categories are not available', async () => {
    const getCategoriesSpy = sandbox.spy(categoriesActions, 'getCategories');
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        categories: undefined,
      },
    };
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={initialState.sm.recipients} />,
      {
        initialState: customState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );
    expect(document.querySelector('va-loading-indicator')).to.exist;
    await waitFor(() => {
      expect(screen.getByTestId('compose-recipient-select')).to.exist;
    });
    waitFor(() => {
      expect(getCategoriesSpy.calledOnce).to.be.true;
    });
  });

  it('renders without errors to recipient selection', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={initialState.sm.recipients} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );
    const val = initialState.sm.recipients.allowedRecipients[0].id;
    selectVaSelect(screen.container, val);
    waitFor(() => {
      expect(screen.getByTestId('compose-recipient-select')).to.have.value(val);
    });
  });

  it('renders without errors to subject input', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={initialState.sm.recipients} />,
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
      <ComposeForm recipients={initialState.sm.recipients} />,
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
      <ComposeForm recipients={initialState.sm.recipients} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );

    const addEventListenerSpy = sandbox.spy(window, 'addEventListener');
    expect(addEventListenerSpy.calledWith('beforeunload')).to.be.false;
    fireEvent.input(screen.getByTestId('message-subject-field'), {
      target: { innerHTML: 'test beforeunload event' },
    });
    waitFor(() => {
      expect(addEventListenerSpy.calledWith('beforeunload')).to.be.true;
    });
  });

  it('adds eventListener if path is /draft/:id', async () => {
    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
    };

    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        triageTeams: { triageTeams },
        categories: { categories },
        threadDetails: {
          ...draftState.sm.threadDetails,
          drafts: [customDraftMessage],
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm
        draft={customDraftMessage}
        recipients={customState.sm.recipients}
      />,
      {
        initialState: customState,
        reducers: reducer,
        path: `/draft/${draftMessage.id}`,
      },
    );

    const addEventListenerSpy = sandbox.spy(window, 'addEventListener');
    expect(addEventListenerSpy.calledWith('beforeunload')).to.be.false;
    fireEvent.input(screen.getByTestId('message-subject-field'), {
      target: { innerHTML: 'test beforeunload event' },
    });
    waitFor(() => {
      expect(addEventListenerSpy.calledWith('beforeunload')).to.be.true;
    });
  });

  it('does not display BlockedTriageGroupAlert on a saved draft if user is not blocked from groups', async () => {
    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
    };

    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        threadDetails: {
          ...draftState.sm.threadDetails,
          drafts: [customDraftMessage],
        },
      },
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
      ...draftState,
      sm: {
        ...draftState.sm,
        recipients: {
          allRecipients: oneBlockedRecipient.mockAllRecipients,
          allowedRecipients: oneBlockedRecipient.mockAllowedRecipients,
          blockedRecipients: oneBlockedRecipient.mockBlockedRecipients,
          associatedTriageGroupsQty:
            oneBlockedRecipient.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            oneBlockedRecipient.associatedBlockedTriageGroupsQty,
          noAssociations: oneBlockedRecipient.noAssociations,
          allTriageGroupsBlocked: oneBlockedRecipient.allTriageGroupsBlocked,
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm
        draft={customState.sm.threadDetails.drafts[0]}
        recipients={customState.sm.recipients}
      />,
      {
        initialState: customState,
        reducers: reducer,
        path: `/thread/${customState.sm.threadDetails.drafts[0].id}`,
      },
    );

    const blockedTriageGroupAlert = await screen.findByTestId(
      'blocked-triage-group-alert',
    );
    await waitFor(() => {
      expect(blockedTriageGroupAlert).to.exist;
      expect(blockedTriageGroupAlert).to.have.attribute(
        'trigger',
        "You can't send messages to SM_TO_VA_GOV_TRIAGE_GROUP_TEST",
      );
    });
    const viewOnlyDraftSections = screen.queryAllByTestId(
      'view-only-draft-section',
    );
    expect(viewOnlyDraftSections.length).to.equal(0);
  });

  it('displays BlockedTriageGroupAlert if multiple groups are blocked, including saved-draft recipient', async () => {
    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        recipients: {
          allRecipients: twoBlockedRecipients.mockAllRecipients,
          allowedRecipients: twoBlockedRecipients.mockAllowedRecipients,
          blockedRecipients: twoBlockedRecipients.mockBlockedRecipients,
          blockedFacilities: [],
          associatedTriageGroupsQty:
            twoBlockedRecipients.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            twoBlockedRecipients.associatedBlockedTriageGroupsQty,
          noAssociations: twoBlockedRecipients.noAssociations,
          allTriageGroupsBlocked: twoBlockedRecipients.allTriageGroupsBlocked,
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm
        draft={customState.sm.threadDetails.drafts[0]}
        recipients={customState.sm.recipients}
      />,
      {
        initialState: customState,
        reducers: reducer,
        path: `/thread/${customState.sm.threadDetails.drafts[0].id}`,
      },
    );

    const blockedTriageGroupAlert = await screen.findByTestId(
      'blocked-triage-group-alert',
    );

    await waitFor(() => {
      expect(blockedTriageGroupAlert).to.exist;
      expect(blockedTriageGroupAlert).to.have.attribute(
        'trigger',
        "You can't send messages to some of your care teams",
      );
    });
    expect(screen.queryAllByTestId('blocked-triage-group').length).to.equal(2);
  });

  it('displays BlockedTriageGroupAlert if saved-draft recipient is not associated with user', async () => {
    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        recipients: {
          allRecipients: lostAssociation.mockAllRecipients,
          allowedRecipients: lostAssociation.mockAllowedRecipients,
          blockedRecipients: lostAssociation.mockBlockedRecipients,
          associatedTriageGroupsQty: lostAssociation.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            lostAssociation.associatedBlockedTriageGroupsQty,
          noAssociations: lostAssociation.noAssociations,
          allTriageGroupsBlocked: lostAssociation.allTriageGroupsBlocked,
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm
        draft={customState.sm.threadDetails.drafts[0]}
        recipients={customState.sm.recipients}
      />,
      {
        initialState: customState,
        reducers: reducer,
        path: `/thread/${customState.sm.threadDetails.drafts[0].id}`,
      },
    );

    const blockedTriageGroupAlert = await screen.findByTestId(
      'blocked-triage-group-alert',
    );

    waitFor(() => {
      expect(blockedTriageGroupAlert).to.exist;
      expect(blockedTriageGroupAlert).to.have.attribute(
        'trigger',
        'Your account is no longer connected to SM_TO_VA_GOV_TRIAGE_GROUP_TEST',
      );
    });
  });

  it('displays BlockedTriageGroupAlert if there are no associations at all', async () => {
    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        recipients: {
          allRecipients: noAssociationsAtAll.mockAllRecipients,
          allowedRecipients: noAssociationsAtAll.mockAllowedRecipients,
          blockedRecipients: noAssociationsAtAll.mockBlockedRecipients,
          associatedTriageGroupsQty:
            noAssociationsAtAll.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            noAssociationsAtAll.associatedBlockedTriageGroupsQty,
          noAssociations: noAssociationsAtAll.noAssociations,
          allTriageGroupsBlocked: noAssociationsAtAll.allTriageGroupsBlocked,
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm
        draft={customState.sm.threadDetails.drafts[0]}
        recipients={customState.sm.recipients}
      />,
      {
        initialState: customState,
        reducers: reducer,
        path: `/thread/${customState.sm.threadDetails.drafts[0].id}`,
      },
    );

    await waitFor(() => {
      const blockedTriageGroupAlert = screen.getByTestId(
        'blocked-triage-group-alert',
      );
      expect(blockedTriageGroupAlert).to.exist;
      expect(blockedTriageGroupAlert).to.have.attribute(
        'trigger',
        "You're not connected to any care teams in this messaging tool",
      );
    });
    const viewOnlyDraftSections = screen.queryAllByTestId(
      'view-only-draft-section',
    );
    expect(viewOnlyDraftSections.length).to.equal(3);
    viewOnlyDraftSections.forEach((draftSection, index) => {
      expect(draftSection.firstChild.tagName).to.equal('STRONG');
      if (index === 0) {
        expect(draftSection.lastChild.textContent).to.equal(
          'COVID: Ask COVID related questions',
        );
      }
      if (index === 1) {
        expect(draftSection.lastChild.textContent).to.equal(
          customState.sm.threadDetails.drafts[0].subject,
        );
      }
      if (index === 2) {
        expect(draftSection.lastChild.textContent).to.equal(
          customState.sm.threadDetails.drafts[0].messageBody,
        );
      }
    });
    expect(screen.queryByTestId('send-button')).to.not.exist;
  });

  it('displays BlockedTriageGroupAlert if blocked from one facility', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          allRecipients: blockedFacility.mockAllRecipients,
          allowedRecipients: blockedFacility.mockAllowedRecipients,
          blockedRecipients: blockedFacility.mockBlockedRecipients,
          blockedFacilities: blockedFacility.mockBlockedFacilities,
          associatedTriageGroupsQty: blockedFacility.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            blockedFacility.associatedBlockedTriageGroupsQty,
          noAssociations: blockedFacility.noAssociations,
          allTriageGroupsBlocked: blockedFacility.allTriageGroupsBlocked,
        },
        threadDetails: {
          draftInProgress: {},
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={customState.sm.recipients} />,
      {
        initialState: customState,
        reducers: reducer,
      },
    );

    const blockedTriageGroupAlert = await screen.findByTestId(
      'blocked-triage-group-alert',
    );
    waitFor(() => {
      expect(blockedTriageGroupAlert).to.exist;
      expect(blockedTriageGroupAlert).to.have.attribute(
        'trigger',
        "You can't send messages to care teams at VA Indiana health care",
      );
    });
  });

  it('displays BlockedTriageGroupAlert with list if blocked from one facility and care team at another facility', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          allRecipients: blockedFacilityAndTeam.mockAllRecipients,
          allowedRecipients: blockedFacilityAndTeam.mockAllowedRecipients,
          blockedRecipients: blockedFacilityAndTeam.mockBlockedRecipients,
          blockedFacilities: blockedFacilityAndTeam.mockBlockedFacilities,
          associatedTriageGroupsQty:
            blockedFacilityAndTeam.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            blockedFacilityAndTeam.associatedBlockedTriageGroupsQty,
          noAssociations: blockedFacilityAndTeam.noAssociations,
          allTriageGroupsBlocked: blockedFacilityAndTeam.allTriageGroupsBlocked,
        },
        threadDetails: {
          draftInProgress: {},
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={customState.sm.recipients} />,
      {
        initialState: customState,
        reducers: reducer,
      },
    );

    const blockedTriageGroupAlert = await screen.findByTestId(
      'blocked-triage-group-alert',
    );
    await waitFor(() => {
      expect(blockedTriageGroupAlert).to.exist;
      expect(blockedTriageGroupAlert).to.have.attribute(
        'trigger',
        "You can't send messages to some of your care teams",
      );
    });
    const blockedList = screen.queryAllByTestId('blocked-triage-group');
    expect(blockedList.length).to.equal(2);
    expect(
      blockedTriageGroupAlert.querySelector('ul li:last-child').textContent,
    ).to.equal('Care teams at VA Indiana health care');
  });

  it('displays BlockedTriageGroupAlert if blocked from all associated teams', async () => {
    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        recipients: {
          allRecipients: allBlockedAssociations.mockAllRecipients,
          allowedRecipients: allBlockedAssociations.mockAllowedRecipients,
          blockedRecipients: allBlockedAssociations.mockBlockedRecipients,
          associatedTriageGroupsQty:
            allBlockedAssociations.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            allBlockedAssociations.associatedBlockedTriageGroupsQty,
          noAssociations: allBlockedAssociations.noAssociations,
          allTriageGroupsBlocked: allBlockedAssociations.allTriageGroupsBlocked,
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm
        draft={customState.sm.threadDetails.drafts[0]}
        recipients={customState.sm.recipients}
      />,
      {
        initialState: customState,
        reducers: reducer,
        path: `/thread/${customState.sm.threadDetails.drafts[0].id}`,
      },
    );

    await waitFor(() => {
      const blockedTriageGroupAlert = screen.getByTestId(
        'blocked-triage-group-alert',
      );
      expect(blockedTriageGroupAlert).to.have.attribute(
        'trigger',
        "You can't send messages to your care teams right now",
      );
    });
    expect(screen.queryByTestId('send-button')).to.not.exist;
  });

  it('displays alerts in Electronic Signature component if signature is required', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={initialState.sm.recipients} />,
      {
        initialState,
        reducers: reducer,
      },
    );
    const val = initialState.sm.recipients.allowedRecipients.find(
      r => r.signatureRequired,
    ).id;
    selectVaSelect(screen.container, val);

    const electronicSignature = await screen.findByText(
      ElectronicSignatureBox.TITLE,
      {
        selector: 'h2',
      },
    );
    expect(electronicSignature).to.exist;
    const alert = screen.getByTestId('signature-alert');
    expect(alert).to.have.attribute('visible', 'true');
    expect(alert.textContent).to.contain(Prompts.Compose.SIGNATURE_REQUIRED);
    const signatureTextFieldSelector = 'va-text-input[label="Your full name"]';
    const signatureTextField = screen.container.querySelector(
      signatureTextFieldSelector,
    );
    inputVaTextInput(
      screen.container,
      'Test$# User',
      signatureTextFieldSelector,
    );
    expect(signatureTextField).to.have.attribute(
      'error',
      'You entered a character we can’t accept. Try removing $, #',
    );
    inputVaTextInput(screen.container, 'Test User', signatureTextFieldSelector);
    expect(signatureTextField).to.have.attribute('error', '');
  });

  it('displays an error in Electronic Signature component if checkbox is not checked', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={initialState.sm.recipients} />,
      {
        initialState,
        reducers: reducer,
      },
    );
    // Enters value for all other compose form fields first
    const tgRecipient = initialState.sm.recipients.allowedRecipients.find(
      r => r.signatureRequired,
    ).id;
    selectVaSelect(screen.container, tgRecipient);

    const checkboxSelector = `va-checkbox[label="${
      ElectronicSignatureBox.CHECKBOX_LABEL
    }"]`;

    await waitFor(() => {
      const sendButton = screen.getByTestId('send-button');
      const checkbox = screen.container.querySelector(checkboxSelector);
      checkVaCheckbox(checkbox, false);

      // after clicking send, validation checks on Electronic Signature component runs
      fireEvent.click(sendButton);
      expect(checkbox).to.have.attribute(
        'error',
        `${ErrorMessages.ComposeForm.CHECKBOX_REQUIRED}`,
      );

      checkVaCheckbox(checkbox, true);
      expect(checkbox).to.have.attribute('error', '');
    });
  });

  it('displays modal on attempt to manual save with electronic signature populated', async () => {
    const customProps = {
      ...draftMessage,
      recipientId: 2710523, // This recipient requires signature
      messageValid: true,
    };
    const screen = setup(initialState, Paths.COMPOSE, { draft: customProps });
    await waitFor(() => {
      expect(screen.getByTestId('compose-recipient-select')).to.exist;
      expect(screen.getByTestId('save-draft-button')).to.exist;
    });

    const val = initialState.sm.recipients.allowedRecipients.find(
      r => r.signatureRequired,
    ).id;

    selectVaSelect(screen.container, val);
    await waitFor(() => {
      const electronicSignature = screen.getByText(
        ElectronicSignatureBox.TITLE,
        { selector: 'h2' },
      );
      expect(electronicSignature).to.exist;
    });

    const signatureTextFieldSelector = 'va-text-input[label="Your full name"]';

    // Wait for the signature text field to be available
    await waitFor(() => {
      const signatureField = screen.container.querySelector(
        signatureTextFieldSelector,
      );
      expect(signatureField).to.exist;
    });

    // Input signature value and wait for it to be processed
    inputVaTextInput(screen.container, 'Test User', signatureTextFieldSelector);

    await waitFor(() => {
      const signatureField = screen.container.querySelector(
        signatureTextFieldSelector,
      );
      expect(
        signatureField.value || signatureField.getAttribute('value'),
      ).to.equal('Test User');
    });

    fireEvent.click(screen.getByTestId('save-draft-button'));
    await waitFor(() => {
      const modal = screen.queryByTestId('navigation-warning-modal');
      expect(modal).to.exist;
      expect(modal).to.have.attribute(
        'modal-title',
        "We can't save your signature in a draft message",
      );
    });
  });

  it('should display electronic signature box when Oracle Health ROI recipient is selected', async () => {
    const oracleHealthRecipientId = 2710523;
    const customProps = {
      ...draftMessage,
      recipientId: oracleHealthRecipientId,
      messageValid: true,
      isSignatureRequired: true,
    };
    const screen = setup(initialState, Paths.COMPOSE, { draft: customProps });

    selectVaSelect(screen.container, oracleHealthRecipientId);
    await waitFor(() => {
      const electronicSignature = screen.findByText(
        ElectronicSignatureBox.TITLE,
        {
          selector: 'h2',
        },
      );
      expect(electronicSignature).to.exist;
    });
  });

  it('should handle Oracle Health Medical Records recipient signature requirement', async () => {
    const medicalRecordsRecipientId = 2710524;
    const customProps = {
      ...draftMessage,
      recipientId: medicalRecordsRecipientId,
      messageValid: true,
      isSignatureRequired: true,
    };
    const screen = setup(initialState, Paths.COMPOSE, { draft: customProps });

    selectVaSelect(screen.container, medicalRecordsRecipientId);
    await waitFor(() => {
      const electronicSignature = screen.findByText(
        ElectronicSignatureBox.TITLE,
        {
          selector: 'h2',
        },
      );
      expect(electronicSignature).to.exist;
    });

    const signatureTextFieldSelector = 'va-text-input[label="Your full name"]';
    inputVaTextInput(screen.container, 'Test User', signatureTextFieldSelector);

    const signatureField = screen.container.querySelector(
      signatureTextFieldSelector,
    );
    expect(signatureField.value).to.equal('Test User');
  });

  it('should display an error message when a file is 0B', async () => {
    const screen = setup(initialState, Paths.COMPOSE);
    const file = new File([''], 'test.png', { type: 'image/png' });

    const uploader = screen.getByTestId('attach-file-input');

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );

    const error = screen.getByTestId('file-input-error-message');
    expect(error).to.exist;
    expect(error.textContent).to.equal(
      ErrorMessages.ComposeForm.ATTACHMENTS.FILE_EMPTY,
    );
  });

  it('should display an error message when a file is not an accepted file type', async () => {
    const file = new File(['(⌐□_□)'], 'test.zip', {
      type: 'application/zip',
    });
    const screen = setup(initialState, Paths.COMPOSE);

    const uploader = screen.getByTestId('attach-file-input');

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );

    const error = screen.getByTestId('file-input-error-message');
    expect(error).to.exist;
    expect(error.textContent).to.equal(
      ErrorMessages.ComposeForm.ATTACHMENTS.INVALID_FILE_TYPE,
    );
  });

  it('should display an error message when a file is a duplicate', async () => {
    // Create a 1MB file with actual content
    const oneMB = 1024 * 1024;
    const fileContent = new Uint8Array(oneMB);
    fileContent.fill(1);
    const file = new File([fileContent], 'test.png', {
      type: 'image/png',
      lastModified: new Date().getTime(),
    });

    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      attachments: [],
    };

    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        threadDetails: {
          ...draftState.sm.threadDetails,
          drafts: [customDraftMessage],
          draftInProgress: {},
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm
        draft={customDraftMessage}
        recipients={customState.sm.recipients}
      />,
      {
        initialState: customState,
        reducers: reducer,
        path: `/draft/${draftMessage.id}`,
      },
    );
    const uploader = screen.getByTestId('attach-file-input');
    // Attach the file once
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );
    // Try to attach the same file again (should trigger duplicate error)
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );
    const error = screen.getByTestId('file-input-error-message');
    expect(error.textContent).to.equal('You have already attached this file.');
  });

  it('should display an error message when a file with the same name but different size is a duplicate', async () => {
    const oneMB = 1024 * 1024;
    // First file: 1MB, name test.png
    const file1Content = new Uint8Array(oneMB);
    file1Content.fill(1); // Fill with data to ensure actual size
    const file1 = new File([file1Content], 'test.png', {
      type: 'image/png',
      lastModified: new Date().getTime(),
    });
    // Second file: 2MB, name test.png (different size)
    const file2Content = new Uint8Array(2 * oneMB);
    file2Content.fill(2);
    const file2 = new File([file2Content], 'test.png', {
      type: 'image/png',
      lastModified: new Date().getTime(),
    });

    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      attachments: [],
    };

    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        threadDetails: {
          ...draftState.sm.threadDetails,
          drafts: [customDraftMessage],
          draftInProgress: {},
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm
        draft={customDraftMessage}
        recipients={customState.sm.recipients}
      />,
      {
        initialState: customState,
        reducers: reducer,
        path: `/draft/${draftMessage.id}`,
      },
    );

    const uploader = screen.getByTestId('attach-file-input');

    // Attach the first file
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file1] },
      }),
    );
    // Attach the second file with same name but different size
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file2] },
      }),
    );

    expect(uploader.files[0].name).to.equal('test.png');
    expect(uploader.files.length).to.equal(1);
    const error = screen.getByTestId('file-input-error-message');
    expect(error.textContent).to.equal('You have already attached this file.');
  });

  it('should display an error message when a file is over 6MB', async () => {
    const largeFileSizeInBytes = 7 * 1024 * 1024; // 7MB
    // Use Uint8Array to ensure the file is truly 7MB
    const largeFileContent = new Uint8Array(largeFileSizeInBytes);
    largeFileContent.fill(1);
    const largeFile = new File([largeFileContent], 'large_file.txt', {
      type: 'application/octet-stream',
      lastModified: new Date().getTime(),
    });

    expect(largeFile.size).to.equal(largeFileSizeInBytes);

    const screen = setup(initialState, Paths.COMPOSE);
    const uploader = screen.getByTestId('attach-file-input');
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [largeFile] },
      }),
    );
    const error = screen.getByTestId('file-input-error-message');
    expect(error.textContent).to.equal(
      ErrorMessages.ComposeForm.ATTACHMENTS.FILE_TOO_LARGE,
    );
  });

  it('should display an error message when attaching a new file increases total attachments size over 10MB', async () => {
    const useFeatureTogglesStub10MB = stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });

    mockApiRequest({});

    const oneMB = 1024 * 1024;

    // Create multiple files under 6MB each that total over 10MB
    const file1Content = new Uint8Array(4 * oneMB); // 4MB
    file1Content.fill(1);
    const file1 = new File([file1Content], 'test1.png', {
      type: 'image/png',
      lastModified: new Date().getTime(),
    });

    const file2Content = new Uint8Array(4 * oneMB); // 4MB
    file2Content.fill(2);
    const file2 = new File([file2Content], 'test2.png', {
      type: 'image/png',
      lastModified: new Date().getTime(),
    });

    const file3Content = new Uint8Array(3 * oneMB); // 3MB - this will push total over 10MB (4+4+3 = 11MB)
    file3Content.fill(3);
    const file3 = new File([file3Content], 'test3.txt', {
      type: 'text/plain',
      lastModified: new Date().getTime(),
    });

    // Verify the files have the correct sizes
    expect(file1.size).to.equal(4 * oneMB);
    expect(file2.size).to.equal(4 * oneMB);
    expect(file3.size).to.equal(3 * oneMB);

    const customState = {
      ...initialState,
    };

    const screen = setup(customState, Paths.COMPOSE);

    // Wait for component to fully render
    await waitFor(() => {
      expect(screen.getByTestId('attach-file-input')).to.exist;
    });
    const uploader = screen.getByTestId('attach-file-input');

    // Upload first 4MB file
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file1] },
      }),
    );

    // Upload second 4MB file
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file2] },
      }),
    );

    // Upload third 3MB file - this should trigger the error (total: 11MB > 10MB)
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file3] },
      }),
    );
    // Check that error message appears
    await waitFor(() => {
      const errorMessage = screen.getByTestId('file-input-error-message');
      expect(errorMessage.textContent).to.equal(
        ErrorMessages.ComposeForm.ATTACHMENTS.TOTAL_MAX_FILE_SIZE_EXCEEDED,
      );
    });

    useFeatureTogglesStub10MB.restore();
  });

  it('should display an error message when attaching a new file increases total attachments size over 25MB with largeAttachmentsEnabled feature flag', async () => {
    const useFeatureTogglesStub25MB = stubUseFeatureToggles({
      largeAttachmentsEnabled: true,
      cernerPilotSmFeatureFlag: true,
    });

    mockApiRequest({});

    const oneMB = 1024 * 1024;

    // Create multiple files under 6MB each that total over 25MB
    const file1Content = new Uint8Array(5 * oneMB); // 5MB
    file1Content.fill(1);
    const file1 = new File([file1Content], 'test1.pdf', {
      type: 'application/pdf',
      lastModified: new Date().getTime(),
    });

    const file2Content = new Uint8Array(5 * oneMB); // 5MB
    file2Content.fill(2);
    const file2 = new File([file2Content], 'test2.pdf', {
      type: 'application/pdf',
      lastModified: new Date().getTime(),
    });

    const file3Content = new Uint8Array(5 * oneMB); // 5MB
    file3Content.fill(3);
    const file3 = new File([file3Content], 'test3.pdf', {
      type: 'application/pdf',
      lastModified: new Date().getTime(),
    });

    const file4Content = new Uint8Array(5 * oneMB); // 5MB
    file4Content.fill(4);
    const file4 = new File([file4Content], 'test4.pdf', {
      type: 'application/pdf',
      lastModified: new Date().getTime(),
    });

    const file5Content = new Uint8Array(5 * oneMB); // 5MB
    file5Content.fill(5);
    const file5 = new File([file5Content], 'test5.pdf', {
      type: 'application/pdf',
      lastModified: new Date().getTime(),
    });

    const file6Content = new Uint8Array(2 * oneMB); // 2MB - this will push total over 25MB (5+5+5+5+5+2 = 27MB)
    file6Content.fill(6);
    const file6 = new File([file6Content], 'test6.txt', {
      type: 'text/plain',
      lastModified: new Date().getTime(),
    });

    // Verify the files have the correct sizes (all under 6MB)
    expect(file1.size).to.equal(5 * oneMB);
    expect(file2.size).to.equal(5 * oneMB);
    expect(file3.size).to.equal(5 * oneMB);
    expect(file4.size).to.equal(5 * oneMB);
    expect(file5.size).to.equal(5 * oneMB);
    expect(file6.size).to.equal(2 * oneMB);

    const customState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingLargeAttachments]: true,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot]: true,
      },
    };

    const screen = setup(customState, Paths.COMPOSE);
    await waitFor(() => {
      expect(screen.getByTestId('attach-file-input')).to.exist;
    });
    const uploader = screen.getByTestId('attach-file-input');

    // Upload first 5 files (25MB total)
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file1] },
      }),
    );
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file2] },
      }),
    );
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file3] },
      }),
    );
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file4] },
      }),
    );
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file5] },
      }),
    );

    // Upload sixth file - this should trigger the error (total: 27MB > 25MB)
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file6] },
      }),
    );

    // Check that error message appears
    await waitFor(() => {
      const errorMessage = screen.getByTestId('file-input-error-message');
      expect(errorMessage.textContent).to.equal(
        ErrorMessages.ComposeForm.ATTACHMENTS
          .TOTAL_MAX_FILE_SIZE_EXCEEDED_LARGE,
      );
    });

    useFeatureTogglesStub25MB.restore();
  });

  it('should contain Edit Signature Link', async () => {
    const customState = { ...initialState, featureToggles: { loading: false } };
    customState.sm.preferences.signature.includeSignature = true;
    const screen = setup(customState, Paths.COMPOSE);
    const link = screen.getByTestId('edit-signature-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal(
      'Edit signature for all messages',
    );
  });

  it('renders correct headings in pilot environment', async () => {
    const customState = {
      ...initialState,
      featureToggles: {
        loading: false,
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
      },
      sm: {
        ...initialState.sm,
        recipients: {
          ...initialState.sm.recipients,
          activeFacility: {
            ehr: 'vista',
            vamcSystemName: 'Test Vista Facility Health Care',
          },
        },
        threadDetails: {
          draftInProgress: {
            careSystemName: 'test care system',
            recipientName: 'test care team',
          },
        },
      },
    };

    const screen = setup(customState, Paths.COMPOSE, {
      pageTitle: 'Start your message',
    });

    expect(
      screen.getByText('Start your message', {
        selector: 'h1',
      }),
    ).to.exist;

    expect(
      screen.getByTestId('compose-recipient-title').textContent,
    ).to.contain('test care system - test care team');

    expect(
      screen.getByText('Attachments', {
        selector: 'h2',
      }),
    ).to.exist;
  });

  it('sets isAutoSave to false when sending message', async () => {
    const sendMessageSpy = sandbox.stub(messageActions, 'sendMessage');
    sendMessageSpy.resolves({});

    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
    };

    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        threadDetails: {
          ...draftState.sm.threadDetails,
          drafts: [customDraftMessage],
        },
      },
    };

    const screen = setup(customState, `/thread/${customDraftMessage.id}`, {
      pageTitle: 'Start your message',
      categories,
      draft: customDraftMessage,
      recipients: customState.sm.recipients,
    });

    fireEvent.click(screen.getByTestId('send-button'));
    await waitFor(() => {
      expect(sendMessageSpy.calledOnce).to.be.true;
    });
    sendMessageSpy.restore();
  });

  it('sets the state of draftInProgress when compose draft is rendered', async () => {
    const updateDraftInProgressSpy = sandbox.spy(
      threadDetailsActions,
      'updateDraftInProgress',
    );
    const oracleHealthDraftRecipient = noBlockedRecipients.mockAllRecipients.find(
      r => r.ohTriageGroup,
    ).id;
    const customDraftMessage = {
      ...draftMessage,
      body: 'Hello',
      recipientId: oracleHealthDraftRecipient,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
    };

    const customState = {
      ...draftState,
      sm: {
        ...draftState.sm,
        threadDetails: {
          ...draftState.sm.threadDetails,
          draftInProgress: {},
          drafts: [customDraftMessage],
        },
      },
    };

    setup(customState, `/thread/${customDraftMessage.id}`, {
      pageTitle: 'Start your message',
      categories,
      draft: customDraftMessage,
      recipients: customState.sm.recipients,
    });

    await waitFor(() => {
      expect(updateDraftInProgressSpy.called).to.be.true;
      const args = updateDraftInProgressSpy.getCall(0).args[0];
      expect(args).to.deep.equal({
        careSystemVhaId: customDraftMessage.careSystemVhaId,
        careSystemName: customDraftMessage.careSystemName,
        recipientId: customDraftMessage.recipientId,
        recipientName: customDraftMessage.recipientName,
        category: customDraftMessage.category,
        subject: customDraftMessage.subject,
        body: customDraftMessage.body,
        messageId: customDraftMessage.id,
        ohTriageGroup: true,
      });
    });
  });

  describe('renewal prescription useEffect', () => {
    it('populates draft with prescription data when renewalPrescription is present', async () => {
      const updateDraftInProgressSpy = sandbox.spy(
        threadDetailsActions,
        'updateDraftInProgress',
      );

      const mockPrescription = {
        prescriptionId: '123',
        prescriptionName: 'Test Medication',
        prescriptionNumber: 'RX123',
        providerFirstName: 'John',
        providerLastName: 'Doe',
        refillRemaining: 5,
        expirationDate: '2025-12-31',
        reason: 'Chronic condition',
        quantity: '30 tablets',
      };

      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          prescription: {
            renewalPrescription: mockPrescription,
            error: null,
            isLoading: false,
          },
        },
      };

      setup(customState);

      await waitFor(() => {
        expect(updateDraftInProgressSpy.called).to.be.true;
        const args = updateDraftInProgressSpy.getCall(0).args[0];
        expect(args.subject).to.equal('Renewal Needed');
        expect(args.category).to.equal('MEDICATIONS');
        expect(args.body).to.include(
          'Medication name, strength, and form: Test Medication',
        );
        expect(args.body).to.include('Prescription number: RX123');
        expect(args.body).to.include('Provider who prescribed it: John Doe');
        expect(args.body).to.include('Number of refills left: 5');
        expect(args.body).to.include(
          'Prescription expiration date: December 31, 2025',
        );
        expect(args.body).to.include('Reason for use: Chronic condition');
        expect(args.body).to.include('Quantity: 30 tablets');
      });
    });

    it('populates draft with prescription data when rxError is present', async () => {
      const updateDraftInProgressSpy = sandbox.spy(
        threadDetailsActions,
        'updateDraftInProgress',
      );

      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          prescription: {
            renewalPrescription: null,
            error: 'Prescription not found',
            isLoading: false,
          },
        },
      };

      setup(customState);

      await waitFor(() => {
        expect(updateDraftInProgressSpy.called).to.be.true;
        const args = updateDraftInProgressSpy.getCall(0).args[0];
        expect(args.subject).to.equal('Renewal Needed');
        expect(args.category).to.equal('MEDICATIONS');
        expect(args.body).to.include('Medication name, strength, and form: ');
        expect(args.body).to.include('Prescription number: ');
        expect(args.body).to.include('Provider who prescribed it: ');
        expect(args.body).to.include('Number of refills left: ');
        expect(args.body).to.include('Prescription expiration date: ');
        expect(args.body).to.include('Reason for use: ');
        expect(args.body).to.include('Quantity: ');
      });
    });

    it('displays loading indicator when renewal prescription is loading', () => {
      const loadingState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          prescription: {
            isLoading: true,
          },
        },
      };

      const screen = setup(loadingState, Paths.COMPOSE);

      const loadingIndicator = screen.getByTestId('loading-indicator');
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal('Loading...');
    });

    it('does not display loading indicator when prescription isLoading is false', () => {
      const nonLoadingState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          prescription: {
            isLoading: false,
          },
        },
      };

      const screen = setup(nonLoadingState, Paths.COMPOSE);

      const loadingIndicator = screen.queryByTestId('loading-indicator');
      expect(loadingIndicator).to.be.null;
    });

    it('hides loading indicator when state updates from loading to not loading', async () => {
      const loadingState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          prescription: {
            isLoading: true,
          },
        },
      };

      // Create store with initial loading state
      const testStore = createStore(
        combineReducers({ ...commonReducer, ...reducer }),
        loadingState,
        applyMiddleware(thunk),
      );

      const screen = renderWithStoreAndRouter(
        <ComposeForm
          recipients={initialState.sm.recipients}
          categories={categories}
        />,
        {
          initialState: loadingState,
          reducers: reducer,
          store: testStore,
          path: Paths.COMPOSE,
        },
      );

      // Initially should show loading indicator
      const loadingIndicator = screen.getByTestId('loading-indicator');
      expect(loadingIndicator).to.exist;

      // Dispatch action to clear prescription (which sets isLoading to false)
      testStore.dispatch({
        type: 'SM_CLEAR_PRESCRIPTION',
      });

      // Loading indicator should disappear
      await waitFor(() => {
        const updatedLoadingIndicator = screen.queryByTestId(
          'loading-indicator',
        );
        expect(updatedLoadingIndicator).to.be.null;
      });
    });

    it('displays medication info warning when prescription has error', () => {
      const errorState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          prescription: {
            error: 'Prescription not found',
          },
        },
      };

      const { container } = setup(errorState, Paths.COMPOSE);

      const warningAlert = container.querySelector('va-alert');
      expect(warningAlert).to.exist;
      expect(warningAlert.getAttribute('visible')).to.equal('true');
      const h2 = warningAlert.querySelector('h2');
      expect(h2).to.exist;
      expect(h2.textContent).to.equal(
        'Add your medication information to this message',
      );
    });

    it('hides medication info warning when prescription has no error', () => {
      const noErrorState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          prescription: {
            error: null,
          },
        },
      };

      const { container } = setup(noErrorState, Paths.COMPOSE);

      const warningAlert = container.querySelector('va-alert');
      expect(warningAlert).to.exist;
      expect(warningAlert.getAttribute('visible')).to.equal('false');
      const h2 = warningAlert.querySelector('h2');
      expect(h2).to.exist;
      expect(h2.textContent).to.equal(
        'Add your medication information to this message',
      );
    });

    describe('message body textarea hint text', () => {
      it('should display medication details hint when rxError exists', async () => {
        const errorState = {
          ...initialState,
          sm: {
            ...initialState.sm,
            prescription: {
              error: 'SM_GET_PRESCRIPTION_BY_ID_ERROR',
              renewalPrescription: null,
              isLoading: false,
            },
          },
        };

        const { container } = setup(errorState, Paths.COMPOSE);

        await waitFor(() => {
          const textarea = container.querySelector(
            'va-textarea[name="compose-message-body"]',
          );
          expect(textarea).to.exist;
          expect(textarea.getAttribute('hint')).to.equal(
            MessageHintText.RX_RENEWAL_ERROR,
          );
        });
      });

      it('should display review details hint when renewalPrescription exists', async () => {
        const successState = {
          ...initialState,
          sm: {
            ...initialState.sm,
            prescription: {
              error: null,
              renewalPrescription: {
                prescriptionId: '123',
                prescriptionName: 'Test Medication',
              },
              isLoading: false,
            },
          },
        };

        const { container } = setup(successState, Paths.COMPOSE);

        await waitFor(() => {
          const textarea = container.querySelector(
            'va-textarea[name="compose-message-body"]',
          );
          expect(textarea).to.exist;
          expect(textarea.getAttribute('hint')).to.equal(
            MessageHintText.RX_RENEWAL_SUCCESS,
          );
        });
      });

      it('should not display hint when neither rxError nor renewalPrescription exist', async () => {
        const noHintState = {
          ...initialState,
          sm: {
            ...initialState.sm,
            prescription: {
              error: null,
              renewalPrescription: null,
              isLoading: false,
            },
          },
        };

        const { container } = setup(noHintState, Paths.COMPOSE);

        await waitFor(() => {
          const textarea = container.querySelector(
            'va-textarea[name="compose-message-body"]',
          );
          expect(textarea).to.exist;
          expect(textarea.getAttribute('hint')).to.be.null;
        });
      });

      it('should prioritize rxError hint over renewalPrescription hint when both exist', async () => {
        const bothExistState = {
          ...initialState,
          sm: {
            ...initialState.sm,
            prescription: {
              error: 'Prescription not found',
              renewalPrescription: {
                prescriptionId: '123',
                prescriptionName: 'Test Medication',
              },
              isLoading: false,
            },
          },
        };

        const { container } = setup(bothExistState, Paths.COMPOSE);

        await waitFor(() => {
          const textarea = container.querySelector(
            'va-textarea[name="compose-message-body"]',
          );
          expect(textarea).to.exist;
          // Should show error hint, not success hint
          expect(textarea.getAttribute('hint')).to.equal(
            MessageHintText.RX_RENEWAL_ERROR,
          );
        });
      });
    });

    it('calls sendMessage and verifies redirect path is available for prescription renewal flow', async () => {
      // Mock the sendMessage action to return a resolved promise
      const sendMessageStub = sandbox.stub(messageActions, 'sendMessage');
      sendMessageStub.returns(() => Promise.resolve());

      // Store original replace method and create spy
      const originalLocation = global.window.location;
      global.window.location = {};
      global.window.location.replace = sandbox.spy();

      const customDraftMessage = {
        ...draftMessage,
        recipientId: 1013155,
        recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
        triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      };

      const customState = {
        ...draftState,
        sm: {
          ...draftState.sm,
          prescription: {
            renewalPrescription: { prescriptionId: '123' },
            redirectPath: '/medications/refill',
            error: undefined,
            isLoading: false,
          },
          threadDetails: {
            ...draftState.sm.threadDetails,
            drafts: [customDraftMessage],
          },
        },
      };

      const screen = setup(customState, `/thread/${customDraftMessage.id}`, {
        draft: customDraftMessage,
        recipients: customState.sm.recipients,
        categories,
        pageTitle: 'Start your message',
      });

      // Verify redirect path is present in state before sending
      expect(customState.sm.prescription.redirectPath).to.equal(
        '/medications/refill',
      );

      fireEvent.click(screen.getByTestId('send-button'));

      // Wait for the component's sendMessage and setTimeout to complete
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Verify that sendMessage was called and navigation occurred
      expect(sendMessageStub.called).to.be.true;
      expect(customState.sm.prescription.redirectPath).to.equal(
        '/medications/refill',
      );
      expect(global.window.location.replace.calledOnce).to.be.true;
      expect(global.window.location.replace.calledWith('/medications/refill'))
        .to.be.true;

      // Restore original location
      global.window.location = originalLocation;
    });

    it('calls sendMessage and verifies normal navigation flow when no redirectPath is present', async () => {
      // Mock the sendMessage action to return a resolved promise (same as working test)
      const sendMessageStub = sandbox.stub(messageActions, 'sendMessage');
      sendMessageStub.returns(() => Promise.resolve());

      const navigateToFolderByFolderIdSpy = sandbox.stub(
        helperUtils,
        'navigateToFolderByFolderId',
      );

      const customDraftMessage = {
        ...draftMessage,
        recipientId: 1013155,
        recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
        triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      };

      const customState = {
        ...draftState,
        sm: {
          ...draftState.sm,
          prescription: {
            renewalPrescription: undefined,
            redirectPath: undefined,
            error: undefined,
            isLoading: false,
          },
          threadDetails: {
            ...draftState.sm.threadDetails,
            drafts: [customDraftMessage],
          },
        },
      };

      const { getByTestId } = setup(
        customState,
        `/thread/${customDraftMessage.id}`,
        {
          draft: customDraftMessage,
          recipients: customState.sm.recipients,
          categories,
          pageTitle: 'Start your message',
        },
      );

      // Verify no redirect path is present in state before sending
      expect(customState.sm.prescription.redirectPath).to.be.undefined;

      fireEvent.click(getByTestId('send-button'));

      // Wait for the component's sendMessage and setTimeout to complete
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Verify that sendMessage was called successfully and no redirect path is available
      expect(sendMessageStub.called).to.be.true;
      expect(customState.sm.prescription.redirectPath).to.be.undefined;

      // Verify the normal navigation function was called
      await waitFor(() => {
        expect(
          navigateToFolderByFolderIdSpy.calledWith(DefaultFolders.INBOX.id),
        ).to.be.true;
      });
    });

    it('calls sendMessage with suppressAlert=true when redirectPath exists', async () => {
      // Mock the sendMessage action to return a resolved promise
      const sendMessageStub = sandbox.stub(messageActions, 'sendMessage');
      sendMessageStub.returns(() => Promise.resolve());

      // Store original replace method and create spy
      const originalLocation = global.window.location;
      global.window.location = {};
      global.window.location.replace = sandbox.spy();

      const customDraftMessage = {
        ...draftMessage,
        recipientId: 1013155,
        recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
        triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      };

      const customState = {
        ...draftState,
        sm: {
          ...draftState.sm,
          prescription: {
            renewalPrescription: { prescriptionId: '123' },
            redirectPath: '/medications/refill',
            error: undefined,
            isLoading: false,
          },
          threadDetails: {
            ...draftState.sm.threadDetails,
            drafts: [customDraftMessage],
          },
        },
      };

      const screen = setup(customState, `/thread/${customDraftMessage.id}`, {
        draft: customDraftMessage,
        recipients: customState.sm.recipients,
        categories,
        pageTitle: 'Start your message',
      });

      fireEvent.click(screen.getByTestId('send-button'));

      // Wait for the component's sendMessage to complete
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Verify that sendMessage was called with suppressAlert=true (4th argument)
      await waitFor(() => {
        expect(sendMessageStub.called).to.be.true;
      });
      const sendMessageCall = sendMessageStub.getCall(0);
      expect(sendMessageCall.args).to.have.lengthOf(4);
      // Args: [sendData, hasAttachments, ohTriageGroup, suppressAlert]
      expect(sendMessageCall.args[3]).to.equal(true); // suppressAlert should be true

      // Restore original location
      global.window.location = originalLocation;
    });

    it('calls sendMessage with suppressAlert=false when redirectPath does not exist', async () => {
      // Mock the sendMessage action to return a resolved promise
      const sendMessageStub = sandbox.stub(messageActions, 'sendMessage');
      sendMessageStub.returns(() => Promise.resolve());

      const navigateToFolderByFolderIdSpy = sandbox.stub(
        helperUtils,
        'navigateToFolderByFolderId',
      );

      const customDraftMessage = {
        ...draftMessage,
        recipientId: 1013155,
        recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
        triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      };

      const customState = {
        ...draftState,
        sm: {
          ...draftState.sm,
          prescription: {
            renewalPrescription: undefined,
            redirectPath: undefined,
            error: undefined,
            isLoading: false,
          },
          threadDetails: {
            ...draftState.sm.threadDetails,
            drafts: [customDraftMessage],
          },
        },
      };

      const { getByTestId } = setup(
        customState,
        `/thread/${customDraftMessage.id}`,
        {
          draft: customDraftMessage,
          recipients: customState.sm.recipients,
          categories,
          pageTitle: 'Start your message',
        },
      );

      fireEvent.click(getByTestId('send-button'));

      // Wait for the component's sendMessage to complete
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Verify that sendMessage was called with suppressAlert=false (4th argument)
      expect(sendMessageStub.called).to.be.true;
      const sendMessageCall = sendMessageStub.getCall(0);
      expect(sendMessageCall.args).to.have.lengthOf(4);
      // Args: [sendData, hasAttachments, ohTriageGroup, suppressAlert]
      expect(sendMessageCall.args[3]).to.equal(false); // suppressAlert should be false

      // Verify normal navigation occurred
      await waitFor(() => {
        expect(
          navigateToFolderByFolderIdSpy.calledWith(DefaultFolders.INBOX.id),
        ).to.be.true;
      });
    });

    it('displays locked category when renewalPrescription exists', () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          prescription: {
            renewalPrescription: { prescriptionId: '123' },
            error: null,
            isLoading: false,
          },
        },
      };

      const screen = setup(customState, Paths.COMPOSE);

      // Locked category display should be visible
      const lockedCategory = screen.getByTestId('locked-category-display');
      expect(lockedCategory).to.exist;

      // Category dropdown should not exist
      const categoryDropdown = screen.queryByTestId(
        'compose-message-categories',
      );
      expect(categoryDropdown).to.not.exist;
    });

    it('displays locked category when rxError exists', () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          prescription: {
            renewalPrescription: null,
            error: 'Prescription not found',
            isLoading: false,
          },
        },
      };

      const screen = setup(customState, Paths.COMPOSE);

      // Locked category display should be visible
      const lockedCategory = screen.getByTestId('locked-category-display');
      expect(lockedCategory).to.exist;

      // Category dropdown should not exist
      const categoryDropdown = screen.queryByTestId(
        'compose-message-categories',
      );
      expect(categoryDropdown).to.not.exist;
    });

    it('displays category dropdown when not in renewal flow', () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          prescription: {
            renewalPrescription: null,
            error: null,
            isLoading: false,
          },
        },
      };

      const screen = setup(customState, Paths.COMPOSE);

      // Category dropdown should be visible
      const categoryDropdown = screen.queryByTestId(
        'compose-message-categories',
      );
      expect(categoryDropdown).to.exist;

      // Locked category display should not exist
      const lockedCategory = screen.queryByTestId('locked-category-display');
      expect(lockedCategory).to.not.exist;
    });

    it('locked category persists through validation errors', () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          prescription: {
            renewalPrescription: { prescriptionId: '123' },
            error: null,
            isLoading: false,
          },
        },
      };

      const screen = setup(customState, Paths.COMPOSE);

      // Trigger validation by trying to send without required fields
      const sendButton = screen.getByTestId('send-button');
      fireEvent.click(sendButton);

      // Locked category should still be visible after validation
      const lockedCategory = screen.queryByTestId('locked-category-display');
      expect(lockedCategory).to.exist;

      // Category dropdown should still not exist
      const categoryDropdown = screen.queryByTestId(
        'compose-message-categories',
      );
      expect(categoryDropdown).to.not.exist;
    });

    it('shows ViewOnlyDraftSection instead of locked category when triage groups blocked', () => {
      const blockedRecipients = {
        ...initialState.sm.recipients,
        allTriageGroupsBlocked: true,
      };

      const customState = {
        ...draftState,
        sm: {
          ...draftState.sm,
          recipients: blockedRecipients,
          prescription: {
            renewalPrescription: { prescriptionId: '123' },
            error: null,
            isLoading: false,
          },
        },
      };

      const screen = renderWithStoreAndRouter(
        <ComposeForm
          draft={customState.sm.threadDetails.drafts[0]}
          recipients={blockedRecipients}
        />,
        {
          initialState: customState,
          reducers: reducer,
          path: `/thread/${customState.sm.threadDetails.drafts[0].id}`,
        },
      );

      // ViewOnlyDraftSection should take priority - locked category should NOT show
      expect(screen.queryByTestId('locked-category-display')).to.not.exist;

      // Category dropdown should also not exist (ViewOnlyDraftSection shown instead)
      expect(screen.queryByTestId('compose-message-categories')).to.not.exist;
    });
  });

  describe('redirectPath prop', () => {
    it('should pass redirectPath to ComposeFormActionButtons when prescription.redirectPath exists', () => {
      const redirectPath = '/my-health/medications';

      // Create a spy on React.createElement to intercept ComposeFormActionButtons props
      const ComposeFormActionButtons = require('../../../components/ComposeForm/ComposeFormActionButtons')
        .default;
      const createElementSpy = sandbox.spy(React, 'createElement');

      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          prescription: {
            renewalPrescription: undefined,
            redirectPath,
            error: undefined,
            isLoading: false,
          },
        },
      };

      setup(customState, Paths.COMPOSE, {
        recipients: customState.sm.recipients,
        signature: {},
        pageTitle: 'Start your message',
      });

      // Find the call to createElement with ComposeFormActionButtons
      const actionButtonsCall = createElementSpy
        .getCalls()
        .find(call => call.args[0] === ComposeFormActionButtons);

      expect(actionButtonsCall).to.exist;
      expect(actionButtonsCall.args[1]).to.have.property(
        'redirectPath',
        redirectPath,
      );
    });

    it('should pass undefined redirectPath to ComposeFormActionButtons when prescription.redirectPath does not exist', () => {
      // Create a spy on React.createElement to intercept ComposeFormActionButtons props
      const ComposeFormActionButtons = require('../../../components/ComposeForm/ComposeFormActionButtons')
        .default;
      const createElementSpy = sandbox.spy(React, 'createElement');

      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          prescription: {
            renewalPrescription: undefined,
            redirectPath: undefined,
            error: undefined,
            isLoading: false,
          },
        },
      };

      setup(customState, Paths.COMPOSE, {
        recipients: customState.sm.recipients,
        signature: {},
        pageTitle: 'Start your message',
      });

      // Find the call to createElement with ComposeFormActionButtons
      const actionButtonsCall = createElementSpy
        .getCalls()
        .find(call => call.args[0] === ComposeFormActionButtons);

      expect(actionButtonsCall).to.exist;
      expect(actionButtonsCall.args[1]).to.have.property(
        'redirectPath',
        undefined,
      );
    });
  });
});
