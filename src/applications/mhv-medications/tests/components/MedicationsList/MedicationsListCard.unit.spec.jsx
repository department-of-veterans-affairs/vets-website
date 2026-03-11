import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/dom';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import prescriptionsListItem from '../../fixtures/prescriptionsListItem.json';
import MedicationsListCard from '../../../components/MedicationsList/MedicationsListCard';
import reducers from '../../../reducers';
import { medicationsUrls } from '../../../util/constants';

describe('Medication card component', () => {
  const FLAG_COMBINATIONS = [
    {
      cernerPilot: false,
      v2StatusMapping: false,
      useV2: false,
      desc: 'both flags disabled',
    },
    {
      cernerPilot: true,
      v2StatusMapping: false,
      useV2: false,
      desc: 'only cernerPilot enabled',
    },
    {
      cernerPilot: false,
      v2StatusMapping: true,
      useV2: false,
      desc: 'only v2StatusMapping enabled',
    },
    {
      cernerPilot: true,
      v2StatusMapping: true,
      useV2: true,
      desc: 'both flags enabled',
    },
  ];

  const V2_STATUSES = [
    { status: 'Active', desc: 'Active' },
    { status: 'In progress', desc: 'In progress' },
    { status: 'Inactive', desc: 'Inactive' },
    { status: 'Transferred', desc: 'Transferred' },
    { status: 'Shipped', desc: 'Shipped' },
    { status: 'Status not available', desc: 'Status not available' },
  ];

  const V1_STATUSES = [
    'Active: Parked',
    'Active: Refill in Process',
    'Active: Submitted',
    'Active: On Hold',
    'Expired',
    'Discontinued',
    'Transferred',
  ];

  const setup = (rx = prescriptionsListItem, initialState = {}) => {
    return renderWithStoreAndRouterV6(<MedicationsListCard rx={rx} />, {
      initialState,
      reducers,
    });
  };

  const setupWithFlags = (
    rx = prescriptionsListItem,
    isCernerPilot = false,
    isV2StatusMapping = false,
  ) => {
    const initialState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: isCernerPilot,
        [FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping]: isV2StatusMapping,
      },
    };
    return renderWithStoreAndRouterV6(<MedicationsListCard rx={rx} />, {
      initialState,
      reducers,
    });
  };

  // Shared test data

  it('renders without errors, even when no prescription name is given ', () => {
    const screen = setup({
      ...prescriptionsListItem,
      prescriptionName: '',
      dispStatus: 'Active: Non-VA',
    });
    const medicationName = screen.getByTestId(
      'medications-history-details-link',
    );
    fireEvent.click(medicationName);
    expect(screen);
  });

  it('shows status', () => {
    const screen = setup();
    expect(screen.getByText(prescriptionsListItem.dispStatus)).to.exist;
  });

  it('does not show Unknown when status is unknown', () => {
    const rxWithUnknownStatus = {
      ...prescriptionsListItem,
      dispStatus: 'Unknown',
    };
    const screen = setup(rxWithUnknownStatus);
    expect(screen.queryByText(rxWithUnknownStatus.dispStatus)).to.not.exist;
  });

  it('able to click on medication name', () => {
    const screen = setup({
      ...prescriptionsListItem,
      dispStatus: 'Active: Non-VA',
    });
    const medicationName = screen.getByText(
      prescriptionsListItem.prescriptionName,
    );
    fireEvent.click(medicationName);
    expect(screen);
  });

  it('shows shipped on information when available', () => {
    const screen = setup({
      ...prescriptionsListItem,
      trackingList: [
        {
          completeDateTime: 'Sun, 16 Jun 2024 04:39:11 EDT',
        },
      ],
    });
    const shippedOn = screen.getByText('Shipped on June 16, 2024');
    expect(shippedOn);
  });

  it('shows number of refills when it is refillable and has at least 1 refill remaining', () => {
    const rx = {
      ...prescriptionsListItem,
      isRefillable: true,
      dispStatus: 'Active',
      refillRemaining: 3,
    };
    const { getByTestId } = setup(rx);
    expect(getByTestId('rx-refill-remaining')).to.have.text(
      'Refills remaining: 3',
    );
  });

  describe('when mhvMedicationsManagementImprovements flag is enabled', () => {
    const managementImprovementsState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsManagementImprovements]: true,
      },
    };

    it('shows "Refills left" instead of "Refills remaining"', () => {
      const rx = {
        ...prescriptionsListItem,
        isRefillable: true,
        dispStatus: 'Active',
        refillRemaining: 3,
      };
      const { getByTestId } = setup(rx, managementImprovementsState);
      expect(getByTestId('rx-refill-remaining')).to.have.text(
        'Refills left: 3',
      );
    });

    it('hides prescription number', () => {
      const rx = {
        ...prescriptionsListItem,
        isRefillable: true,
        dispStatus: 'Active',
        prescriptionNumber: '12345',
      };
      const { queryByTestId } = setup(rx, managementImprovementsState);
      expect(queryByTestId('rx-number')).to.be.null;
    });

    it('hides status label', () => {
      const rx = {
        ...prescriptionsListItem,
        isRefillable: true,
        dispStatus: 'Active',
      };
      const { queryByTestId } = setup(rx, managementImprovementsState);
      expect(queryByTestId('rxStatus')).to.be.null;
    });

    it('shows refill-in-progress alert for "Active: Refill in Process" status', () => {
      const rx = {
        ...prescriptionsListItem,
        dispStatus: 'Active: Refill in Process',
        isRefillable: false,
      };
      const { getByTestId, getByText } = setup(rx, managementImprovementsState);
      expect(getByTestId('refill-in-progress-alert')).to.exist;
      const link = getByText('Go to in-progress medications');
      expect(link).to.have.attribute(
        'href',
        medicationsUrls.MEDICATIONS_IN_PROGRESS,
      );
    });

    it('shows refill-in-progress alert for "Active: Submitted" status', () => {
      const rx = {
        ...prescriptionsListItem,
        dispStatus: 'Active: Submitted',
        isRefillable: false,
      };
      const { getByTestId, getByText } = setup(rx, managementImprovementsState);
      expect(getByTestId('refill-in-progress-alert')).to.exist;
      const link = getByText('Go to in-progress medications');
      expect(link).to.have.attribute(
        'href',
        medicationsUrls.MEDICATIONS_IN_PROGRESS,
      );
    });

    it('shows "Refills left" for refill-in-progress even when isRefillable is false', () => {
      const rx = {
        ...prescriptionsListItem,
        dispStatus: 'Active: Refill in Process',
        isRefillable: false,
        refillRemaining: 3,
      };
      const { getByTestId } = setup(rx, managementImprovementsState);
      expect(getByTestId('rx-refill-remaining')).to.have.text(
        'Refills left: 3',
      );
    });

    it('hides ExtraDetails for refill-in-progress prescriptions', () => {
      const rx = {
        ...prescriptionsListItem,
        dispStatus: 'Active: Refill in Process',
        isRefillable: false,
      };
      const { container } = setup(rx, managementImprovementsState);
      expect(container.querySelector('.shipping-info')).to.be.null;
    });

    it('does not show refill-in-progress alert for Active status', () => {
      const rx = {
        ...prescriptionsListItem,
        isRefillable: true,
        dispStatus: 'Active',
      };
      const { queryByTestId } = setup(rx, managementImprovementsState);
      expect(queryByTestId('refill-in-progress-alert')).to.be.null;
    });
  });

  describe('when mhvMedicationsManagementImprovements flag is disabled', () => {
    it('does not show refill-in-progress alert and shows original layout', () => {
      const rx = {
        ...prescriptionsListItem,
        dispStatus: 'Active: Refill in Process',
        isRefillable: false,
        prescriptionNumber: '12345',
      };
      const { queryByTestId, getByTestId } = setup(rx);
      expect(queryByTestId('refill-in-progress-alert')).to.be.null;
      expect(getByTestId('rx-number')).to.exist;
      expect(getByTestId('rxStatus')).to.exist;
    });
  });

  it('Does not show number of refills when it is not refillable', () => {
    const rx = {
      ...prescriptionsListItem,
      dispStatus: 'Active',
      refillRemaining: 3,
    };
    const { queryByTestId } = setup(rx);
    expect(queryByTestId('rx-refill-remaining')).to.be.null;
  });

  it('Does show number of refills when it has 0 refill remaining', () => {
    const rx = {
      ...prescriptionsListItem,
      isRefillable: true,
      dispStatus: 'Active',
      refillRemaining: 0,
    };
    const { getByTestId } = setup(rx);
    expect(getByTestId('rx-refill-remaining')).to.have.text(
      'Refills remaining: 0',
    );
  });

  it('displays "Not available" when prescription number is missing', () => {
    const rx = {
      ...prescriptionsListItem,
      prescriptionNumber: null,
      dispStatus: 'Active: Non-VA',
    };
    const { getByTestId } = setup(rx);
    expect(getByTestId('rx-number')).to.have.text(
      'Prescription number: Not available',
    );
  });

  it('shows pending med text inside card body when the rx prescription source is PD and dispStatus is NewOrder', () => {
    const screen = setup({
      ...prescriptionsListItem,
      prescriptionSource: 'PD',
      dispStatus: 'NewOrder',
    });
    expect(
      screen.getByText(
        'This is a new prescription from your provider. Your VA pharmacy is reviewing it now. Details may change.',
      ),
    );
  });

  it('shows pending renewal text inside card body when the rx prescription source is PD and the disp status is Renew', () => {
    const screen = setup({
      ...prescriptionsListItem,
      prescriptionSource: 'PD',
      dispStatus: 'Renew',
    });
    expect(
      screen.getByText(
        'This is a renewal you requested. Your VA pharmacy is reviewing it now. Details may change.',
      ),
    );
  });

  it('renders a Non-VA Prescription with an orderedDate', () => {
    const rx = {
      ...prescriptionsListItem,
      prescriptionSource: 'NV',
      dispStatus: 'Active: Non-VA',
      orderedDate: '2024-06-16T20:00:00Z',
    };
    const { getByTestId } = setup(rx);
    /* eslint-disable prettier/prettier */
    expect(getByTestId('rx-last-filled-info')).to.have.text(
      'Documented on June 16, 2024',
    );
    expect(getByTestId('rxStatus')).to.have.text('Active: Non-VA');
    expect(getByTestId('non-VA-prescription')).to.have.text(
      'You can’t manage this medication in this online tool.',
    );
    /* eslint-enable prettier/prettier */
  });

  it('renders a Non-VA Prescription without an orderedDate', () => {
    const rx = {
      ...prescriptionsListItem,
      prescriptionSource: 'NV',
      dispStatus: 'Active: Non-VA',
      orderedDate: '',
    };
    const { getByTestId } = setup(rx);
    /* eslint-disable prettier/prettier */
    expect(getByTestId('rx-last-filled-info')).to.have.text(
      'Documented on: Date not available',
    );
    expect(getByTestId('rxStatus')).to.have.text('Active: Non-VA');
    expect(getByTestId('non-VA-prescription')).to.have.text(
      'You can’t manage this medication in this online tool.',
    );
    /* eslint-enable prettier/prettier */
  });

  it('renders a Non-VA Prescription when dispStatus is null', () => {
    const rx = {
      ...prescriptionsListItem,
      prescriptionSource: 'NV',
      dispStatus: null,
      orderedDate: '',
    };
    const { getByTestId } = setup(rx);
    /* eslint-disable prettier/prettier */
    expect(getByTestId('rx-last-filled-info')).to.have.text(
      'Documented on: Date not available',
    );
    expect(getByTestId('rxStatus')).to.have.text('Active: Non-VA');
    expect(getByTestId('non-VA-prescription')).to.have.text(
      'You can’t manage this medication in this online tool.',
    );
    /* eslint-enable prettier/prettier */
  });

  describe('CernerPilot and V2StatusMapping flag requirement validation', () => {
    FLAG_COMBINATIONS.forEach(
      ({ cernerPilot, v2StatusMapping, useV2, desc }) => {
        it(`${useV2 ? 'V2' : 'V1'} behavior when ${desc}`, () => {
          // Pass appropriate status based on flag combination
          // When both flags enabled, API returns V2 status; otherwise V1
          const dispStatus = useV2 ? 'Inactive' : 'Expired';
          const rx = { ...prescriptionsListItem, dispStatus };
          const screen = setupWithFlags(rx, cernerPilot, v2StatusMapping);
          expect(screen.getByText(dispStatus)).to.exist;
        });
      },
    );
  });

  it('renders link text from orderableItem when prescriptionName is null', () => {
    const rx = {
      ...prescriptionsListItem,
      prescriptionName: null, // null check
      orderableItem: 'Amoxicillin 500mg Capsules', // fallback text
    };
    const screen = setup(rx);
    const link = screen.getByTestId('medications-history-details-link');
    expect(link).to.exist;
    expect(link.textContent).to.include('Amoxicillin 500mg Capsules');
  });

  it('renders link with medication name when available', () => {
    const rx = {
      ...prescriptionsListItem,
      prescriptionName: 'Atorvastatin',
      orderableItem: 'Fallback should not be used',
    };
    const screen = setup(rx);
    const link = screen.getByTestId('medications-history-details-link');
    expect(link).to.exist;
    expect(link.textContent).to.include('Atorvastatin');
  });

  it('does not render Unknown status text', () => {
    const rxWithUnknownStatus = {
      ...prescriptionsListItem,
      dispStatus: 'Unknown',
    };
    const screen = setup(rxWithUnknownStatus);
    expect(screen.queryByText(rxWithUnknownStatus.dispStatus)).to.not.exist;
  });

  it('does not render aria-describedby attribute on the link', () => {
    const screen = setup();
    const link = screen.getByTestId('medications-history-details-link');
    expect(link.getAttribute('aria-describedby')).to.be.null;
  });
  describe('Status display edge cases', () => {
    const edgeCases = [
      { dispStatus: null, desc: 'null dispStatus' },
      { dispStatus: undefined, desc: 'undefined dispStatus' },
      { dispStatus: '', desc: 'empty string dispStatus' },
    ];

    edgeCases.forEach(({ dispStatus, desc }) => {
      FLAG_COMBINATIONS.forEach(
        ({ cernerPilot, v2StatusMapping, desc: flagDesc }) => {
          it(`handles ${desc} when ${flagDesc}`, () => {
            const rx = { ...prescriptionsListItem, dispStatus };
            const screen = setupWithFlags(rx, cernerPilot, v2StatusMapping);
            expect(screen).to.exist;
          });
        },
      );
    });
  });
  describe('Non-VA status preservation', () => {
    FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, desc }) => {
      it(`preserves Active: Non-VA status when ${desc}`, () => {
        const rx = {
          ...prescriptionsListItem,
          dispStatus: 'Active: Non-VA',
          prescriptionSource: 'NV',
        };
        const screen = setupWithFlags(rx, cernerPilot, v2StatusMapping);
        expect(screen.getByText('Active: Non-VA')).to.exist;
      });
    });
  });

  describe('Pending medication status handling', () => {
    // V1 pending statuses only apply when V2 mapping is NOT enabled
    const v1FlagCombinations = FLAG_COMBINATIONS.filter(({ useV2 }) => !useV2);

    const pendingStatuses = [
      {
        dispStatus: 'NewOrder',
        expectedText: /new prescription from your provider/,
      },
      { dispStatus: 'Renew', expectedText: /renewal you requested/ },
    ];

    pendingStatuses.forEach(({ dispStatus, expectedText }) => {
      v1FlagCombinations.forEach(({ cernerPilot, v2StatusMapping, desc }) => {
        it(`shows pending ${dispStatus} text when ${desc}`, () => {
          const rx = {
            ...prescriptionsListItem,
            prescriptionSource: 'PD',
            dispStatus,
          };
          const screen = setupWithFlags(rx, cernerPilot, v2StatusMapping);
          expect(screen.getByText(expectedText)).to.exist;
        });
      });
    });
  });

  describe('V2 pending medication status handling (when both flags are enabled)', () => {
    it('shows pending new order text when V2 enabled with refillStatus neworder', () => {
      const rx = {
        ...prescriptionsListItem,
        prescriptionSource: 'PD',
        dispStatus: 'In progress',
        refillStatus: 'neworder',
      };
      const screen = setupWithFlags(rx, true, true);
      expect(screen.getByText(/new prescription from your provider/)).to.exist;
    });

    it('shows pending renewal text when V2 enabled with refillStatus renew', () => {
      const rx = {
        ...prescriptionsListItem,
        prescriptionSource: 'PD',
        dispStatus: 'In progress',
        refillStatus: 'renew',
      };
      const screen = setupWithFlags(rx, true, true);
      expect(screen.getByText(/renewal you requested/)).to.exist;
    });

    it('handles case-insensitive refillStatus values', () => {
      const rx = {
        ...prescriptionsListItem,
        prescriptionSource: 'PD',
        dispStatus: 'In progress',
        refillStatus: 'NewOrder',
      };
      const screen = setupWithFlags(rx, true, true);
      expect(screen.getByText(/new prescription from your provider/)).to.exist;
    });

    it('does not show pending text when prescriptionSource is not PD with V2 In progress status', () => {
      const rx = {
        ...prescriptionsListItem,
        prescriptionSource: 'VA',
        dispStatus: 'In progress',
        refillStatus: 'neworder',
      };
      const screen = setupWithFlags(rx, true, true);
      expect(screen.queryByTestId('pending-renewal-rx')).to.not.exist;
    });

    it('does not show pending text when dispStatus is not In progress with V2 enabled', () => {
      const rx = {
        ...prescriptionsListItem,
        prescriptionSource: 'PD',
        dispStatus: 'Active',
        refillStatus: 'neworder',
      };
      const screen = setupWithFlags(rx, true, true);
      expect(screen.queryByTestId('pending-renewal-rx')).to.not.exist;
    });

    it('does not show pending text when refillStatus is missing with V2 enabled', () => {
      const rx = {
        ...prescriptionsListItem,
        prescriptionSource: 'PD',
        dispStatus: 'In progress',
      };
      const screen = setupWithFlags(rx, true, true);
      expect(screen.queryByTestId('pending-renewal-rx')).to.not.exist;
    });

    it('does not show V2 pending text when only cernerPilot flag is enabled', () => {
      const rx = {
        ...prescriptionsListItem,
        prescriptionSource: 'PD',
        dispStatus: 'In progress',
        refillStatus: 'neworder',
      };
      const screen = setupWithFlags(rx, true, false);
      // V2 status mapping requires both flags; with only cernerPilot, 'In progress' is not recognized
      expect(screen.queryByTestId('pending-renewal-rx')).to.not.exist;
    });

    it('does not show V2 pending text when only v2StatusMapping flag is enabled', () => {
      const rx = {
        ...prescriptionsListItem,
        prescriptionSource: 'PD',
        dispStatus: 'In progress',
        refillStatus: 'neworder',
      };
      const screen = setupWithFlags(rx, false, true);
      // V2 status mapping requires both flags
      expect(screen.queryByTestId('pending-renewal-rx')).to.not.exist;
    });
  });

  describe('V2 status display when API returns V2 statuses (both flags enabled)', () => {
    V2_STATUSES.forEach(({ status, desc }) => {
      it(`displays ${desc} correctly when returned by API`, () => {
        const rx = { ...prescriptionsListItem, dispStatus: status };
        const screen = setupWithFlags(rx, true, true);
        expect(screen.getByText(status)).to.exist;
      });
    });
  });

  describe('V1 status display when flags disabled', () => {
    V1_STATUSES.forEach(status => {
      it(`displays ${status} correctly when returned by API`, () => {
        const rx = { ...prescriptionsListItem, dispStatus: status };
        const screen = setupWithFlags(rx, false, false);
        expect(screen.getByText(status)).to.exist;
      });
    });
  });
});

