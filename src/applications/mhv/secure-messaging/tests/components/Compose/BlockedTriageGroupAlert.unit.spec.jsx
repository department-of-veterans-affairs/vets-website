import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, waitFor } from '@testing-library/react';
import reducer from '../../../reducers';
import BlockedTriageGroupAlert from '../../../components/shared/BlockedTriageGroupAlert';

describe('BlockedTriageGroupAlert component', () => {
  const initialState = {
    sm: {},
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

  it('does not render a list of facilities if there is only 1', async () => {
    const screen = setup(initialState, {
      blockedTriageGroupList: [{ name: '###PQR TRIAGE_TEAM 747###' }],
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

  it('displays all facilities if more than 1 are blocked', async () => {
    const screen = setup(initialState, {
      blockedTriageGroupList: [
        { name: '***Jeasmitha-Cardio-Clinic***' },
        { name: '###PQR TRIAGE_TEAM 747###' },
      ],
      status: 'alert',
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
