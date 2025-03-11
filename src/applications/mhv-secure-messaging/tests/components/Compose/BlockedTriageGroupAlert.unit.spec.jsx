import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, waitFor } from '@testing-library/react';
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
    expect(screen.getByText('Find your VA health facility')).to.exist;
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
});
