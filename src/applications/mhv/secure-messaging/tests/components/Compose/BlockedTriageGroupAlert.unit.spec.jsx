import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, waitFor } from '@testing-library/react';
import reducer from '../../../reducers';
import BlockedTriageGroupAlert from '../../../components/shared/BlockedTriageGroupAlert';
import { Recipients } from '../../../util/constants';

describe('BlockedTriageGroupAlert component', () => {
  const initialState = {
    sm: {},
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
    const screen = setup(initialState, { status: 'alert' });
    expect(screen);
  });

  it('does not render a list of care teams if there is only 1', async () => {
    const screen = setup(initialState, {
      blockedTriageGroupList: [
        { name: '###PQR TRIAGE_TEAM 747###', type: Recipients.CARE_TEAM },
      ],
      status: 'alert',
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
        recipients: {
          associatedTriageGroupsQty: 4,
          associatedBlockedTriageGroupsQty: 2,
        },
      },
    };
    const screen = setup(customState, {
      blockedTriageGroupList: [
        {
          name: '***Jeasmitha-Cardio-Clinic***',
          type: Recipients.CARE_TEAM,
          stationNumber: '662',
        },
        {
          name: '###PQR TRIAGE_TEAM 747###',
          type: Recipients.CARE_TEAM,
          stationNumber: '636',
        },
      ],
      status: 'alert',
      parentComponent: 'Compose Form',
    });
    expect(
      screen.queryByTestId('blocked-triage-group-alert'),
    ).to.have.attribute(
      'trigger',
      "You can't send messages to certain providers",
    );
    expect(screen.queryAllByTestId('blocked-triage-group').length).to.equal(2);
  });

  it('renders a va-alert if no associations at all & status = "info"', async () => {
    const screen = setup(initialState, { status: 'info' });
    expect(
      screen.queryByTestId('blocked-triage-group-alert'),
    ).to.have.attribute('status', 'info');
    expect(
      screen.getByText(
        'You’re not connected to any care teams in this messaging tool',
      ),
    ).to.exist;
  });
});
