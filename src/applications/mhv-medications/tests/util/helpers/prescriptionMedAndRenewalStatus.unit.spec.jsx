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
    // V2 statuses are returned by the API when both flags are enabled
    // The frontend uses refillStatus to look up definitions in pdfStatusDefinitionsV2
    // NOTE: Use curly apostrophes (') to match the constants file
    const V2_STATUS_DEFINITIONS = [
      {
        dispStatus: 'Active',
        refillStatus: 'active',
        includes: 'prescription you can fill at a local VA pharmacy',
      },
      {
        dispStatus: 'In progress',
        refillStatus: 'inprogress',
        includes: 'new prescription or a prescription',
      },
      {
        dispStatus: 'Inactive',
        refillStatus: 'inactive',
        includes: 'prescription you can no longer fill',
      },
      {
        dispStatus: 'Transferred',
        refillStatus: 'transferred',
        includes: 'prescription moved to VA',
      },
    ];

    it('should return formatted status string for regular prescription when BOTH CernerPilot AND V2StatusMapping flags are disabled', () => {
      const result = prescriptionMedAndRenewalStatus(
        mockPrescription,
        medStatusDisplayTypes.PRINT,
        false,
        false,
      );
      expect(result).to.be.a('string');
      expect(result).to.include('Active');
      // Should use V1 status definitions
      expect(result).to.not.include(
        'prescription you can fill at a local VA pharmacy',
      );
    });

    V2_STATUS_DEFINITIONS.forEach(({ dispStatus, refillStatus, includes }) => {
      it(`should use V2 definition for ${dispStatus} when BOTH CernerPilot AND V2StatusMapping flags are enabled`, () => {
        // API returns V2 status directly when both flags are enabled
        // refillStatus is used to look up the definition in pdfStatusDefinitionsV2
        const rx = { ...mockPrescription, dispStatus, refillStatus };
        const result = prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.PRINT,
          true, // isCernerPilot
          true, // isV2StatusMapping
        );
        expect(result).to.be.a('string');
        expect(result).to.include(dispStatus);
        expect(result).to.include(includes);
      });
    });

    it('should use V1 definition when only cernerPilot is enabled', () => {
      const rx = { ...mockPrescription, dispStatus: 'Active' };
      const result = prescriptionMedAndRenewalStatus(
        rx,
        medStatusDisplayTypes.PRINT,
        true, // isCernerPilot
        false, // isV2StatusMapping
      );
      expect(result).to.be.a('string');
      expect(result).to.include('Active');
      // Should NOT include V2 definition
      expect(result).to.not.include(
        'prescription you can fill at a local VA pharmacy',
      );
    });

    it('should use V1 definition when only v2StatusMapping is enabled', () => {
      const rx = { ...mockPrescription, dispStatus: 'Active' };
      const result = prescriptionMedAndRenewalStatus(
        rx,
        medStatusDisplayTypes.PRINT,
        false, // isCernerPilot
        true, // isV2StatusMapping
      );
      expect(result).to.be.a('string');
      expect(result).to.include('Active');
      // Should NOT include V2 definition
      expect(result).to.not.include(
        'prescription you can fill at a local VA pharmacy',
      );
    });

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
    // V2 statuses are returned by the API when both flags are enabled
    const V2_TXT_STATUS_DEFINITIONS = [
      {
        dispStatus: 'Active',
        refillStatus: 'active',
        includes: 'prescription you can fill at a local VA pharmacy',
      },
      {
        dispStatus: 'In progress',
        refillStatus: 'inprogress',
        includes: 'new prescription or a prescription',
      },
      {
        dispStatus: 'Inactive',
        refillStatus: 'inactive',
        includes: 'prescription you can no longer fill',
      },
      {
        dispStatus: 'Transferred',
        refillStatus: 'transferred',
        includes: 'prescription moved to VA',
      },
    ];

    it('should return formatted status string for regular prescription when BOTH CernerPilot AND V2StatusMapping flags are disabled', () => {
      const result = prescriptionMedAndRenewalStatus(
        mockPrescription,
        medStatusDisplayTypes.TXT,
        false,
        false,
      );
      expect(result).to.be.a('string');
      expect(result).to.include('Active');
      // Should use standard format with dispStatus prefix
      expect(result).to.match(/^Active - /);
    });

    V2_TXT_STATUS_DEFINITIONS.forEach(
      ({ dispStatus, refillStatus, includes }) => {
        it(`should use V2 definition for ${dispStatus} in TXT format when BOTH flags are enabled`, () => {
          const rx = { ...mockPrescription, dispStatus, refillStatus };
          const result = prescriptionMedAndRenewalStatus(
            rx,
            medStatusDisplayTypes.TXT,
            true,
            true,
          );
          expect(result).to.be.a('string');
          expect(result).to.include(dispStatus);
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

    it('should handle multiline status definitions when BOTH flags are enabled', () => {
      const rx = {
        ...mockPrescription,
        dispStatus: 'Active',
        refillStatus: 'active',
      };
      const result = prescriptionMedAndRenewalStatus(
        rx,
        medStatusDisplayTypes.TXT,
        true,
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
