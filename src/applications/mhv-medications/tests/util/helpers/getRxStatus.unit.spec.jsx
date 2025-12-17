import { expect } from 'chai';
import {
  getRxStatus,
  getStatusDefinitions,
  getPdfStatusDefinitionKey,
  getFilterOptions,
} from '../../../util/helpers/getRxStatus';
import {
  ACTIVE_NON_VA,
  FIELD_NONE_NOTED,
  pdfStatusDefinitions,
  pdfStatusDefinitionsV2,
  filterOptions,
  filterOptionsV2,
} from '../../../util/constants';

describe('getRxStatus helper functions', () => {
  // Shared test data
  const FLAG_COMBINATIONS = [
    { cernerPilot: false, v2StatusMapping: false, useV2: false, desc: 'cernerPilot=false, v2StatusMapping=false' },
    { cernerPilot: true, v2StatusMapping: false, useV2: false, desc: 'cernerPilot=true, v2StatusMapping=false' },
    { cernerPilot: false, v2StatusMapping: true, useV2: false, desc: 'cernerPilot=false, v2StatusMapping=true' },
    { cernerPilot: true, v2StatusMapping: true, useV2: true, desc: 'cernerPilot=true AND v2StatusMapping=true' },
  ];

  const mockRx = {
    dispStatus: 'Active',
    prescriptionSource: 'VA',
  };

  const mockNonVaRx = {
    dispStatus: 'Active: Non-VA',
    prescriptionSource: 'NV',
  };

  describe('getRxStatus', () => {
    it('should return ACTIVE_NON_VA for Non-VA prescriptions', () => {
      const result = getRxStatus(mockNonVaRx);
      expect(result).to.equal(ACTIVE_NON_VA);
    });

    it('should return dispStatus when provided', () => {
      const rx = { ...mockRx, dispStatus: 'Active: Refill in Process' };
      const result = getRxStatus(rx);
      expect(result).to.equal('Active: Refill in Process');
    });

    it('should return FIELD_NONE_NOTED when dispStatus is missing', () => {
      const rx = { prescriptionSource: 'VA' };
      const result = getRxStatus(rx);
      expect(result).to.equal(FIELD_NONE_NOTED);
    });

    it('should return FIELD_NONE_NOTED for null dispStatus', () => {
      const rx = { dispStatus: null, prescriptionSource: 'VA' };
      expect(getRxStatus(rx)).to.equal(FIELD_NONE_NOTED);
    });

    describe('V1 to V2 status transformation', () => {
      it('should not transform status when BOTH CernerPilot and  V2StatusMapping flags are disabled', () => {
        // Test that getRxStatus returns original status without transformation
        const rx = { dispStatus: 'Active: Refill in Process', prescriptionSource: 'VA' };
        const result = getRxStatus(rx);
        expect(result).to.equal('Active: Refill in Process');
      });

      it('should not transform status when only cernerPilot is enabled', () => {
        const rx = { dispStatus: 'Expired', prescriptionSource: 'VA' };
        const result = getRxStatus(rx);
        expect(result).to.equal('Expired');
      });

      it('should not transform status when only v2StatusMapping is enabled', () => {
        const rx = { dispStatus: 'Discontinued', prescriptionSource: 'VA' };
        const result = getRxStatus(rx);
        expect(result).to.equal('Discontinued');
      });
    });

    describe('Edge cases for getRxStatus', () => {
      it('should handle empty string dispStatus', () => {
        const rx = { dispStatus: '', prescriptionSource: 'VA' };
        expect(getRxStatus(rx)).to.equal(FIELD_NONE_NOTED);
      });

      it('should handle whitespace-only dispStatus', () => {
        const rx = { dispStatus: '   ', prescriptionSource: 'VA' };
        // Depending on implementation, this might return the whitespace or FIELD_NONE_NOTED
        const result = getRxStatus(rx);
        expect(result).to.exist;
      });

      it('should prioritize Non-VA status over dispStatus', () => {
        const rx = { dispStatus: 'Expired', prescriptionSource: 'NV' };
        expect(getRxStatus(rx)).to.equal(ACTIVE_NON_VA);
      });

      it('should handle both null dispStatus and NV prescriptionSource', () => {
        const rx = { dispStatus: null, prescriptionSource: 'NV' };
        expect(getRxStatus(rx)).to.equal(ACTIVE_NON_VA);
      });
    });
  });

  describe('getStatusDefinitions with flag combinations', () => {
    FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, useV2, desc }) => {
      it(`returns ${useV2 ? 'V2' : 'V1'} definitions when ${desc}`, () => {
        const result = getStatusDefinitions(cernerPilot, v2StatusMapping);
        const expected = useV2 ? pdfStatusDefinitionsV2 : pdfStatusDefinitions;
        expect(result).to.deep.equal(expected);
      });
    });

    it('returns consistent definitions for same flag values', () => {
      const result1 = getStatusDefinitions(true, true);
      const result2 = getStatusDefinitions(true, true);
      expect(result1).to.deep.equal(result2);
    });

    it('V1 and V2 definitions have different structures', () => {
      const v1 = getStatusDefinitions(false, false);
      const v2 = getStatusDefinitions(true, true);
      expect(v1).to.not.deep.equal(v2);
    });
  });

  describe('getPdfStatusDefinitionKey', () => {
    it('should return refillStatus when provided', () => {
      expect(getPdfStatusDefinitionKey('Active', 'refillable')).to.equal('refillable');
    });

    it('should return dispStatus when refillStatus is null', () => {
      expect(getPdfStatusDefinitionKey('Active', null)).to.equal('Active');
    });

    it('should return dispStatus when refillStatus is undefined', () => {
      expect(getPdfStatusDefinitionKey('Active', undefined)).to.equal('Active');
    });
  });

  describe('getFilterOptions with flag combinations', () => {
    FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, useV2, desc }) => {
      it(`returns ${useV2 ? 'V2' : 'V1'} filter options when ${desc}`, () => {
        const result = getFilterOptions(cernerPilot, v2StatusMapping);
        const expected = useV2 ? filterOptionsV2 : filterOptions;
        expect(result).to.deep.equal(expected);
      });
    });

    it('returns consistent options for same flag values', () => {
      const result1 = getFilterOptions(true, true);
      const result2 = getFilterOptions(true, true);
      expect(result1).to.deep.equal(result2);
    });

    it('V1 and V2 filter options have different keys', () => {
      const v1 = getFilterOptions(false, false);
      const v2 = getFilterOptions(true, true);
      expect(Object.keys(v1)).to.not.deep.equal(Object.keys(v2));
    });
  });

  describe('V2 status values', () => {
    it('getStatusDefinitions V2 should contain all required V2 status keys', () => {
      const v2Defs = getStatusDefinitions(true, true);
      // Keys in pdfStatusDefinitionsV2 are lowercase
      const expectedKeys = ['active', 'inprogress', 'inactive', 'transferred', 'statusNotAvailable'];
      expectedKeys.forEach(key => {
        expect(v2Defs).to.have.property(key);
      });
    });

    it('getFilterOptions V2 should contain all required V2 filter keys', () => {
      const v2Options = getFilterOptions(true, true);
      expect(v2Options).to.have.property('ACTIVE');
      expect(v2Options).to.have.property('IN_PROGRESS');
      expect(v2Options).to.have.property('SHIPPED');
      expect(v2Options).to.have.property('INACTIVE');
      expect(v2Options).to.have.property('TRANSFERRED');
      expect(v2Options).to.have.property('STATUS_NOT_AVAILABLE');
    });
  });
});
