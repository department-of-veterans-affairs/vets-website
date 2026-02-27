import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import ContactListMigrationAlert from '../../../components/shared/ContactListMigrationAlert';

describe('ContactListMigrationAlert component', () => {
  const baseMigrationSchedule = {
    migrationDate: 'February 13, 2026',
    facilities: [
      { facilityId: '553', facilityName: 'VA Detroit Healthcare System' },
      { facilityId: '655', facilityName: 'VA Saginaw Healthcare System' },
    ],
    migrationStatus: 'ACTIVE',
    phases: {
      current: 'p6',
      p0: 'December 15, 2025 at 12:00AM ET',
      p1: 'December 30, 2025 at 12:00AM ET',
      p2: 'January 14, 2026 at 12:00AM ET',
      p3: 'February 7, 2026 at 12:00AM ET',
      p4: 'February 10, 2026 at 12:00AM ET',
      p5: 'February 13, 2026 at 12:00AM ET',
      p6: 'February 15, 2026 at 12:00AM ET',
      p7: 'February 20, 2026 at 12:00AM ET',
      p8: 'March 15, 2026 at 12:00AM ET',
      p9: 'March 30, 2026 at 12:00AM ET',
    },
  };

  const defaultProps = {
    userFacilityMigratingToOh: true,
    migrationSchedules: [baseMigrationSchedule],
  };

  const setup = (props = {}) => {
    return render(<ContactListMigrationAlert {...defaultProps} {...props} />);
  };

  afterEach(() => {
    cleanup();
  });

  describe('POST_MIGRATION variant (phase p6)', () => {
    it('renders the alert when a facility is in phase p6', async () => {
      const screen = setup();

      await waitFor(() => {
        expect(screen.getByTestId('contact-list-migration-alert')).to.exist;
        expect(screen.getByText('We updated your contact list')).to.exist;
      });
    });

    it('displays migrating facility names', async () => {
      const screen = setup();

      await waitFor(() => {
        expect(screen.getByText('VA Detroit Healthcare System')).to.exist;
        expect(screen.getByText('VA Saginaw Healthcare System')).to.exist;
      });
    });

    it('displays the correct body text', async () => {
      const screen = setup();

      await waitFor(() => {
        expect(
          screen.getByText(
            'We removed care teams from these facilities from your contact list:',
          ),
        ).to.exist;
        expect(
          screen.getByText((_, el) => {
            return (
              el.tagName === 'P' &&
              el.textContent.includes(
                'You can still send messages to care teams at these facilities.',
              )
            );
          }),
        ).to.exist;
      });
    });

    it('is closeable', async () => {
      const screen = setup();

      await waitFor(() => {
        expect(screen.getByTestId('contact-list-migration-alert')).to.exist;
      });

      const alert = screen.getByTestId('contact-list-migration-alert');
      alert.__events.closeEvent();

      await waitFor(() => {
        expect(screen.queryByTestId('contact-list-migration-alert')).to.not
          .exist;
      });
    });
  });

  describe('alert visibility conditions', () => {
    it('renders the alert when facility is in phase p7', async () => {
      const scheduleP7 = {
        ...baseMigrationSchedule,
        phases: { ...baseMigrationSchedule.phases, current: 'p7' },
      };
      const screen = setup({ migrationSchedules: [scheduleP7] });

      await waitFor(() => {
        expect(screen.getByTestId('contact-list-migration-alert')).to.exist;
        expect(screen.getByText('We updated your contact list')).to.exist;
      });
    });

    it('renders the alert when facility is in phase p8', async () => {
      const scheduleP8 = {
        ...baseMigrationSchedule,
        phases: { ...baseMigrationSchedule.phases, current: 'p8' },
      };
      const screen = setup({ migrationSchedules: [scheduleP8] });

      await waitFor(() => {
        expect(screen.getByTestId('contact-list-migration-alert')).to.exist;
        expect(screen.getByText('We updated your contact list')).to.exist;
      });
    });

    it('does not render when facility is in phase p9', async () => {
      const scheduleP9 = {
        ...baseMigrationSchedule,
        phases: { ...baseMigrationSchedule.phases, current: 'p9' },
      };
      const screen = setup({ migrationSchedules: [scheduleP9] });

      expect(screen.queryByTestId('contact-list-migration-alert')).to.not.exist;
    });

    it('does not render when migrationSchedules is empty', async () => {
      const screen = setup({ migrationSchedules: [] });

      expect(screen.queryByTestId('contact-list-migration-alert')).to.not.exist;
    });

    it('does not render when migrationSchedules is undefined', async () => {
      const screen = setup({ migrationSchedules: undefined });

      expect(screen.queryByTestId('contact-list-migration-alert')).to.not.exist;
    });

    it('does not render when userFacilityMigratingToOh is false', async () => {
      const screen = setup({ userFacilityMigratingToOh: false });

      expect(screen.queryByTestId('contact-list-migration-alert')).to.not.exist;
    });

    it('renders facilities from all matching-phase schedules when multiple schedules have mixed phases', async () => {
      const scheduleP7 = {
        ...baseMigrationSchedule,
        facilities: [
          { facilityId: '506', facilityName: 'VA Ann Arbor Healthcare System' },
        ],
        phases: { ...baseMigrationSchedule.phases, current: 'p7' },
      };
      const scheduleP6 = {
        ...baseMigrationSchedule,
        facilities: [
          { facilityId: '553', facilityName: 'VA Detroit Healthcare System' },
        ],
        phases: { ...baseMigrationSchedule.phases, current: 'p6' },
      };
      const scheduleP9 = {
        ...baseMigrationSchedule,
        facilities: [
          {
            facilityId: '612',
            facilityName: 'VA Northern Indiana Healthcare System',
          },
        ],
        phases: { ...baseMigrationSchedule.phases, current: 'p9' },
      };
      const screen = setup({
        migrationSchedules: [scheduleP7, scheduleP6, scheduleP9],
      });

      await waitFor(() => {
        expect(screen.getByTestId('contact-list-migration-alert')).to.exist;
        expect(screen.getByText('VA Detroit Healthcare System')).to.exist;
        expect(screen.getByText('VA Ann Arbor Healthcare System')).to.exist;
        expect(screen.queryByText('VA Northern Indiana Healthcare System')).to
          .not.exist;
      });
    });
  });
});
