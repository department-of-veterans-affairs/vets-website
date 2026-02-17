import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor, fireEvent } from '@testing-library/react';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import noBlockedRecipients from '../fixtures/json-triage-mocks/triage-teams-mock.json';
import allTriageGroupsBlocked from '../fixtures/json-triage-mocks/triage-teams-all-blocked-mock.json';
import triageTeams from '../fixtures/recipients.json';
import categories from '../fixtures/categories-response.json';
import draftMessage from '../fixtures/message-draft-response.json';
import reducer from '../../reducers';
import Compose from '../../containers/Compose';
import { Paths, BlockedTriageAlertText } from '../../util/constants';
import { inputVaTextInput, selectVaSelect } from '../../util/testUtils';

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

  it('displays compose fields after clicking through interstitial page', async () => {
    const state = {
      sm: {
        triageTeams: { triageTeams },
        categories: { categories },
        recipients: {
          associatedTriageGroupsQty:
            noBlockedRecipients.associatedTriageGroupsQty,
          noAssociations: false,
          allowedRecipients: noBlockedRecipients.mockAllowedRecipients,
        },
        preferences: {
          signature: {
            signatureName: 'TEST',
            signatureTitle: 'TITLE',
            includeSignature: true,
          },
        },
      },
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: false,
      },
    };

    const screen = setup({ state });
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('continue-button'));
    });
    const recipient = screen.getByTestId('compose-recipient-select');
    const categoryDropdown = screen.getByTestId('compose-message-categories');

    const subject = waitFor(() => {
      screen.getByTestId('message-subject-field');
    });
    const body = waitFor(() => {
      screen.getByTestId('message-body-field');
    });

    expect(recipient).to.exist;
    expect(categoryDropdown).to.exist;
    expect(subject).to.exist;
    expect(body).to.exist;
    expect(screen.getByTestId('edit-signature-link')).to.exist;
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
    const state = {
      ...initialState,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: false,
      },
    };
    const screen = setup({ state });
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
    const state = {
      ...initialState,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: false,
      },
    };
    const screen = setup({ state });
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
    selectVaSelect(
      screen.container,
      'EDUCATION',
      'va-select[data-testid="compose-message-categories"]',
    );
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
    expect(alert.textContent).to.contain(alertTitle.ALL_TEAMS_BLOCKED);
    expect(alert.textContent).to.contain(alertMessage.ALL_TEAMS_BLOCKED);
    const findLocationsLink = screen.container.querySelector(
      'va-link-action[href*="/find-locations"]',
    );
    expect(findLocationsLink).to.exist;
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
    const findLocationsLink = screen.container.querySelector(
      'va-link-action[href*="/find-locations"]',
    );
    expect(findLocationsLink).to.exist;
  });

  it('displays AlertBackgroundBox component if there are any errors', async () => {
    const customState = {
      sm: {
        ...initialState.sm,
        threadDetails: {
          acceptInterstitial: false,
        },
        alerts: {
          alertVisible: true,
          alertFocusOut: false,
          alertList: [
            {
              datestamp: '2025-09-17T19:06:02.367Z',
              isActive: true,
              alertType: 'error',
              header: 'Error',
              content: "We're sorry. Something went wrong on our end.",
            },
          ],
        },
      },
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: false,
      },
    };

    const { container, getByTestId, getByText } = setup({
      state: customState,
    });
    await waitFor(() => {
      fireEvent.click(getByTestId('continue-button'));
    });

    await waitFor(() => {
      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
    });

    await waitFor(() => {
      expect(getByText("We're sorry. Something went wrong on our end.")).to
        .exist;
    });
  });

  describe('with curated list flow feature flag enabled', () => {
    it('displays interstitial page with start message link', async () => {
      const state = {
        sm: {
          triageTeams: { triageTeams },
          categories: { categories },
          recipients: {
            associatedTriageGroupsQty:
              noBlockedRecipients.associatedTriageGroupsQty,
            noAssociations: false,
            allowedRecipients: noBlockedRecipients.mockAllowedRecipients,
          },
          threadDetails: {
            drafts: [],
            acceptInterstitial: false,
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
        },
      };

      const screen = setup({ state });
      // findByTestId automatically waits for the element to appear
      const startMessageLink = await screen.findByTestId('start-message-link');
      expect(startMessageLink).to.exist;
      expect(startMessageLink).to.have.attribute(
        'text',
        'Continue to start message',
      );
    });

    it('navigates to recent care teams page when clicking start message link', async () => {
      const state = {
        sm: {
          triageTeams: { triageTeams },
          categories: { categories },
          recipients: {
            associatedTriageGroupsQty:
              noBlockedRecipients.associatedTriageGroupsQty,
            noAssociations: false,
            allowedRecipients: noBlockedRecipients.mockAllowedRecipients,
            allRecipients: noBlockedRecipients.mockAllowedRecipients,
            recentRecipients: [noBlockedRecipients.mockAllowedRecipients[0]],
          },
          threadDetails: {
            drafts: [],
            acceptInterstitial: false,
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
        },
      };

      const { findByTestId, history } = setup({ state });

      const startMessageLink = await findByTestId('start-message-link');

      fireEvent.click(startMessageLink);

      await waitFor(() => {
        expect(history.location.pathname).to.equal(Paths.RECENT_CARE_TEAMS);
      });
    });

    it('displays selected recipient title instead of dropdown after interstitial', async () => {
      const state = {
        sm: {
          triageTeams: { triageTeams },
          categories: { categories },
          recipients: {
            associatedTriageGroupsQty:
              noBlockedRecipients.associatedTriageGroupsQty,
            noAssociations: false,
            allowedRecipients: noBlockedRecipients.mockAllowedRecipients,
          },
          preferences: {
            signature: {
              signatureName: 'TEST',
              signatureTitle: 'TITLE',
              includeSignature: true,
            },
          },
          threadDetails: {
            acceptInterstitial: true,
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
        },
      };

      const screen = setup({ state });

      // Should show recipient title instead of dropdown
      await waitFor(() => {
        const recipientTitle = screen.getByTestId('compose-recipient-title');
        expect(recipientTitle).to.exist;
      });

      // Should not show the old recipient select dropdown
      const recipientSelect = screen.queryByTestId('compose-recipient-select');
      expect(recipientSelect).to.not.exist;

      // Should show link to select different care team
      const selectDifferentTeamLink = screen.getByText(
        'Select a different care team',
      );
      expect(selectDifferentTeamLink).to.exist;
    });

    it('displays compose form fields with new flow after accepting interstitial', async () => {
      const state = {
        sm: {
          triageTeams: { triageTeams },
          categories: { categories },
          recipients: {
            associatedTriageGroupsQty:
              noBlockedRecipients.associatedTriageGroupsQty,
            noAssociations: false,
            allowedRecipients: noBlockedRecipients.mockAllowedRecipients,
          },
          preferences: {
            signature: {
              signatureName: 'TEST',
              signatureTitle: 'TITLE',
              includeSignature: true,
            },
          },
          threadDetails: {
            acceptInterstitial: true,
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
        },
      };

      const screen = setup({ state });

      await waitFor(() => {
        const categoryDropdown = screen.getByTestId(
          'compose-message-categories',
        );
        expect(categoryDropdown).to.exist;
      });

      const subject = await waitFor(() => {
        return screen.getByTestId('message-subject-field');
      });
      const body = await waitFor(() => {
        return screen.getByTestId('message-body-field');
      });

      expect(subject).to.exist;
      expect(body).to.exist;
      expect(screen.getByTestId('edit-signature-link')).to.exist;
    });
  });
});
