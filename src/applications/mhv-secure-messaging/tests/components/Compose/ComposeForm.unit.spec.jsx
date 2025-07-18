import React from 'react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { inputVaTextInput } from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
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
import ComposeForm from '../../../components/ComposeForm/ComposeForm';
import {
  Paths,
  Prompts,
  ElectronicSignatureBox,
  ErrorMessages,
} from '../../../util/constants';
import { messageSignatureFormatter } from '../../../util/helpers';
import * as messageActions from '../../../actions/messages';
import * as draftActions from '../../../actions/draftDetails';
import * as categoriesActions from '../../../actions/categories';
import threadDetailsReducer from '../../fixtures/threads/reply-draft-thread-reducer.json';
import {
  getProps,
  selectVaRadio,
  selectVaSelect,
  checkVaCheckbox,
  comboBoxVaSelect,
} from '../../../util/testUtils';
import { drupalStaticData } from '../../fixtures/cerner-facility-mock-data.json';

describe('Compose form component', () => {
  let stub;
  afterEach(() => {
    if (stub) {
      stub.restore();
      stub = null;
    }
  });
  const stubUseFeatureToggles = value => {
    const useFeatureToggles = require('../../../hooks/useFeatureToggles');
    stub = sinon.stub(useFeatureToggles, 'default').returns(value);
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
    },
    drupalStaticData,
    featureToggles: {},
  };

  const draftState = {
    sm: {
      triageTeams: { triageTeams },
      categories: { categories },
      threadDetails: { ...threadDetailsReducer.threadDetails },
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
        threadDetails: { customDraftMessage },
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

    const sendMessageSpy = sinon.spy(messageActions, 'sendMessage');
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
    const saveDraftSpy = sinon.spy(draftActions, 'saveDraft');
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
          ...draftState.sm.threadDetails,
          drafts: {},
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

    expect(messageInput)
      .to.have.attribute('value')
      .not.equal(
        messageSignatureFormatter(signatureReducers.signatureEnabled.signature),
      );
  });

  it('displays an error on attempt to save a draft with attachments', async () => {
    const customProps = {
      ...draftMessage,
      messageValid: true,
      isSignatureRequired: false,
    };
    const screen = setup(initialState, Paths.COMPOSE, { draft: customProps });
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
      selectVaRadio(screen.container, 'COVID');
      expect(
        $('va-radio-option[value="COVID"]', screen.container),
      ).to.have.attribute('checked', 'true');
    });
  });

  it('renders a loading indicator if categories are not available', async () => {
    const getCategoriesSpy = sinon.spy(categoriesActions, 'getCategories');
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

    const addEventListenerSpy = sinon.spy(window, 'addEventListener');
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

    const addEventListenerSpy = sinon.spy(window, 'addEventListener');
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

    const blockedTriageGroupAlert = await screen.findByTestId(
      'blocked-triage-group-alert',
    );
    expect(blockedTriageGroupAlert).to.exist;
    expect(blockedTriageGroupAlert).to.have.attribute(
      'trigger',
      "You're not connected to any care teams in this messaging tool",
    );
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
        threadDetails: {},
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
        threadDetails: {},
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

    const blockedTriageGroupAlert = await screen.findByTestId(
      'blocked-triage-group-alert',
    );
    await waitFor(() => {
      expect(blockedTriageGroupAlert).to.exist;
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
      messageValid: true,
      isSignatureRequired: true,
    };
    const screen = setup(initialState, Paths.COMPOSE, { draft: customProps });

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
    const signatureTextFieldSelector = 'va-text-input[label="Your full name"]';
    inputVaTextInput(screen.container, 'Test User', signatureTextFieldSelector);
    let modal = null;

    fireEvent.click(screen.getByTestId('save-draft-button'));
    await waitFor(() => {
      modal = screen.queryByTestId('navigation-warning-modal');
      expect(modal).to.exist;
    });
    expect(modal).to.have.attribute(
      'modal-title',
      "We can't save your signature in a draft message",
    );
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
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });

    const oneMB = 1024 * 1024;

    // Create first 4MB file with actual content
    const file1Content = new Uint8Array(4 * oneMB);
    file1Content.fill(1); // Fill with data to ensure actual size
    const file1 = new File([file1Content], 'test1.png', {
      type: 'image/png',
      lastModified: new Date().getTime(),
    });

    // Create second 4MB file with actual content
    const file2Content = new Uint8Array(4 * oneMB);
    file2Content.fill(2); // Fill with data to ensure actual size
    const file2 = new File([file2Content], 'test2.png', {
      type: 'image/png',
      lastModified: new Date().getTime(),
    });

    // Create third 3MB file with actual content (this will exceed 10MB limit)
    const file3Content = new Uint8Array(3 * oneMB);
    file3Content.fill(3); // Fill with data to ensure actual size
    const file3 = new File([file3Content], 'test3.txt', {
      type: 'application/octet-stream',
      lastModified: new Date().getTime(),
    });

    // Verify the files have the correct sizes
    expect(file1.size).to.equal(4 * oneMB);
    expect(file2.size).to.equal(4 * oneMB);
    expect(file3.size).to.equal(3 * oneMB);

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
      screen.getByTestId('file-input-error-message');
    });
    expect(screen.getByTestId('file-input-error-message').textContent).to.equal(
      ErrorMessages.ComposeForm.ATTACHMENTS.TOTAL_MAX_FILE_SIZE_EXCEEDED,
    );

    useFeatureTogglesStub.restore();
  });

  it('should display an error message when attaching a new file increases total attachments size over 25MB with largeAttachmentsEnabled feature flag', async () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: true,
    });
    useFeatureTogglesStub;
    const oneMB = 1024 * 1024;
    const customAttachments = [
      { name: 'test1.png', size: 4 * oneMB, type: 'image/png' },
      { name: 'test2.png', size: 4 * oneMB, type: 'image/png' },
      { name: 'test3.png', size: 4 * oneMB, type: 'image/png' },
      { name: 'test4.png', size: 11 * oneMB, type: 'image/png' },
    ];
    const largeFileSizeInBytes = 3 * oneMB; // 3MB
    // Use Uint8Array to ensure the file is actually 3MB
    const largeFileContent = new Uint8Array(largeFileSizeInBytes);
    largeFileContent.fill(1);
    const largeFile = new File([largeFileContent], 'large_file.txt', {
      type: 'application/octet-stream',
      lastModified: new Date().getTime(),
    });
    expect(largeFile.size).to.equal(largeFileSizeInBytes);

    const customDraftMessage = {
      ...draftMessage,
      recipientId: 1013155,
      recipientName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      triageGroupName: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
      attachments: [...customAttachments],
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
        path: `/draft/${draftMessage.id}`,
      },
    );

    const uploader = screen.getByTestId('attach-file-input');
    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [largeFile] },
      }),
    );
    const error = screen.getByTestId('file-input-error-message');
    expect(error.textContent).to.equal(
      ErrorMessages.ComposeForm.ATTACHMENTS.TOTAL_MAX_FILE_SIZE_EXCEEDED,
    );
  });

  it('should contain Edit Signature Link', () => {
    const customState = { ...initialState, featureToggles: { loading: false } };
    // eslint-disable-next-line camelcase
    customState.sm.preferences.signature.includeSignature = true;
    const screen = setup(customState, Paths.COMPOSE);
    expect(screen.getByText('Edit signature for all messages')).to.exist;
  });

  it('renders combobox when combobox feauture flag is true', () => {
    const customState = { ...initialState, featureToggles: { loading: false } };
    // eslint-disable-next-line camelcase
    customState.featureToggles.mhv_secure_messaging_recipient_combobox = true;
    customState.sm.preferences.signature.includeSignature = true;
    const screen = setup(customState, Paths.COMPOSE);
    expect(screen.getByTestId('compose-recipient-combobox')).to.exist;
  });

  it('renders without errors to recipient selection in combobox', () => {
    const customState = { ...initialState, featureToggles: { loading: false } };
    // eslint-disable-next-line camelcase
    customState.featureToggles.mhv_secure_messaging_recipient_combobox = true;
    customState.sm.preferences.signature.includeSignature = true;
    const screen = setup(customState, Paths.COMPOSE);
    const val = initialState.sm.recipients.allowedRecipients[0].id;
    comboBoxVaSelect(screen.container, val);
    waitFor(() => {
      expect(screen.getByTestId('compose-recipient-combobox')).to.have.value(
        val,
      );
    });
  });

  it('displays error states on empty fields when send button is clicked (combobox empty)', async () => {
    const customState = { ...initialState, featureToggles: { loading: false } };
    // eslint-disable-next-line camelcase
    customState.featureToggles.mhv_secure_messaging_recipient_combobox = true;
    customState.sm.preferences.signature.includeSignature = true;

    const screen = setup(customState, Paths.COMPOSE);

    const sendButton = screen.getByTestId('send-button');

    fireEvent.click(sendButton);

    const comboBoxInput = await screen.getByTestId(
      'compose-recipient-combobox',
    );

    const subjectInput = await screen.getByTestId('message-subject-field');
    const subjectInputError = subjectInput[getProps(subjectInput)].error;

    const messageInput = await screen.getByTestId('message-body-field');
    const messageInputError = messageInput[getProps(messageInput)].error;

    expect(comboBoxInput.error).to.equal('Please select a recipient.');
    expect(subjectInputError).to.equal('Subject cannot be blank.');
    expect(messageInputError).to.equal('Message body cannot be blank.');
  });
});
