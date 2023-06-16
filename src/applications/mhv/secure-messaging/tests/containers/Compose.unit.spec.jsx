import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor, fireEvent } from '@testing-library/react';
import moment from 'moment/moment';
import triageTeams from '../fixtures/recipients.json';
import categories from '../fixtures/categories-response.json';
import draftMessage from '../fixtures/message-draft-response.json';
import { draftDetails } from '../fixtures/threads/reply-draft-thread-reducer.json';
import folders from '../fixtures/folder-inbox-response.json';
import reducer from '../../reducers';
import Compose from '../../containers/Compose';
import { Alerts, Links, Paths } from '../../util/constants';
import AuthorizedRoutes from '../../containers/AuthorizedRoutes';

describe('Compose container', () => {
  const initialState = {
    sm: {
      triageTeams: { triageTeams },
      categories: { categories },
    },
  };

  const setup = (state = initialState, path = Paths.COMPOSE) => {
    return renderWithStoreAndRouter(<AuthorizedRoutes />, {
      initialState: state,
      reducers: reducer,
      path,
    });
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState,
      reducers: reducer,
      path: Paths.COMPOSE,
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
      path: Paths.COMPOSE,
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
    const screen = await setup({
      sm: {
        triageTeams: { triageTeams: undefined },
      },
    });
    waitFor(() => {
      fireEvent.click(screen.getByText('Continue to start message'));
    });
    const loadingIndicator = screen.getByTestId('loading-indicator');
    expect(loadingIndicator).to.exist;
  });

  it(`displays compose heading if path is ${Paths.COMPOSE}`, () => {
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState,
      reducers: reducer,
      path: Paths.COMPOSE,
    });
    const headingText = waitFor(() => {
      screen.getByRole('heading', {
        name: 'Start a new message',
      });
    });

    expect(headingText).to.exist;
  });

  it('displays compose fields if path is /new-message', async () => {
    const state = {
      sm: {
        triageTeams: { triageTeams },
        categories: { categories },
      },
    };

    const screen = setup(state);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue to start message'));
    });
    const recipient = screen.getByTestId('compose-recipient-select');
    const categoryRadioButtons = screen.getAllByTestId(
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

  it(`displays compose action buttons if path is ${Paths.COMPOSE}`, () => {
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState,
      reducers: reducer,
      path: Paths.COMPOSE,
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

  it('does not display recipients with preferredTeam:false attribute', async () => {
    const screen = setup();
    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue to start message'));
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
        senderName: 'TESTER, CLINICIAN',
        recipientId: 1930436,
        recipientName: 'EXTRA_LONG_CHARACTER_TRIAGE_GROUP_DAYT29',
        readReceipt: 'READ',
        triageGroupName: null,
        proxySenderName: null,
        threadId: 2710544,
        folderId: 0,
        messageBody: 'Second test reply from Clinician\r\n\r\nOleksii',
        draftDate: null,
        toDate: null,
        hasAttachments: false,
      },
      ...draftDetails.draftMessageHistory,
    ];

    const state = {
      sm: {
        alerts: {
          alertVisible: true,
          alertList: [
            {
              datestamp: '2023-03-28T17:29:16.362Z',
              isActive: true,
              alertType: 'info',
              header: 'This conversation is too old for new replies',
              content:
                "The last message in this conversation is more than 45 days old. If you want to continue this conversation, you'll need to start a new message.",
              className:
                'fas fa-edit vads-u-margin-right--1 vads-u-margin-top--1',
              link: Paths.COMPOSE,
              title: 'Start a new message',
            },
          ],
        },
        folders: { folder: folders.drafts },
        triageTeams: { triageTeams },
        categories: { categories },
        draftDetails: {
          draftMessage: draftDetails.draftMessage,
          draftMessageHistory: draftMessageHistoryOld,
        },
      },
    };

    const screen = await setup(
      state,
      `/draft/${draftDetails.draftMessage.messageId}`,
    );
    waitFor(() => {
      expect(
        screen.getByText(Alerts.Message.CANNOT_REPLY_INFO_HEADER, {
          exact: true,
          selector: 'h2',
        }),
      ).to.exist;
    }).then(() => {
      expect(screen.getByTestId('reply-form')).to.exist;
      expect(
        screen.getByText(
          `${draftDetails.draftMessage.category}: ${
            draftDetails.draftMessage.subject
          }`,
          {
            exact: true,
            selector: 'h1',
          },
        ),
      ).to.exist;
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
});
