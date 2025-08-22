import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, waitFor } from '@testing-library/dom';
import {
  mockApiRequest,
  mockMultipleApiRequests,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { useLocation } from 'react-router-dom-v5-compat';
import { subDays } from 'date-fns';
import ThreadDetails from '../../containers/ThreadDetails';
import { Alerts, PageTitles } from '../../util/constants';
import reducer from '../../reducers';
import { inbox } from '../fixtures/folder-inbox-response.json';
import singleDraftThread from '../fixtures/threads/single-draft-thread-reducer.json';
import replyDraftThread from '../fixtures/threads/reply-draft-thread-reducer.json';
import recipients from '../fixtures/recipients.json';
import { threadDetails } from '../fixtures/threads/message-thread-reducer.json';
import { inputVaTextInput } from '../../util/testUtils';
import {
  threadsDateFormat,
  getLastSentMessage,
  isOlderThan,
} from '../../util/helpers';
import oneBlockedRecipient from '../fixtures/json-triage-mocks/triage-teams-one-blocked-mock.json';
import noBlockedRecipients from '../fixtures/json-triage-mocks/triage-teams-mock.json';
import noAssociationsAtAll from '../fixtures/json-triage-mocks/triage-teams-no-associations-at-all-mock.json';
import lostAssociation from '../fixtures/json-triage-mocks/triage-teams-lost-association.json';

describe('Thread Details container', () => {
  let stub;
  afterEach(() => {
    if (stub) {
      stub.restore();
      stub = null;
    }
  });
  const stubUseFeatureToggles = value => {
    const useFeatureToggles = require('../../hooks/useFeatureToggles');
    stub = sinon.stub(useFeatureToggles, 'default').returns(value);
    return stub;
  };

  const PathCapture = () => {
    const loc = useLocation();
    return <div data-testid="current-path">{loc.pathname}</div>;
  };

  const setup = state => {
    return renderWithStoreAndRouterV6(<><ThreadDetails testing /><PathCapture /></>, {
      initialState: state,
      reducers: reducer,
      initialEntries: ['/thread/2713217'],
    });
  };
  const { drafts, messages } = replyDraftThread.threadDetails;
  const replyDraftMessage = drafts[0];
  const replyMessage = messages[0];
  const olderMessage = messages[1];

  it('renders Thread Details with messages in a thread', async () => {
    const state = {
      sm: {
        threadDetails,
      },
    };
    const screen = setup(state);
    const {
      category,
      body,
      subject,
      senderName,
      sentDate,
      recipientName,
      messageId,
      triageGroupName,
    } = threadDetails.messages[0];

    expect(
      await screen.findByText(`Messages: ${category} - ${subject}`, {
        exact: false,
        selector: 'h1',
      }),
    ).to.exist;

    expect(
      screen.getByTestId(`expand-message-button-${messageId}`).textContent,
    ).to.contain(`From: ${senderName} (${triageGroupName})`);

    expect(
      screen.getByTestId(`expand-message-button-${messageId}`).textContent,
    ).to.contain(`To: ${recipientName}`);

    expect(
      screen.getByTestId(`expand-message-button-${messageId}`).textContent,
    ).to.contain(`Date: ${threadsDateFormat(sentDate)}`);

    expect(
      screen.getByTestId(`expand-message-button-${messageId}`).textContent,
    ).to.contain(`Message ID: ${messageId}`);

    expect(
      screen.getByTestId(`message-body-${messageId}`).textContent,
    ).to.contain(body);

    expect(
      document
        .querySelector('.older-messages')
        .querySelectorAll('.older-message'),
    ).to.have.length(2);

    expect(screen.getByTestId('not-for-print-header').textContent).to.contain(
      '2 messages in this conversation',
    );
  });

  it('renders reply link when customFoldersRedesign feature flag is on', async () => {
    const state = {
      sm: {
        threadDetails,
      },
      featureToggles: {},
    };

    // eslint-disable-next-line dot-notation
    state.featureToggles['mhv_secure_messaging_custom_folders_redesign'] = true;

    const screen = setup(state);
    const { category, subject } = threadDetails.messages[0];

    expect(
      await screen.findByText(`Messages: ${category} - ${subject}`, {
        exact: false,
        selector: 'h1',
      }),
    ).to.exist;

    expect(screen.getByTestId('reply-to-message-link')).to.exist;
    expect(screen.queryByTestId('reply-button-body')).to.not.exist;

    expect(screen.getByTestId('not-for-print-header').textContent).to.contain(
      '2 messages in this conversation',
    );
  });

  it('renders Print Window on `Print` button click in Thread Details', async () => {
    const state = {
      sm: {
        threadDetails,
      },
    };
    if (!window.print) {
      window.print = () => {};
    }
    const printStub = sinon.stub(window, 'print');
    const screen = setup(state);
    const printButton = screen.getByTestId('print-button');

    expect(printButton).to.exist;

    fireEvent.click(printButton);
    await waitFor(() => {
      expect(printStub.called).to.be.true;
    });
    printStub.restore();
    expect(screen.getByTestId('message-thread-for-print')).to.be.visible;
  });

  it('renders Thread Details with NO message history in a thread', async () => {
    const message = threadDetails.messages[0];
    const state = {
      sm: {
        threadDetails: {
          ...threadDetails,
          messages: [message],
        },
      },
    };
    const screen = setup(state);
    const {
      category,
      body,
      subject,
      senderName,
      sentDate,
      recipientName,
      messageId,
      triageGroupName,
    } = message;

    expect(
      await screen.findByText(`Messages: ${category} - ${subject}`, {
        exact: false,
        selector: 'h1',
      }),
    ).to.exist;

    expect(
      screen.getByTestId(`expand-message-button-${messageId}`).textContent,
    ).to.contain(`From: ${senderName} (${triageGroupName})`);
    expect(
      screen.getByTestId(`expand-message-button-${messageId}`).textContent,
    ).to.contain(`To: ${recipientName}`);
    expect(
      screen.getByTestId(`expand-message-button-${messageId}`).textContent,
    ).to.contain(`Date: ${threadsDateFormat(sentDate)}`);
    expect(
      screen.getByTestId(`expand-message-button-${messageId}`).textContent,
    ).to.contain(`Message ID: ${messageId}`);

    expect(
      screen.getByTestId(`message-body-${messageId}`).textContent,
    ).to.contain(body);

    expect(screen.getByTestId('not-for-print-header').textContent).to.contain(
      '1 message in this conversation',
    );
    expect(document.querySelector('.older-messages')).to.not.be.null;
  });

  it('with one draft message renders Edit Draft', async () => {
    const { body } = singleDraftThread.draftMessage;
    const state = {
      sm: {
        triageTeams: {
          triageTeams: recipients,
        },
        threadDetails: {
          drafts: [singleDraftThread.draftMessage],
          messages: [],
          isLoading: false,
          replyToName: 'SM_TO_VA_GOV_TRIAGE_GROUP_TEST',
          threadFolderId: -2,
          cannotReply: false,
          draftInProgress: {
            recipientId: singleDraftThread.draftMessage.recipientId,
            recipientName: singleDraftThread.draftMessage.recipientName,
            category: singleDraftThread.draftMessage.category,
            subject: singleDraftThread.draftMessage.subject,
            body: singleDraftThread.draftMessage.body,
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
      },
    };

    const screen = setup(state);

    expect(screen.findByText('Edit draft', { exact: true, selector: 'h1' })).to
      .exist;

    expect(
      document.querySelector('va-alert-expandable').getAttribute('trigger'),
    ).to.equal('Only use messages for non-urgent needs');

    expect(
      screen.getByText(
        'If you need help sooner, use one of these urgent communications options:',
      ),
    ).to.exist;

    expect(document.querySelector(`va-textarea[value="${body}"]`)).to.exist;

    await waitFor(() => {
      expect(global.document.title).to.equal(
        PageTitles.EDIT_DRAFT_PAGE_TITLE_TAG,
      );
    });
  });

  it('with a reply draft message on a replied to message is MORE than 45 days', async () => {
    const { category, subject } = replyDraftThread.threadDetails.messages[0];

    const state = {
      sm: {
        folders: {
          folder: inbox,
        },
        triageTeams: {
          triageTeams: recipients,
        },
        threadDetails: {
          cannotReply: isOlderThan(getLastSentMessage(messages).sentDate, 45),
          drafts: [
            {
              ...replyDraftMessage,
              draftDate: new Date(),
            },
          ],
          messages: [
            {
              ...replyMessage,
              sentDate: subDays(new Date(), 46).toISOString(),
            },
            olderMessage,
          ],
          isLoading: false,
          replyToName: replyMessage.senderName,
          threadFolderId: '0',
          replyToMessageId: replyMessage.messageId,
        },
      },
    };
    const screen = setup(state);

    expect(await screen.queryByText('Continue to reply')).to.not.exist;

    expect(
      await screen.findByText(`Messages: ${category} - ${subject}`, {
        exact: false,
      }),
    ).to.exist;

    expect(global.document.title).to.equal(
      `Messages: ${PageTitles.CONVERSATION_TITLE_TAG}`,
    );

    expect(document.querySelector('va-textarea')).to.not.exist;

    expect(document.querySelector('section.old-reply-message-body')).to.exist;

    expect(
      document.querySelector('span[data-testid=draft-reply-to]').textContent,
    ).to.equal(
      'Draft To: FREEMAN, GORDON\n(Team: SM_TO_VA_GOV_TRIAGE_GROUP_TEST)',
    );

    expect(screen.getByTestId('not-for-print-header').textContent).to.contain(
      '2 messages in this conversation',
    );

    expect(
      screen.getByTestId(`message-body-${olderMessage.messageId}`).textContent,
    ).to.contain(olderMessage.body);
    expect(screen.queryByTestId('send-button')).to.be.null;
    expect(screen.queryByTestId('save-draft-button')).to.be.null;
    expect(screen.getByTestId('delete-draft-button')).to.exist;
  });

  it('with a reply draft message on a replied to message is MORE than 45 days OH message', async () => {
    const { category, subject } = replyDraftThread.threadDetails.messages[0];

    const state = {
      sm: {
        folders: {
          folder: inbox,
        },
        triageTeams: {
          triageTeams: recipients,
        },
        threadDetails: {
          cannotReply: isOlderThan(getLastSentMessage(messages).sentDate, 45),
          drafts: [
            {
              ...replyDraftMessage,
              draftDate: new Date(),
            },
          ],
          messages: [
            {
              ...replyMessage,
              isOhMessage: true,
              sentDate: subDays(new Date(), 46).toISOString(),
            },
            olderMessage,
          ],
          isLoading: false,
          replyToName: replyMessage.senderName,
          threadFolderId: '0',
          replyToMessageId: replyMessage.messageId,
        },
      },
    };

    const screen = setup(state);

    expect(await screen.queryByText('Continue to reply')).to.not.exist;

    expect(
      await screen.findByText(`Messages: ${category} - ${subject}`, {
        exact: false,
      }),
    ).to.exist;

    expect(global.document.title).to.equal(
      `Messages: ${PageTitles.CONVERSATION_TITLE_TAG}`,
    );

    expect(document.querySelector('va-textarea')).to.not.exist;

    expect(document.querySelector('section.old-reply-message-body')).to.exist;

    expect(
      document.querySelector('span[data-testid=draft-reply-to]').textContent,
    ).to.equal(
      'Draft To: FREEMAN, GORDON\n(Team: SM_TO_VA_GOV_TRIAGE_GROUP_TEST)',
    );

    expect(screen.getByTestId('not-for-print-header').textContent).to.contain(
      '2 messages in this conversation',
    );
    expect(screen.getByText('Find your VA health facility', { selector: 'a' }))
      .to.exist;
    expect(screen.getByText(Alerts.Message.CANNOT_REPLY_BODY.OH)).to.exist;
    expect(
      screen.getByTestId(`message-body-${olderMessage.messageId}`).textContent,
    ).to.contain(olderMessage.body);
    expect(screen.queryByTestId('send-button')).to.be.null;
    expect(screen.queryByTestId('save-draft-button')).to.be.null;
    expect(screen.getByTestId('delete-draft-button')).to.exist;
  });

  it.skip('with a reply draft message on a replied to message is LESS than 45 days', async () => {
    const { category, subject } = replyDraftThread.threadDetails.messages[0];

    const draftMessageHistoryUpdated = [
      {
        ...replyMessage,
        sentDate: subDays(new Date(), 44).toISOString(),
      },
      olderMessage,
    ];

    const state = {
      sm: {
        folders: {
          folder: inbox,
        },
        triageTeams: {
          triageTeams: recipients,
        },
        threadDetails: {
          replyToName: 'FREEMAN, GORDON',
          cannotReply: isOlderThan(
            getLastSentMessage(draftMessageHistoryUpdated).sentDate,
            45,
          ),
          drafts: [
            {
              ...replyDraftMessage,
              draftDate: new Date(),
            },
          ],
          messages: [...draftMessageHistoryUpdated],
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
      },
    };
    const screen = setup(state);

    const { triageGroupName } = state.sm.threadDetails.drafts[0];

    expect(await screen.queryByText('Continue to reply')).to.not.exist;

    expect(
      await screen.findByText(`${category}: ${subject}`, {
        exact: false,
        selector: 'h1',
      }),
    ).to.exist;

    expect(global.document.title).to.equal(PageTitles.CONVERSATION_TITLE_TAG);

    expect(screen.queryByTestId('expired-alert-message')).to.be.null;
    expect(screen.queryByText('This conversation is too old for new replies'))
      .to.be.null;
    expect(screen.queryByText('Start a new message')).to.be.null;
    expect(
      screen.getByText(
        'If you need help sooner, use one of these urgent communications options:',
      ),
    ).to.exist;

    expect(document.querySelector('va-textarea')).to.exist;

    expect(document.querySelector('section.old-reply-message-body')).to.not
      .exist;

    expect(
      document.querySelector('span[data-testid=draft-reply-to]').textContent,
    ).to.equal(`Draft To: FREEMAN, GORDON\n(Team: ${triageGroupName})`);

    expect(screen.getByTestId('message-body-field')).to.exist;

    expect(screen.getByTestId('send-button')).to.exist;
    expect(screen.getByTestId('save-draft-button')).to.exist;
    expect(screen.getByTestId('delete-draft-button')).to.exist;
    mockApiRequest({ method: 'POST', data: {}, status: 200 });
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('send-button'));
      expect(screen.getByText('Message sent.'));
      const alert = document.querySelector('va-alert');
      expect(alert)
        .to.have.attribute('status')
        .to.equal('success');
    });
  });
  it('with an active reply draft, focuses on draft section when clicking Edit reply draft button', async () => {
    const draftMessageHistoryUpdated = [
      {
        ...replyMessage,
        sentDate: subDays(new Date(), 44).toISOString(),
      },
      olderMessage,
    ];

    const state = {
      sm: {
        folders: {
          folder: inbox,
        },
        triageTeams: {
          triageTeams: recipients,
        },
        threadDetails: {
          replyToName: 'FREEMAN, GORDON',
          cannotReply: isOlderThan(
            getLastSentMessage(draftMessageHistoryUpdated).sentDate,
            45,
          ),
          drafts: [
            {
              ...replyDraftMessage,
              draftDate: new Date(),
            },
          ],
          messages: [...draftMessageHistoryUpdated],
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
      },
    };
    const screen = setup(state);

    const editDraftReplyButton = screen.getByTestId('edit-draft-button-body');
    expect(editDraftReplyButton).to.exist;
    const draftReplyHeader = screen.getByTestId('draft-reply-header');
    expect(draftReplyHeader).to.exist;
    await waitFor(() => {
      fireEvent.click(editDraftReplyButton);
      expect(document.activeElement).to.equal(
        screen.getByTestId('draft-reply-header'),
      );
    });
  });

  it.skip('responds to sending a reply draft with attachments', async () => {
    const state = {
      sm: {
        folders: {
          folder: inbox,
        },
        threadDetails: {
          drafts: [replyDraftMessage],
          messages: [replyMessage],
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
      },
    };
    const screen = setup(state);

    const fileName = 'test.png';
    const file = new File(['(⌐□_□)'], fileName, { type: 'image/png' });

    await waitFor(() =>
      fireEvent.change(screen.getByTestId('attach-file-input'), {
        target: { files: [file] },
      }),
    );
    const req1 = {
      shouldResolve: false,
      response: { method: 'POST', data: {}, status: 500 },
    };
    const req2 = {
      shouldResolve: true,
      response: { method: 'POST', data: {}, status: 200 },
    };
    mockMultipleApiRequests([req1, req2]);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('send-button'));
    });
    expect(
      await screen.findByText('We’re sorry. Something went wrong on our end.'),
    ).to.exist;
    const alert = document.querySelector('va-alert');
    expect(alert)
      .to.have.attribute('status')
      .to.equal('error');

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('send-button'));
    });
    expect(await screen.findByText('Message sent.')).to.exist;
    expect(document.querySelector('va-alert'))
      .to.have.attribute('status')
      .to.equal('success');
  });

  it('renders error banner on sendReply failure', async () => {
    const state = {
      sm: {
        folders: {
          folder: inbox,
        },
        threadDetails: {
          drafts: [
            {
              ...replyDraftMessage,
            },
          ],
          messages: [replyMessage],
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
      },
    };
    const screen = setup(state);
    mockApiRequest({ method: 'POST', data: {}, status: 500 }, false);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('send-button'));
      expect(screen.getByText('We’re sorry. Something went wrong on our end.'));
      const alert = document.querySelector('va-alert');
      expect(alert)
        .to.have.attribute('status')
        .to.equal('error');
    });
  });

  it.skip('redirect to the folder associated with the draft on sendReply', async () => {
    const folderId = '112233';
    const state = {
      sm: {
        threadDetails: {
          drafts: [
            {
              ...replyDraftMessage,
              threadFolderId: folderId,
              replyToMessageId: 1234,
            },
          ],
          messages: [replyMessage],
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
      },
    };
    const screen = setup(state);
    await waitFor(() => {
      screen.getByTestId('send-button');
    });
    expect(screen.getByTestId('send-button')).to.exist;
    mockApiRequest({ method: 'POST', data: {}, status: 200 });
    fireEvent.click(screen.getByTestId('send-button'));
    await waitFor(() => {
      expect(screen.getByText('Message sent.'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('current-path').textContent).to.equal(
        `/folders/${folderId}/`,
      );
    });
  });

  it('renders the sending message spinner when sent', async () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
    });
    useFeatureTogglesStub;

    const folderId = '112233';
    const state = {
      sm: {
        threadDetails: {
          drafts: [
            {
              ...replyDraftMessage,
              threadFolderId: folderId,
              replyToMessageId: 1234,
            },
          ],
          messages: [replyMessage],
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
      },
    };
    const screen = setup(state);
    await waitFor(() => {
      screen.getByTestId('send-button');
    });
    expect(screen.getByTestId('send-button')).to.exist;
    mockApiRequest({ method: 'POST', data: {}, status: 200 });
    fireEvent.click(screen.getByTestId('send-button'));
    await waitFor(() => {
      expect(screen.getByTestId('sending-indicator')).to.have.attribute(
        'message',
        'Sending message...',
      );
    });
  });

  it('renders the sending message spinner when sent with largeAttachmentsEnabled feature flag', async () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: true,
    });
    useFeatureTogglesStub;
    const folderId = '112233';
    const state = {
      sm: {
        threadDetails: {
          drafts: [
            {
              ...replyDraftMessage,
              threadFolderId: folderId,
              replyToMessageId: 1234,
            },
          ],
          messages: [replyMessage],
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
      },
    };
    const screen = setup(state);
    await waitFor(() => {
      screen.getByTestId('send-button');
    });
    expect(screen.getByTestId('send-button')).to.exist;
    mockApiRequest({ method: 'POST', data: {}, status: 200 });
    fireEvent.click(screen.getByTestId('send-button'));
    await waitFor(() => {
      expect(screen.getByTestId('sending-indicator')).to.have.attribute(
        'message',
        'Do not refresh the page. Sending message...',
      );
    });
    useFeatureTogglesStub.restore();
  });

  it('responds to Save Draft button click on Reply Form', async () => {
    const state = {
      sm: {
        folders: {
          folder: inbox,
        },
        threadDetails: {
          drafts: [
            {
              ...replyDraftMessage,
              replyToMessageId: 1234,
            },
          ],
          messages: [replyMessage],
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
      },
    };
    const screen = setup(state);
    await waitFor(() => {
      screen.getByTestId('message-body-field');
    });

    inputVaTextInput(screen.container, 'Test draft message', 'va-textarea');
    mockApiRequest({ method: 'POST', status: 200, ok: true });
    fireEvent.click(screen.getByTestId('save-draft-button'));
    await waitFor(() => {
      expect(screen.getByText('Your message was saved', { exact: false }));
    });
  });

  it('displays BlockedTriageGroupAlert if recipient is blocked', async () => {
    const state = {
      sm: {
        folders: {
          folder: inbox,
        },
        threadDetails,
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

    const screen = setup(state);

    const blockedTriageGroupAlert = await screen.findByTestId(
      'blocked-triage-group-alert',
    );
    expect(blockedTriageGroupAlert).to.exist;
    expect(blockedTriageGroupAlert).to.have.attribute(
      'trigger',
      "You can't send messages to SM_TO_VA_GOV_TRIAGE_GROUP_TEST",
    );
  });

  it('displays BlockedTriageGroupAlert if recipient is not associated', async () => {
    const state = {
      sm: {
        folders: {
          folder: inbox,
        },
        threadDetails,
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

    const screen = setup(state);

    const blockedTriageGroupAlert = await screen.findByTestId(
      'blocked-triage-group-alert',
    );

    expect(blockedTriageGroupAlert).to.exist;
    expect(blockedTriageGroupAlert).to.have.attribute(
      'trigger',
      'Your account is no longer connected to SM_TO_VA_GOV_TRIAGE_GROUP_TEST',
    );
  });

  it('allows reply if message is from unassociated OH sender', async () => {
    const state = {
      sm: {
        folders: {
          folder: inbox,
        },
        threadDetails: {
          ...threadDetails,
          messages: threadDetails.messages.map(m => ({
            ...m,
            isOhMessage: true,
          })),
        },
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

    const screen = setup(state);

    const blockedTriageGroupAlert = await screen.queryByTestId(
      'blocked-triage-group-alert',
    );

    expect(blockedTriageGroupAlert).to.not.exist;
    expect(screen.getByTestId('reply-button-body')).to.exist;
    expect(screen.getByTestId('reply-button-body').textContent).to.contain(
      'Reply',
    );
  });

  it('displays BlockedTriageGroupAlert if there are no associations at all', async () => {
    const state = {
      sm: {
        folders: {
          folder: inbox,
        },
        threadDetails,
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

    const screen = setup(state);

    const blockedTriageGroupAlert = await screen.findByTestId(
      'blocked-triage-group-alert',
    );
    expect(blockedTriageGroupAlert).to.exist;
    expect(blockedTriageGroupAlert).to.have.attribute(
      'trigger',
      'Your account is no longer connected to SM_TO_VA_GOV_TRIAGE_GROUP_TEST',
    );
  });

  it('does not display BlockedTriageGroupAlert if recipients API call is incomplete (meaning recipient values will be undefined)', async () => {
    const state = {
      sm: {
        folders: {
          folder: inbox,
        },
        threadDetails,
        recipients: {
          allRecipients: [],
          allowedRecipients: [],
          blockedRecipients: [],
          associatedTriageGroupsQty: undefined,
          associatedBlockedTriageGroupsQty: undefined,
          noAssociations: undefined,
          allTriageGroupsBlocked: undefined,
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

    const screen = setup(state);

    const blockedTriageGroupAlert = await screen.queryByTestId(
      'blocked-triage-group-alert',
    );
    expect(blockedTriageGroupAlert).not.to.exist;
  });
});