const TRANSITION_PHASES = {
  current: 'p4',
  p0: 'February 10, 2026',
  p1: 'February 12, 2026',
  p2: 'March 12, 2026',
  p3: 'April 5, 2026',
  p4: 'April 8, 2026',
  p5: 'April 11, 2026',
  p6: 'April 13, 2026',
  p7: 'April 18, 2026',
};

describe('Oracle Health Transition - MedicationsListCard', () => {
  // Test data fixtures
  const MICHIGAN_FACILITY_515 = '515';
  const NON_TRANSITIONING_FACILITY = '442';

  const mockMichiganMigration = {
    migrationDate: '2026-04-11',
    facilities: [
      {
        facilityId: MICHIGAN_FACILITY_515,
        facilityName: 'Battle Creek VA Medical Center',
      },
    ],
    phases: TRANSITION_PHASES,
  };

  // Helper to create prescription with station number
  const createRxWithStation = (stationNumber, overrides = {}) => ({
    ...prescriptionsListItem,
    stationNumber,
    isRefillable: true,
    refillRemaining: 3,
    ...overrides,
  });

  const createMigrationWithPhase = phase => ({
    ...mockMichiganMigration,
    phases: { ...TRANSITION_PHASES, current: phase },
  });

  // Renewable Active prescription at a transitioning facility.
  // isRefillable is false because a medication cannot be both refillable and renewable.
  const createRenewableRxAtTransitioning = (overrides = {}) =>
    createRxWithStation(MICHIGAN_FACILITY_515, {
      dispStatus: 'Active',
      refillRemaining: 0,
      isRefillable: false,
      isRenewable: true,
      prescriptionSource: 'VA',
      stationNumber: MICHIGAN_FACILITY_515,
      ...overrides,
    });

  // Helper to setup component with migration data
  const setupWithMigration = (
    rx,
    featureFlagEnabled = true,
    migrations = [mockMichiganMigration],
  ) => {
    const initialState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsOracleHealthCutover]: featureFlagEnabled,
      },
      user: {
        profile: {
          vaProfile: {
            ohMigrationInfo: {
              migrationSchedules: migrations,
            },
          },
        },
      },
    };
    return renderWithStoreAndRouterV6(<MedicationsListCard rx={rx} />, {
      initialState,
      reducers,
    });
  };

  // Assertion helpers — refill in-card alert (OracleHealthInCardAlert)
  const expectRefillAlertToExist = screen => {
    expect(screen.getByTestId('oracle-health-in-card-alert')).to.exist;
  };

  const expectRefillAlertNotToExist = screen => {
    expect(screen.queryByTestId('oracle-health-in-card-alert')).to.not.exist;
  };

  // Assertion helpers — renewal in-card alert (OracleHealthRenewalInCardAlert)
  const expectRenewalAlertToExist = screen => {
    expect(screen.getByTestId('oracle-health-renewal-in-card-alert')).to.exist;
  };

  const expectRenewalAlertNotToExist = screen => {
    expect(screen.queryByTestId('oracle-health-renewal-in-card-alert')).to.not
      .exist;
  };

  describe('common transition behavior', () => {
    describe('does not show transition alerts when feature flag is disabled', () => {
      it('does not show refill alert for refillable rx', () => {
        const migration = createMigrationWithPhase('p4');
        const refillableRx = createRxWithStation(MICHIGAN_FACILITY_515);
        const screen = setupWithMigration(refillableRx, false, [migration]);
        expectRefillAlertNotToExist(screen);
      });

      it('does not show renewal alert for renewable rx', () => {
        const migration = createMigrationWithPhase('p4');
        const renewableRx = createRenewableRxAtTransitioning();
        const screen = setupWithMigration(renewableRx, false, [migration]);
        expectRenewalAlertNotToExist(screen);
      });
    });

    describe('does not show transition alerts when feature flag is enabled BUT no matching facility', () => {
      it('does not show transition alerts for non-transitioning facility', () => {
        const rx = createRxWithStation(NON_TRANSITIONING_FACILITY);
        const screen = setupWithMigration(rx, true);
        expectRefillAlertNotToExist(screen);
        expectRenewalAlertNotToExist(screen);
      });
    });
  });

  describe('refill alert (OracleHealthInCardAlert) during phases p4-p5', () => {
    it('shows refill alert and hides refill button for refillable rx at transitioning facility', () => {
      const rx = createRxWithStation(MICHIGAN_FACILITY_515);
      const screen = setupWithMigration(rx, true);
      expectRefillAlertToExist(screen);
      expect(screen.queryByTestId('refill-request-button')).to.not.exist;
    });

    it('does not show refill alert for non-refillable (renewable) rx at transitioning facility', () => {
      const rx = createRenewableRxAtTransitioning();
      const screen = setupWithMigration(rx, true);
      expectRefillAlertNotToExist(screen);
    });

    it('does not show refill alert during non-blocking phase (p1)', () => {
      const migration = createMigrationWithPhase('p1');
      const rx = createRxWithStation(MICHIGAN_FACILITY_515);
      const screen = setupWithMigration(rx, true, [migration]);
      expectRefillAlertNotToExist(screen);
    });
  });

  // shouldBlockRenewals uses phases p3-p5 (superset of refill-blocking p4-p5).
  // OracleHealthRenewalInCardAlert renders inside ExtraDetails when
  // isRenewalBlocked and rx.isRenewable are both true.
  describe('renewal alert (OracleHealthRenewalInCardAlert) during phases p3-p5', () => {
    it('shows renewal alert during p3 for renewable rx at transitioning facility', () => {
      const migration = createMigrationWithPhase('p3');
      const rx = createRenewableRxAtTransitioning();
      const screen = setupWithMigration(rx, true, [migration]);
      expectRenewalAlertToExist(screen);
    });

    it('shows renewal alert during p4 for renewable rx at transitioning facility', () => {
      const migration = createMigrationWithPhase('p4');
      const rx = createRenewableRxAtTransitioning();
      const screen = setupWithMigration(rx, true, [migration]);
      expectRenewalAlertToExist(screen);
    });

    it('does not show renewal alert during p2 (non-blocking boundary)', () => {
      const migration = createMigrationWithPhase('p2');
      const rx = createRenewableRxAtTransitioning();
      const screen = setupWithMigration(rx, true, [migration]);
      expectRenewalAlertNotToExist(screen);
    });

    it('shows renewal alert for Expired renewable rx at transitioning facility', () => {
      const migration = createMigrationWithPhase('p3');
      const rx = createRenewableRxAtTransitioning({ dispStatus: 'Expired' });
      const screen = setupWithMigration(rx, true, [migration]);
      expectRenewalAlertToExist(screen);
    });

    it('does not show renewal alert when isRenewable is false', () => {
      const migration = createMigrationWithPhase('p4');
      const rx = createRenewableRxAtTransitioning({ isRenewable: false });
      const screen = setupWithMigration(rx, true, [migration]);
      expectRenewalAlertNotToExist(screen);
    });
  });
});
