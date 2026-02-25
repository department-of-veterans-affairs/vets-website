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
  describe('isFacilityTransitioning - checks if a facility is part of an Oracle Health EHR migration', () => {
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

    it('returns true for Ann Arbor VA (506)', () => {
      expect(
        isFacilityTransitioning({
          facilityId: '506',
          migrations: [mockMichiganMigration],
        }),
      ).to.be.true;
    });

    it('returns true for Battle Creek VA (515)', () => {
      expect(
        isFacilityTransitioning({
          facilityId: '515',
          migrations: [mockMichiganMigration],
        }),
      ).to.be.true;
    });

    it('returns true for Aleda E. Lutz VA (553)', () => {
      expect(
        isFacilityTransitioning({
          facilityId: '553',
          migrations: [mockMichiganMigration],
        }),
      ).to.be.true;
    });

    it('returns true for John D. Dingell VA (585)', () => {
      expect(
        isFacilityTransitioning({
          facilityId: '585',
          migrations: [mockMichiganMigration],
        }),
      ).to.be.true;
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

  // Shared helper to test common edge cases for blocking functions.
  // Keeps DRY without using forEach — each caller writes explicit phase tests.
  const expectBlockingEdgeCases = (fn, blockingPhase) => {
    it('returns false for non-transitioning facilities', () => {
      const nonTransitioningRx = {
        ...mockPrescription,
        stationNumber: NON_TRANSITIONING_FACILITY_ID,
      };
      expect(
        fn({
          prescription: nonTransitioningRx,
          isFeatureFlagEnabled: true,
          migrations: [createMigrationWithPhase(blockingPhase)],
        }),
      ).to.be.false;
    });

    it('returns false when prescription has no stationNumber', () => {
      const rxWithoutStation = { ...mockPrescription, stationNumber: null };
      expect(
        fn({
          prescription: rxWithoutStation,
          isFeatureFlagEnabled: true,
          migrations: [createMigrationWithPhase(blockingPhase)],
        }),
      ).to.be.false;
    });

    it('returns false when migrations array is empty or null', () => {
      expect(
        fn({
          prescription: mockPrescription,
          isFeatureFlagEnabled: true,
          migrations: [],
        }),
      ).to.be.false;
      expect(
        fn({
          prescription: mockPrescription,
          isFeatureFlagEnabled: true,
          migrations: null,
        }),
      ).to.be.false;
    });
  };

  describe('shouldBlockRefills - determines if a prescription refill should be blocked during Oracle Health EHR transition', () => {
    describe('when mhvMedicationsOracleHealthCutover feature flag is enabled', () => {
      it('returns true when facility is transitioning and in p4 phase', () => {
        expect(
          shouldBlockRefills({
            prescription: mockPrescription,
            isFeatureFlagEnabled: true,
            migrations: [createMigrationWithPhase('p4')],
          }),
        ).to.be.true;
      });

      it('returns true when facility is transitioning and in p5 phase', () => {
        expect(
          shouldBlockRefills({
            prescription: mockPrescription,
            isFeatureFlagEnabled: true,
            migrations: [createMigrationWithPhase('p5')],
          }),
        ).to.be.true;
      });

      it('returns false in non-blocking p1 phase', () => {
        expect(
          shouldBlockRefills({
            prescription: mockPrescription,
            isFeatureFlagEnabled: true,
            migrations: [createMigrationWithPhase('p1')],
          }),
        ).to.be.false;
      });

      it('returns false in non-blocking p3 phase', () => {
        expect(
          shouldBlockRefills({
            prescription: mockPrescription,
            isFeatureFlagEnabled: true,
            migrations: [createMigrationWithPhase('p3')],
          }),
        ).to.be.false;
      });

      it('returns false in non-blocking p6 phase', () => {
        expect(
          shouldBlockRefills({
            prescription: mockPrescription,
            isFeatureFlagEnabled: true,
            migrations: [createMigrationWithPhase('p6')],
          }),
        ).to.be.false;
      });

      expectBlockingEdgeCases(shouldBlockRefills, 'p4');
    });

    describe('when mhvMedicationsOracleHealthCutover feature flag is disabled', () => {
      it('returns false even during blocking phase p4', () => {
        expect(
          shouldBlockRefills({
            prescription: mockPrescription,
            isFeatureFlagEnabled: false,
            migrations: [createMigrationWithPhase('p4')],
          }),
        ).to.be.false;
      });
    });
  });

  describe('shouldBlockRenewals - determines if a prescription renewal should be blocked during Oracle Health EHR transition', () => {
    describe('when mhvMedicationsOracleHealthCutover feature flag is enabled', () => {
      it('returns true when facility is transitioning and in p3 phase', () => {
        expect(
          shouldBlockRenewals({
            prescription: mockPrescription,
            isFeatureFlagEnabled: true,
            migrations: [createMigrationWithPhase('p3')],
          }),
        ).to.be.true;
      });

      it('returns true when facility is transitioning and in p4 phase', () => {
        expect(
          shouldBlockRenewals({
            prescription: mockPrescription,
            isFeatureFlagEnabled: true,
            migrations: [createMigrationWithPhase('p4')],
          }),
        ).to.be.true;
      });

      it('returns true when facility is transitioning and in p5 phase', () => {
        expect(
          shouldBlockRenewals({
            prescription: mockPrescription,
            isFeatureFlagEnabled: true,
            migrations: [createMigrationWithPhase('p5')],
          }),
        ).to.be.true;
      });

      it('returns false in non-blocking p1 phase', () => {
        expect(
          shouldBlockRenewals({
            prescription: mockPrescription,
            isFeatureFlagEnabled: true,
            migrations: [createMigrationWithPhase('p1')],
          }),
        ).to.be.false;
      });

      it('returns false in non-blocking p6 phase', () => {
        expect(
          shouldBlockRenewals({
            prescription: mockPrescription,
            isFeatureFlagEnabled: true,
            migrations: [createMigrationWithPhase('p6')],
          }),
        ).to.be.false;
      });

      expectBlockingEdgeCases(shouldBlockRenewals, 'p4');
    });

    describe('when mhvMedicationsOracleHealthCutover feature flag is disabled', () => {
      it('returns false even during blocking phase p4', () => {
        expect(
          shouldBlockRenewals({
            prescription: mockPrescription,
            isFeatureFlagEnabled: false,
            migrations: [createMigrationWithPhase('p4')],
          }),
        ).to.be.false;
      });
    });
  });

  describe('filterPrescriptionsByTransition - splits prescriptions into available and blocked arrays based on facility transition status', () => {
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

    describe('when mhvMedicationsOracleHealthCutover feature flag is enabled', () => {
      it('returns all prescriptions as available when phase is not blocking', () => {
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

    describe('when mhvMedicationsOracleHealthCutover feature flag is disabled', () => {
      it('returns all prescriptions as available regardless of phase', () => {
        const result = filterPrescriptionsByTransition({
          prescriptions: mockPrescriptions,
          isFeatureFlagEnabled: false,
          migrations: [createMigrationWithPhase('p4')],
        });
        expect(result.available).to.have.lengthOf(3);
        expect(result.blocked).to.have.lengthOf(0);
        expect(result.available).to.deep.equal(mockPrescriptions);
      });
    });
  });
});
