import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import moment from 'moment/moment';
import triageTeams from '../fixtures/recipients.json';
import categories from '../fixtures/categories-response.json';
import draftMessage from '../fixtures/message-draft-response.json';
import { draftMessageHistory } from '../fixtures/draft-message-history-mock-reducer.json';
import folders from '../fixtures/folder-inbox-response.json';
import reducer from '../../reducers';
import Compose from '../../containers/Compose';
import { Alerts, Links } from '../../util/constants';

describe('Compose container', () => {
  const initialState = {
    sm: {
      triageTeams: { triageTeams },
      categories: { categories },
    },
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState,
      reducers: reducer,
      path: `/compose`,
    });
    expect(screen);
  });

  it('displays an emergency note with crisis line button', () => {
    const state = {
      sm: {
        triageTeams: { triageTeams },
        categories: { categories },
        draftDetails: { draftMessage, draftMessageHistory: [] },
      },
    };
    const screen = renderWithStoreAndRouter(<Compose />, {
      state,
      reducers: reducer,
      path: `/compose`,
    });
    const note = waitFor(() => {
      screen.getByText(
        'If you’re in a mental health crisis or thinking about suicide',
        { exact: false },
      );
    });
    const crisisLineButton = waitFor(() => {
      screen.getByRole('link', {
        name: '988lifeline.org',
      });
    });
    expect(note).to.exist;
    expect(crisisLineButton).to.exist;
  });

  it('dispays loading indicator if recipients are not yet loaded', async () => {
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState: {
        sm: {
          triageTeams: { triageTeams: undefined },
        },
      },
      reducers: reducer,
      path: `/compose`,
    });

    const loadingIndicator = await screen.getByTestId('loading-indicator');
    expect(loadingIndicator).to.exist;
  });

  it('displays compose heading if path is /compose', () => {
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState,
      reducers: reducer,
      path: `/compose`,
    });
    const headingText = waitFor(() => {
      screen.getByRole('heading', {
        name: 'Compose message',
      });
    });

    expect(headingText).to.exist;
  });

  it('displays compose fields if path is /compose', async () => {
    const state = {
      sm: {
        triageTeams: { triageTeams },
        categories: { categories },
      },
    };
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState: state,
      reducers: reducer,
      path: `/compose`,
    });

    const recipient = await screen.getByTestId('compose-recipient-select');
    const categoryRadioButtons = await screen.getAllByTestId(
      'compose-category-radio-button',
    );

    const subject = waitFor(() => {
      screen.getByTestId('message-subject-field');
    });
    const body = waitFor(() => {
      screen.getByTestId('message-body-field');
    });

    expect(recipient).to.exist;
    expect(categoryRadioButtons).to.have.length(6);
    expect(subject).to.exist;
    expect(body).to.exist;
  });

  it('displays compose action buttons if path is /compose', () => {
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState,
      reducers: reducer,
      path: `/compose`,
    });

    const sendButton = waitFor(() => {
      screen.getByTestId('Send-Button');
    });
    const saveDraftButton = waitFor(() => {
      screen.getByTestId('Save-Draft-Button');
    });

    expect(sendButton).to.exist;
    expect(saveDraftButton).to.exist;
  });

  it('displays draft page if path is /draft/:id', () => {
    const state = {
      sm: {
        triageTeams: { triageTeams },
        categories: { categories },
        draftDetails: { draftMessage, draftMessageHistory: [] },
      },
    };
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState: state,
      reducers: reducer,
      path: `/draft/7171715`,
    });
    const headingText = waitFor(() => {
      screen.getAllByRole('heading', {
        name: 'Edit draft',
      });
    });
    const draftMessageHeadingText = waitFor(() => {
      screen.getAllByRole('heading', {
        name: 'COVID: Covid-Inquiry',
        level: 3,
      });
    });
    const deleteButton = waitFor(() => {
      screen.getAllByRole('button', {
        name: 'Delete draft',
        exact: false,
      });
    });
    expect(headingText).to.exist;
    expect(draftMessageHeadingText).to.exist;
    expect(deleteButton).to.exist;
  });

  it('does not display recipients with preferredTeam:false attribute', () => {
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState,
      reducers: reducer,
      path: `/compose`,
    });

    const recipient = screen.getByTestId('compose-recipient-select');

    const recipientValues = Array.from(
      recipient.querySelectorAll('option'),
    ).map(e => parseInt(e.getAttribute('value'), 10));
    const falseValues = triageTeams
      .filter(team => team.preferredTeam === false)
      .map(team => team.id);
    const trueValues = triageTeams
      .filter(team => team.preferredTeam === true)
      .map(team => team.id);
    waitFor(() => {
      expect(recipientValues.some(r => falseValues.indexOf(r) >= 0)).to.be
        .false;
    });
    waitFor(() => {
      expect(recipientValues).to.include.members(trueValues);
    });
  });

  it('displays Reply draft when a message has previous messages in the thread', async () => {
    const state = {
      sm: {
        folders: { folder: folders.drafts },
        triageTeams: { triageTeams },
        categories: { categories },
        draftDetails: {
          draftMessage,
          draftMessageHistory,
        },
      },
    };
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState: state,
      reducers: reducer,
      path: `/draft/7171715`,
    });

    await waitFor(() => {
      expect(
        screen.getByText(`${draftMessage.category}: ${draftMessage.subject}`, {
          exact: true,
          selector: 'h1',
        }),
      ).to.exist;
    }).then(() => {
      expect(screen.getByTestId('reply-form')).to.exist;
      const repliedMessage = screen.getByTestId('message-replied-to');
      expect(repliedMessage.textContent).to.contain(
        `From: ${draftMessageHistory[0].senderName}`,
      );
      expect(repliedMessage.textContent).to.contain(
        `To: ${draftMessageHistory[0].recipientName}`,
      );
      expect(repliedMessage.textContent).to.contain(
        `Message ID: ${draftMessageHistory[0].messageId}`,
      );
      expect(repliedMessage.textContent).to.contain(
        `${draftMessageHistory[0].body}`,
      );
      expect(
        screen.getByText('Messages in this conversation', {
          exact: true,
          selector: 'h2',
        }),
      ).to.exist;

      expect(screen.queryByText('Edit draft', { exact: true, selector: 'h1' }))
        .not.to.exist;
      expect(screen.queryByTestId('compose-form-header')).not.to.exist;
    });
  });

  it('Reply draft on a replied to message is older than 45 days', async () => {
    const draftMessageHistoryOld = [
      {
        messageId: 2609285,
        category: 'OTHER',
        subject: 'PT2CL MESSAGE: REASSIGN OUTSIDE FACILITY',
        body: '<script>alert(1);</script>\n\n\n\n\n',
        attachment: true,
        sentDate: moment()
          .subtract(46, 'days')
          .format(),
        senderId: 523757,
        senderName: 'FREEMAN, MELVIN  V',
        recipientId: 1930436,
        recipientName: 'EXTRA_LONG_CHARACTER_TRIAGE_GROUP_DAYT29',
        readReceipt: 'READ',
        triageGroupName: null,
        proxySenderName: null,
      },
      ...draftMessageHistory,
    ];

    const state = {
      sm: {
        folders: { folder: folders.drafts },
        triageTeams: { triageTeams },
        categories: { categories },
        draftDetails: {
          draftMessage,
          draftMessageHistory: draftMessageHistoryOld,
        },
      },
    };
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState: state,
      reducers: reducer,
      path: `/draft/7171715`,
    });
    await waitFor(() => {
      expect(
        screen.getByText(`${draftMessage.category}: ${draftMessage.subject}`, {
          exact: true,
          selector: 'h1',
        }),
      ).to.exist;
    }).then(() => {
      expect(screen.getByTestId('reply-form')).to.exist;
      expect(screen.queryByTestId('Send-Button')).not.to.exist;
      expect(
        screen.getByText(Alerts.Message.CANNOT_REPLY_INFO_HEADER, {
          exact: true,
          selector: 'h2',
        }),
      ).to.exist;
      expect(
        screen.getByText(Alerts.Message.CANNOT_REPLY_BODY, {
          exact: true,
        }),
      ).to.exist;
      expect(
        screen.getByText(Links.Link.CANNOT_REPLY.TITLE, {
          exact: true,
          selector: 'a',
        }),
      ).to.exist;
    });
  });

  it('Reply draft on a replied to message is less than 45 days', async () => {
    const draftMessageHistoryOld = [
      {
        messageId: 2609285,
        category: 'OTHER',
        subject: 'PT2CL MESSAGE: REASSIGN OUTSIDE FACILITY',
        body: '<script>alert(1);</script>\n\n\n\n\n',
        attachment: true,
        sentDate: moment()
          .subtract(44, 'days')
          .format(),
        senderId: 523757,
        senderName: 'FREEMAN, MELVIN  V',
        recipientId: 1930436,
        recipientName: 'EXTRA_LONG_CHARACTER_TRIAGE_GROUP_DAYT29',
        readReceipt: 'READ',
        triageGroupName: null,
        proxySenderName: null,
      },
      ...draftMessageHistory,
    ];

    const state = {
      sm: {
        folders: { folder: folders.drafts },
        triageTeams: { triageTeams },
        categories: { categories },
        draftDetails: {
          draftMessage,
          draftMessageHistory: draftMessageHistoryOld,
        },
      },
    };
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState: state,
      reducers: reducer,
      path: `/draft/7171715`,
    });
    await waitFor(() => {
      expect(
        screen.getByText(`${draftMessage.category}: ${draftMessage.subject}`, {
          exact: true,
          selector: 'h1',
        }),
      ).to.exist;
    }).then(() => {
      expect(screen.getByTestId('reply-form')).to.exist;
      expect(screen.getByTestId('Send-Button')).to.exist;
      expect(
        screen.queryByText(Alerts.Message.CANNOT_REPLY_INFO_HEADER, {
          exact: true,
          selector: 'h2',
        }),
      ).not.to.exist;
      expect(
        screen.queryByText(Alerts.Message.CANNOT_REPLY_BODY, {
          exact: true,
        }),
      ).not.to.exist;
      expect(
        screen.queryByText(Links.Link.CANNOT_REPLY.TITLE, {
          exact: true,
          selector: 'a',
        }),
      ).not.to.exist;
    });
  });
});
