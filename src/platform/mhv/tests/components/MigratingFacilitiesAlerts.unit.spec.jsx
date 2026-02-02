import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import MigratingFacilitiesAlerts from '../../components/CernerFacilityAlert/MigratingFacilitiesAlerts';

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
        p6: 'May 3, 2026',
        p7: 'May 8, 2026',
      },
    },
  ];

  describe('when no alerts should be shown', () => {
    it('returns null when current phase is not in warning or error arrays', () => {
      const propsWithNoMatch = {
        healthTool: 'MEDICATIONS',
        migratingFacilities: [
          {
            ...mockMigratingFacilities[0],
            phases: {
              ...mockMigratingFacilities[0].phases,
              current: 'p0', // Not in warning or error arrays for MEDICATIONS
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
          healthTool="MEDICATIONS"
          migratingFacilities={[]}
        />,
      );

      expect(container.firstChild).to.be.null;
    });

    it('returns null when healthTool is not found in CernerAlertContent', () => {
      const { container } = render(
        <MigratingFacilitiesAlerts
          healthTool="INVALID_TOOL"
          migratingFacilities={mockMigratingFacilities}
        />,
      );

      expect(container.firstChild).to.be.null;
    });

    it('returns null when healthTool is undefined', () => {
      const { container } = render(
        <MigratingFacilitiesAlerts
          healthTool={undefined}
          migratingFacilities={mockMigratingFacilities}
        />,
      );

      expect(container.firstChild).to.be.null;
    });
  });

  describe('warning alerts', () => {
    const warningProps = {
      healthTool: 'MEDICATIONS',
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

      expect(getByText(/April 27, 2026/)).to.exist;
      expect(getByText(/May 8, 2026/)).to.exist;
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

    it('displays warningAddlInfo in note section', () => {
      const { getByText } = render(
        <MigratingFacilitiesAlerts {...warningProps} />,
      );

      // MEDICATIONS has warningAddlInfo
      expect(
        getByText(
          /call your VA pharmacy’s automated refill line to refill a medication/i,
        ),
      ).to.exist;
    });
  });

  describe('warning alerts with warningAction (APPOINTMENTS)', () => {
    const appointmentsWarningProps = {
      healthTool: 'APPOINTMENTS',
      migratingFacilities: [
        {
          ...mockMigratingFacilities[0],
          phases: {
            ...mockMigratingFacilities[0].phases,
            current: 'p0', // In warning array for APPOINTMENTS
          },
        },
      ],
    };

    it('displays warningAction when defined in constant', () => {
      const { getByText } = render(
        <MigratingFacilitiesAlerts {...appointmentsWarningProps} />,
      );

      // APPOINTMENTS has warningAction: 'call'
      expect(getByText(/you can still call this facility/i)).to.exist;
    });
  });

  describe('error alerts', () => {
    const errorProps = {
      healthTool: 'MEDICATIONS',
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

    it('displays standard headline for MEDICATIONS', () => {
      const screen = render(<MigratingFacilitiesAlerts {...errorProps} />);

      // Component generates: "You can't ${errorAction} some facilities right now"
      // MEDICATIONS has errorAction: 'refill medications online for'
      expect(
        screen.getByText(
          /You can’t refill medications online for some facilities right now/i,
        ),
      ).to.exist;
    });

    it('displays errorBody in content', () => {
      const screen = render(<MigratingFacilitiesAlerts {...errorProps} />);

      // MEDICATIONS has errorBody
      expect(screen.getByText(/You can’t refill your medications online for/i))
        .to.exist;
    });

    it('displays errorAddlInfo when provided', () => {
      const screen = render(<MigratingFacilitiesAlerts {...errorProps} />);

      // MEDICATIONS has errorAddlInfo
      expect(
        screen.getByText(
          /If you need to refill a medication now, call your VA pharmacy’s automated refill line/i,
        ),
      ).to.exist;
    });

    it('displays end date in error message', () => {
      const { getByText } = render(
        <MigratingFacilitiesAlerts {...errorProps} />,
      );

      expect(getByText(/May 8, 2026/)).to.exist;
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
  });

  describe('error alerts for MEDICAL_RECORDS', () => {
    const medicalRecordsErrorProps = {
      healthTool: 'MEDICAL_RECORDS',
      migratingFacilities: [
        {
          ...mockMigratingFacilities[0],
          phases: {
            ...mockMigratingFacilities[0].phases,
            current: 'p5', // In error array for MEDICAL_RECORDS
          },
        },
      ],
    };

    it('displays special headline for MEDICAL_RECORDS', () => {
      const screen = render(
        <MigratingFacilitiesAlerts {...medicalRecordsErrorProps} />,
      );

      // Component generates special headline for MEDICAL_RECORDS:
      // "New medical records may not appear here until ${endDate}"
      expect(
        screen.getByText(
          /New medical records may not appear here until May 8, 2026/i,
        ),
      ).to.exist;
    });
  });

  describe('multiple facilities', () => {
    const errorProps = {
      healthTool: 'MEDICATIONS',
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
      healthTool: 'MEDICATIONS',
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
            p6: 'May 3, 2026',
            p7: 'May 8, 2026',
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
            p6: 'June 3, 2026',
            p7: 'June 8, 2026',
          },
        },
      ],
    };

    it('renders multiple alerts for different migrations', () => {
      const { container, getByText } = render(
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
      expect(warningAlerts[0].getAttribute('trigger')).to.include(
        'April 27, 2026',
      );

      // Displays correct facility names
      expect(getByText('VA Uptown New Orleans Medical Center')).to.exist;
      expect(getByText('VA Downtown New Orleans Clinic')).to.exist;

      // Get all list items from both alerts
      const allListItems = container.querySelectorAll('ul li');
      // Should have 2 facilities total (one in each alert)
      expect(allListItems.length).to.equal(2);
      // Both alerts should use "this facility" since each migration has one facility
      const bodyText = container.textContent;
      expect(bodyText).to.include('this facility');

      // Error alert should show end date from p6 for second migration
      expect(getByText(/June 3, 2026/)).to.exist;
    });
  });

  describe('multiple migrations with three or more facilities', () => {
    const threeMigrations = {
      healthTool: 'MEDICATIONS',
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
            p6: 'May 3, 2026',
            p7: 'May 8, 2026',
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
            p6: 'June 3, 2026',
            p7: 'June 8, 2026',
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
            p6: 'July 3, 2026',
            p7: 'July 8, 2026',
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
      healthTool: 'MEDICATIONS',
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
        healthTool: 'MEDICATIONS',
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
        healthTool: 'MEDICATIONS',
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

    it('renders warning alert when warningGetNote is missing', () => {
      // MEDICAL_RECORDS doesn't have warningGetNote
      const propsWithoutWarningNote = {
        healthTool: 'MEDICAL_RECORDS',
        migratingFacilities: [
          {
            ...mockMigratingFacilities[0],
            phases: {
              ...mockMigratingFacilities[0].phases,
              current: 'p1',
            },
          },
        ],
      };

      const { container } = render(
        <MigratingFacilitiesAlerts {...propsWithoutWarningNote} />,
      );

      const alert = container.querySelector('va-alert-expandable');
      expect(alert).to.exist;
      // Note section should not exist if warningGetNote is missing
      expect(container.querySelector('strong')?.textContent).to.not.include(
        'Note:',
      );
    });

    it('renders error alert when errorNote is missing', () => {
      // Create a custom mock that's missing errorNote
      const propsWithoutErrorNote = {
        healthTool: 'MEDICAL_RECORDS',
        migratingFacilities: [
          {
            ...mockMigratingFacilities[0],
            phases: {
              ...mockMigratingFacilities[0].phases,
              current: 'p5',
            },
          },
        ],
      };

      const { container, queryByTestId } = render(
        <MigratingFacilitiesAlerts {...propsWithoutErrorNote} />,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      // Find facility link should not exist if errorNote is missing
      expect(queryByTestId('find-facility-link')).to.not.exist;
    });

    it('handles missing warningPhases or errorPhases arrays', () => {
      // MHV_LANDING_PAGE doesn't have warningPhases or errorPhases
      const propsWithoutPhaseArrays = {
        healthTool: 'MHV_LANDING_PAGE',
        migratingFacilities: [
          {
            ...mockMigratingFacilities[0],
            phases: {
              ...mockMigratingFacilities[0].phases,
              current: 'p1',
            },
          },
        ],
      };

      const { container } = render(
        <MigratingFacilitiesAlerts {...propsWithoutPhaseArrays} />,
      );

      // Should return null when phase arrays are missing
      expect(container.firstChild).to.be.null;
    });

    it('uses errorHeadline when errorGetHeadline is not provided', () => {
      // MEDICATIONS uses errorHeadline (not errorGetHeadline)
      const propsWithErrorHeadline = {
        healthTool: 'MEDICATIONS',
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

      const { getByText } = render(
        <MigratingFacilitiesAlerts {...propsWithErrorHeadline} />,
      );

      expect(
        getByText(
          `You can’t refill medications online for some facilities right now`,
        ),
      ).to.exist;
    });

    it('uses errorGetHeadline when provided (MEDICAL_RECORDS)', () => {
      // MEDICAL_RECORDS uses errorGetHeadline function
      const propsWithErrorGetHeadline = {
        healthTool: 'MEDICAL_RECORDS',
        migratingFacilities: [
          {
            ...mockMigratingFacilities[0],
            phases: {
              ...mockMigratingFacilities[0].phases,
              current: 'p5',
            },
          },
        ],
      };

      const { getByText, getAllByText } = render(
        <MigratingFacilitiesAlerts {...propsWithErrorGetHeadline} />,
      );

      // errorGetHeadline for MEDICAL_RECORDS includes the end date
      expect(getByText(/New medical records may not appear here until/)).to
        .exist;
      expect(getAllByText(/May 8, 2026/).length).to.be.greaterThan(0);
    });
  });
});
