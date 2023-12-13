import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, waitFor } from '@testing-library/react';
import triageTeams from '../../fixtures/recipients.json';
import categories from '../../fixtures/categories-response.json';
import reducer from '../../../reducers';
import BlockedTriageGroupAlert from '../../../components/shared/BlockedTriageGroupAlert';

describe('BlockedTriageGroupAlert component', () => {
  const initialState = {
    sm: {
      triageTeams: { triageTeams },
      categories: { categories },
      recipients: {
        associatedBlockedTriageGroupsQty: 2,
        blockedRecipients: [
          { name: '***Jeasmitha-Cardio-Clinic***' },
          { name: '###PQR TRIAGE_TEAM 747###' },
        ],
      },
    },
  };

  const setup = customState => {
    return renderWithStoreAndRouter(<BlockedTriageGroupAlert />, {
      initialState: customState,
      reducers: reducer,
    });
  };

  afterEach(() => {
    cleanup();
  });

  it('renders without errors', async () => {
    const screen = setup(initialState);
    expect(screen);
  });

  it('does not render a list of facilities if there is only 1', async () => {
    const screen = setup({
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          associatedBlockedTriageGroupsQty: 1,
          blockedRecipients: [{ name: '###PQR TRIAGE_TEAM 747###' }],
        },
      },
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
    const screen = setup(initialState);
    expect(
      screen.queryByTestId('blocked-triage-group-alert'),
    ).to.have.attribute(
      'trigger',
      "You can't send messages to certain providers",
    );
    expect(screen.queryAllByTestId('blocked-triage-group').length).to.equal(2);
  });
});
