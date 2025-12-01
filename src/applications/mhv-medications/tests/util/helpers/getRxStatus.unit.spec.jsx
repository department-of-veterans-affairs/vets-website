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

    it('should return old status when Cerner pilot is disabled', () => {
      const rx = { ...mockRx, dispStatus: 'Active: Refill in Process' };
      const result = getRxStatus(rx, false);
      expect(result).to.equal('Active: Refill in Process');
    });

    it('should return V2 status when Cerner pilot is enabled', () => {
      const rx = { ...mockRx, dispStatus: 'Active: Refill in Process' };
      const result = getRxStatus(rx, true);
      expect(result).to.equal('In progress');
    });

    it('should return FIELD_NONE_NOTED when dispStatus is missing', () => {
      const rx = { prescriptionSource: 'VA' };
      const result = getRxStatus(rx, false);
      expect(result).to.equal(FIELD_NONE_NOTED);
    });

    it('should map various statuses correctly for Cerner pilot', () => {
      const testCases = [
        { input: 'Active: Submitted', expected: 'In progress' },
        { input: 'Active: On Hold', expected: 'Inactive' },
        { input: 'Active: Parked', expected: 'Active' },
        { input: 'Expired', expected: 'Inactive' },
        { input: 'Discontinued', expected: 'Inactive' },
        { input: 'Transferred', expected: 'Transferred' },
        { input: 'NewOrder', expected: 'In progress' },
        { input: 'Renew', expected: 'In progress' },
        { input: 'Unknown', expected: 'Status not available' },
      ];

      testCases.forEach(({ input, expected }) => {
        const rx = { ...mockRx, dispStatus: input };
        const result = getRxStatus(rx, true);
        expect(result).to.equal(expected, `Failed for status: ${input}`);
      });
    });

    it('should return FIELD_NONE_NOTED as-is regardless of pilot flag', () => {
      const rx = { dispStatus: FIELD_NONE_NOTED, prescriptionSource: 'VA' };
      expect(getRxStatus(rx, false)).to.equal(FIELD_NONE_NOTED);
      expect(getRxStatus(rx, true)).to.equal(FIELD_NONE_NOTED);
    });
  });

  describe('getStatusDefinitions', () => {
    it('should return definitions when Cerner pilot is disabled', () => {
      const result = getStatusDefinitions(false);
      expect(result).to.deep.equal(pdfStatusDefinitions);
    });

    it('should return V2 definitions when Cerner pilot is enabled', () => {
      const result = getStatusDefinitions(true);
      expect(result).to.deep.equal(pdfStatusDefinitionsV2);
    });
  });

  describe('getPdfStatusDefinitionKey', () => {
    it('should return refillStatus when provided', () => {
      const result = getPdfStatusDefinitionKey('Active', 'refillable');
      expect(result).to.equal('refillable');
    });

    it('should return dispStatus when refillStatus is not provided', () => {
      const result = getPdfStatusDefinitionKey('Active', null);
      expect(result).to.equal('Active');
    });

    it('should return dispStatus when refillStatus is undefined', () => {
      const result = getPdfStatusDefinitionKey('Active', undefined);
      expect(result).to.equal('Active');
    });
  });

  describe('getFilterOptions', () => {
    it('should return standard filter options when Cerner pilot is disabled', () => {
      const result = getFilterOptions(false);
      expect(result).to.deep.equal(filterOptions);
    });

    it('should return V2 filter options when Cerner pilot is enabled', () => {
      const result = getFilterOptions(true);
      expect(result).to.deep.equal(filterOptionsV2);
    });
  });
});
