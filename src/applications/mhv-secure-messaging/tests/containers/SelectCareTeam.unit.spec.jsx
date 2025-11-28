import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { datadogRum } from '@datadog/browser-rum';
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

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    updateDraftInProgressSpy = sandbox.spy(
      threadDetailsActions,
      'updateDraftInProgress',
    );
  });

  afterEach(() => {
    sandbox.restore();
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
});
