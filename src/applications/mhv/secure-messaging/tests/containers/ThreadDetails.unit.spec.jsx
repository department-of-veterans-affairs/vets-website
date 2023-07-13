import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';
import moment from 'moment';
import ThreadDetails from '../../containers/ThreadDetails';
import { PageTitles } from '../../util/constants';
import reducer from '../../reducers';
import singleDraftThread from '../fixtures/threads/single-draft-thread-reducer.json';
import replyDraftThread from '../fixtures/threads/reply-draft-thread-reducer.json';
import recipients from '../fixtures/recipients.json';
import { messageDetails } from '../fixtures/threads/message-thread-reducer.json';
import { getByBrokenText } from '../../util/testUtils';
import {
  dateFormat,
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
  const replyDraftMessage = replyDraftThread.draftDetails.draftMessage;
  const { draftMessageHistory } = replyDraftThread.draftDetails;
  const replyMessage = draftMessageHistory[0];
  const olderMessage = draftMessageHistory[1];

  it('with no drafts renders Thread Details with messages in a thread', async () => {
    const state = {
      sm: {
        messageDetails: {
          ...messageDetails,
          threadViewCount: 5,
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
    } = messageDetails.message;

    expect(
      await screen.findByText(`${category}: ${subject}`, {
        exact: false,
        selector: 'h1',
      }),
    ).to.exist;
    expect(screen.getByTestId('message-metadata').textContent).to.contain(
      `From: ${senderName} (${triageGroupName})`,
    );
    expect(screen.getByTestId('message-metadata').textContent).to.contain(
      `To: ${recipientName}`,
    );
    expect(screen.getByTestId('message-metadata').textContent).to.contain(
      `Date: ${dateFormat(sentDate)}`,
    );
    expect(screen.getByTestId('message-metadata').textContent).to.contain(
      `Message ID: ${messageId}`,
    );

    expect(screen.getByText(body)).to.exist;

    expect(screen.getByText('Messages in this conversation')).to.exist;
    expect(
      document
        .querySelector('.older-messages')
        .querySelectorAll('.older-message'),
    ).to.have.length(1);
  });

  it('with no drafts renders Thread Details with NO messages in a thread', async () => {
    const state = {
      sm: {
        messageDetails: {
          message: messageDetails.message,
          messageHistory: [],
          threadViewCount: 5,
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
    } = messageDetails.message;

    expect(
      await screen.findByText(`${category}: ${subject}`, {
        exact: false,
        selector: 'h1',
      }),
    ).to.exist;

    expect(screen.getByTestId('message-metadata').textContent).to.contain(
      `From: ${senderName} (${triageGroupName})`,
    );
    expect(screen.getByTestId('message-metadata').textContent).to.contain(
      `To: ${recipientName}`,
    );
    expect(screen.getByTestId('message-metadata').textContent).to.contain(
      `Date: ${dateFormat(sentDate)}`,
    );
    expect(screen.getByTestId('message-metadata').textContent).to.contain(
      `Message ID: ${messageId}`,
    );

    expect(screen.getByText(body)).to.exist;

    expect(screen.queryByText('Messages in this conversation')).to.be.null;
    expect(document.querySelector('.older-messages')).to.be.null;
  });

  it('with one draft message renders Edit Draft', async () => {
    const { category, subject, body } = singleDraftThread.draftMessage;
    const state = {
      sm: {
        triageTeams: {
          triageTeams: recipients,
        },
        draftDetails: {
          draftMessage: singleDraftThread.draftMessage,
          draftMessageHistory: [],
        },
      },
    };

    const screen = setup(state);

    fireEvent.click(await screen.findByText('Continue to draft'));

    expect(
      await screen.findByText('Edit draft', { exact: true, selector: 'h1' }),
    ).to.exist;

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
    expect(
      screen.getByText(`${category}: ${subject}`, {
        exact: false,
        selector: 'h2',
      }),
    ).to.exist;
    expect(document.querySelector(`va-textarea[value="${body}"]`)).to.exist;
  });

  it('with a reply draft message on a replied to message is MORE than 45 days', async () => {
    const { category, subject } = replyDraftThread.draftDetails.draftMessage;

    const draftMessageHistoryUpdated = [
      {
        ...replyMessage,
        sentDate: moment()
          .subtract(46, 'days')
          .format(),
      },
      olderMessage,
    ];

    const state = {
      sm: {
        triageTeams: {
          triageTeams: recipients,
        },
        messageDetails: {
          threadViewCount: 5,
          cannotReply: isOlderThan(
            getLastSentMessage(draftMessageHistoryUpdated).sentDate,
            45,
          ),
        },
        draftDetails: {
          ...replyDraftMessage,
          draftDate: new Date(),
        },
        draftMessageHistory: draftMessageHistoryUpdated,
        ...replyDraftThread,
      },
    };
    const screen = setup(state);

    fireEvent.click(await screen.findByText('Continue to reply'));

    expect(await screen.findByText(`${category}: ${subject}`, { exact: false }))
      .to.exist;

    expect(global.document.title).to.equal(
      PageTitles.EDIT_DRAFT_PAGE_TITLE_TAG,
    );

    expect(document.querySelector('span').textContent).to.equal(
      '(Draft) To: MORGUN, OLEKSII\n(Team: SM_TO_VA_GOV_TRIAGE_GROUP_TEST)',
    );

    expect(
      screen.getByText(
        '(Draft) To: MORGUN, OLEKSII (Team: SM_TO_VA_GOV_TRIAGE_GROUP_TEST)',
      ),
    ).to.exist;

    const messageRepliedTo = screen.getByTestId('message-replied-to');
    const from = getByBrokenText(
      `From: ${replyMessage.senderName}`,
      messageRepliedTo,
    );
    expect(from).to.exist;
    const to = getByBrokenText(
      `To: ${replyMessage.recipientName}`,
      messageRepliedTo,
    );
    expect(to).to.exist;

    expect(
      screen.getByText('Messages in this conversation', {
        exact: true,
        selector: 'h2',
      }),
    ).to.exist;

    expect(screen.getByText(olderMessage.body, { exact: false })).to.exist;
    expect(screen.queryByTestId('Send-Button')).to.be.null;
    expect(screen.getByTestId('Save-Draft-Button')).to.exist;
    expect(screen.getByTestId('delete-draft-button')).to.exist;
  });

  it('with a reply draft message on a replied to message is LESS than 45 days', async () => {
    const {
      triageGroupName,
      category,
      subject,
    } = replyDraftThread.draftDetails.draftMessage;

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
        triageTeams: {
          triageTeams: recipients,
        },
        messageDetails: {
          threadViewCount: 5,
          cannotReply: isOlderThan(
            getLastSentMessage(draftMessageHistoryUpdated).sentDate,
            45,
          ),
        },
        draftDetails: {
          ...replyDraftMessage,
          draftDate: new Date(),
        },
        draftMessageHistory: draftMessageHistoryUpdated,
        ...replyDraftThread,
      },
    };
    const screen = setup(state);

    fireEvent.click(await screen.findByText('Continue to reply'));

    expect(
      await screen.findByText(`${category}: ${subject}`, {
        exact: false,
        selector: 'h1',
      }),
    ).to.exist;

    expect(global.document.title).to.equal(
      PageTitles.EDIT_DRAFT_PAGE_TITLE_TAG,
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
    expect(
      screen.getByText(
        `(Draft) To: MORGUN, OLEKSII (Team: ${triageGroupName})`,
      ),
    ).to.exist;
    expect(screen.getByTestId('message-body-field')).to.exist;

    expect(screen.getByTestId('Send-Button')).to.exist;
    expect(screen.getByTestId('Save-Draft-Button')).to.exist;
    expect(screen.getByTestId('delete-draft-button')).to.exist;
  });
});
