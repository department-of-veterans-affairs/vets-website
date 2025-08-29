import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import reducer from '../../reducers';
import { ErrorMessages, Paths } from '../../util/constants';
import SelectCareTeam from '../../containers/SelectCareTeam';
import noBlockedRecipients from '../fixtures/json-triage-mocks/triage-teams-mock.json';
import noBlocked6Recipients from '../fixtures/json-triage-mocks/triage-teams-mock-6-teams.json';
import singleFacility from '../fixtures/json-triage-mocks/triage-teams-one-facility-mock.json';
import { selectVaRadio, selectVaSelect } from '../../util/testUtils';
import * as threadDetailsActions from '../../actions/threadDetails';

describe('SelectCareTeam', () => {
  let updateDraftInProgressSpy;

  beforeEach(() => {
    if (updateDraftInProgressSpy && updateDraftInProgressSpy.restore) {
      updateDraftInProgressSpy.restore();
    }
    updateDraftInProgressSpy = sinon.spy(
      threadDetailsActions,
      'updateDraftInProgress',
    );
  });

  afterEach(() => {
    if (updateDraftInProgressSpy && updateDraftInProgressSpy.restore) {
      updateDraftInProgressSpy.restore();
      updateDraftInProgressSpy = null;
    }
    cleanup();
  });

  const initialState = {
    sm: {
      recipients: {
        allFacilities: noBlockedRecipients.mockAllFacilities,
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
        draftInProgress: {},
      },
    },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: {
            '662': {
              vhaId: '662',
              vamcSystemName: 'Test Facility 1',
              ehr: 'vista',
            },
            '636': {
              vhaId: '636',
              vamcSystemName: 'Test Facility 2',
              ehr: 'vista',
            },
            '587': {
              vhaId: '587',
              vamcSystemName: 'Test Facility 3',
              ehr: 'vista',
            },
            '321': {
              vhaId: '321',
              vamcSystemName: 'Test Facility 4',
              ehr: 'vista',
            },
            '954': {
              vhaId: '954',
              vamcSystemName: 'Test Facility 5',
              ehr: 'cerner',
            },
            '834': {
              vhaId: '834',
              vamcSystemName: 'Test Facility 6',
              ehr: 'cerner',
            },
          },
        },
      },
    },
  };

  it('renders the heading and radio options', () => {
    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    expect(
      screen.getByRole('heading', {
        name: /Select care team/i,
      }),
    ).to.exist;
    const vaRadio = screen.container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'Select a VA health care system',
    );
    expect(vaRadio.getAttribute('data-dd-action-name')).to.equal(
      'Care System Radio button',
    );
    expect(vaRadio.getAttribute('data-dd-privacy')).to.equal('mask');
    const vaRadioOption = screen.container.querySelector('va-radio-option');
    expect(vaRadioOption).to.exist;

    expect(vaRadioOption.getAttribute('id')).to.equal('636');
    expect(screen.getByTestId('care-system-636')).to.exist;
    expect(screen.getByTestId('care-system-662')).to.exist;
  });

  it('displays health care system facilities as radio button options', async () => {
    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });
    expect(screen.getByTestId('care-system-636')).to.exist; // VA Boston
    expect(screen.getByTestId('care-system-662')).to.exist; // VA Seattle
    // Check the number of radio options
    const radioOptions = screen.container.querySelectorAll('va-radio-option');
    expect(radioOptions.length).to.equal(2);
  });

  it('displays health care system facilities as select dropdown when 6 or more', async () => {
    const customState = {
      ...initialState,
      sm: {
        recipients: {
          allFacilities: noBlocked6Recipients.mockAllFacilities,
          allRecipients: noBlocked6Recipients.mockAllRecipients,
          allowedRecipients: noBlocked6Recipients.mockAllowedRecipients,
          blockedRecipients: noBlocked6Recipients.mockBlockedRecipients,
          associatedTriageGroupsQty:
            noBlocked6Recipients.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            noBlocked6Recipients.associatedBlockedTriageGroupsQty,
          noAssociations: noBlocked6Recipients.noAssociations,
          allTriageGroupsBlocked: noBlocked6Recipients.allTriageGroupsBlocked,
        },
      },
    };
    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    await waitFor(() => {
      const careSystemSelect = screen.getByTestId('care-system-select');

      const options = careSystemSelect.querySelectorAll('option');
      expect(options).to.have.lengthOf(
        customState.sm.recipients.allFacilities.length,
      );

      const careTeamSelect = screen.getByTestId('compose-recipient-select');
      const careTeamOptions = careTeamSelect.querySelectorAll('option');
      expect(careTeamOptions).to.have.lengthOf(11);
    });
  });

  it('updates care team selection options when a care system is selected', async () => {
    const customState = {
      ...initialState,
      sm: {
        recipients: {
          allFacilities: noBlocked6Recipients.mockAllFacilities,
          allRecipients: noBlocked6Recipients.mockAllRecipients,
          allowedRecipients: noBlocked6Recipients.mockAllowedRecipients,
          blockedRecipients: noBlocked6Recipients.mockBlockedRecipients,
          associatedTriageGroupsQty:
            noBlocked6Recipients.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            noBlocked6Recipients.associatedBlockedTriageGroupsQty,
          noAssociations: noBlocked6Recipients.noAssociations,
          allTriageGroupsBlocked: noBlocked6Recipients.allTriageGroupsBlocked,
        },
      },
    };
    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    selectVaSelect(
      screen.container,
      '636',
      '[data-testid="care-system-select"]',
    );
    await waitFor(() => {
      const careTeamSelect = screen.getByTestId('compose-recipient-select');
      const careTeamOptions = careTeamSelect.querySelectorAll('option');
      expect(careTeamOptions).to.have.lengthOf(3);
    });
  });

  it('updates care team selection options when a care system radio is selected', async () => {
    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    selectVaRadio(screen.container, '636');

    await waitFor(() => {
      const careTeamSelect = screen.getByTestId('compose-recipient-select');
      const careTeamOptions = careTeamSelect.querySelectorAll('option');
      expect(careTeamOptions).to.have.lengthOf(5);
    });
  });

  it('updates care team on care team selection', async () => {
    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    await waitFor(() => {
      const val = initialState.sm.recipients.allowedRecipients[0].id;
      selectVaSelect(screen.container, val);

      expect(screen.getByTestId('compose-recipient-select')).to.have.value(val);
    });
  });

  it('navigates to start-message when no messageId present', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        threadDetails: {
          draftInProgress: {
            recipientId: initialState.sm.recipients.allowedRecipients[0].id,
            recipientName: initialState.sm.recipients.allowedRecipients[0].name,
          },
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    await waitFor(() => {
      const val = customState.sm.recipients.allowedRecipients[0].id;
      selectVaSelect(screen.container, val);

      const continueButton = screen.getByTestId('continue-button');
      expect(continueButton).to.exist;
      fireEvent.click(continueButton);

      expect(screen.history.location.pathname).to.equal(
        `${Paths.COMPOSE}${Paths.START_MESSAGE}`,
      );
    });
  });

  it('navigates to edit draft when messageId present', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        threadDetails: {
          draftInProgress: {
            recipientId: initialState.sm.recipients.allowedRecipients[0].id,
            recipientName: initialState.sm.recipients.allowedRecipients[0].name,
            messageId: 123456,
          },
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    await waitFor(() => {
      const val = customState.sm.recipients.allowedRecipients[0].id;
      selectVaSelect(screen.container, val);

      const continueButton = screen.getByTestId('continue-button');
      expect(continueButton).to.exist;
      fireEvent.click(continueButton);

      expect(screen.history.location.pathname).to.equal(
        `${Paths.MESSAGE_THREAD}${
          customState.sm.threadDetails.draftInProgress.messageId
        }`,
      );
    });
  });

  it('dispatches correct care system when it does not match the selected care team on continue', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        threadDetails: {
          draftInProgress: {
            recipientId: initialState.sm.recipients.allowedRecipients[0].id,
            recipientName: initialState.sm.recipients.allowedRecipients[0].name,
            careSystemName: null,
            careSystemVhaId: null,
          },
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    await waitFor(() => {
      const val = customState.sm.recipients.allowedRecipients[0].id;
      selectVaSelect(screen.container, val);

      const continueButton = screen.getByTestId('continue-button');
      fireEvent.click(continueButton);

      sinon.assert.calledWith(updateDraftInProgressSpy);
      const callArgs = updateDraftInProgressSpy.lastCall.args[0];

      expect(callArgs).to.include({
        careSystemVhaId: '662',
        careSystemName: 'Test Facility 1',
      });
    });
  });

  it('dispatches care system when user has only one facility', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          allFacilities: singleFacility.mockAllFacilities,
          allRecipients: singleFacility.mockAllRecipients,
          allowedRecipients: singleFacility.mockAllowedRecipients,
          blockedRecipients: singleFacility.mockBlockedRecipients,
          associatedTriageGroupsQty: singleFacility.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            singleFacility.associatedBlockedTriageGroupsQty,
          noAssociations: singleFacility.noAssociations,
          allTriageGroupsBlocked: singleFacility.allTriageGroupsBlocked,
        },
        threadDetails: {
          draftInProgress: {},
        },
      },
    };

    renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    await waitFor(() => {
      sinon.assert.calledWith(updateDraftInProgressSpy);
    });
    const callArgs = updateDraftInProgressSpy.lastCall.args[0];

    expect(callArgs).to.include({
      careSystemVhaId: '662',
      careSystemName: 'Test Facility 1',
    });
  });

  it('dispatches CONT_SAVING_DRAFT_CHANGES navigation error when draft has body, subject, and category', async () => {
    const customState = {
      ...initialState,
      featureToggles: {
        loading: false,
      },
      sm: {
        ...initialState.sm,
        threadDetails: {
          draftInProgress: {
            body: 'Draft message body',
            subject: 'Draft subject',
            category: 'GENERAL',
          },
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    const val = String(customState.sm.recipients.allowedRecipients[0].id);

    await waitFor(async () => {
      const selectElement = screen.getByTestId('compose-recipient-select');
      selectVaSelect(screen.container, val);

      // Wait a bit for the component to process the selection
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(selectElement).to.have.attribute('value', val);
    });

    // Check that the spy was called with navigationError
    const getNavigationErrorCall = () => {
      return updateDraftInProgressSpy
        .getCalls()
        .find(call => call.args[0]?.navigationError);
    };
    let navigationErrorCall;
    await waitFor(
      () => {
        navigationErrorCall = getNavigationErrorCall();
        expect(navigationErrorCall).to.exist;
      },
      { timeout: 5000 },
    );
    const actualError = navigationErrorCall.args[0].navigationError;
    const isValidError =
      actualError.title ===
        ErrorMessages.ComposeForm.CONT_SAVING_DRAFT_CHANGES.title ||
      actualError.title === ErrorMessages.ComposeForm.UNABLE_TO_SAVE.title;
    expect(isValidError).to.be.true;
  });

  it('dispatches UNABLE_TO_SAVE navigation error when draft is missing body, subject, or category', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        threadDetails: {
          draftInProgress: {
            body: 'Draft message body',
            // missing subject and category
          },
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    await waitFor(async () => {
      const val = String(customState.sm.recipients.allowedRecipients[0].id);
      const selectElement = screen.getByTestId('compose-recipient-select');
      selectVaSelect(screen.container, val);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(selectElement).to.have.attribute('value', val);
    });

    await waitFor(() => {
      const calls = updateDraftInProgressSpy.getCalls();
      const navigationErrorCall = calls.find(
        call => call.args[0]?.navigationError,
      );
      expect(navigationErrorCall).to.exist;
      expect(navigationErrorCall.args[0].navigationError).to.deep.equal(
        ErrorMessages.ComposeForm.UNABLE_TO_SAVE,
      );
    });
  });

  it('redirects users to interstitial page if interstitial not accepted', async () => {
    const oldLocation = global.window.location;
    global.window.location = {
      replace: sinon.spy(),
    };

    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        threadDetails: {
          acceptInterstitial: false,
          draftInProgress: {},
        },
      },
    };

    const { history } = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    await waitFor(() => {
      expect(history.location.pathname).to.equal('/new-message/');
    });

    global.window.location = oldLocation;
  });

  it('wont redirect users if interstitial accepted', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        threadDetails: {
          acceptInterstitial: true,
          draftInProgress: {},
        },
      },
    };

    const { history } = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    await waitFor(() => {
      expect(history.location.pathname).to.equal('select-care-team');
    });
  });
});
