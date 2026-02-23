import { expect } from 'chai';
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

    it('returns true for all Michigan transitioning facilities', () => {
      mockMichiganMigration.facilities.forEach(({ facilityId }) => {
        expect(
          isFacilityTransitioning({
            facilityId,
            migrations: [mockMichiganMigration],
          }),
        ).to.be.true;
      });
    });

    it('returns false when migrations array is empty or null', () => {
      expect(
        isFacilityTransitioning({
          facilityId: TRANSITIONING_FACILITY_ID,
          migrations: [],
        }),
      ).to.be.false;
      expect(
        isFacilityTransitioning({
          facilityId: TRANSITIONING_FACILITY_ID,
          migrations: null,
        }),
      ).to.be.false;
    });

    it('returns false when facilityId is undefined, empty string, or invalid', () => {
      expect(
        isFacilityTransitioning({
          facilityId: undefined,
          migrations: [mockMichiganMigration],
        }),
      ).to.be.false;
      expect(
        isFacilityTransitioning({
          facilityId: '',
          migrations: [mockMichiganMigration],
        }),
      ).to.be.false;
    });

    it('handles multiple migrations correctly', () => {
      const multipleMigrations = [
        mockMichiganMigration,
        {
          migrationDate: '2026-05-15',
          facilities: [
            { facilityId: '777', facilityName: 'Test VA Medical Center' },
          ],
        },
      ];

      expect(
        isFacilityTransitioning({
          facilityId: TRANSITIONING_FACILITY_ID,
          migrations: multipleMigrations,
        }),
      ).to.be.true;
      expect(
        isFacilityTransitioning({
          facilityId: '777',
          migrations: multipleMigrations,
        }),
      ).to.be.true;
      expect(
        isFacilityTransitioning({
          facilityId: '999',
          migrations: multipleMigrations,
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

    it('returns false when feature flag is disabled regardless of phase', () => {
      expect(
        shouldBlockRefills({
          prescription: mockPrescription,
          isFeatureFlagEnabled: false,
          migrations: [createMigrationWithPhase('p4')],
        }),
      ).to.be.false;
      expect(
        shouldBlockRefills({
          prescription: mockPrescription,
          isFeatureFlagEnabled: false,
          migrations: [createMigrationWithPhase('p5')],
        }),
      ).to.be.false;
      expect(
        shouldBlockRefills({
          prescription: mockPrescription,
          isFeatureFlagEnabled: false,
          migrations: [createMigrationWithPhase('p3')],
        }),
      ).to.be.false;
    });

    it('returns false for non-transitioning facilities even with flag enabled', () => {
      const nonTransitioningRx = {
        ...mockPrescription,
        stationNumber: NON_TRANSITIONING_FACILITY_ID,
      };
      expect(
        shouldBlockRefills({
          prescription: nonTransitioningRx,
          isFeatureFlagEnabled: true,
          migrations: [createMigrationWithPhase('p4')],
        }),
      ).to.be.false;
    });

    it('returns false for phases outside blocking window (p4, p5)', () => {
      const phases = ['p0', 'p1', 'p2', 'p3', 'p6', 'p7'];
      phases.forEach(phase => {
        expect(
          shouldBlockRefills({
            prescription: mockPrescription,
            isFeatureFlagEnabled: true,
            migrations: [createMigrationWithPhase(phase)],
          }),
        ).to.be.false;
      });
    });

    it('returns false when prescription has no stationNumber', () => {
      const rxWithoutStation = { ...mockPrescription, stationNumber: null };
      expect(
        shouldBlockRefills({
          prescription: rxWithoutStation,
          isFeatureFlagEnabled: true,
          migrations: [createMigrationWithPhase('p4')],
        }),
      ).to.be.false;
    });

    it('returns false when migrations array is empty or null', () => {
      expect(
        shouldBlockRefills({
          prescription: mockPrescription,
          isFeatureFlagEnabled: true,
          migrations: [],
        }),
      ).to.be.false;
      expect(
        shouldBlockRefills({
          prescription: mockPrescription,
          isFeatureFlagEnabled: true,
          migrations: null,
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

    it('returns false when feature flag is disabled regardless of phase', () => {
      expect(
        shouldBlockRenewals({
          prescription: mockPrescription,
          isFeatureFlagEnabled: false,
          migrations: [createMigrationWithPhase('p3')],
        }),
      ).to.be.false;
      expect(
        shouldBlockRenewals({
          prescription: mockPrescription,
          isFeatureFlagEnabled: false,
          migrations: [createMigrationWithPhase('p4')],
        }),
      ).to.be.false;
      expect(
        shouldBlockRenewals({
          prescription: mockPrescription,
          isFeatureFlagEnabled: false,
          migrations: [createMigrationWithPhase('p5')],
        }),
      ).to.be.false;
    });

    it('returns false for non-transitioning facilities even with flag enabled', () => {
      const nonTransitioningRx = {
        ...mockPrescription,
        stationNumber: NON_TRANSITIONING_FACILITY_ID,
      };
      expect(
        shouldBlockRenewals({
          prescription: nonTransitioningRx,
          isFeatureFlagEnabled: true,
          migrations: [createMigrationWithPhase('p4')],
        }),
      ).to.be.false;
    });

    it('returns false for phases outside blocking window (p3, p4, p5)', () => {
      const phases = ['p0', 'p1', 'p2', 'p6', 'p7'];
      phases.forEach(phase => {
        expect(
          shouldBlockRenewals({
            prescription: mockPrescription,
            isFeatureFlagEnabled: true,
            migrations: [createMigrationWithPhase(phase)],
          }),
        ).to.be.false;
      });
    });

    it('returns false when prescription has no stationNumber', () => {
      const rxWithoutStation = { ...mockPrescription, stationNumber: null };
      expect(
        shouldBlockRenewals({
          prescription: rxWithoutStation,
          isFeatureFlagEnabled: true,
          migrations: [createMigrationWithPhase('p4')],
        }),
      ).to.be.false;
    });

    it('returns false when migrations array is empty or null', () => {
      expect(
        shouldBlockRenewals({
          prescription: mockPrescription,
          isFeatureFlagEnabled: true,
          migrations: [],
        }),
      ).to.be.false;
      expect(
        shouldBlockRenewals({
          prescription: mockPrescription,
          isFeatureFlagEnabled: true,
          migrations: null,
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

    it('returns all prescriptions as available when feature flag is disabled', () => {
      const result = filterPrescriptionsByTransition({
        prescriptions: mockPrescriptions,
        isFeatureFlagEnabled: false,
        migrations: [createMigrationWithPhase('p4')],
      });
      expect(result.available).to.have.lengthOf(3);
      expect(result.blocked).to.have.lengthOf(0);
      expect(result.available).to.deep.equal(mockPrescriptions);
    });

    it('returns all prescriptions as available when feature flag is enabled but phase is not blocking', () => {
      const resultP1 = filterPrescriptionsByTransition({
        prescriptions: mockPrescriptions,
        isFeatureFlagEnabled: true,
        migrations: [createMigrationWithPhase('p1')],
      });
      expect(resultP1.available).to.have.lengthOf(3);
      expect(resultP1.blocked).to.have.lengthOf(0);

      const resultP6 = filterPrescriptionsByTransition({
        prescriptions: mockPrescriptions,
        isFeatureFlagEnabled: true,
        migrations: [createMigrationWithPhase('p6')],
      });
      expect(resultP6.available).to.have.lengthOf(3);
      expect(resultP6.blocked).to.have.lengthOf(0);
    });

    it('correctly blocks prescriptions from transitioning facilities in p4 phase', () => {
      const result = filterPrescriptionsByTransition({
        prescriptions: mockPrescriptions,
        isFeatureFlagEnabled: true,
        migrations: [createMigrationWithPhase('p4')],
      });
      expect(result.available).to.have.lengthOf(1);
      expect(result.blocked).to.have.lengthOf(2);
      expect(result.available[0].stationNumber).to.equal(
        NON_TRANSITIONING_FACILITY_ID,
      );
      expect(result.blocked.map(rx => rx.stationNumber)).to.include.members([
        TRANSITIONING_FACILITY_ID,
        TRANSITIONING_FACILITY_ID_2,
      ]);
    });

    it('correctly blocks prescriptions from transitioning facilities in p5 phase', () => {
      const result = filterPrescriptionsByTransition({
        prescriptions: mockPrescriptions,
        isFeatureFlagEnabled: true,
        migrations: [createMigrationWithPhase('p5')],
      });
      expect(result.available).to.have.lengthOf(1);
      expect(result.blocked).to.have.lengthOf(2);
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

    it('handles prescriptions with missing or invalid stationNumber', () => {
      const prescriptionsWithInvalidStation = [
        ...mockPrescriptions,
        { prescriptionId: 4, stationNumber: null, prescriptionName: 'MED D' },
        {
          prescriptionId: 5,
          stationNumber: undefined,
          prescriptionName: 'MED E',
        },
      ];

      const result = filterPrescriptionsByTransition({
        prescriptions: prescriptionsWithInvalidStation,
        isFeatureFlagEnabled: true,
        migrations: [createMigrationWithPhase('p4')],
      });

      expect(result.available).to.have.lengthOf(3);
      expect(result.blocked).to.have.lengthOf(2);
    });

    it('fails safe by returning all prescriptions as available when error occurs', () => {
      // Pass invalid data structure to trigger error handling
      const result = filterPrescriptionsByTransition({
        prescriptions: 'invalid',
        isFeatureFlagEnabled: true,
        migrations: [createMigrationWithPhase('p4')],
      });

      expect(result.available).to.deep.equal([]);
      expect(result.blocked).to.deep.equal([]);
    });

    it('handles multiple migrations with different facilities', () => {
      const multiMigration = [
        mockMichiganMigration,
        {
          migrationDate: '2026-05-15',
          facilities: [
            { facilityId: '888', facilityName: 'Another VA Medical Center' },
          ],
          phases: {
            current: 'p4',
            p4: 'May 12, 2026',
            p5: 'May 15, 2026',
            p6: 'May 17, 2026',
          },
        },
      ];

      const prescriptionsMultiFacility = [
        ...mockPrescriptions,
        {
          prescriptionId: 4,
          stationNumber: '888',
          prescriptionName: 'MEDICATION D',
        },
      ];

      const result = filterPrescriptionsByTransition({
        prescriptions: prescriptionsMultiFacility,
        isFeatureFlagEnabled: true,
        migrations: multiMigration,
      });

      expect(result.available).to.have.lengthOf(1);
      expect(result.blocked).to.have.lengthOf(3);
    });
  });
});
