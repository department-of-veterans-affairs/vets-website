import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { BrowserRouter } from 'react-router-dom-v5-compat';
import { OracleHealthT3Alert } from '../../components/OracleHealthTransitionAlerts';

describe('OracleHealthTransitionAlerts', () => {
  const blockedPrescriptions = [
    {
      prescriptionId: 123,
      prescriptionName: 'MEDICATION A 10MG TAB',
    },
    {
      prescriptionId: 456,
      prescriptionName: 'MEDICATION B 20MG CAP',
    },
  ];

  const singleBlockedPrescription = [
    {
      prescriptionId: 123,
      prescriptionName: 'MEDICATION A 10MG TAB',
    },
  ];

  const mockMigratingFacilities = [
    {
      migrationDate: '2026-04-01',
      facilities: [
        {
          facilityId: '506',
          facilityName: 'VA Ann Arbor Healthcare System',
        },
        {
          facilityId: '515',
          facilityName: 'Battle Creek VA Medical Center',
        },
        {
          facilityId: '553',
          facilityName: 'John D. Dingell VA Medical Center',
        },
        {
          facilityId: '585',
          facilityName: 'Aleda E. Lutz VA Medical Center',
        },
      ],
      phases: {
        current: 'p4',
        p0: 'February 1, 2026',
        p1: 'February 15, 2026',
        p2: 'March 1, 2026',
        p3: 'March 25, 2026',
        p4: 'March 28, 2026',
        p5: 'April 1, 2026',
        p6: 'April 13, 2026',
        p7: 'April 18, 2026',
      },
    },
  ];

  describe('when no alerts should be shown', () => {
    it('returns null when required data is missing', () => {
      const scenarios = [
        { blockedPrescriptions: [], migratingFacilities: mockMigratingFacilities, desc: 'empty prescriptions' },
        { blockedPrescriptions, migratingFacilities: [], desc: 'empty migrations' },
        { blockedPrescriptions, migratingFacilities: [{ ...mockMigratingFacilities[0], phases: null }], desc: 'missing phases' },
      ];

      scenarios.forEach(({ blockedPrescriptions: rxs, migratingFacilities: migs }) => {
        const { container } = render(
          <BrowserRouter>
            <OracleHealthT3Alert
              blockedPrescriptions={rxs}
              migratingFacilities={migs}
              hasRefillable
            />
          </BrowserRouter>,
        );
        expect(container.firstChild).to.be.null;
      });
    });
  });

  describe('error alert with refillable prescriptions', () => {
    const withRefillableProps = {
      blockedPrescriptions,
      migratingFacilities: mockMigratingFacilities,
      hasRefillable: true,
    };

    it('renders error alert with correct test ID', () => {
      const { container } = render(
        <BrowserRouter>
          <OracleHealthT3Alert {...withRefillableProps} />
        </BrowserRouter>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('error');
      expect(alert.getAttribute('data-testid')).to.equal(
        'oracle-health-t3-alert-with-refillable',
      );
    });

    it('displays standard headline', () => {
      const { container } = render(
        <BrowserRouter>
          <OracleHealthT3Alert {...withRefillableProps} />
        </BrowserRouter>,
      );

      const headline = container.querySelector('[slot="headline"]');
      expect(headline).to.exist;
      expect(headline.textContent).to.equal(
        'You can’t refill medications online for some facilities right now',
      );
    });

    it('displays error message with end date', () => {
      const { container } = render(
        <BrowserRouter>
          <OracleHealthT3Alert {...withRefillableProps} />
        </BrowserRouter>,
      );

      expect(container.textContent).to.include(
        'You can’t refill these prescriptions online until',
      );
    });

    it('displays all blocked prescriptions with links', () => {
      const { getByText, container } = render(
        <BrowserRouter>
          <OracleHealthT3Alert {...withRefillableProps} />
        </BrowserRouter>,
      );

      expect(getByText('MEDICATION A 10MG TAB')).to.exist;
      expect(getByText('MEDICATION B 20MG CAP')).to.exist;

      const links = container.querySelectorAll('a');
      expect(links).to.have.length.at.least(2);
      expect(links[0].getAttribute('href')).to.equal('/prescription/123');
      expect(links[1].getAttribute('href')).to.equal('/prescription/456');
    });

    it('displays end date from migration phases', () => {
      const { getByText } = render(
        <BrowserRouter>
          <OracleHealthT3Alert {...withRefillableProps} />
        </BrowserRouter>,
      );

      expect(getByText(/April 13, 2026/)).to.exist;
    });

    it('displays additional info about calling pharmacy', () => {
      const { container } = render(
        <BrowserRouter>
          <OracleHealthT3Alert {...withRefillableProps} />
        </BrowserRouter>,
      );

      expect(container.textContent).to.include(
        'If you need to refill a medication now, call your VA pharmacy’s automated refill line',
      );
    });

    it('includes accessible aria labels on prescription links', () => {
      const { container } = render(
        <BrowserRouter>
          <OracleHealthT3Alert
            blockedPrescriptions={singleBlockedPrescription}
            migratingFacilities={mockMigratingFacilities}
            hasRefillable
          />
        </BrowserRouter>,
      );

      const link = container.querySelector('a');
      expect(link.getAttribute('aria-label')).to.equal(
        'View details for MEDICATION A 10MG TAB',
      );
    });
  });

  describe('hasRefillable prop handling', () => {
    it('sets correct test ID based on hasRefillable prop', () => {
      const { container: withRefillable } = render(
        <BrowserRouter>
          <OracleHealthT3Alert
            blockedPrescriptions={blockedPrescriptions}
            migratingFacilities={mockMigratingFacilities}
            hasRefillable
          />
        </BrowserRouter>,
      );

      const { container: noRefillable } = render(
        <BrowserRouter>
          <OracleHealthT3Alert
            blockedPrescriptions={blockedPrescriptions}
            migratingFacilities={mockMigratingFacilities}
            hasRefillable={false}
          />
        </BrowserRouter>,
      );

      expect(withRefillable.querySelector('va-alert').getAttribute('data-testid')).to.equal(
        'oracle-health-t3-alert-with-refillable',
      );
      expect(noRefillable.querySelector('va-alert').getAttribute('data-testid')).to.equal(
        'oracle-health-t3-alert-no-refillable',
      );
    });
  });

  describe('custom end date', () => {
    it('uses custom end date from migration phases', () => {
      const customMigration = [
        {
          ...mockMigratingFacilities[0],
          phases: {
            ...mockMigratingFacilities[0].phases,
            p6: 'May 15, 2026',
          },
        },
      ];

      const { getByText } = render(
        <BrowserRouter>
          <OracleHealthT3Alert
            blockedPrescriptions={blockedPrescriptions}
            migratingFacilities={customMigration}
            hasRefillable
          />
        </BrowserRouter>,
      );

      expect(getByText(/May 15, 2026/)).to.exist;
    });
  });
});

