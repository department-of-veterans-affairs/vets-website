import { expect } from 'chai';
import sinon from 'sinon';
import {
  formatPhaseDate,
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
    p0: '2026-02-10',
    p1: '2026-02-25',
    p2: '2026-03-12',
    p3: '2026-04-05',
    p4: '2026-04-08',
    p5: '2026-04-11',
    p6: '2026-04-13',
    p7: '2026-04-18',
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

  describe('formatPhaseDate', () => {
    it('formats ISO dates to readable format and uses fallback for invalid dates', () => {
      expect(formatPhaseDate('2026-04-13', 'Fallback')).to.equal(
        'April 13, 2026',
      );
      expect(formatPhaseDate('March 1, 2026', 'Fallback')).to.equal(
        'March 1, 2026',
      );
      expect(formatPhaseDate(null, 'Fallback Date')).to.equal('Fallback Date');
    });
  });

  describe('isFacilityTransitioning', () => {
    it('returns true when facility ID exists in migrations data, false otherwise', () => {
      expect(
        isFacilityTransitioning(TRANSITIONING_FACILITY_ID, [
          mockMichiganMigration,
        ]),
      ).to.be.true;
      expect(
        isFacilityTransitioning(NON_TRANSITIONING_FACILITY_ID, [
          mockMichiganMigration,
        ]),
      ).to.be.false;
      expect(isFacilityTransitioning(null, [mockMichiganMigration])).to.be
        .false;
    });
  });

  describe('shouldBlockRefills', () => {
    it('returns true only when mhv_medications_oracle_health_cutover feature flag enabled AND facility transitioning AND in p4 phase', () => {
      expect(
        shouldBlockRefills(mockPrescription, true, [
          createMigrationWithPhase('p4'),
        ]),
      ).to.be.true;
      expect(
        shouldBlockRefills(mockPrescription, true, [
          createMigrationWithPhase('p1'),
        ]),
      ).to.be.false;
      expect(
        shouldBlockRefills(mockPrescription, false, [
          createMigrationWithPhase('p4'),
        ]),
      ).to.be.false;
    });
  });

  describe('shouldBlockRenewals', () => {
    it('returns true when mhv_medications_oracle_health_cutover feature flag enabled AND facility transitioning AND in p3 or p4 phase', () => {
      expect(
        shouldBlockRenewals(mockPrescription, true, [
          createMigrationWithPhase('p3'),
        ]),
      ).to.be.true;
      expect(
        shouldBlockRenewals(mockPrescription, true, [
          createMigrationWithPhase('p4'),
        ]),
      ).to.be.true;
      expect(
        shouldBlockRenewals(mockPrescription, true, [
          createMigrationWithPhase('p1'),
        ]),
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
      const disabled = filterPrescriptionsByTransition(
        mockPrescriptions,
        false,
        [mockMichiganMigration],
      );
      expect(disabled.available).to.have.lengthOf(3);
      expect(disabled.blocked).to.have.lengthOf(0);

      const enabled = filterPrescriptionsByTransition(mockPrescriptions, true, [
        createMigrationWithPhase('p4'),
      ]);
      expect(enabled.available).to.have.lengthOf(1);
      expect(enabled.blocked).to.have.lengthOf(2);
    });

    it('returns empty arrays for null/empty input and fails open (all available) when no migrations', () => {
      // Null/empty prescriptions
      expect(
        filterPrescriptionsByTransition(null, true, [mockMichiganMigration]),
      ).to.deep.equal({ available: [], blocked: [] });
      expect(filterPrescriptionsByTransition([], true, [])).to.deep.equal({
        available: [],
        blocked: [],
      });

      // Empty migrations (fail-safe: all prescriptions available)
      const result = filterPrescriptionsByTransition(
        mockPrescriptions,
        true,
        [],
      );
      expect(result.available).to.have.lengthOf(3);
      expect(result.blocked).to.have.lengthOf(0);
    });
  });
});
