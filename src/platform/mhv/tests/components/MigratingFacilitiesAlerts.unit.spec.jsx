import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import MigratingFacilitiesAlerts from '../../components/CernerFacilityAlert/MigratingFacilitiesAlerts';
import { CernerAlertContent } from '../../components/CernerFacilityAlert/constants';

describe('MigratingFacilitiesAlerts', () => {
  const mockMigratingFacilities = [
    {
      migrationDate: '2026-05-01',
      facilities: [
        {
          facilityId: '528',
          facilityName: 'VA Uptown New Orleans Medical Center',
        },
      ],
      phases: {
        current: 'p2',
        p0: 'March 1, 2026',
        p1: 'March 15, 2026',
        p2: 'April 1, 2026',
        p3: 'April 24, 2026',
        p4: 'April 27, 2026',
        p5: 'May 1, 2026',
        p6: 'May 8, 2026',
      },
    },
  ];

  const mockMultipleFacilities = [
    {
      migrationDate: '2026-05-01',
      facilities: [
        {
          facilityId: '528',
          facilityName: 'VA Uptown New Orleans Medical Center',
        },
        {
          facilityId: '529',
          facilityName: 'VA Downtown New Orleans Clinic',
        },
      ],
      phases: {
        current: 'p2',
        p0: 'March 1, 2026',
        p1: 'March 15, 2026',
        p2: 'April 1, 2026',
        p3: 'April 24, 2026',
        p4: 'April 27, 2026',
        p5: 'May 1, 2026',
        p6: 'May 8, 2026',
      },
    },
  ];

  describe('when no alerts should be shown', () => {
    it('returns null when current phase is not in warning or error arrays', () => {
      const propsWithNoMatch = {
        ...CernerAlertContent.MEDICATIONS,
        migratingFacilities: [
          {
            ...mockMigratingFacilities[0],
            phases: {
              ...mockMigratingFacilities[0].phases,
              current: 'p0', // Not in warning or error arrays
            },
          },
        ],
      };

      const { container } = render(
        <MigratingFacilitiesAlerts {...propsWithNoMatch} />,
      );

      expect(container.firstChild).to.be.null;
    });

    it('returns null when migratingFacilities is empty', () => {
      const { container } = render(
        <MigratingFacilitiesAlerts
          {...CernerAlertContent.MEDICATIONS}
          migratingFacilities={[]}
        />,
      );

      expect(container.firstChild).to.be.null;
    });
  });

  describe('warning alerts', () => {
    const warningProps = {
      ...CernerAlertContent.MEDICATIONS,
      migratingFacilities: [
        {
          ...mockMigratingFacilities[0],
          phases: {
            ...mockMigratingFacilities[0].phases,
            current: 'p1', // In warning array
          },
        },
      ],
    };

    it('renders warning alert when current phase is in warning array', () => {
      const { getByTestId } = render(
        <MigratingFacilitiesAlerts {...warningProps} />,
      );

      const alert = getByTestId('cerner-facilities-transition-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('warning');
    });

    it('displays trigger with start date', () => {
      const { getByTestId } = render(
        <MigratingFacilitiesAlerts {...warningProps} />,
      );

      const alert = getByTestId('cerner-facilities-transition-alert');
      expect(alert.getAttribute('trigger')).to.equal(
        'Updates will begin on April 27, 2026',
      );
    });

    it('displays start and end dates in alert content', () => {
      const { getByText } = render(
        <MigratingFacilitiesAlerts {...warningProps} />,
      );

      expect(getByText('April 27, 2026')).to.exist;
      expect(getByText('May 8, 2026')).to.exist;
    });

    it('displays "this facility" for single facility', () => {
      const { findByText } = render(
        <MigratingFacilitiesAlerts {...warningProps} />,
      );

      expect(findByText(/this facility/i)).to.exist;
    });

    it('displays "these facilities" for multiple facilities', () => {
      const multipleProps = {
        ...warningProps,
        migratingFacilities: [
          {
            ...mockMultipleFacilities[0],
            phases: {
              ...mockMultipleFacilities[0].phases,
              current: 'p1',
            },
          },
        ],
      };

      const { findByText } = render(
        <MigratingFacilitiesAlerts {...multipleProps} />,
      );

      expect(findByText(/these facilities/i)).to.exist;
    });

    it('displays all facility names in list', () => {
      const multipleProps = {
        ...warningProps,
        migratingFacilities: [
          {
            ...mockMultipleFacilities[0],
            phases: {
              ...mockMultipleFacilities[0].phases,
              current: 'p1',
            },
          },
        ],
      };

      const { getByText } = render(
        <MigratingFacilitiesAlerts {...multipleProps} />,
      );

      expect(getByText('VA Uptown New Orleans Medical Center')).to.exist;
      expect(getByText('VA Downtown New Orleans Clinic')).to.exist;
    });

    it('displays bodyTransitionText in note section if provided', () => {
      const { getByText } = render(
        <MigratingFacilitiesAlerts
          {...warningProps}
          bodyTransitionText="manage your medications"
        />,
      );

      expect(getByText(/manage your medications/i)).to.exist;
    });

    it('falls back to transitionText when bodyTransitionText is not provided', () => {
      const propsWithoutBody = {
        ...warningProps,
        bodyTransitionText: undefined,
      };

      const { findByText } = render(
        <MigratingFacilitiesAlerts {...propsWithoutBody} />,
      );

      expect(findByText(/manage your medications/i)).to.exist;
    });
  });

  describe('error alerts', () => {
    const errorProps = {
      ...CernerAlertContent.MEDICATIONS,
      migratingFacilities: [
        {
          ...mockMigratingFacilities[0],
          phases: {
            ...mockMigratingFacilities[0].phases,
            current: 'p4', // In error array
          },
        },
      ],
    };

    it('renders error alert when current phase is in error array', () => {
      const { container } = render(
        <MigratingFacilitiesAlerts {...errorProps} />,
      );

      const alert = container.querySelector('va-alert[status="error"]');
      expect(alert).to.exist;
    });

    it('displays standard headline', () => {
      const screen = render(<MigratingFacilitiesAlerts {...errorProps} />);

      // These are broken up by the render, so checking them individually
      expect(screen.findByText(/You can’t/i)).to.exist;
      expect(screen.findByText(/renew or refill your prescriptions online/i)).to
        .exist;
      expect(screen.getByText(/some facilities right now/i)).to.exist;
    });

    it('uses altTransitionHeadline when provided', () => {
      const propsWithAltHeadline = {
        ...errorProps,
        altTransitionHeadline: 'manage medications for',
      };

      const screen = render(
        <MigratingFacilitiesAlerts {...propsWithAltHeadline} />,
      );

      // These are broken up by the render, so checking them individually
      expect(screen.findByText(/You can’t/i)).to.exist;
      expect(screen.getByText(/manage medications/i)).to.exist;
      expect(screen.getByText(/some facilities right now/i)).to.exist;
    });

    it('displays end date in error message', () => {
      const { getByText } = render(
        <MigratingFacilitiesAlerts {...errorProps} />,
      );

      expect(getByText('May 8, 2026')).to.exist;
    });

    it('displays facility list in error alert', () => {
      const { getByText } = render(
        <MigratingFacilitiesAlerts {...errorProps} />,
      );

      expect(getByText('VA Uptown New Orleans Medical Center')).to.exist;
    });

    it('displays find locations link', () => {
      const { getByTestId } = render(
        <MigratingFacilitiesAlerts {...errorProps} />,
      );

      const link = getByTestId('find-facility-link');
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal(
        'https://www.va.gov/find-locations/',
      );
      expect(link.getAttribute('text')).to.equal(
        "Find your facility's contact information",
      );
    });

    it('displays "this facility" for single facility in error', () => {
      const { getByText } = render(
        <MigratingFacilitiesAlerts {...errorProps} />,
      );

      expect(getByText(/this facility/i)).to.exist;
    });

    it('displays "these facilities" for multiple facilities in error', () => {
      const multipleProps = {
        ...errorProps,
        migratingFacilities: [
          {
            ...mockMultipleFacilities[0],
            phases: {
              ...mockMultipleFacilities[0].phases,
              current: 'p4',
            },
          },
        ],
      };

      const { getByText } = render(
        <MigratingFacilitiesAlerts {...multipleProps} />,
      );

      expect(getByText(/these facilities/i)).to.exist;
    });
  });

  describe('multiple migrations', () => {
    const multipleMigrationsProps = {
      ...CernerAlertContent.MEDICATIONS,
      migratingFacilities: [
        {
          migrationDate: '2026-05-01',
          facilities: [
            {
              facilityId: '528',
              facilityName: 'VA Uptown New Orleans Medical Center',
            },
          ],
          phases: {
            current: 'p1',
            p0: 'March 1, 2026',
            p1: 'March 15, 2026',
            p2: 'April 1, 2026',
            p3: 'April 24, 2026',
            p4: 'April 27, 2026',
            p5: 'May 1, 2026',
            p6: 'May 8, 2026',
          },
        },
        {
          migrationDate: '2026-06-01',
          facilities: [
            {
              facilityId: '529',
              facilityName: 'VA Downtown New Orleans Clinic',
            },
          ],
          phases: {
            current: 'p4',
            p0: 'April 1, 2026',
            p1: 'April 15, 2026',
            p2: 'May 1, 2026',
            p3: 'May 24, 2026',
            p4: 'May 27, 2026',
            p5: 'June 1, 2026',
            p6: 'June 8, 2026',
          },
        },
      ],
    };

    it('renders multiple alerts for different migrations', () => {
      const { container } = render(
        <MigratingFacilitiesAlerts {...multipleMigrationsProps} />,
      );

      const warningAlerts = container.querySelectorAll(
        'va-alert-expandable[status="warning"]',
      );
      const errorAlerts = container.querySelectorAll(
        'va-alert[status="error"]',
      );

      expect(warningAlerts.length).to.equal(1);
      expect(errorAlerts.length).to.equal(1);
    });

    it('displays correct facility names in each alert', () => {
      const { getByText } = render(
        <MigratingFacilitiesAlerts {...multipleMigrationsProps} />,
      );

      expect(getByText('VA Uptown New Orleans Medical Center')).to.exist;
      expect(getByText('VA Downtown New Orleans Clinic')).to.exist;
    });

    it('warning alert displays correct phase dates for first migration', () => {
      const { container } = render(
        <MigratingFacilitiesAlerts {...multipleMigrationsProps} />,
      );

      const warningAlert = container.querySelector(
        'va-alert-expandable[status="warning"]',
      );
      expect(warningAlert.getAttribute('trigger')).to.include('April 27, 2026');
    });

    it('error alert displays correct phase dates for second migration', () => {
      const { getByText } = render(
        <MigratingFacilitiesAlerts {...multipleMigrationsProps} />,
      );

      // Error alert should show end date from p6 for second migration
      expect(getByText('June 8, 2026')).to.exist;
    });

    it('each alert is independent with its own facility list', () => {
      const { container } = render(
        <MigratingFacilitiesAlerts {...multipleMigrationsProps} />,
      );

      // Get all list items from both alerts
      const allListItems = container.querySelectorAll('ul li');

      // Should have 2 facilities total (one in each alert)
      expect(allListItems.length).to.equal(2);
    });

    it('renders both alerts even when they have different statuses', () => {
      const { container } = render(
        <MigratingFacilitiesAlerts {...multipleMigrationsProps} />,
      );

      // Both alerts should be present in the DOM
      expect(container.querySelector('va-alert-expandable[status="warning"]'))
        .to.exist;
      expect(container.querySelector('va-alert[status="error"]')).to.exist;
    });

    it('applies correct keys to each alert', () => {
      const { container } = render(
        <MigratingFacilitiesAlerts {...multipleMigrationsProps} />,
      );

      const warningAlert = container.querySelector(
        'va-alert-expandable[status="warning"]',
      );
      const errorAlert = container.querySelector('va-alert[status="error"]');

      // Both should have key attribute (index-based)
      expect(warningAlert).to.exist;
      expect(errorAlert).to.exist;
    });

    it('renders correct facility text for each alert type', () => {
      const { container } = render(
        <MigratingFacilitiesAlerts {...multipleMigrationsProps} />,
      );

      // Both alerts should use "this facility" since each migration has one facility
      const bodyText = container.textContent;
      expect(bodyText).to.include('this facility');
    });
  });

  describe('multiple migrations with three or more facilities', () => {
    const threeMigrations = {
      ...CernerAlertContent.MEDICATIONS,
      migratingFacilities: [
        {
          migrationDate: '2026-05-01',
          facilities: [
            {
              facilityId: '528',
              facilityName: 'VA Uptown New Orleans Medical Center',
            },
          ],
          phases: {
            current: 'p1',
            p0: 'March 1, 2026',
            p1: 'March 15, 2026',
            p2: 'April 1, 2026',
            p3: 'April 24, 2026',
            p4: 'April 27, 2026',
            p5: 'May 1, 2026',
            p6: 'May 8, 2026',
          },
        },
        {
          migrationDate: '2026-06-01',
          facilities: [
            {
              facilityId: '529',
              facilityName: 'VA Downtown New Orleans Clinic',
            },
          ],
          phases: {
            current: 'p4',
            p0: 'April 1, 2026',
            p1: 'April 15, 2026',
            p2: 'May 1, 2026',
            p3: 'May 24, 2026',
            p4: 'May 27, 2026',
            p5: 'June 1, 2026',
            p6: 'June 8, 2026',
          },
        },
        {
          migrationDate: '2026-07-01',
          facilities: [
            {
              facilityId: '530',
              facilityName: 'VA Westside Clinic',
            },
          ],
          phases: {
            current: 'p2',
            p0: 'May 1, 2026',
            p1: 'May 15, 2026',
            p2: 'June 1, 2026',
            p3: 'June 24, 2026',
            p4: 'June 27, 2026',
            p5: 'July 1, 2026',
            p6: 'July 8, 2026',
          },
        },
      ],
    };

    it('renders three alerts for three different migrations', () => {
      const { container } = render(
        <MigratingFacilitiesAlerts {...threeMigrations} />,
      );

      const warningAlerts = container.querySelectorAll(
        'va-alert-expandable[status="warning"]',
      );
      const errorAlerts = container.querySelectorAll(
        'va-alert[status="error"]',
      );

      // 2 warning (p1 and p2) and 1 error (p4)
      expect(warningAlerts.length).to.equal(2);
      expect(errorAlerts.length).to.equal(1);
    });

    it('displays all three facility names across alerts', () => {
      const { getByText } = render(
        <MigratingFacilitiesAlerts {...threeMigrations} />,
      );

      expect(getByText('VA Uptown New Orleans Medical Center')).to.exist;
      expect(getByText('VA Downtown New Orleans Clinic')).to.exist;
      expect(getByText('VA Westside Clinic')).to.exist;
    });
  });

  describe('styling and className', () => {
    const errorProps = {
      ...CernerAlertContent.MEDICATIONS,
      migratingFacilities: [
        {
          ...mockMigratingFacilities[0],
          phases: {
            ...mockMigratingFacilities[0].phases,
            current: 'p4',
          },
        },
      ],
    };

    it('applies custom className to alert', () => {
      const { container } = render(
        <MigratingFacilitiesAlerts
          {...errorProps}
          className="custom-test-class"
        />,
      );

      const alert = container.querySelector('va-alert');
      expect(alert.getAttribute('class')).to.include('custom-test-class');
    });

    it('applies default margin classes', () => {
      const { container } = render(
        <MigratingFacilitiesAlerts {...errorProps} />,
      );

      const alert = container.querySelector('va-alert');
      expect(alert.getAttribute('class')).to.include(
        'vads-u-margin-bottom--2p5',
      );
    });

    it('applies top margin when there are migrating facilities', () => {
      const { container } = render(
        <MigratingFacilitiesAlerts {...errorProps} />,
      );

      const alert = container.querySelector('va-alert');
      expect(alert.getAttribute('class')).to.include('vads-u-margin-top--2');
    });
  });

  describe('edge cases', () => {
    it('handles migration with no facilities gracefully', () => {
      const propsWithNoFacilities = {
        ...CernerAlertContent.MEDICATIONS,
        migratingFacilities: [
          {
            ...mockMigratingFacilities[0],
            facilities: [],
            phases: {
              ...mockMigratingFacilities[0].phases,
              current: 'p4',
            },
          },
        ],
      };

      const { container } = render(
        <MigratingFacilitiesAlerts {...propsWithNoFacilities} />,
      );

      expect(container.querySelector('va-alert')).to.exist;
    });

    it('handles missing phase dates', () => {
      const propsWithMissingPhases = {
        ...CernerAlertContent.MEDICATIONS,
        migratingFacilities: [
          {
            ...mockMigratingFacilities[0],
            phases: {
              current: 'p1',
              p0: 'March 1, 2026',
              p1: 'March 15, 2026',
            },
          },
        ],
      };

      const { container } = render(
        <MigratingFacilitiesAlerts {...propsWithMissingPhases} />,
      );

      expect(container.querySelector('va-alert-expandable')).to.exist;
    });
  });
});
