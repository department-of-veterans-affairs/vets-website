import { expect } from 'chai';
import _ from 'lodash/fp';
import SkinDeep from 'skin-deep';

import { ADDRESS_TYPES, MILITARY_STATES } from '../../../src/js/letters/utils/constants';

import {
  getBenefitOptionText,
  inferAddressType,
  resetDisallowedAddressFields
} from '../../../src/js/letters/utils/helpers';

const address = {
  countryName: 'USA',
  addressOne: '123 Main St N',
  stateCode: 'MA',
  zipCode: '12345',
  type: ADDRESS_TYPES.domestic,
  city: 'Bygtowne'
};

describe('Letters helpers: ', () => {
  describe('getBenefitOptionText', () => {
    // The following tests check for options that should be available / not available given certain conditions
    it('should be defined for both veterans and dependents', () => {
      _.forEach(option => {
        expect(getBenefitOptionText(option, true, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, true, false)).not.to.be.undefined;
      }, ['hasChapter35Eligibility']);
    });

    it('should only be defined for veterans', () => {
      _.forEach(option => {
        expect(getBenefitOptionText(option, true, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, true, false)).to.be.undefined;
      }, ['hasNonServiceConnectedPension', 'hasServiceConnectedDisabilities', 'hasAdaptedHousing', 'hasIndividualUnemployabilityGranted', 'hasSpecialMonthlyCompensation']);
    });

    it('should only be defined for dependents', () => {
      _.forEach(option => {
        expect(getBenefitOptionText(option, true, true)).to.be.undefined;
        expect(getBenefitOptionText(option, true, false)).not.to.be.undefined;
      }, ['hasSurvivorsIndemnityCompensationAward', 'hasSurvivorsPensionAward', 'hasDeathResultOfDisability']);
    });

    it('should only be defined for veterans if value is true', () => {
      _.forEach(option => {
        expect(getBenefitOptionText(option, true, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, false, true)).to.be.undefined;
      }, ['hasNonServiceConnectedPension', 'hasAdaptedHousing', 'hasIndividualUnemployabilityGranted', 'hasSpecialMonthlyCompensation']);
    });

    it('should only be defined for dependents if value is true', () => {
      _.forEach(option => {
        expect(getBenefitOptionText(option, true, false)).not.to.be.undefined;
        expect(getBenefitOptionText(option, false, false)).to.be.undefined;
      }, ['hasSurvivorsIndemnityCompensationAward', 'hasSurvivorsPensionAward']);
    });

    it('should be defined whether value is true or false', () => {
      // For both veterans and dependents
      _.forEach(option => {
        expect(getBenefitOptionText(option, true, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, false, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, true, false)).not.to.be.undefined;
        expect(getBenefitOptionText(option, false, false)).not.to.be.undefined;
      }, ['hasChapter35Eligibility']);
      // For veterans only
      _.forEach(option => {
        expect(getBenefitOptionText(option, true, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, false, true)).not.to.be.undefined;
      }, ['hasServiceConnectedDisabilities']);
      // For dependents only
      _.forEach(option => {
        expect(getBenefitOptionText(option, true, false)).not.to.be.undefined;
        expect(getBenefitOptionText(option, false, false)).not.to.be.undefined;
      }, ['hasDeathResultOfDisability']);
    });

    // Special cases for non-boolean options
    it('should never be defined', () => {
      expect(getBenefitOptionText('awardEffectiveDate', '1965-01-01T05:00:00.000+00:00', true)).to.be.undefined;
      expect(getBenefitOptionText('awardEffectiveDate', undefined, true)).to.be.undefined;
    });

    it('should only be defined if value is valid', () => {
      _.forEach(option => {
        expect(getBenefitOptionText(option, 20, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, undefined, true)).to.be.undefined;
        expect(getBenefitOptionText(option, 'unavailable', true)).to.be.undefined;
      }, ['monthlyAwardAmount', 'serviceConnectedPercentage']);
    });

    it('should include the awardEffectiveDate in the text for monthlyAward', () => {
      const tree = SkinDeep.shallowRender(getBenefitOptionText('monthlyAwardAmount', 20, true));
      expect(tree.text()).to.contain('The effective date');
    });
  });

  /*
  describe('getStateName', () => {
    // Seems kind of pointless...
    it('should return valid state names', () => {});

    // Can we really test for this?
    it('should send an error to sentry if the state code is unknown', () => {});
  });
  */

  describe('inferAddressType', () => {
    it('should set the type to international if USA isn\'t selected', () => {
      const newAddress = Object.assign({}, address, { countryName: 'Uganda' });
      expect(inferAddressType(newAddress).type).to.equal(ADDRESS_TYPES.international);
    });

    it('should set the type to military if a military stateCode is chosen', () => {
      const newAddress = Object.assign({}, address);
      Array.from(MILITARY_STATES).forEach(code => {
        newAddress.stateCode = code;
        expect(inferAddressType(newAddress).type).to.equal(ADDRESS_TYPES.military);
      });
    });

    it('should set the type to domestic if none of the above are true', () => {
      expect(inferAddressType(address).type).to.equal(ADDRESS_TYPES.domestic);
    });
  });

  describe('resetDisallowedAddressFields', () => {
    it('should clear state and zipCode for international addresses', () => {
      const internationalAddress = Object.assign({}, address, { type: ADDRESS_TYPES.international });
      const resetAddress = resetDisallowedAddressFields(internationalAddress);

      expect(resetAddress.state).to.equal('');
      expect(resetAddress.zipCode).to.equal('');
    });
  });
});

