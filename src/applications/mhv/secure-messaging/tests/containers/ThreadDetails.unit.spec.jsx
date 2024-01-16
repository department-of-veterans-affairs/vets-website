import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import {
  mockApiRequest,
  mockMultipleApiRequests,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import moment from 'moment';
import ThreadDetails from '../../containers/ThreadDetails';
import { PageTitles } from '../../util/constants';
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

describe('Thread Details container', () => {
  const setup = state => {
    return renderWithStoreAndRouter(<ThreadDetails testing />, {
      initialState: state,
      reducers: reducer,
      path: `/thread/2713217`,
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
      await screen.findByText(`${category}: ${subject}`, {
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

    expect(screen.getByText(body)).to.exist;

    expect(screen.getByText('2 Messages in this conversation')).to.exist;
    expect(
      document
        .querySelector('.older-messages')
        .querySelectorAll('.older-message'),
    ).to.have.length(2);
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
      await screen.findByText(`${category}: ${subject}`, {
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

    expect(screen.getByText(body)).to.exist;

    expect(screen.queryByText('1 Message in this conversation')).to.exist;
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
          printOption: 'PRINT_THREAD',
          threadViewCount: 5,
        },
      },
    };

    const screen = setup(state);

    expect(screen.findByText('Edit draft', { exact: true, selector: 'h1' })).to
      .exist;

    await waitFor(() => {
      expect(global.document.title).to.equal(
        PageTitles.EDIT_DRAFT_PAGE_TITLE_TAG,
      );
    });

    expect(
      document.querySelector('va-alert-expandable').getAttribute('trigger'),
    ).to.equal('Only use messages for non-urgent needs');
    expect(
      screen.getByText(
        'If you need help sooner, use one of these urgent communication options:',
      ),
    ).to.exist;
    expect(document.querySelector(`va-textarea[value="${body}"]`)).to.exist;
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
          threadViewCount: 5,
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
              sentDate: moment()
                .subtract(46, 'days')
                .format(),
            },
            olderMessage,
          ],
          isLoading: false,
          replyToName: replyMessage.senderName,
          threadFolderId: '0',
          replyToMessageId: replyMessage.messageId,
          printOption: 'PRINT_THREAD',
        },
      },
    };
    const screen = setup(state);

    expect(await screen.queryByText('Continue to reply')).to.not.exist;

    expect(await screen.findByText(`${category}: ${subject}`, { exact: false }))
      .to.exist;

    expect(global.document.title).to.equal(
      `${category}: ${subject} ${PageTitles.PAGE_TITLE_TAG}`,
    );

    expect(document.querySelector('va-textarea')).to.not.exist;

    expect(document.querySelector('section.old-reply-message-body')).to.exist;

    expect(document.querySelector('span').textContent).to.equal(
      '(Draft) To: FREEMAN, GORDON\n(Team: SM_TO_VA_GOV_TRIAGE_GROUP_TEST)',
    );

    expect(
      screen.getByText('2 Messages in this conversation', {
        exact: true,
        selector: 'h2',
      }),
    ).to.exist;

    expect(screen.getByText(olderMessage.body, { exact: false })).to.exist;
    expect(screen.queryByTestId('Send-Button')).to.be.null;
    expect(screen.queryByTestId('Save-Draft-Button')).to.be.null;
    expect(screen.getByTestId('delete-draft-button')).to.exist;
  });

  it('with a reply draft message on a replied to message is LESS than 45 days', async () => {
    const {
      triageGroupName,
      category,
      subject,
    } = replyDraftThread.threadDetails.messages[0];

    const draftMessageHistoryUpdated = [
      {
        ...replyMessage,
        sentDate: moment()
          .subtract(44, 'days')
          .format(),
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
          threadViewCount: 5,
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
      },
    };
    const screen = setup(state);

    expect(await screen.queryByText('Continue to reply')).to.not.exist;

    expect(
      await screen.findByText(`${category}: ${subject}`, {
        exact: false,
        selector: 'h1',
      }),
    ).to.exist;

    expect(global.document.title).to.equal(
      `${category}: ${subject} ${PageTitles.PAGE_TITLE_TAG}`,
    );

    expect(screen.queryByTestId('expired-alert-message')).to.be.null;
    expect(screen.queryByText('This conversation is too old for new replies'))
      .to.be.null;
    expect(screen.queryByText('Start a new message')).to.be.null;
    expect(
      screen.getByText(
        'If you need help sooner, use one of these urgent communication options:',
      ),
    ).to.exist;

    expect(document.querySelector('va-textarea')).to.exist;

    expect(document.querySelector('section.old-reply-message-body')).to.not
      .exist;

    expect(document.querySelector('span').textContent).to.equal(
      `(Draft) To: FREEMAN, GORDON\n(Team: ${triageGroupName})`,
    );

    expect(screen.getByTestId('message-body-field')).to.exist;

    expect(screen.getByTestId('Send-Button')).to.exist;
    expect(screen.getByTestId('Save-Draft-Button')).to.exist;
    expect(screen.getByTestId('delete-draft-button')).to.exist;
    mockApiRequest({ method: 'POST', data: {}, status: 200 });
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('Send-Button'));
      expect(screen.getByText('Secure message was successfully sent.'));
      const alert = document.querySelector('va-alert');
      expect(alert)
        .to.have.attribute('status')
        .to.equal('success');
    });
  });

  it('responds to sending a reply draft with attachments', async () => {
    const state = {
      sm: {
        folders: {
          folder: inbox,
        },
        threadDetails: {
          drafts: [replyDraftMessage],
          messages: [replyMessage],
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
      fireEvent.click(screen.getByTestId('Send-Button'));
    });
    expect(
      await screen.findByText('We’re sorry. Something went wrong on our end.'),
    ).to.exist;
    const alert = document.querySelector('va-alert');
    expect(alert)
      .to.have.attribute('status')
      .to.equal('error');

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('Send-Button'));
    });
    expect(await screen.findByText('Secure message was successfully sent.')).to
      .exist;
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
          drafts: [replyDraftMessage],
          messages: [replyMessage],
        },
      },
    };
    const screen = setup(state);
    mockApiRequest({ method: 'POST', data: {}, status: 500 }, false);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('Send-Button'));
      expect(screen.getByText('We’re sorry. Something went wrong on our end.'));
      const alert = document.querySelector('va-alert');
      expect(alert)
        .to.have.attribute('status')
        .to.equal('error');
    });
  });

  it('redirect to the folder associated with the draft on sendReply', async () => {
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
      },
    };
    const screen = setup(state);
    await waitFor(() => {
      screen.getByTestId('Send-Button');
    });
    expect(screen.getByTestId('Send-Button')).to.exist;
    mockApiRequest({ method: 'POST', data: {}, status: 200 });
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('Send-Button'));
      expect(screen.getByText('Secure message was successfully sent.'));
      expect(screen.history.location.pathname).to.equal(
        `/folders/${folderId}/`,
      );
    });
  });

  it('responds to Save Draft button click on Reply Form', async () => {
    const state = {
      sm: {
        folders: {
          folder: inbox,
        },
        threadDetails: {
          drafts: [{ ...replyDraftMessage, replyToMessageId: 1234 }],
          messages: [replyMessage],
        },
      },
    };
    const screen = setup(state);
    await waitFor(() => {
      screen.getByTestId('message-body-field');
    });

    inputVaTextInput(screen.container, 'Test draft message', 'va-textarea');
    mockApiRequest({ method: 'POST', status: 200, ok: true });
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('Save-Draft-Button'));
      expect(screen.getByText('Your message was saved', { exact: false }));
    });
  });
});
