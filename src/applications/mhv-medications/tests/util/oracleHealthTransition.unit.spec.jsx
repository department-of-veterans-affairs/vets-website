import { expect } from 'chai';
import sinon from 'sinon';
import {
  isFacilityTransitioning,
  shouldBlockRefills,
  shouldBlockRenewals,
  filterPrescriptionsByTransition,
} from '../../util/oracleHealthTransition';

const TRANSITIONING_FACILITY_ID = '515';
const NON_TRANSITIONING_FACILITY_ID = '999';
const TRANSITIONING_FACILITY_ID_2 = '506';

// Test migration data fixture
const mockMichiganMigration = {
  migrationDate: '2026-04-11',
  facilities: [
    { facilityId: '506', facilityName: 'Ann Arbor VA Medical Center' },
    { facilityId: '515', facilityName: 'Battle Creek VA Medical Center' },
    { facilityId: '553', facilityName: 'Aleda E. Lutz VA Medical Center' },
    { facilityId: '585', facilityName: 'John D. Dingell VA Medical Center' },
  ],
  phases: {
    current: 'p4',
    p0: 'February 10, 2026',
    p1: 'February 12, 2026',
    p2: 'March 12, 2026',
    p3: 'April 5, 2026',
    p4: 'April 8, 2026',
    p5: 'April 11, 2026',
    p6: 'April 13, 2026',
    p7: 'April 18, 2026',
  },
};

const mockPrescription = {
  prescriptionId: 12345,
  stationNumber: TRANSITIONING_FACILITY_ID,
  prescriptionName: 'TEST MEDICATION',
};

const createMigrationWithPhase = phase => ({
  ...mockMichiganMigration,
  phases: { ...mockMichiganMigration.phases, current: phase },
});

describe('oracleHealthTransition utilities', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('isFacilityTransitioning', () => {
    it('returns true when facility ID exists in migrations data, false otherwise', () => {
      expect(
        isFacilityTransitioning({
          facilityId: TRANSITIONING_FACILITY_ID,
          migrations: [mockMichiganMigration],
        }),
      ).to.be.true;
      expect(
        isFacilityTransitioning({
          facilityId: NON_TRANSITIONING_FACILITY_ID,
          migrations: [mockMichiganMigration],
        }),
      ).to.be.false;
      expect(
        isFacilityTransitioning({
          facilityId: null,
          migrations: [mockMichiganMigration],
        }),
      ).to.be.false;
    });
  });

  describe('shouldBlockRefills', () => {
    it('returns true only when mhv_medications_oracle_health_cutover feature flag enabled AND facility transitioning AND in p4 or p5 phase', () => {
      expect(
        shouldBlockRefills({
          prescription: mockPrescription,
          isFeatureFlagEnabled: true,
          migrations: [createMigrationWithPhase('p4')],
        }),
      ).to.be.true;
      expect(
        shouldBlockRefills({
          prescription: mockPrescription,
          isFeatureFlagEnabled: true,
          migrations: [createMigrationWithPhase('p5')],
        }),
      ).to.be.true;
      expect(
        shouldBlockRefills({
          prescription: mockPrescription,
          isFeatureFlagEnabled: true,
          migrations: [createMigrationWithPhase('p1')],
        }),
      ).to.be.false;
      expect(
        shouldBlockRefills({
          prescription: mockPrescription,
          isFeatureFlagEnabled: false,
          migrations: [createMigrationWithPhase('p4')],
        }),
      ).to.be.false;
    });
  });

  describe('shouldBlockRenewals', () => {
    it('returns true when mhv_medications_oracle_health_cutover feature flag enabled AND facility transitioning AND in p3, p4, or p5 phase', () => {
      expect(
        shouldBlockRenewals({
          prescription: mockPrescription,
          isFeatureFlagEnabled: true,
          migrations: [createMigrationWithPhase('p3')],
        }),
      ).to.be.true;
      expect(
        shouldBlockRenewals({
          prescription: mockPrescription,
          isFeatureFlagEnabled: true,
          migrations: [createMigrationWithPhase('p4')],
        }),
      ).to.be.true;
      expect(
        shouldBlockRenewals({
          prescription: mockPrescription,
          isFeatureFlagEnabled: true,
          migrations: [createMigrationWithPhase('p5')],
        }),
      ).to.be.true;
      expect(
        shouldBlockRenewals({
          prescription: mockPrescription,
          isFeatureFlagEnabled: true,
          migrations: [createMigrationWithPhase('p1')],
        }),
      ).to.be.false;
    });
  });

  describe('filterPrescriptionsByTransition', () => {
    const mockPrescriptions = [
      {
        prescriptionId: 1,
        stationNumber: TRANSITIONING_FACILITY_ID,
        prescriptionName: 'MEDICATION A',
      },
      {
        prescriptionId: 2,
        stationNumber: NON_TRANSITIONING_FACILITY_ID,
        prescriptionName: 'MEDICATION B',
      },
      {
        prescriptionId: 3,
        stationNumber: TRANSITIONING_FACILITY_ID_2,
        prescriptionName: 'MEDICATION C',
      },
    ];

    it('splits prescriptions into available/blocked arrays based on facility transition status and phase', () => {
      const disabled = filterPrescriptionsByTransition({
        prescriptions: mockPrescriptions,
        isFeatureFlagEnabled: false,
        migrations: [mockMichiganMigration],
      });
      expect(disabled.available).to.have.lengthOf(3);
      expect(disabled.blocked).to.have.lengthOf(0);

      const enabled = filterPrescriptionsByTransition({
        prescriptions: mockPrescriptions,
        isFeatureFlagEnabled: true,
        migrations: [createMigrationWithPhase('p4')],
      });
      expect(enabled.available).to.have.lengthOf(1);
      expect(enabled.blocked).to.have.lengthOf(2);
    });

    it('returns empty arrays for null/empty input and fails open (all available) when no migrations', () => {
      // Null/empty prescriptions
      expect(
        filterPrescriptionsByTransition({
          prescriptions: null,
          isFeatureFlagEnabled: true,
          migrations: [mockMichiganMigration],
        }),
      ).to.deep.equal({ available: [], blocked: [] });
      expect(
        filterPrescriptionsByTransition({
          prescriptions: [],
          isFeatureFlagEnabled: true,
          migrations: [],
        }),
      ).to.deep.equal({
        available: [],
        blocked: [],
      });

      // Empty migrations (fail-safe: all prescriptions available)
      const result = filterPrescriptionsByTransition({
        prescriptions: mockPrescriptions,
        isFeatureFlagEnabled: true,
        migrations: [],
      });
      expect(result.available).to.have.lengthOf(3);
      expect(result.blocked).to.have.lengthOf(0);
    });
  });
});
