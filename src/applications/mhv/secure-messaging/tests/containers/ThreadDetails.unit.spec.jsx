import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import ThreadDetails from '../../containers/ThreadDetails';
import reducer from '../../reducers';
import singleDraftThread from '../fixtures/threads/single-draft-thread-reducer.json';
import replyDraftThread from '../fixtures/threads/reply-draft-thread-reducer.json';
import { messageDetails } from '../fixtures/threads/message-thread-reducer.json';
import { getByBrokenText } from '../../util/testUtils';

describe('Thread Details container', () => {
  const setup = state => {
    return renderWithStoreAndRouter(<ThreadDetails testing />, {
      initialState: state,
      reducers: reducer,
      path: `/thread/2713217`,
    });
  };

  it('with one draft message renders Edit Draft', async () => {
    const {
      triageGroupName,
      category,
      subject,
      body,
    } = singleDraftThread.draftMessage;
    const state = {
      sm: {
        triageTeams: {
          triageTeams: [
            {
              id: 1013155,
              name: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
              relationType: 'PATIENT',
              preferredTeam: true,
            },
            {
              id: 1013156,
              name: triageGroupName,
              relationType: 'PATIENT',
              preferredTeam: true,
            },
          ],
        },
        draftDetails: {
          draftMessage: singleDraftThread.draftMessage,
          draftMessageHistory: [],
        },
      },
    };

    const { getByText } = setup(state);

    await waitFor(() => {
      expect(getByText('Edit draft', { exact: true, selector: 'h1' })).to.exist;
    }).then(() => {
      expect(getByText('Don’t use messages for emergencies')).to.exist;
      expect(
        getByText(`${category}: ${subject}`, { exact: false, selector: 'h3' }),
      ).to.exist;
      expect(document.querySelector(`va-textarea[value="${body}"]`)).to.exist;
    });
  });

  it('with reply draft message renders Edit Reply Draft', async () => {
    const {
      triageGroupName,
      category,
      subject,
    } = replyDraftThread.draftDetails.draftMessage;
    const replyMessage = replyDraftThread.draftDetails.draftMessageHistory[0];
    const olderMessage = replyDraftThread.draftDetails.draftMessageHistory[1];
    const state = {
      sm: {
        triageTeams: {
          triageTeams: [
            {
              id: 1013155,
              name: '***MEDICATION_AWARENESS_100% @ MOH_DAYT29',
              relationType: 'PATIENT',
              preferredTeam: true,
            },
            {
              id: 1013156,
              name: triageGroupName,
              relationType: 'PATIENT',
              preferredTeam: true,
            },
          ],
        },
        ...replyDraftThread,
      },
    };
    const { getByText, getByTestId } = setup(state);

    await waitFor(() => {
      expect(getByText(`${category}: ${subject}`, { exact: false })).to.exist;
    }).then(() => {
      expect(
        getByText(
          `(Draft) To: ${replyMessage.senderName} (Team: ${
            replyMessage.triageGroupName
          })`,
          { exact: false },
        ),
      ).to.exist;

      const messageRepliedTo = getByTestId('message-replied-to');
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
        getByText('Messages in this conversation', {
          exact: true,
          selector: 'h2',
        }),
      ).to.exist;

      expect(getByText(olderMessage.body, { exact: false })).to.exist;
    });
  });

  it('with no drafts renders Thread Details', async () => {
    const state = {
      sm: {
        messageDetails,
      },
    };
    const { getByText } = setup(state);
    const {
      category,
      body,
      subject,
      senderName,
      recipientName,
      messageId,
    } = messageDetails.message;

    await waitFor(() => {
      expect(
        getByText(`${category}: ${subject}`, {
          exact: false,
          selector: 'h2',
        }),
      ).to.exist;
    }).then(() => {
      const container = document.querySelector('.message-metadata');
      const from = getByBrokenText(`From: ${senderName}`, container);
      expect(from).to.exist;

      const to = getByBrokenText(`To: ${recipientName}`, container);
      expect(to).to.exist;

      const date = getByBrokenText(
        `Date: March 23, 2023, 10:58 a.m. EDT`,
        container,
      );
      expect(date).to.exist;

      const id = getByBrokenText(`Message ID: ${messageId}`, container);
      expect(id).to.exist;

      expect(getByText(body)).to.exist;

      expect(getByText('Messages in this conversation')).to.exist;
      expect(
        document
          .querySelector('.older-messages')
          .querySelectorAll('.older-message'),
      ).to.have.length(1);
    });
  });
});
