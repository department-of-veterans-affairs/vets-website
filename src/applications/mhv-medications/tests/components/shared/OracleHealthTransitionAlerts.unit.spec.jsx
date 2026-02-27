import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom-v5-compat';
import configureStore from 'redux-mock-store';
import {
  OracleHealthT3Alert,
  OracleHealthInCardAlert,
  OracleHealthRenewalInCardAlert,
} from '../../../components/shared/OracleHealthTransitionAlerts';
import { michiganTransitioningUser } from '../../../mocks/api/user';
import michiganPrescriptions from '../../e2e/fixtures/list-refillable-oh-ehr-michigan-prescriptions.json';

describe('OracleHealthTransitionAlerts', () => {
  const mockStore = configureStore([]);
  const initialState = {
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_medications_oracle_health_cutover: true,
    },
  };

  const blockedPrescriptions = michiganPrescriptions.data.map(rx => ({
    prescriptionId: rx.attributes.prescriptionId,
    prescriptionName: rx.attributes.prescriptionName,
    stationNumber: rx.attributes.stationNumber,
  }));

  const singleBlockedPrescription = [blockedPrescriptions[0]];

  // Transform snake_case API response to camelCase expected by component
  const mockMigratingFacilities = michiganTransitioningUser.data.attributes.va_profile.oh_migration_info.migration_schedules.map(
    schedule => ({
      ...schedule,
      migrationDate: schedule.migration_date,
      facilities: schedule.facilities.map(facility => ({
        facilityId: facility.facility_id,
        facilityName: facility.facility_name,
      })),
    }),
  );

  const renderWithProviders = (component, state = initialState) => {
    const store = mockStore(state);
    return render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>,
    );
  };

  describe('OracleHealthT3Alert', () => {
    describe('when mhvMedicationsOracleHealthCutover feature flag is enabled', () => {
      it('returns null when blockedPrescriptions is empty', () => {
        const { container } = renderWithProviders(
          <OracleHealthT3Alert
            blockedPrescriptions={[]}
            migratingFacilities={mockMigratingFacilities}
            hasRefillable
          />,
        );
        expect(container.firstChild).to.be.null;
      });

      it('returns null when migratingFacilities is empty', () => {
        const { container } = renderWithProviders(
          <OracleHealthT3Alert
            blockedPrescriptions={blockedPrescriptions}
            migratingFacilities={[]}
            hasRefillable
          />,
        );
        expect(container.firstChild).to.be.null;
      });

      it('returns null when migration phases are null', () => {
        const { container } = renderWithProviders(
          <OracleHealthT3Alert
            blockedPrescriptions={blockedPrescriptions}
            migratingFacilities={[
              { ...mockMigratingFacilities[0], phases: null },
            ]}
            hasRefillable
          />,
        );
        expect(container.firstChild).to.be.null;
      });

      describe('error alert with refillable prescriptions', () => {
        const withRefillableProps = {
          blockedPrescriptions,
          migratingFacilities: mockMigratingFacilities,
          hasRefillable: true,
        };

        it('renders error alert with correct test ID', () => {
          const { container } = renderWithProviders(
            <OracleHealthT3Alert {...withRefillableProps} />,
          );

          const alert = container.querySelector('va-alert');
          expect(alert).to.exist;
          expect(alert.getAttribute('status')).to.equal('error');
          expect(alert.getAttribute('data-testid')).to.equal(
            'oracle-health-t3-alert-with-refillable',
          );
        });

        it('displays standard headline', () => {
          const { container } = renderWithProviders(
            <OracleHealthT3Alert {...withRefillableProps} />,
          );

          const headline = container.querySelector('[slot="headline"]');
          expect(headline).to.exist;
          expect(headline.textContent).to.equal(
            'You can’t refill prescriptions online for some facilities right now',
          );
        });

        it('displays all blocked prescriptions with links', () => {
          const { getByText, container } = renderWithProviders(
            <OracleHealthT3Alert {...withRefillableProps} />,
          );

          expect(getByText('AMLODIPINE BESYLATE 10MG TAB')).to.exist;
          expect(getByText('LISINOPRIL 20MG TAB')).to.exist;

          const links = container.querySelectorAll('a');
          expect(links).to.have.length.at.least(2);
          expect(links[0].getAttribute('href')).to.equal(
            '/prescription/100506?station_number=506',
          );
          expect(links[1].getAttribute('href')).to.equal(
            '/prescription/100515?station_number=515',
          );
        });

        it('displays end date from migration phases', () => {
          const { getByText } = renderWithProviders(
            <OracleHealthT3Alert {...withRefillableProps} />,
          );

          expect(getByText(/April 13, 2026/)).to.exist;
        });

        it('displays additional info about calling pharmacy', () => {
          const { container } = renderWithProviders(
            <OracleHealthT3Alert {...withRefillableProps} />,
          );

          expect(container.textContent).to.include(
            'If you need a refill now, call your VA pharmacy’s automated refill line',
          );
        });

        it('includes accessible aria labels on prescription links', () => {
          const { container } = renderWithProviders(
            <OracleHealthT3Alert
              blockedPrescriptions={singleBlockedPrescription}
              migratingFacilities={mockMigratingFacilities}
              hasRefillable
            />,
          );

          const link = container.querySelector('a');
          expect(link.getAttribute('aria-label')).to.equal(
            'View details for AMLODIPINE BESYLATE 10MG TAB',
          );
        });
      });

      describe('hasRefillable prop handling', () => {
        it('sets correct test ID based on hasRefillable prop', () => {
          const { container: withRefillable } = renderWithProviders(
            <OracleHealthT3Alert
              blockedPrescriptions={blockedPrescriptions}
              migratingFacilities={mockMigratingFacilities}
              hasRefillable
            />,
          );

          const { container: noRefillable } = renderWithProviders(
            <OracleHealthT3Alert
              blockedPrescriptions={blockedPrescriptions}
              migratingFacilities={mockMigratingFacilities}
              hasRefillable={false}
            />,
          );

          expect(
            withRefillable
              .querySelector('va-alert')
              .getAttribute('data-testid'),
          ).to.equal('oracle-health-t3-alert-with-refillable');
          expect(
            noRefillable.querySelector('va-alert').getAttribute('data-testid'),
          ).to.equal('oracle-health-t3-alert-no-refillable');
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

          const { getByText } = renderWithProviders(
            <OracleHealthT3Alert
              blockedPrescriptions={blockedPrescriptions}
              migratingFacilities={customMigration}
              hasRefillable
            />,
          );

          expect(getByText(/May 15, 2026/)).to.exist;
        });
      });
    });

    describe('when mhvMedicationsOracleHealthCutover feature flag is disabled', () => {
      it('returns null regardless of transition data', () => {
        const stateWithFlagDisabled = {
          featureToggles: {
            // eslint-disable-next-line camelcase
            mhv_medications_oracle_health_cutover: false,
          },
        };

        const { container } = renderWithProviders(
          <OracleHealthT3Alert
            blockedPrescriptions={blockedPrescriptions}
            migratingFacilities={mockMigratingFacilities}
            hasRefillable
          />,
          stateWithFlagDisabled,
        );

        expect(container.firstChild).to.be.null;
      });
    });
  });

  describe('OracleHealthInCardAlert', () => {
    it('renders error alert with correct styling and status', () => {
      const { container } = render(<OracleHealthInCardAlert />);

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('error');
      expect(alert.hasAttribute('background-only')).to.be.true;
      expect(alert.getAttribute('class')).to.include('vads-u-margin-top--2');
    });

    it('displays correct DataDog action name for analytics', () => {
      const { container } = render(<OracleHealthInCardAlert />);

      const alert = container.querySelector('va-alert');
      expect(alert.getAttribute('data-dd-action-name')).to.equal(
        'oracle-health-in-card-alert-displayed',
      );
    });

    it('displays correct message about facility transition', () => {
      const { container } = render(<OracleHealthInCardAlert />);

      expect(container.textContent).to.include(
        'refill this medication online right now',
      );
      expect(container.textContent).to.include(
        'call your VA pharmacy’s automated refill line',
      );
    });
  });
  describe('OracleHealthRenewalInCardAlert', () => {
    it('renders error alert with correct styling and status', () => {
      const { container } = render(<OracleHealthRenewalInCardAlert />);

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('error');
      expect(alert.hasAttribute('background-only')).to.be.true;
      expect(alert.getAttribute('class')).to.include('vads-u-margin-top--2');
    });

    it('has correct test ID', () => {
      const { getByTestId } = render(<OracleHealthRenewalInCardAlert />);
      expect(getByTestId('oracle-health-renewal-in-card-alert')).to.exist;
    });

    it('displays correct DataDog action name for analytics', () => {
      const { container } = render(<OracleHealthRenewalInCardAlert />);

      const alert = container.querySelector('va-alert');
      expect(alert.getAttribute('data-dd-action-name')).to.equal(
        'oracle-health-renewal-in-card-alert-displayed',
      );
    });

    it('displays correct message about renewal during transition', () => {
      const { container } = render(<OracleHealthRenewalInCardAlert />);

      expect(container.textContent).to.include('don’t have any refills left');
      expect(container.textContent).to.include(
        'call your provider to request a renewal',
      );
    });
  });
});
