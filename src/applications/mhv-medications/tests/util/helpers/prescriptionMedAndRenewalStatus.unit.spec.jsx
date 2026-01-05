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
    describe('when both CernerPilot and V2StatusMapping flags disabled', () => {
      const cernerPilotFlag = false;
      const v2StatusMappingFlag = false;

      it('should return formatted status string for regular prescription', () => {
        const result = prescriptionMedAndRenewalStatus(
          mockPrescription,
          medStatusDisplayTypes.PRINT,
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.be.a('string');
        expect(result).to.include('Active');
        // Should use V1 status definitions
        expect(result).to.not.include(
          'prescription you can fill at a local VA pharmacy',
        );
      });
    });

    describe('when only cernerPilot enabled', () => {
      const cernerPilotFlag = true;
      const v2StatusMappingFlag = false;

      it('should use V1 definition', () => {
        const rx = { ...mockPrescription, dispStatus: 'Active' };
        const result = prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.PRINT,
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.be.a('string');
        expect(result).to.include('Active');
        expect(result).to.not.include(
          'prescription you can fill at a local VA pharmacy',
        );
      });
    });

    describe('when only v2StatusMapping enabled', () => {
      const cernerPilotFlag = false;
      const v2StatusMappingFlag = true;

      it('should use V1 definition', () => {
        const rx = { ...mockPrescription, dispStatus: 'Active' };
        const result = prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.PRINT,
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.be.a('string');
        expect(result).to.include('Active');
        expect(result).to.not.include(
          'prescription you can fill at a local VA pharmacy',
        );
      });
    });

    describe('when both CernerPilot and V2StatusMapping flags enabled', () => {
      const cernerPilotFlag = true;
      const v2StatusMappingFlag = true;

      it('should use V2 definition for Active', () => {
        const rx = {
          ...mockPrescription,
          dispStatus: 'Active',
          refillStatus: 'active',
        };
        const result = prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.PRINT,
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.be.a('string');
        expect(result).to.include('Active');
        expect(result).to.include(
          'prescription you can fill at a local VA pharmacy',
        );
      });

      it('should use V2 definition for In progress', () => {
        const rx = {
          ...mockPrescription,
          dispStatus: 'In progress',
          refillStatus: 'inprogress',
        };
        const result = prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.PRINT,
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.be.a('string');
        expect(result).to.include('In progress');
        expect(result).to.include('new prescription or a prescription');
      });

      it('should use V2 definition for Inactive', () => {
        const rx = {
          ...mockPrescription,
          dispStatus: 'Inactive',
          refillStatus: 'inactive',
        };
        const result = prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.PRINT,
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.be.a('string');
        expect(result).to.include('Inactive');
        expect(result).to.include('prescription you can no longer fill');
      });

      it('should use V2 definition for Transferred', () => {
        const rx = {
          ...mockPrescription,
          dispStatus: 'Transferred',
          refillStatus: 'transferred',
        };
        const result = prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.PRINT,
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.be.a('string');
        expect(result).to.include('Transferred');
        expect(result).to.include('prescription moved to VA');
      });

      it('should use V2 definition for Status not available', () => {
        const rx = {
          ...mockPrescription,
          dispStatus: 'Status not available',
          refillStatus: 'statusNotAvailable',
        };
        const result = prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.PRINT,
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.be.a('string');
        expect(result).to.include('Status not available');
        expect(result).to.include('There’s a problem with our system');
      });
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
    describe('when both cernerPilot and v2StatusMapping flags disabled', () => {
      const cernerPilotFlag = false;
      const v2StatusMappingFlag = false;

      it('should return formatted status string for regular prescription', () => {
        const result = prescriptionMedAndRenewalStatus(
          mockPrescription,
          medStatusDisplayTypes.TXT,
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.be.a('string');
        expect(result).to.include('Active');
        // Should use standard format with dispStatus prefix
        expect(result).to.match(/^Active - /);
      });
    });

    describe('when both cernerPilot and V2StatusMapping flags enabled', () => {
      const cernerPilotFlag = true;
      const v2StatusMappingFlag = true;

      it('should use V2 definition for Active', () => {
        const rx = {
          ...mockPrescription,
          dispStatus: 'Active',
          refillStatus: 'active',
        };
        const result = prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.TXT,
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.be.a('string');
        expect(result).to.include('Active');
        expect(result).to.include(
          'prescription you can fill at a local VA pharmacy',
        );
      });

      it('should use V2 definition for In progress', () => {
        const rx = {
          ...mockPrescription,
          dispStatus: 'In progress',
          refillStatus: 'inprogress',
        };
        const result = prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.TXT,
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.be.a('string');
        expect(result).to.include('In progress');
        expect(result).to.include('new prescription or a prescription');
      });

      it('should use V2 definition for Inactive', () => {
        const rx = {
          ...mockPrescription,
          dispStatus: 'Inactive',
          refillStatus: 'inactive',
        };
        const result = prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.TXT,
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.be.a('string');
        expect(result).to.include('Inactive');
        expect(result).to.include('prescription you can no longer fill');
      });

      it('should use V2 definition for Transferred', () => {
        const rx = {
          ...mockPrescription,
          dispStatus: 'Transferred',
          refillStatus: 'transferred',
        };
        const result = prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.TXT,
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.be.a('string');
        expect(result).to.include('Transferred');
        expect(result).to.include('prescription moved to VA');
      });

      it('should use V2 definition for Status not available', () => {
        const rx = {
          ...mockPrescription,
          dispStatus: 'Status not available',
          refillStatus: 'statusNotAvailable',
        };
        const result = prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.TXT,
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.be.a('string');
        expect(result).to.include('Status not available');
        expect(result).to.include('There’s a problem with our system');
      });

      it('should handle multiline status definitions', () => {
        const rx = {
          ...mockPrescription,
          dispStatus: 'Active',
          refillStatus: 'active',
        };
        const result = prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.TXT,
          cernerPilotFlag,
          v2StatusMappingFlag,
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
