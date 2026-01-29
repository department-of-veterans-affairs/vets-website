import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { datadogRum } from '@datadog/browser-rum';
import reducer from '../../../reducers';
import BlockedTriageGroupAlert from '../../../components/shared/BlockedTriageGroupAlert';
import {
  BlockedTriageAlertStyles,
  ParentComponent,
  RecipientStatus,
  Recipients,
} from '../../../util/constants';

describe('BlockedTriageGroupAlert component', () => {
  const initialState = {
    sm: { recipients: {} },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: {
            '662': {
              facilityId: '662',
              vamcSystemName: 'Test Facility 1',
              isCerner: false,
            },
            '636': {
              facilityId: '636',
              vamcSystemName: 'Test Facility 2',
              isCerner: false,
            },
          },
        },
      },
    },
  };

  const setup = (customState, props) => {
    return renderWithStoreAndRouter(<BlockedTriageGroupAlert {...props} />, {
      initialState: customState,
      reducers: reducer,
    });
  };

  afterEach(() => {
    cleanup();
  });

  it('renders without errors', async () => {
    const screen = setup(initialState, {
      alertStyle: BlockedTriageAlertStyles.ALERT,
    });
    expect(screen);
  });

  it('does not render a list of care teams if there is only 1', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          associatedBlockedTriageGroupsQty: 1,
          blockedRecipients: [{ id: 222333 }],
          allRecipients: [{ id: 222333 }],
        },
      },
    };
    const screen = setup(customState, {
      currentRecipient: {
        recipientId: 222333,
        name: '###PQR TRIAGE_TEAM 747###',
        type: Recipients.CARE_TEAM,
        status: RecipientStatus.BLOCKED,
      },
      alertStyle: BlockedTriageAlertStyles.ALERT,
    });
    expect(screen.queryByTestId('blocked-triage-group')).to.not.exist;
    await waitFor(() => {
      expect(
        screen.queryByTestId('blocked-triage-group-alert'),
      ).to.have.attribute(
        'trigger',
        "You can't send messages to ###PQR TRIAGE_TEAM 747###",
      );
    });
    const findFacilityLink = screen.container.querySelector(
      'va-link-action[href*="/find-locations"]',
    );
    expect(findFacilityLink).to.exist;
  });

  it('uses VaLinkAction for /find-locations (cross-app destination)', async () => {
    // /find-locations is a different SPA (facility-locator), so we need
    // VaLinkAction for full browser navigation, not RouterLinkAction
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          associatedBlockedTriageGroupsQty: 1,
          blockedRecipients: [{ id: 222333 }],
          allRecipients: [{ id: 222333 }],
        },
      },
    };
    const screen = setup(customState, {
      currentRecipient: {
        recipientId: 222333,
        name: 'Test Team',
        type: Recipients.CARE_TEAM,
        status: RecipientStatus.BLOCKED,
      },
      alertStyle: BlockedTriageAlertStyles.ALERT,
    });

    await waitFor(() => {
      const findFacilityLink = screen.container.querySelector(
        'va-link-action[href*="/find-locations"]',
      );
      expect(findFacilityLink).to.exist;
      expect(findFacilityLink.tagName).to.equal('VA-LINK-ACTION');
      expect(findFacilityLink.getAttribute('text')).to.equal(
        'Find your VA health facility',
      );
    });
  });

  it('displays all blocked teams if multiple are blocked', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          associatedTriageGroupsQty: 4,
          associatedBlockedTriageGroupsQty: 2,
          blockedRecipients: [
            {
              name: '***Jeasmitha-Cardio-Clinic***',
              type: Recipients.CARE_TEAM,
              stationNumber: '662',
              status: RecipientStatus.BLOCKED,
            },
            {
              name: '###PQR TRIAGE_TEAM 747###',
              type: Recipients.CARE_TEAM,
              stationNumber: '636',
              status: RecipientStatus.BLOCKED,
            },
          ],
        },
      },
    };
    const screen = setup(customState, {
      alertStyle: BlockedTriageAlertStyles.ALERT,
      parentComponent: ParentComponent.COMPOSE_FORM,
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('blocked-triage-group-alert'),
      ).to.have.attribute(
        'trigger',
        "You can't send messages to some of your care teams",
      );
    });
    expect(screen.queryAllByTestId('blocked-triage-group').length).to.equal(2);
  });

  it('renders a va-alert if no associations at all & alertStyle = "info"', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          noAssociations: true,
          allTriageGroupsBlocked: false,
          associatedBlockedTriageGroupsQty: 0,
        },
      },
    };

    const screen = setup(customState, {
      parentComponent: ParentComponent.FOLDER_HEADER,
      alertStyle: BlockedTriageAlertStyles.INFO,
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('blocked-triage-group-alert'),
      ).to.have.attribute('status', BlockedTriageAlertStyles.INFO);
      expect(
        screen.getByText(
          "You're not connected to any care teams in this messaging tool",
        ),
      ).to.exist;
    });
  });

  it('On editing a saved draft, includes a lost-association group in the alert if other teams are blocked', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          associatedTriageGroupsQty: 4,
          associatedBlockedTriageGroupsQty: 2,
          blockedRecipients: [
            {
              name: '***Jeasmitha-Cardio-Clinic***',
              type: Recipients.CARE_TEAM,
              stationNumber: '662',
              status: RecipientStatus.BLOCKED,
            },
            {
              name: '###PQR TRIAGE_TEAM 747###',
              type: Recipients.CARE_TEAM,
              stationNumber: '636',
              status: RecipientStatus.BLOCKED,
            },
          ],
        },
      },
    };

    const screen = setup(customState, {
      alertStyle: BlockedTriageAlertStyles.ALERT,
      parentComponent: ParentComponent.COMPOSE_FORM,
      currentRecipient: {
        recipientId: 223344,
        name: 'lost-association-team',
        type: Recipients.CARE_TEAM,
        status: RecipientStatus.ALLOWED,
      },
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('blocked-triage-group-alert'),
      ).to.have.attribute(
        'trigger',
        "You can't send messages to some of your care teams",
      );
      const blockedTGs = screen.queryAllByTestId('blocked-triage-group');
      expect(blockedTGs.length).to.equal(3);
      expect(blockedTGs[2].textContent).to.equal('lost-association-team');
    });
  });

  it('lost-association team appears in title of alert if only one team is not associated and no other groups are blocked', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          associatedTriageGroupsQty: 4,
          associatedBlockedTriageGroupsQty: 0,
          blockedRecipients: [],
        },
      },
    };

    const screen = setup(customState, {
      alertStyle: BlockedTriageAlertStyles.ALERT,
      parentComponent: ParentComponent.COMPOSE_FORM,
      currentRecipient: {
        recipientId: 223344,
        name: 'lost-association-team',
        type: Recipients.CARE_TEAM,
        status: RecipientStatus.ALLOWED,
      },
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('blocked-triage-group-alert'),
      ).to.have.attribute(
        'trigger',
        'Your account is no longer connected to lost-association-team',
      );
      expect(
        screen.getByText(
          'If you need to contact your care team, call your VA health facility.',
        ),
      ).to.exist;
    });
  });

  describe('analytics datadogRum.addAction type value scenarios', () => {
    let spyDog;

    const getState = ({
      blockedRecipients = [],
      associatedBlockedTriageGroupsQty = 1,
      allTriageGroupsBlocked = false,
    } = {}) => ({
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          associatedBlockedTriageGroupsQty,
          blockedRecipients,
          allRecipients: [{ id: 222333 }],
          allTriageGroupsBlocked,
        },
      },
      drupalStaticData: {
        vamcEhrData: {
          data: {
            ehrDataByVhaId: {
              '662': {
                facilityId: '662',
                vamcSystemName: 'Test Facility 1',
                isCerner: false,
              },
            },
          },
        },
      },
    });

    beforeEach(() => {
      spyDog = sinon.spy(datadogRum, 'addAction');
    });

    afterEach(() => {
      spyDog.restore();
    });

    it('sends MESSAGE_TO_CARE_TEAMS value', async () => {
      const careTeamsState = getState({
        blockedRecipients: [
          {
            id: 222333,
            name: 'Test Facility 1',
            type: Recipients.FACILITY,
            status: RecipientStatus.BLOCKED,
            suggestedNameDisplay: 'Test Facility 1',
          },
        ],
      });
      setup(careTeamsState, {
        alertStyle: BlockedTriageAlertStyles.ALERT,
        parentComponent: ParentComponent.COMPOSE_FORM,
      });
      await waitFor(() => {
        expect(spyDog.called).to.be.true;
        expect(spyDog.firstCall.args[1].type).to.include(
          "You can't send messages to care teams at",
        );
      });
    });

    it('sends MULTIPLE_TEAMS_BLOCKED value', async () => {
      const multiBlockedState = getState({
        associatedBlockedTriageGroupsQty: 2,
        blockedRecipients: [
          {
            id: 1,
            name: 'Team 1',
            type: Recipients.CARE_TEAM,
            status: RecipientStatus.BLOCKED,
          },
          {
            id: 2,
            name: 'Team 2',
            type: Recipients.CARE_TEAM,
            status: RecipientStatus.BLOCKED,
          },
        ],
      });
      setup(multiBlockedState, {
        alertStyle: BlockedTriageAlertStyles.ALERT,
        parentComponent: ParentComponent.COMPOSE_FORM,
      });
      await waitFor(() => {
        expect(spyDog.called).to.be.true;
        expect(spyDog.firstCall.args[1].type).to.include(
          'some of your care teams',
        );
      });
    });

    it('sends ALL_TEAMS_BLOCKED value', async () => {
      const allBlockedState = getState({
        allTriageGroupsBlocked: true,
      });
      setup(allBlockedState, {
        alertStyle: BlockedTriageAlertStyles.ALERT,
        parentComponent: ParentComponent.FOLDER_HEADER,
      });
      await waitFor(() => {
        expect(spyDog.called).to.be.true;
        expect(spyDog.firstCall.args[1].type).to.include(
          "You can't send messages to your care teams right now",
        );
      });
    });

    it('sends MESSAGE_TO_CARE_TEAM value', async () => {
      const careTeamState = getState({
        blockedRecipients: [
          {
            id: 222333,
            name: 'Test Team',
            type: Recipients.CARE_TEAM,
            status: RecipientStatus.BLOCKED,
          },
        ],
      });
      setup(careTeamState, {
        alertStyle: BlockedTriageAlertStyles.ALERT,
        currentRecipient: {
          recipientId: 222333,
          name: 'Test Team',
          type: Recipients.CARE_TEAM,
          status: RecipientStatus.BLOCKED,
        },
        parentComponent: ParentComponent.COMPOSE_FORM,
      });
      await waitFor(() => {
        expect(spyDog.called).to.be.true;
        expect(spyDog.firstCall.args[1].type).to.include(
          "You can't send messages to",
        );
      });
    });

    it('sends ACCOUNT_DISCONNECTED value', async () => {
      const disconnectedState = getState({
        blockedRecipients: [
          {
            id: 222333,
            name: 'Test Team',
            type: Recipients.CARE_TEAM,
            status: RecipientStatus.NOT_ASSOCIATED,
          },
        ],
      });
      setup(disconnectedState, {
        alertStyle: BlockedTriageAlertStyles.ALERT,
        currentRecipient: {
          recipientId: 222333,
          name: 'Test Team',
          type: Recipients.CARE_TEAM,
          status: RecipientStatus.NOT_ASSOCIATED,
        },
        parentComponent: ParentComponent.COMPOSE_FORM,
      });
      await waitFor(() => {
        expect(spyDog.called).to.be.true;
        expect(spyDog.firstCall.args[1].type).to.include(
          'Your account is no longer connected to',
        );
      });
    });

    it('sends fallback/other alertTitleText value', async () => {
      const fallbackState = getState({
        blockedRecipients: [
          {
            id: 222333,
            name: 'Other Team',
            type: Recipients.CARE_TEAM,
            status: RecipientStatus.BLOCKED,
          },
        ],
      });
      setup(fallbackState, {
        alertStyle: BlockedTriageAlertStyles.ALERT,
        currentRecipient: {
          recipientId: 222333,
          name: 'Other Team',
          type: Recipients.CARE_TEAM,
          status: RecipientStatus.BLOCKED,
        },
        parentComponent: ParentComponent.COMPOSE_FORM,
      });
      await waitFor(() => {
        expect(spyDog.called).to.be.true;
        expect(spyDog.firstCall.args[1].type).to.include(
          "You can't send messages to TG_NAME",
        );
      });
    });
  });
});
