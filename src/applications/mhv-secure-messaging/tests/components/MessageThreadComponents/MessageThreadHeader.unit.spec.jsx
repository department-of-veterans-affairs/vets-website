import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import sinon from 'sinon';
import reducer from '../../../reducers';
import messageResponse from '../../fixtures/message-response.json';
import MessageThreadHeader from '../../../components/MessageThreadHeader';

describe('MessageThreadHeader component', () => {
  let sandbox;

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
      alerts: {
        alertList: [],
      },
    },
    user: {
      profile: {
        migrationSchedules: [],
      },
    },
    featureToggles: {},
  };

  const defaultProps = {
    message: defaultMessage,
    cannotReply: false,
    isCreateNewModalVisible: false,
    setIsCreateNewModalVisible: () => {},
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const setup = (state = defaultState, props = defaultProps) => {
    return renderWithStoreAndRouter(<MessageThreadHeader {...props} />, {
      initialState: state,
      reducers: reducer,
      path: '/thread/12345',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays the message subject in header', () => {
    const screen = setup();
    expect(screen.getByRole('heading', { level: 1 })).to.exist;
    expect(screen.getByText(/Messages: Appointment - Test Subject/)).to.exist;
  });

  describe('CannotReplyAlert visibility', () => {
    it('shows CannotReplyAlert when cannotReply is true and not in migration phase', () => {
      const customState = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          threadDetails: {
            ...defaultState.sm.threadDetails,
            isStale: true,
          },
        },
      };
      const props = {
        ...defaultProps,
        cannotReply: true,
      };
      const screen = setup(customState, props);
      expect(screen.getByTestId('expired-alert-message')).to.exist;
    });

    it('hides CannotReplyAlert when in migration phase p3', () => {
      const state = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          threadDetails: {
            ...defaultState.sm.threadDetails,
            ohMigrationPhase: 'p3',
          },
        },
      };
      const props = {
        ...defaultProps,
        cannotReply: true,
      };
      const screen = setup(state, props);
      expect(screen.queryByTestId('expired-alert-message')).to.not.exist;
    });

    it('hides CannotReplyAlert when in migration phase p4', () => {
      const state = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          threadDetails: {
            ...defaultState.sm.threadDetails,
            ohMigrationPhase: 'p4',
          },
        },
      };
      const props = {
        ...defaultProps,
        cannotReply: true,
      };
      const screen = setup(state, props);
      expect(screen.queryByTestId('expired-alert-message')).to.not.exist;
    });

    it('hides CannotReplyAlert when in migration phase p5', () => {
      const state = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          threadDetails: {
            ...defaultState.sm.threadDetails,
            ohMigrationPhase: 'p5',
          },
        },
      };
      const props = {
        ...defaultProps,
        cannotReply: true,
      };
      const screen = setup(state, props);
      expect(screen.queryByTestId('expired-alert-message')).to.not.exist;
    });
  });

  describe('MigratingFacilitiesAlerts visibility', () => {
    const MIGRATION_ALERT_H2 = /You can.t use messages to contact providers at some facilities right now/i;

    const migrationSchedulesFixture = [
      {
        migrationDate: 'February 13, 2026',
        facilities: [
          {
            facilityId: '979',
            facilityName: 'Test VA Medical Center',
          },
        ],
        migrationStatus: 'ACTIVE',
        phases: {
          current: 'p3',
          p0: 'December 15, 2025 at 12:00AM ET',
          p1: 'December 30, 2025 at 12:00AM ET',
          p2: 'January 14, 2026 at 12:00AM ET',
          p3: 'February 7, 2026 at 12:00AM ET',
          p4: 'February 10, 2026 at 12:00AM ET',
          p5: 'February 13, 2026 at 12:00AM ET',
          p6: 'February 15, 2026 at 12:00AM ET',
          p7: 'February 20, 2026 at 12:00AM ET',
        },
      },
    ];

    it('renders MigratingFacilitiesAlerts when in migration phase p3', () => {
      const state = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          threadDetails: {
            ...defaultState.sm.threadDetails,
            ohMigrationPhase: 'p3',
          },
        },
        user: {
          profile: {
            migrationSchedules: migrationSchedulesFixture,
          },
        },
      };
      const screen = setup(state, defaultProps);
      // When in migration phase, the MigratingFacilitiesAlerts component should be rendered
      const h2 = screen.getByText(MIGRATION_ALERT_H2);
      expect(h2.tagName).to.equal('H2');
    });

    it('renders MigratingFacilitiesAlerts when in migration phase p4', () => {
      const schedulesP4 = [
        {
          ...migrationSchedulesFixture[0],
          phases: { ...migrationSchedulesFixture[0].phases, current: 'p4' },
        },
      ];
      const state = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          threadDetails: {
            ...defaultState.sm.threadDetails,
            ohMigrationPhase: 'p4',
          },
        },
        user: {
          profile: {
            migrationSchedules: schedulesP4,
          },
        },
      };
      const screen = setup(state, defaultProps);
      const h2 = screen.getByText(MIGRATION_ALERT_H2);
      expect(h2.tagName).to.equal('H2');
    });

    it('renders MigratingFacilitiesAlerts when in migration phase p5', () => {
      const schedulesP5 = [
        {
          ...migrationSchedulesFixture[0],
          phases: { ...migrationSchedulesFixture[0].phases, current: 'p5' },
        },
      ];
      const state = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          threadDetails: {
            ...defaultState.sm.threadDetails,
            ohMigrationPhase: 'p5',
          },
        },
        user: {
          profile: {
            migrationSchedules: schedulesP5,
          },
        },
      };
      const screen = setup(state, defaultProps);
      const h2 = screen.getByText(MIGRATION_ALERT_H2);
      expect(h2.tagName).to.equal('H2');
    });

    it('does not render MigratingFacilitiesAlerts when not in migration phase', () => {
      const state = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          threadDetails: {
            ...defaultState.sm.threadDetails,
            ohMigrationPhase: null,
          },
        },
      };
      const screen = setup(state, defaultProps);
      // The component wrapper should exist, but no migration alert content
      expect(screen.queryByText(MIGRATION_ALERT_H2)).to.not.exist;
    });

    it('does not render MigratingFacilitiesAlerts for phase p1', () => {
      const state = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          threadDetails: {
            ...defaultState.sm.threadDetails,
            ohMigrationPhase: 'p1',
          },
        },
      };
      const screen = setup(state, defaultProps);
      expect(screen.queryByText(MIGRATION_ALERT_H2)).to.not.exist;
    });

    it('does not render MigratingFacilitiesAlerts for phase p2', () => {
      const state = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          threadDetails: {
            ...defaultState.sm.threadDetails,
            ohMigrationPhase: 'p2',
          },
        },
      };
      const screen = setup(state, defaultProps);
      expect(screen.queryByText(MIGRATION_ALERT_H2)).to.not.exist;
    });
  });

  describe('BlockedTriageGroupAlert visibility during migration', () => {
    it('does not render BlockedTriageGroupAlert wrapper when in migration phase', () => {
      const state = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          threadDetails: {
            ...defaultState.sm.threadDetails,
            ohMigrationPhase: 'p3',
          },
        },
      };
      const screen = setup(state, defaultProps);
      // Blocked triage group alert should not be rendered when in migration phase
      // The wrapper div with margin classes should not exist when isInMigrationPhase is true
      expect(screen.queryByText(/You can't send messages/i)).to.not.exist;
    });
  });
});
