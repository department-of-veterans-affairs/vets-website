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

    it('should not transform status when both cernerPilot and v2StatusMapping flags are disabled', () => {
      const rx = {
        dispStatus: 'Active: Refill in Process',
        prescriptionSource: 'VA',
      };
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

    describe('Edge cases for getRxStatus', () => {
      it('should handle empty string dispStatus', () => {
        const rx = { dispStatus: '', prescriptionSource: 'VA' };
        expect(getRxStatus(rx)).to.equal(FIELD_NONE_NOTED);
      });

      it('should handle whitespace-only dispStatus', () => {
        const rx = { dispStatus: '   ', prescriptionSource: 'VA' };
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

  describe('getStatusDefinitions', () => {
    describe('when both cernerPilot and v2StatusMapping flags are disabled', () => {
      const cernerPilotFlag = false;
      const v2StatusMappingFlag = false;

      it('returns V1 status definitions', () => {
        const result = getStatusDefinitions(
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.deep.equal(pdfStatusDefinitions);
      });

      it('includes V1-specific keys', () => {
        const result = getStatusDefinitions(
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.have.property('active');
        expect(result).to.have.property('refillinprocess');
        expect(result).to.have.property('activeParked');
        expect(result).to.have.property('submitted');
        expect(result).to.have.property('expired');
        expect(result).to.have.property('discontinued');
      });
    });

    describe('when only cernerPilot is enabled', () => {
      const cernerPilotFlag = true;
      const v2StatusMappingFlag = false;

      it('returns V1 status definitions', () => {
        const result = getStatusDefinitions(
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.deep.equal(pdfStatusDefinitions);
      });

      it('includes V1-specific keys', () => {
        const result = getStatusDefinitions(
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.have.property('refillinprocess');
        expect(result).to.have.property('expired');
        expect(result).to.have.property('discontinued');
      });
    });

    describe('when only v2StatusMapping is enabled', () => {
      const cernerPilotFlag = false;
      const v2StatusMappingFlag = true;

      it('returns V1 status definitions', () => {
        const result = getStatusDefinitions(
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.deep.equal(pdfStatusDefinitions);
      });

      it('includes V1-specific keys', () => {
        const result = getStatusDefinitions(
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.have.property('refillinprocess');
        expect(result).to.have.property('discontinued');
        expect(result).to.have.property('hold');
      });
    });

    describe('when both cernerPilot and v2StatusMapping flags are enabled', () => {
      const cernerPilotFlag = true;
      const v2StatusMappingFlag = true;

      it('returns V2 status definitions', () => {
        const result = getStatusDefinitions(
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.deep.equal(pdfStatusDefinitionsV2);
      });

      it('includes V2-specific keys with lowercase format', () => {
        const result = getStatusDefinitions(
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.have.property('active');
        expect(result).to.have.property('inprogress');
        expect(result).to.have.property('inactive');
        expect(result).to.have.property('transferred');
        expect(result).to.have.property('statusNotAvailable');
      });

      it('does not include V1-specific keys', () => {
        const result = getStatusDefinitions(
          cernerPilotFlag,
          v2StatusMappingFlag,
        );
        expect(result).to.not.have.property('refillinprocess');
        expect(result).to.not.have.property('activeParked');
        expect(result).to.not.have.property('expired');
        expect(result).to.not.have.property('discontinued');
        expect(result).to.not.have.property('hold');
      });
    });
  });

  describe('getPdfStatusDefinitionKey', () => {
    it('should return refillStatus when provided', () => {
      expect(getPdfStatusDefinitionKey('Active', 'refillable')).to.equal(
        'refillable',
      );
    });

    it('should return dispStatus when refillStatus is null', () => {
      expect(getPdfStatusDefinitionKey('Active', null)).to.equal('Active');
    });

    it('should return dispStatus when refillStatus is undefined', () => {
      expect(getPdfStatusDefinitionKey('Active', undefined)).to.equal('Active');
    });
  });

  describe('getFilterOptions', () => {
    describe('when both CernerPilot and v2StatusMapping flags are disabled', () => {
      const cernerPilotFlag = false;
      const v2StatusMappingFlag = false;

      it('returns V1 filter options', () => {
        const result = getFilterOptions(cernerPilotFlag, v2StatusMappingFlag);
        expect(result).to.deep.equal(filterOptions);
      });

      it('includes V1-specific filter keys', () => {
        const result = getFilterOptions(cernerPilotFlag, v2StatusMappingFlag);
        expect(result).to.have.property('ALL_MEDICATIONS');
        expect(result).to.have.property('ACTIVE');
        expect(result).to.have.property('RECENTLY_REQUESTED');
        expect(result).to.have.property('RENEWAL');
        expect(result).to.have.property('NON_ACTIVE');
      });
    });

    describe('when only cernerPilot is enabled', () => {
      const cernerPilotFlag = true;
      const v2StatusMappingFlag = false;

      it('returns V1 filter options with V2-compatible renewal URL', () => {
        const result = getFilterOptions(cernerPilotFlag, v2StatusMappingFlag);
        expect(result).to.have.property('RENEWAL');
        expect(result.RENEWAL.label).to.equal(filterOptions.RENEWAL.label);
        expect(result.RENEWAL.url).to.equal(filterOptionsV2.RENEWABLE.url);
      });

      it('includes V1-specific filter keys', () => {
        const result = getFilterOptions(cernerPilotFlag, v2StatusMappingFlag);
        expect(result).to.have.property('ACTIVE');
        expect(result).to.have.property('RECENTLY_REQUESTED');
        expect(result).to.have.property('NON_ACTIVE');
      });

      it('preserves V1 labels and descriptions for non-renewal filters', () => {
        const result = getFilterOptions(cernerPilotFlag, v2StatusMappingFlag);
        expect(result.ACTIVE).to.deep.equal(filterOptions.ACTIVE);
        expect(result.NON_ACTIVE).to.deep.equal(filterOptions.NON_ACTIVE);
      });
    });

    describe('when only v2StatusMapping is enabled', () => {
      const cernerPilotFlag = false;
      const v2StatusMappingFlag = true;

      it('returns V1 filter options', () => {
        const result = getFilterOptions(cernerPilotFlag, v2StatusMappingFlag);
        expect(result).to.deep.equal(filterOptions);
      });

      it('includes V1-specific filter keys', () => {
        const result = getFilterOptions(cernerPilotFlag, v2StatusMappingFlag);
        expect(result).to.have.property('RENEWAL');
        expect(result).to.have.property('NON_ACTIVE');
      });
    });

    describe('when both CernerPilot and v2StatusMapping flags are enabled', () => {
      const cernerPilotFlag = true;
      const v2StatusMappingFlag = true;

      it('returns V2 filter options', () => {
        const result = getFilterOptions(cernerPilotFlag, v2StatusMappingFlag);
        expect(result).to.deep.equal(filterOptionsV2);
      });

      it('includes V2-specific filter keys', () => {
        const result = getFilterOptions(cernerPilotFlag, v2StatusMappingFlag);
        expect(result).to.have.property('ALL_MEDICATIONS');
        expect(result).to.have.property('ACTIVE');
        expect(result).to.have.property('IN_PROGRESS');
        expect(result).to.have.property('SHIPPED');
        expect(result).to.have.property('INACTIVE');
        expect(result).to.have.property('TRANSFERRED');
        expect(result).to.have.property('STATUS_NOT_AVAILABLE');
      });

      it('does not include V1-specific keys', () => {
        const result = getFilterOptions(cernerPilotFlag, v2StatusMappingFlag);
        expect(result).to.not.have.property('RECENTLY_REQUESTED');
        expect(result).to.not.have.property('NON_ACTIVE');
      });
    });
  });
});
