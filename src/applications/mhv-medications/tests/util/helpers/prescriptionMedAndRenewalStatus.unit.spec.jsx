import { expect } from 'chai';
import { prescriptionMedAndRenewalStatus } from '../../../util/helpers/prescriptionMedAndRenewalStatus';
import {
  medStatusDisplayTypes,
  RX_SOURCE,
  DISPENSE_STATUS,
} from '../../../util/constants';

describe('prescriptionMedAndRenewalStatus helper', () => {
  const mockPrescription = {
    prescriptionId: '123456',
    prescriptionName: 'Test Medication',
    dispStatus: 'Active',
    refillStatus: 'refillable',
    prescriptionSource: 'VA',
  };

  const mockPendingMed = {
    ...mockPrescription,
    prescriptionSource: RX_SOURCE.PENDING_DISPENSE,
    dispStatus: DISPENSE_STATUS.NEW_ORDER,
  };

  const mockPendingRenewal = {
    ...mockPrescription,
    prescriptionSource: RX_SOURCE.PENDING_DISPENSE,
    dispStatus: DISPENSE_STATUS.RENEW,
  };

  describe('when prescription is null or undefined', () => {
    it('should return null for null prescription', () => {
      const result = prescriptionMedAndRenewalStatus(
        null,
        medStatusDisplayTypes.PRINT,
      );
      expect(result).to.be.null;
    });

    it('should return null for undefined prescription', () => {
      const result = prescriptionMedAndRenewalStatus(
        undefined,
        medStatusDisplayTypes.PRINT,
      );
      expect(result).to.be.null;
    });
  });

  describe('VA_PRESCRIPTION display type', () => {
    it('should return StatusDropdown for regular prescription', () => {
      const result = prescriptionMedAndRenewalStatus(
        mockPrescription,
        medStatusDisplayTypes.VA_PRESCRIPTION,
      );
      // Result should be a React element (StatusDropdown component)
      expect(result).to.not.be.null;
      expect(result.type.name).to.equal('StatusDropdown');
    });

    it('should return pending med text for pending medications', () => {
      const result = prescriptionMedAndRenewalStatus(
        mockPendingMed,
        medStatusDisplayTypes.VA_PRESCRIPTION,
      );
      // Result should be a React element with pending med text
      expect(result).to.not.be.null;
      expect(result.props.children).to.include(
        'This is a new prescription from your provider',
      );
    });

    it('should return pending renewal text for pending renewals', () => {
      const result = prescriptionMedAndRenewalStatus(
        mockPendingRenewal,
        medStatusDisplayTypes.VA_PRESCRIPTION,
      );
      // Result should be a React element with pending renewal text
      expect(result).to.not.be.null;
      expect(result.props['data-testid']).to.equal('pending-renewal-status');
    });
  });

  describe('PRINT display type', () => {
    const V2_STATUS_MAPPINGS = [
      {
        dispStatus: 'Active',
        refillStatus: 'active',
        expectedV2: 'Active',
        includes: 'prescription you can fill at a local VA pharmacy',
      },
      {
        dispStatus: 'Active: Refill in Process',
        refillStatus: 'inprogress',
        expectedV2: 'In progress',
        includes: 'new prescription or a prescription',
      },
      {
        dispStatus: 'Expired',
        refillStatus: 'inactive',
        expectedV2: 'Inactive',
        includes: 'prescription you can no longer fill',
      },
      {
        dispStatus: 'Discontinued',
        refillStatus: 'inactive',
        expectedV2: 'Inactive',
        includes: 'prescription you can no longer fill',
      },
    ];

    it('should return formatted status string for regular prescription when Cerner pilot is disabled', () => {
      const result = prescriptionMedAndRenewalStatus(
        mockPrescription,
        medStatusDisplayTypes.PRINT,
        false,
      );
      expect(result).to.be.a('string');
      expect(result).to.include('Active');
      // Should use standard status definitions
      expect(result).to.not.include(
        'prescription you can fill at a local VA pharmacy',
      );
    });

    V2_STATUS_MAPPINGS.forEach(
      ({ dispStatus, refillStatus, expectedV2, includes }) => {
        it(`should map ${dispStatus} to ${expectedV2} when Cerner pilot is enabled`, () => {
          const rx = { ...mockPrescription, dispStatus, refillStatus };
          const result = prescriptionMedAndRenewalStatus(
            rx,
            medStatusDisplayTypes.PRINT,
            true,
          );
          expect(result).to.be.a('string');
          expect(result).to.include(expectedV2);
          expect(result).to.include(includes);
        });
      },
    );

    it('should return pending med text for pending medications', () => {
      const result = prescriptionMedAndRenewalStatus(
        mockPendingMed,
        medStatusDisplayTypes.PRINT,
      );
      expect(result).to.include(
        'This is a new prescription from your provider',
      );
    });

    it('should return pending renewal text for pending renewals', () => {
      const result = prescriptionMedAndRenewalStatus(
        mockPendingRenewal,
        medStatusDisplayTypes.PRINT,
      );
      expect(result).to.include('This is a renewal you requested');
    });
  });

  describe('TXT display type', () => {
    const V2_TXT_STATUS_MAPPINGS = [
      {
        dispStatus: 'Active',
        refillStatus: 'active',
        expectedV2: 'Active',
        includes: 'prescription you can fill at a local VA pharmacy',
      },
      {
        dispStatus: 'Active: Submitted',
        refillStatus: 'inprogress',
        expectedV2: 'In progress',
        includes: 'new prescription or a prescription',
      },
      {
        dispStatus: 'Expired',
        refillStatus: 'inactive',
        expectedV2: 'Inactive',
        includes: 'prescription you can no longer fill',
      },
      {
        dispStatus: 'Transferred',
        refillStatus: 'transferred',
        expectedV2: 'Transferred',
        includes: 'prescription moved to VA',
      },
    ];

    it('should return formatted status string for regular prescription when Cerner pilot is disabled', () => {
      const result = prescriptionMedAndRenewalStatus(
        mockPrescription,
        medStatusDisplayTypes.TXT,
        false,
      );
      expect(result).to.be.a('string');
      expect(result).to.include('Active');
      // Should use standard format with dispStatus prefix
      expect(result).to.match(/^Active - /);
    });

    V2_TXT_STATUS_MAPPINGS.forEach(
      ({ dispStatus, refillStatus, expectedV2, includes }) => {
        it(`should map ${dispStatus} to ${expectedV2} in TXT format when Cerner pilot is enabled`, () => {
          const rx = { ...mockPrescription, dispStatus, refillStatus };
          const result = prescriptionMedAndRenewalStatus(
            rx,
            medStatusDisplayTypes.TXT,
            true,
          );
          expect(result).to.be.a('string');
          expect(result).to.include(expectedV2);
          expect(result).to.include(includes);
        });
      },
    );

    it('should return pending med text for pending medications', () => {
      const result = prescriptionMedAndRenewalStatus(
        mockPendingMed,
        medStatusDisplayTypes.TXT,
      );
      expect(result).to.include(
        'This is a new prescription from your provider',
      );
    });

    it('should return pending renewal text for pending renewals', () => {
      const result = prescriptionMedAndRenewalStatus(
        mockPendingRenewal,
        medStatusDisplayTypes.TXT,
      );
      expect(result).to.include('This is a renewal you requested');
    });

    it('should handle multiline status definitions for Cerner pilot', () => {
      const rx = {
        ...mockPrescription,
        dispStatus: 'Active',
        refillStatus: 'active',
      };
      const result = prescriptionMedAndRenewalStatus(
        rx,
        medStatusDisplayTypes.TXT,
        true,
      );
      expect(result).to.be.a('string');
      expect(result).to.include('Active');
      // Should include both parts of the V2 definition
      expect(result).to.include(
        'prescription you can fill at a local VA pharmacy',
      );
      expect(result).to.include('If you need a medication immediately');
    });
  });

  describe('unknown display type', () => {
    it('should return null for unknown display type', () => {
      const result = prescriptionMedAndRenewalStatus(
        mockPrescription,
        'UNKNOWN_TYPE',
      );
      expect(result).to.be.null;
    });
  });
});
