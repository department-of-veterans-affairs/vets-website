import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import reducer from '../../../reducers';
import messageResponse from '../../fixtures/message-response.json';
import MigratedMessageAlert from '../../../components/shared/MigratedMessageAlert';

describe('MigratedMessageAlert', () => {
  const defaultMessage = {
    ...messageResponse,
    threadId: 12345,
    category: 'APPOINTMENTS',
    subject: 'Test Subject',
    sentDate: new Date().toISOString(),
    recipientId: 7107671,
    isOhMessage: false,
  };

  const defaultState = {
    sm: {
      threadDetails: {
        messages: [defaultMessage],
        ohMigrationPhase: null,
      },
    },
    user: {
      profile: {
        migrationSchedules: [],
      },
    },
    featureToggles: {},
  };

  const setup = (state = defaultState) => {
    return renderWithStoreAndRouter(<MigratedMessageAlert />, {
      initialState: state,
      reducers: reducer,
    });
  };

  it('renders MigratedMessageAlert when at least one message has migratedToOracleHealth', async () => {
    const migratedMessage = {
      ...defaultMessage,
      migratedToOracleHealth: true,
      ohMigrationPhase: 'p6',
    };
    const state = {
      ...defaultState,
      sm: {
        ...defaultState.sm,
        threadDetails: {
          ...defaultState.sm.threadDetails,
          messages: [migratedMessage],
        },
      },
    };
    const screen = setup(state);
    await waitFor(() => {
      expect(screen.queryByTestId('migrated-message-alert')).to.exist;
    });
  });

  it('does not render MigratedMessageAlert when no messages have migratedToOracleHealth', async () => {
    const nonMigratedMessage = {
      ...defaultMessage,
      migratedToOracleHealth: false,
    };
    const state = {
      ...defaultState,
      sm: {
        ...defaultState.sm,
        threadDetails: {
          ...defaultState.sm.threadDetails,
          messages: [nonMigratedMessage],
        },
      },
    };
    const screen = setup(state);
    await waitFor(() => {
      expect(screen.queryByTestId('migrated-message-alert')).to.not.exist;
    });
  });
});
