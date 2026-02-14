import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { datadogRum } from '@datadog/browser-rum';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import * as monitoring from '@department-of-veterans-affairs/platform-monitoring/exports';
import reducer from '../../reducers';
import { ErrorMessages, Paths } from '../../util/constants';
import SelectCareTeam from '../../containers/SelectCareTeam';
import noBlockedRecipients from '../fixtures/json-triage-mocks/triage-teams-mock.json';
import noBlocked6Recipients from '../fixtures/json-triage-mocks/triage-teams-mock-6-teams.json';
import singleFacility from '../fixtures/json-triage-mocks/triage-teams-one-facility-mock.json';
import { selectVaRadio, selectVaSelect } from '../../util/testUtils';
import * as threadDetailsActions from '../../actions/threadDetails';

describe('SelectCareTeam', () => {
  let sandbox;
  let updateDraftInProgressSpy;
  let recordEventStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    updateDraftInProgressSpy = sandbox.spy(
      threadDetailsActions,
      'updateDraftInProgress',
    );
    recordEventStub = sinon.stub(monitoring, 'recordEvent');
  });

  afterEach(() => {
    sandbox.restore();
    recordEventStub.restore();
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
        vistaFacilities: noBlockedRecipients.mockVistaFacilities,
      },
      threadDetails: {
        draftInProgress: {},
      },
    },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: {
            662: {
              vhaId: '662',
              vamcSystemName: 'Test Facility 1',
              ehr: 'vista',
            },
            636: {
              vhaId: '636',
              vamcSystemName: 'Test Facility 2',
              ehr: 'vista',
            },
            587: {
              vhaId: '587',
              vamcSystemName: 'Test Facility 3',
              ehr: 'vista',
            },
            321: {
              vhaId: '321',
              vamcSystemName: 'Test Facility 4',
              ehr: 'vista',
            },
            954: {
              vhaId: '954',
              vamcSystemName: 'Test Facility 5',
              ehr: 'cerner',
            },
            834: {
              vhaId: '834',
              vamcSystemName: 'Test Facility 6',
              ehr: 'cerner',
            },
          },
        },
      },
    },
  };

  it('renders the heading and radio options', async () => {
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

    await waitFor(() => {
      expect(document.title).to.contain(
        'Select Care Team - Start Message | Veterans Affairs',
      );
    });
    const vaRadio = screen.container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.hasAttribute('enable-analytics')).to.be.true;
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
    expect(screen.getByTestId('care-system-757')).to.exist; // VA Seattle

    // Check the number of radio options
    const radioOptions = screen.container.querySelectorAll('va-radio-option');
    expect(radioOptions.length).to.equal(3);
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
      // Ensure enable-analytics is present on VaSelect
      expect(careSystemSelect.hasAttribute('enable-analytics')).to.be.true;

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
      expect(careTeamOptions).to.have.lengthOf(7);
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

  it('Updates continue button text when no messageId present', async () => {
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
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
      },
    };

    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    const continueButton = await screen.findByTestId('continue-button');
    expect(continueButton).to.exist;
    expect(continueButton).to.have.attribute(
      'text',
      'Continue to start message',
    );
  });

  it('Updates continue button text when messageId present', async () => {
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
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
      },
    };

    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    const continueButton = await screen.findByTestId('continue-button');
    expect(continueButton).to.exist;
    expect(continueButton).to.have.attribute('text', 'Continue to draft');
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

    const val = customState.sm.recipients.allowedRecipients[0].id;
    selectVaSelect(screen.container, val);

    const continueButton = screen.getByTestId('continue-button');
    await waitFor(() => {
      fireEvent.click(continueButton);
    });
    waitFor(() => {
      expect(updateDraftInProgressSpy.lastCall.args[0]).to.include({
        careSystemVhaId: '662',
        careSystemName: 'Test Facility 1',
      });
    });
  });

  it('dispatches ohTriageGroup attribute for care system', async () => {
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

    const val = customState.sm.recipients.allowedRecipients.find(
      r => r.ohTriageGroup === true,
    ).id;
    await waitFor(() => {
      selectVaSelect(screen.container, val);
    });

    waitFor(() => {
      const callArgs = updateDraftInProgressSpy.args;
      const validArg = callArgs.find(arg => arg[0].ohTriageGroup === true);
      expect(validArg[0]).to.include({
        ohTriageGroup: true,
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
      expect(updateDraftInProgressSpy.calledOnce).to.be.true;
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
      expect(history.location.pathname).to.equal('select-care-team/');
    });
  });

  it('shows contact list link when user has only Vista facilities', async () => {
    const vistaOnlyState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          ...initialState.sm.recipients,
          allRecipients: [
            {
              id: 1013155,
              triageTeamId: 1013155,
              name: 'Vista Team',
              stationNumber: '636',
              blockedStatus: false,
              preferredTeam: true,
              relationshipType: 'PATIENT',
              ohTriageGroup: false,
            },
          ],
          allowedRecipients: [
            {
              id: 1013155,
              triageTeamId: 1013155,
              name: 'Vista Team',
              stationNumber: '636',
              blockedStatus: false,
              preferredTeam: true,
              relationshipType: 'PATIENT',
              ohTriageGroup: false,
            },
          ],
          vistaFacilities: ['636'],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: vistaOnlyState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    await waitFor(() => {
      expect(screen.getByText('Update your contact list')).to.exist;
    });
  });

  it('does not show contact list link when user has only Cerner facilities', async () => {
    const cernerOnlyState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          ...initialState.sm.recipients,
          allRecipients: [
            {
              id: 2710522,
              triageTeamId: 2710522,
              name: 'Cerner Team',
              stationNumber: '757',
              blockedStatus: false,
              preferredTeam: true,
              relationshipType: 'PATIENT',
              ohTriageGroup: true,
            },
          ],
          allowedRecipients: [
            {
              id: 2710522,
              triageTeamId: 2710522,
              name: 'Cerner Team',
              stationNumber: '757',
              blockedStatus: false,
              preferredTeam: true,
              relationshipType: 'PATIENT',
              ohTriageGroup: true,
            },
          ],
          vistaFacilities: [],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: cernerOnlyState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    await waitFor(() => {
      expect(screen.queryByText('Update your contact list')).to.not.exist;
    });
  });

  it('shows contact list link when user has both Vista and Cerner facilities', async () => {
    const bothState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          ...initialState.sm.recipients,
          allRecipients: [
            {
              id: 1013155,
              triageTeamId: 1013155,
              name: 'Vista Team',
              stationNumber: '636',
              blockedStatus: false,
              preferredTeam: true,
              relationshipType: 'PATIENT',
              ohTriageGroup: false,
            },
            {
              id: 2710522,
              triageTeamId: 2710522,
              name: 'Cerner Team',
              stationNumber: '757',
              blockedStatus: false,
              preferredTeam: true,
              relationshipType: 'PATIENT',
              ohTriageGroup: true,
            },
          ],
          allowedRecipients: [
            {
              id: 1013155,
              triageTeamId: 1013155,
              name: 'Vista Team',
              stationNumber: '636',
              blockedStatus: false,
              preferredTeam: true,
              relationshipType: 'PATIENT',
              ohTriageGroup: false,
            },
            {
              id: 2710522,
              triageTeamId: 2710522,
              name: 'Cerner Team',
              stationNumber: '757',
              blockedStatus: false,
              preferredTeam: true,
              relationshipType: 'PATIENT',
              ohTriageGroup: true,
            },
          ],
          vistaFacilities: ['636'],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: bothState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    await waitFor(() => {
      expect(screen.getByText('Update your contact list')).to.exist;
    });
  });

  describe('Datadog RUM tracking', () => {
    let addActionSpy;

    const stateWithAcceptInterstitial = {
      ...initialState,
      sm: {
        ...initialState.sm,
        threadDetails: {
          acceptInterstitial: true,
          draftInProgress: {},
        },
      },
    };

    beforeEach(() => {
      addActionSpy = sinon.spy(datadogRum, 'addAction');
    });

    afterEach(() => {
      addActionSpy.restore();
    });

    it('should call datadogRum.addAction on unmount when care system was switched', async () => {
      // Set initial state with a pre-selected care system
      const stateWithPreselectedCareSystem = {
        ...stateWithAcceptInterstitial,
        sm: {
          ...stateWithAcceptInterstitial.sm,
          threadDetails: {
            ...stateWithAcceptInterstitial.sm.threadDetails,
            draftInProgress: {
              careSystemVhaId: '636',
            },
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: stateWithPreselectedCareSystem,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId('care-system-662')).to.exist;
      });

      // Switch from 636 to 662
      selectVaRadio(screen.container, '662');

      await waitFor(() => {
        expect(updateDraftInProgressSpy.called).to.be.true;
      });

      // Unmount component to trigger useEffect cleanup
      screen.unmount();

      // Check that datadogRum.addAction was called
      await waitFor(() => {
        expect(addActionSpy.calledOnce).to.be.true;
      });
      expect(
        addActionSpy.calledWith('Care System Radio Switch Count', {
          switchCount: 1,
        }),
      ).to.be.true;
    });

    it('should track multiple care system switches', async () => {
      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: stateWithAcceptInterstitial,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId('care-system-662')).to.exist;
      });

      // Each selection is a switch since each value is different from the previous
      selectVaRadio(screen.container, '662');
      selectVaRadio(screen.container, '636');
      selectVaRadio(screen.container, '587');

      // Unmount component
      screen.unmount();

      // Check that datadogRum.addAction was called
      await waitFor(() => {
        expect(addActionSpy.calledOnce).to.be.true;
      });
      const callArgs = addActionSpy.lastCall.args;
      expect(callArgs[0]).to.equal('Care System Radio Switch Count');
      expect(callArgs[1]).to.deep.equal({
        switchCount: 3,
      });
    });

    it('should call datadogRum.addAction when no care system switches occurred', async () => {
      renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: stateWithAcceptInterstitial,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Unmount without any switches
      cleanup();

      await waitFor(() => {
        expect(addActionSpy.called).to.be.true;
      });
      const callArgs = addActionSpy.lastCall.args;
      expect(callArgs[0]).to.equal('Care System Radio Switch Count');
      expect(callArgs[1]).to.deep.equal({
        switchCount: 0,
      });
    });

    it('should track only one switch when selecting same care system multiple times', async () => {
      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: stateWithAcceptInterstitial,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId('care-system-662')).to.exist;
      });

      // First selection counts as a switch, second selection of same value does not
      selectVaRadio(screen.container, '662');
      selectVaRadio(screen.container, '662');

      // Unmount component
      screen.unmount();

      // Check that datadogRum.addAction was called
      await waitFor(() => {
        expect(addActionSpy.calledOnce).to.be.true;
      });
      expect(
        addActionSpy.calledWith('Care System Radio Switch Count', {
          switchCount: 1,
        }),
      ).to.be.true;
    });
  });

  describe('Error Handling', () => {
    it('should redirect to inbox when recipientsError is true', async () => {
      const stateWithRecipientsError = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            ...initialState.sm.recipients,
            error: true,
          },
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: stateWithRecipientsError,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      await waitFor(() => {
        expect(screen.history.location.pathname).to.equal(Paths.INBOX);
      });
    });

    it('should not redirect to inbox when recipientsError is false', async () => {
      const stateWithoutRecipientsError = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            ...initialState.sm.recipients,
            error: false,
          },
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: stateWithoutRecipientsError,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Wait a bit to ensure no redirect happens
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(screen.history.location.pathname).to.equal(Paths.SELECT_CARE_TEAM);
    });

    it('should not redirect to inbox when recipientsError is undefined', async () => {
      const stateWithoutRecipientsError = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            ...initialState.sm.recipients,
            error: undefined,
          },
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: stateWithoutRecipientsError,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Wait a bit to ensure no redirect happens
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(screen.history.location.pathname).to.equal(Paths.SELECT_CARE_TEAM);
    });
  });

  describe('Analytics - VA Health Systems Displayed', () => {
    beforeEach(() => {
      global.window.dataLayer = [];
    });

    afterEach(() => {
      global.window.dataLayer = [];
    });

    const findDataLayerEvent = eventName => {
      return global.window.dataLayer?.find(e => e['api-name'] === eventName);
    };

    it('should call recordEvent when multiple VA health systems are displayed as radio buttons', async () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            ...initialState.sm.recipients,
            allFacilities: ['636', '662', '757'], // 3 facilities
          },
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Wait for the radio buttons to render using testid
      await waitFor(() => {
        expect(screen.getByTestId('care-system-636')).to.exist;
      });

      // Check that recordEvent pushed to dataLayer
      await waitFor(() => {
        const event = findDataLayerEvent('SM VA Health Systems Displayed');
        expect(event).to.exist;
        expect(event).to.deep.include({
          event: 'api_call',
          'api-name': 'SM VA Health Systems Displayed',
          'api-status': 'successful',
          'health-systems-count': 3,
          version: 'radio',
        });
      });
    });

    it('should call recordEvent when 6 or more VA health systems are displayed as dropdown', async () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            ...initialState.sm.recipients,
            allFacilities: noBlocked6Recipients.mockAllFacilities, // 6 facilities
          },
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Wait for the dropdown to render using testid
      await waitFor(() => {
        expect(screen.getByTestId('care-system-select')).to.exist;
      });

      // Check that recordEvent pushed to dataLayer
      await waitFor(() => {
        const event = findDataLayerEvent('SM VA Health Systems Displayed');
        expect(event).to.exist;
        expect(event).to.deep.include({
          event: 'api_call',
          'api-name': 'SM VA Health Systems Displayed',
          'api-status': 'successful',
          'health-systems-count': 6,
          version: 'dropdown',
        });
      });
    });

    it('should not call recordEvent when only one VA health system exists', async () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            ...initialState.sm.recipients,
            allFacilities: ['636'], // Only 1 facility
          },
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Wait for component to render (heading should always be present)
      await screen.findByRole('heading', { name: 'Select care team' });

      // Wait a bit to ensure useEffect has run
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check that recordEvent was NOT called for this event
      const event = findDataLayerEvent('SM VA Health Systems Displayed');
      expect(event).to.be.undefined;
    });

    it('should call recordEvent with fail status when no VA health systems exist', async () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            ...initialState.sm.recipients,
            allFacilities: [], // No facilities
            noAssociations: false, // Ensure we don't redirect
          },
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
      };

      renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Check that recordEvent pushed to dataLayer with fail status
      await waitFor(() => {
        const event = findDataLayerEvent('SM VA Health Systems Displayed');
        expect(event).to.exist;
        expect(event).to.deep.include({
          event: 'api_call',
          'api-name': 'SM VA Health Systems Displayed',
          'api-status': 'fail',
          'health-systems-count': 0,
          'error-key': 'no-health-systems',
        });
      });
    });
  });

  describe('Analytics - Care Team Search Input', () => {
    beforeEach(() => {
      global.window.dataLayer = [];
      // Restore recordEvent to allow real dataLayer pushes for these tests
      recordEventStub.restore();
    });

    afterEach(() => {
      global.window.dataLayer = [];
      // Re-stub recordEvent after these tests
      recordEventStub = sinon.stub(monitoring, 'recordEvent');
    });

    const findDataLayerEvent = eventName => {
      return global.window.dataLayer?.find(e => e.event === eventName);
    };

    // Note: This test is skipped because it relies on simulating input in a web component's
    // shadow DOM (va-combo-box), which doesn't properly trigger the component's internal
    // handlers in the unit test environment. The debounced analytics event requires the
    // actual shadow DOM input to be modified, which can't be accurately simulated.
    // This analytics behavior should be verified in E2E tests instead.
    it.skip('should call recordEvent when user types in care team search box', async () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Wait for the combobox to render
      await waitFor(() => {
        expect(screen.getByTestId('compose-recipient-combobox')).to.exist;
      });

      // Simulate typing in the combobox by triggering onInput event
      const combobox = screen.getByTestId('compose-recipient-combobox');
      const inputEvent = new CustomEvent('input', {
        bubbles: true,
        detail: { value: 'test search' },
      });
      // Mock the shadowRoot querySelector to return an input with the typed value
      Object.defineProperty(combobox, 'shadowRoot', {
        value: {
          querySelector: () => ({ value: 'test search' }),
        },
        writable: true,
      });
      combobox.dispatchEvent(inputEvent);

      // Wait for debounce timer (500ms) plus some buffer
      await waitFor(
        () => {
          const event = findDataLayerEvent('int-text-input-search');
          expect(event).to.exist;
          expect(event).to.deep.include({
            event: 'int-text-input-search',
            'text-input-label': 'Select a care team',
          });
        },
        { timeout: 2000 },
      );
    });

    it('should not call recordEvent when search box is empty', async () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Wait for the combobox to render
      await waitFor(() => {
        expect(screen.getByTestId('compose-recipient-combobox')).to.exist;
      });

      // Wait to ensure no event fires
      await new Promise(resolve => setTimeout(resolve, 600));

      // Check that recordEvent was NOT called for empty search
      const event = findDataLayerEvent('int-text-input-search');
      expect(event).to.be.undefined;
    });
  });

  describe('Blocked Triage Group Alert', () => {
    it('should render BlockedTriageGroupAlert with ALERT style when allTriageGroupsBlocked is true', () => {
      const allBlockedState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            ...initialState.sm.recipients,
            allTriageGroupsBlocked: true,
            blockedFacilities: [],
            blockedRecipients: [],
            associatedBlockedTriageGroupsQty: 3,
          },
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: allBlockedState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Should render the h1
      expect(screen.container.querySelector('h1')).to.exist;

      // Should render the BlockedTriageGroupAlert as va-alert-expandable (ALERT style)
      const alert = screen.container.querySelector('va-alert-expandable');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('warning');
      expect(alert.getAttribute('trigger')).to.include(
        "can't send messages to your care teams",
      );

      // Should NOT render the care system selection (va-radio or va-select)
      const radioGroup = screen.container.querySelector('va-radio');
      expect(radioGroup).to.not.exist;
      const selectDropdown = screen.container.querySelector('va-select');
      expect(selectDropdown).to.not.exist;

      // Should NOT render the care team combobox
      const combobox = screen.container.querySelector(
        '[data-testid="compose-recipient-combobox"]',
      );
      expect(combobox).to.not.exist;
    });

    it('should render BlockedTriageGroupAlert with INFO style when single facility is blocked', () => {
      const singleFacilityBlockedState = {
        ...initialState,
        drupalStaticData: {
          vamcEhrData: {
            data: {
              ehrDataByVhaId: {
                ...initialState.drupalStaticData.vamcEhrData.data
                  .ehrDataByVhaId,
                '553': {
                  vhaId: '553',
                  vamcSystemName: 'VA Detroit Healthcare System',
                  ehr: 'vista',
                },
              },
            },
          },
        },
        sm: {
          ...initialState.sm,
          recipients: {
            ...initialState.sm.recipients,
            allTriageGroupsBlocked: false,
            blockedFacilities: ['553'],
            blockedRecipients: [],
            associatedBlockedTriageGroupsQty: 1,
          },
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: singleFacilityBlockedState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Should render the h1
      expect(screen.container.querySelector('h1')).to.exist;

      // Should render the BlockedTriageGroupAlert as va-alert (INFO style)
      const alert = screen.container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('info');

      // Should still render the care system selection
      const radioGroup = screen.container.querySelector('va-radio');
      expect(radioGroup).to.exist;
    });

    it('should render BlockedTriageGroupAlert with INFO style when individual teams are blocked', () => {
      const blockedTeamsState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            ...initialState.sm.recipients,
            allTriageGroupsBlocked: false,
            blockedFacilities: [],
            blockedRecipients: [
              {
                id: 12345,
                name: 'Blocked Team 1',
                stationNumber: '662',
              },
            ],
            associatedBlockedTriageGroupsQty: 1,
          },
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: blockedTeamsState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Should render the h1
      expect(screen.container.querySelector('h1')).to.exist;

      // Should render the BlockedTriageGroupAlert as va-alert (INFO style)
      const alert = screen.container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('info');

      // Should still render the care system selection
      const radioGroup = screen.container.querySelector('va-radio');
      expect(radioGroup).to.exist;
    });

    it('should NOT render BlockedTriageGroupAlert when no blocked facilities or teams', () => {
      const noBlockedState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            ...initialState.sm.recipients,
            allTriageGroupsBlocked: false,
            blockedFacilities: [],
            blockedRecipients: [],
            associatedBlockedTriageGroupsQty: 0,
          },
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: noBlockedState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Should render the h1
      expect(screen.container.querySelector('h1')).to.exist;

      // Should NOT render any va-alert (BlockedTriageGroupAlert)
      // Note: EmergencyNote renders a va-alert-expandable, so we check for va-alert specifically
      const alert = screen.container.querySelector(
        'va-alert[data-testid="blocked-triage-group-alert"]',
      );
      expect(alert).to.not.exist;

      // Should render the care system selection normally
      const radioGroup = screen.container.querySelector('va-radio');
      expect(radioGroup).to.exist;
    });

    it('should NOT render BlockedTriageGroupAlert when multiple facilities are blocked but not all', () => {
      const multipleBlockedState = {
        ...initialState,
        drupalStaticData: {
          vamcEhrData: {
            data: {
              ehrDataByVhaId: {
                ...initialState.drupalStaticData.vamcEhrData.data
                  .ehrDataByVhaId,
                '553': {
                  vhaId: '553',
                  vamcSystemName: 'VA Detroit Healthcare System',
                  ehr: 'vista',
                },
                '648': {
                  vhaId: '648',
                  vamcSystemName: 'VA Portland Healthcare System',
                  ehr: 'vista',
                },
              },
            },
          },
        },
        sm: {
          ...initialState.sm,
          recipients: {
            ...initialState.sm.recipients,
            allTriageGroupsBlocked: false,
            blockedFacilities: ['553', '648'],
            blockedRecipients: [],
            associatedBlockedTriageGroupsQty: 2,
          },
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: multipleBlockedState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Should render the h1
      expect(screen.container.querySelector('h1')).to.exist;

      // Should NOT render BlockedTriageGroupAlert when multiple (not single) facilities blocked
      // Based on the condition: blockedFacilities?.length === 1 && !allTriageGroupsBlocked
      const alert = screen.container.querySelector(
        'va-alert[data-testid="blocked-triage-group-alert"]',
      );
      expect(alert).to.not.exist;

      // Should render the care system selection normally
      const radioGroup = screen.container.querySelector('va-radio');
      expect(radioGroup).to.exist;
    });

    it('should filter blocked facilities from care system radio options', () => {
      const stateWithBlockedFacility = {
        ...initialState,
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
                  vamcSystemName: 'Blocked Facility',
                  ehr: 'vista',
                },
              },
            },
          },
        },
        sm: {
          ...initialState.sm,
          recipients: {
            ...initialState.sm.recipients,
            allFacilities: ['662', '636', '587'],
            blockedFacilities: ['587'],
            blockedRecipients: [],
            associatedBlockedTriageGroupsQty: 1,
          },
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: stateWithBlockedFacility,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Should render radio options
      const radioGroup = screen.container.querySelector('va-radio');
      expect(radioGroup).to.exist;

      // Should NOT include the blocked facility in radio options
      const radioOptions = screen.container.querySelectorAll('va-radio-option');
      const optionLabels = Array.from(radioOptions).map(option =>
        option.getAttribute('label'),
      );

      expect(optionLabels).to.include('Test Facility 1');
      expect(optionLabels).to.include('Test Facility 2');
      expect(optionLabels).to.not.include('Blocked Facility');
    });
  });

  describe('Care team selection validation', () => {
    it('should display error and focus input when continue is clicked without selecting a care team', async () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      // Wait for component to fully render
      await waitFor(() => {
        expect(screen.getByTestId('continue-button')).to.exist;
      });

      // Click continue without selecting a care team
      const continueButton = screen.getByTestId('continue-button');
      fireEvent.click(continueButton);

      // Wait for error to be set
      await waitFor(() => {
        const combobox = screen.container.querySelector(
          '[data-testid="compose-recipient-combobox"]',
        );
        expect(combobox).to.exist;
        expect(combobox).to.have.attribute('error', 'Select a care team');
      });
    });

    it('should set error message accessible to screen readers', async () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      await waitFor(() => {
        expect(screen.getByTestId('continue-button')).to.exist;
      });

      // Click continue without selection
      const continueButton = screen.getByTestId('continue-button');
      fireEvent.click(continueButton);

      // Verify error attribute is set for screen reader accessibility
      await waitFor(() => {
        const combobox = screen.container.querySelector(
          '[data-testid="compose-recipient-combobox"]',
        );
        expect(combobox).to.exist;

        // Verify error attribute exists (required for screen reader announcement)
        const errorAttr = combobox.getAttribute('error');
        expect(errorAttr).to.equal('Select a care team');

        // The VaComboBox web component handles ARIA associations internally
        // when the error prop is set, making the error accessible to screen readers
      });
    });

    it('should clear error when a care team is selected', async () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      await waitFor(() => {
        expect(screen.getByTestId('continue-button')).to.exist;
      });

      // First, trigger the error
      const continueButton = screen.getByTestId('continue-button');
      fireEvent.click(continueButton);

      await waitFor(() => {
        const combobox = screen.container.querySelector(
          '[data-testid="compose-recipient-combobox"]',
        );
        expect(combobox).to.have.attribute('error', 'Select a care team');
      });

      // Now select a care team by dispatching the change event
      const combobox = screen.container.querySelector(
        '[data-testid="compose-recipient-combobox"]',
      );

      // Simulate selecting the first recipient
      const firstRecipient = initialState.sm.recipients.allowedRecipients[0];
      const changeEvent = new CustomEvent('vaSelect', {
        detail: { value: firstRecipient.id.toString() },
      });
      combobox.dispatchEvent(changeEvent);

      // Wait for error to clear
      await waitFor(() => {
        const updatedCombobox = screen.container.querySelector(
          '[data-testid="compose-recipient-combobox"]',
        );
        const errorAttr = updatedCombobox.getAttribute('error');
        expect(errorAttr).to.equal('');
      });
    });

    it('should not navigate when validation fails', async () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          threadDetails: {
            draftInProgress: {},
            acceptInterstitial: true,
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow]: true,
        },
      };

      const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
        initialState: customState,
        reducers: reducer,
        path: Paths.SELECT_CARE_TEAM,
      });

      const { history } = screen;
      const initialPath = history.location.pathname;

      await waitFor(() => {
        expect(screen.getByTestId('continue-button')).to.exist;
      });

      // Click continue without selecting a care team
      const continueButton = screen.getByTestId('continue-button');
      fireEvent.click(continueButton);

      await waitFor(() => {
        const combobox = screen.container.querySelector(
          '[data-testid="compose-recipient-combobox"]',
        );
        expect(combobox).to.have.attribute('error', 'Select a care team');
      });

      // Verify navigation did not occur by checking path hasn't changed
      expect(history.location.pathname).to.equal(initialPath);
    });
  });
});
