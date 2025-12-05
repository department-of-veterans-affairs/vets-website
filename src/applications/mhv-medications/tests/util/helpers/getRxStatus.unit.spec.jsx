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
    it('should return refillStatus when provided and CernerPilot is disabled', () => {
      const result = getPdfStatusDefinitionKey('Active', 'refillable', false);
      expect(result).to.equal('refillable');
    });

    it('should return dispStatus when refillStatus is not provided and CernerPilot is disabled', () => {
      const result = getPdfStatusDefinitionKey('Active', null, false);
      expect(result).to.equal('Active');
    });

    it('should return dispStatus when refillStatus is undefined and CernerPilot is disabled', () => {
      const result = getPdfStatusDefinitionKey('Active', undefined, false);
      expect(result).to.equal('Active');
    });

    it('should map V1 keys to V2 keys when CernerPilot is enabled', () => {
      const testCases = [
        { v1Key: 'refillinprocess', v2Expected: 'inprogress' },
        { v1Key: 'submitted', v2Expected: 'inprogress' },
        { v1Key: 'expired', v2Expected: 'inactive' },
        { v1Key: 'discontinued', v2Expected: 'inactive' },
        { v1Key: 'hold', v2Expected: 'inactive' },
        { v1Key: 'activeParked', v2Expected: 'active' },
        { v1Key: 'transferred', v2Expected: 'transferred' },
        { v1Key: 'unknown', v2Expected: 'unknown' },
      ];

      testCases.forEach(({ v1Key, v2Expected }) => {
        const result = getPdfStatusDefinitionKey('Active', v1Key, true);
        expect(result).to.equal(v2Expected, `Failed for key: ${v1Key}`);
      });
    });

    it('should return original key when no mapping exists in V2 mode', () => {
      const result = getPdfStatusDefinitionKey(
        'Active',
        'someUnknownKey',
        true,
      );
      expect(result).to.equal('someUnknownKey');
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
