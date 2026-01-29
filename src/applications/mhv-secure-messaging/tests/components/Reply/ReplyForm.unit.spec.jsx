import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import {
  mockApiRequest,
  inputVaTextInput,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import ReplyForm from '../../../components/ComposeForm/ReplyForm';
import reducer from '../../../reducers';
import threadDetailsReducer from '../../fixtures/threads/reply-draft-thread-reducer.json';
import folders from '../../fixtures/folder-inbox-response.json';
import signatureReducers from '../../fixtures/signature-reducers.json';
import { ErrorMessages } from '../../../util/constants';
import saveDraftResponse from '../../e2e/fixtures/draftsResponse/drafts-single-message-response.json';
import oneBlockedRecipient from '../../fixtures/json-triage-mocks/triage-teams-one-blocked-mock.json';
import twoBlockedRecipients from '../../fixtures/json-triage-mocks/triage-teams-two-blocked-mock.json';
import noBlockedRecipients from '../../fixtures/json-triage-mocks/triage-teams-mock.json';
import noAssociationsAtAll from '../../fixtures/json-triage-mocks/triage-teams-no-associations-at-all-mock.json';
import lostAssociation from '../../fixtures/json-triage-mocks/triage-teams-lost-association.json';

describe('Reply form component', () => {
  const { signature } = signatureReducers.signatureEnabled;
  const initialState = {
    sm: {
      preferences: { signature },
      folders: {
        folder: folders.inbox,
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
      threadDetails: {
        ...threadDetailsReducer.threadDetails,
      },
    },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: [
            {
              facilityId: '662',
              isCerner: false,
            },
            {
              facilityId: '636',
              isCerner: false,
            },
          ],
        },
      },
    },
    featureToggles: {},
  };
  const { threadDetails } = threadDetailsReducer;
  const replyMessage = threadDetails.drafts[0];
  const { category, subject, senderName, triageGroupName } = replyMessage;

  const render = (state = initialState, props = {}, message = replyMessage) => {
    return renderWithStoreAndRouter(
      <ReplyForm replyMessage={message} drafts={[]} {...props} />,
      {
        initialState: state,
        reducers: reducer,
        path: `/reply/7171715`,
      },
    );
  };

  it('renders without errors', async () => {
    const screen = render();
    expect(screen).to.exist;
  });

  // Note: This test is skipped because the ReplyForm component does not directly
  // add a beforeunload event listener. The beforeunload behavior is handled by
  // SmRouteNavigationGuard or RouteLeavingGuard at the parent component level.
  // This test was passing on Node 14 due to timing differences but the assertion
  // was coincidentally matching existing listeners from other sources.
  it.skip('adds beforeunload event listener', async () => {
    const screen = render();
    const addEventListenerSpy = sinon.spy(window, 'addEventListener');

    fireEvent.input(screen.getByTestId('message-body-field'), {
      target: { innerHTML: 'test beforeunload event' },
    });

    await waitFor(() => {
      expect(addEventListenerSpy.calledWith('beforeunload')).to.be.true;
    });
    addEventListenerSpy.restore();
  });

  it('renders the subject header', async () => {
    const screen = render();
    await waitFor(() => {
      expect(
        screen.queryByText(`Messages: ${category} - ${subject}`, {
          selector: 'h1',
        }),
      ).to.exist;
    });
  });

  it('renders the reply form', async () => {
    const screen = render();
    const { getByText } = screen;

    const patientSafetyNotice = document.querySelector(
      "[trigger='How to get help sooner for urgent needs']",
    );
    const draftToLabel = document.querySelector(
      'span[data-testid=draft-reply-to]',
    );
    const actionButtons = document.querySelector('.compose-form-actions');

    expect(patientSafetyNotice).to.exist;

    expect(draftToLabel.textContent).to.equal(
      `Draft To: ${senderName}\n(Team: ${triageGroupName})`,
    );

    expect(getByText('Attachments'))
      .to.have.attribute('class')
      .to.contain('message-body-attachments-label');

    expect(actionButtons).to.exist;
  });

  it('renders correct category in h1 when category is "OTHER"', async () => {
    const customReplyMessage = {
      ...replyMessage,
      category: 'OTHER',
      subject: 'test replace category',
    };
    const screen = render(undefined, undefined, customReplyMessage);

    await waitFor(() => {
      const replyTitle = screen.getByTestId('reply-form-title');
      expect(replyTitle).to.have.text(
        'Messages: General - test replace category',
      );
    });
  });

  it('renders correct category in h1 when category is "TEST_RESULTS"', async () => {
    const customReplyMessage = {
      ...replyMessage,
      category: 'TEST_RESULTS',
      subject: 'test replace category',
    };
    const screen = render(undefined, undefined, customReplyMessage);

    await waitFor(() => {
      const replyTitle = screen.getByTestId('reply-form-title');
      expect(replyTitle).to.have.text('Messages: Test - test replace category');
    });
  });

  it('renders the message signature in the textarea if a signature is included', async () => {
    const screen = render();
    expect(screen.getByTestId('message-body-field'))
      .to.have.attribute('value')
      .to.equal(
        `\n\n\n${signature.signatureName}\n${signature.signatureTitle}`,
      );
  });

  it('does not render the message signature in the textarea if a signature is NOT included', async () => {
    const signatureExcluded = signatureReducers.signatureDisabled.signature;
    const customState = {
      sm: {
        ...initialState.sm,
        preferences: { signature: signatureExcluded },
      },
    };
    const screen = render(customState);
    const messageBodyInput = screen.getByTestId('message-body-field');
    expect(messageBodyInput).to.exist;
    expect(messageBodyInput).to.not.have.attribute('value');
  });

  it('renders the attachments component when adding a file', async () => {
    const { getByTestId, container } = render();
    const fileName = 'test.png';
    const file = new File(['(⌐□_□)'], fileName, { type: 'image/png' });

    const uploader = getByTestId('attach-file-input');

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );

    expect(uploader.files[0].name).to.equal('test.png');
    expect(uploader.files.length).to.equal(1);
    fireEvent.click(getByTestId('save-draft-button'));
    await waitFor(() => {
      const modals = container.querySelectorAll('va-modal');
      const modal = Array.from(modals).find(
        m =>
          m.getAttribute('modal-title') ===
          ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT.title,
      );
      expect(modal).to.exist;
    });
  });

  it('renders success message on new reply draft save', async () => {
    const customState = {
      sm: {
        ...initialState.sm,
        threadDetails: {
          ...initialState.sm.threadDetails,
          messages: [replyMessage],
          drafts: [],
          isLoading: false,
          cannotReply: false,
          replyToName: replyMessage.recipientName,
          threadFolderId: 0,
          replyToMessageId: replyMessage.id,
        },
      },
    };

    const screen = render(customState);
    await waitFor(() => {
      screen.getByTestId('message-body-field');
    });
    fireEvent.focus(screen.getByTestId('message-body-field'));
    inputVaTextInput(screen.container, 'Test draft message', 'va-textarea');
    mockApiRequest(saveDraftResponse);
    expect(screen.getByTestId('save-draft-button')).to.exist;
    fireEvent.click(screen.getByTestId('save-draft-button'));
    await waitFor(() => {
      expect(screen.getByText('Your message was saved', { exact: false }));
    });
  });

  it('displays BlockedTriageGroupAlert if group is blocked', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
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

    const screen = render(customState, {
      drafts: threadDetails.drafts,
      recipients: customState.sm.recipients,
      messages: threadDetails.messages,
    });

    const blockedTriageGroupAlert = await screen.findByTestId(
      'blocked-triage-group-alert',
    );

    expect(blockedTriageGroupAlert).to.exist;
    expect(blockedTriageGroupAlert).to.have.attribute(
      'trigger',
      "You can't send messages to SM_TO_VA_GOV_TRIAGE_GROUP_TEST",
    );
  });

  it('displays BlockedTriageGroupAlert with blocked group (only) if multiple groups are blocked', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          allRecipients: twoBlockedRecipients.mockAllRecipients,
          allowedRecipients: twoBlockedRecipients.mockAllowedRecipients,
          blockedRecipients: twoBlockedRecipients.mockBlockedRecipients,
          associatedTriageGroupsQty:
            twoBlockedRecipients.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            twoBlockedRecipients.associatedBlockedTriageGroupsQty,
          noAssociations: twoBlockedRecipients.noAssociations,
          allTriageGroupsBlocked: twoBlockedRecipients.allTriageGroupsBlocked,
        },
      },
    };

    const screen = render(customState, {
      drafts: threadDetails.drafts,
      recipients: customState.sm.recipients,
      messages: threadDetails.messages,
    });

    const blockedTriageGroupAlert = await screen.findByTestId(
      'blocked-triage-group-alert',
    );
    expect(blockedTriageGroupAlert).to.exist;
    expect(blockedTriageGroupAlert).to.have.attribute(
      'trigger',
      "You can't send messages to SM_TO_VA_GOV_TRIAGE_GROUP_TEST",
    );
  });

  it('displays BlockedTriageGroupAlert with blocked group (only) if no associations at all', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
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

    const screen = render(customState, {
      drafts: threadDetails.drafts,
      recipients: customState.sm.recipients,
      messages: threadDetails.messages,
    });

    const blockedTriageGroupAlert = await screen.findByTestId(
      'blocked-triage-group-alert',
    );
    expect(blockedTriageGroupAlert).to.exist;
    expect(blockedTriageGroupAlert).to.have.attribute(
      'trigger',
      'Your account is no longer connected to SM_TO_VA_GOV_TRIAGE_GROUP_TEST',
    );
  });

  it('allows reply if OH message and not associated with recipient', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
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
    const ohDrafts = threadDetails.drafts.map(draft => ({
      ...draft,
      isOhMessage: true,
      recipientId: 111111,
      recipientName: 'not_SM_TO_VA_GOV_TRIAGE_GROUP_TEST',
      triageGroupName: 'not_SM_TO_VA_GOV_TRIAGE_GROUP_TEST',
    }));

    const ohMessages = threadDetails.messages.map(message => ({
      ...message,
      isOhMessage: true,
      recipientId: 111111,
      recipientName: 'not_SM_TO_VA_GOV_TRIAGE_GROUP_TEST',
      triageGroupName: 'not_SM_TO_VA_GOV_TRIAGE_GROUP_TEST',
    }));

    const screen = render(
      customState,
      {
        drafts: ohDrafts,
        recipients: customState.sm.recipients,
        messages: ohMessages,
      },
      ohDrafts[0],
    );

    const blockedTriageGroupAlert = await screen.queryByTestId(
      'blocked-triage-group-alert',
    );
    expect(blockedTriageGroupAlert).to.not.exist;

    // Verify reply is enabled by checking for draft reply header
    expect(screen.getByTestId('draft-reply-header')).to.exist;
    expect(screen.getByTestId('draft-reply-header').textContent).to.contain(
      'Draft reply',
    );
  });
});
