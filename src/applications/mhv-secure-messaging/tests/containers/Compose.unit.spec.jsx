import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor, fireEvent } from '@testing-library/react';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import noBlockedRecipients from '../fixtures/json-triage-mocks/triage-teams-mock.json';
import allTriageGroupsBlocked from '../fixtures/json-triage-mocks/triage-teams-all-blocked-mock.json';
import triageTeams from '../fixtures/recipients.json';
import categories from '../fixtures/categories-response.json';
import draftMessage from '../fixtures/message-draft-response.json';
import reducer from '../../reducers';
import Compose from '../../containers/Compose';
import { Paths, BlockedTriageAlertText } from '../../util/constants';
import {
  inputVaTextInput,
  selectVaRadio,
  selectVaSelect,
} from '../../util/testUtils';

describe('Compose container', () => {
  const initialState = {
    sm: {
      categories: { categories },
      recipients: {
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

  const setup = ({ state = initialState, path = Paths.COMPOSE }) => {
    return renderWithStoreAndRouter(<Compose />, {
      initialState: state,
      reducers: reducer,
      path,
    });
  };

  it('renders without errors', () => {
    const screen = setup({});
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
    const screen = setup(state);
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

  it(`displays compose heading if path is ${Paths.COMPOSE}`, () => {
    const screen = setup({});
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
        recipients: {
          associatedTriageGroupsQty: 0,
          noAssociations: false,
          allowedRecipients: noBlockedRecipients.mockAllowedRecipients,
        },
      },
    };

    const screen = setup({ state });
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('continue-button'));
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
    expect(screen.getByText('Edit preferences')).to.exist;
    expect(screen.getByTestId('edit-list')).to.have.attribute(
      'visible',
      'false',
    );
    expect(recipient).to.exist;
    expect(categoryRadioButtons).to.have.length(6);
    expect(subject).to.exist;
    expect(body).to.exist;
  });

  it(`displays compose action buttons if path is ${Paths.COMPOSE}`, () => {
    const screen = setup({});

    const sendButton = waitFor(() => {
      screen.getByTestId('send-button');
    });
    const saveDraftButton = waitFor(() => {
      screen.getByTestId('save-draft-button');
    });

    expect(sendButton).to.exist;
    expect(saveDraftButton).to.exist;
  });

  it('does not display recipients with preferredTeam:false attribute', async () => {
    const screen = setup({});
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('continue-button'));
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

  it('responds to sending a message with attachment', async () => {
    const screen = setup({});
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('continue-button'));
    });
    await waitFor(() => {
      screen.getByTestId('compose-recipient-select');
    });

    selectVaSelect(
      screen.container,
      initialState.sm.recipients.allowedRecipients[0].id,
    );
    selectVaRadio(screen.container, 'Education');
    inputVaTextInput(screen.container, 'Test Subject');
    inputVaTextInput(screen.container, 'Test Body', 'va-textarea');
    mockApiRequest({ ok: true, status: 204 });
    const fileName = 'test.png';
    const file = new File(['(⌐□_□)'], fileName, { type: 'image/png' });

    const uploader = screen.getByTestId('attach-file-input');

    await waitFor(() => {
      fireEvent.change(uploader, {
        target: { files: [file] },
      });
    });
  });

  it('displays all blocked triage groups alert on deadend compose page', async () => {
    const customState = {
      user: { login: { currentlyLoggedIn: true } },
      sm: {
        recipients: {
          allTriageGroupsBlocked: true,
          associatedBlockedTriageGroupsQty:
            allTriageGroupsBlocked.associatedBlockedTriageGroupsQty,
        },
      },
    };

    const screen = setup({
      state: customState,
      path: Paths.COMPOSE,
    });
    const { alertTitle, alertMessage } = BlockedTriageAlertText;

    await waitFor(() => {
      const headingText = screen.getByText('Start a new message');
      expect(headingText).to.exist;
    });

    const alert = screen.getByTestId('blocked-triage-group-alert');
    expect(alert).to.exist;
    expect(alert).to.have.attribute('status', 'warning');
    expect(alert).to.have.attribute('visible', 'true');
    expect(alert.textContent).to.contain(alertTitle.MULTIPLE_TEAMS_BLOCKED);
    expect(alert.textContent).to.contain(alertMessage.MULTIPLE_TEAMS_BLOCKED);
    const findLocationsLink = screen.getByText('Find your VA health facility');
    expect(findLocationsLink)
      .to.have.attribute('href')
      .to.contain('/find-locations');
  });

  it('displays no associations alert on deadend compose page', async () => {
    const customState = {
      user: { login: { currentlyLoggedIn: true } },
      sm: {
        recipients: {
          allowedRecipients: [],
          allTriageGroupsBlocked: false,
          associatedTriageGroupsQty: 0,
          associatedBlockedTriageGroupsQty: 0,
          noAssociations: true,
          allRecipients: [],
        },
      },
    };

    const screen = setup({
      state: customState,
      path: Paths.COMPOSE,
    });
    const { alertTitle, alertMessage } = BlockedTriageAlertText;

    await waitFor(() => {
      const headingText = screen.getByText('Start a new message');
      expect(headingText).to.exist;
    });

    const alert = screen.getByTestId('blocked-triage-group-alert');
    expect(alert).to.exist;
    expect(alert).to.have.attribute('status', 'info');
    expect(alert).to.have.attribute('visible', 'true');
    expect(alert.textContent).to.contain(alertTitle.NO_ASSOCIATIONS);
    expect(alert.textContent).to.contain(alertMessage.NO_ASSOCIATIONS);
    const findLocationsLink = screen.getByText('Find your VA health facility');
    expect(findLocationsLink)
      .to.have.attribute('href')
      .to.contain('/find-locations');
  });
});
