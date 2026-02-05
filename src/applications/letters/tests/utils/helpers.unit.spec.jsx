import { expect } from 'chai';
import { render } from '@testing-library/react';

import { ADDRESS_TYPES_ALTERNATE } from '@@vap-svc/constants';

import {
  getBenefitOptionText,
  resetDisallowedAddressFields,
  isAddressEmpty,
  stripOffTime,
} from '../../utils/helpers';

const address = {
  countryName: 'USA',
  addressOne: '123 Main St N',
  stateCode: 'MA',
  zipCode: '12345',
  type: ADDRESS_TYPES_ALTERNATE.domestic,
  city: 'Bygtowne',
};

describe('Letters helpers: ', () => {
  describe('getBenefitOptionText', () => {
    // The following tests check for options that should be available / not available given certain conditions
    it('should be defined for both veterans and dependents', () => {
      ['hasChapter35Eligibility'].forEach(option => {
        expect(getBenefitOptionText(option, true, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, true, false)).not.to.be.undefined;
      });
    });

    it('should only be defined for veterans', () => {
      [
        'hasNonServiceConnectedPension',
        'hasServiceConnectedDisabilities',
        'hasAdaptedHousing',
        'hasIndividualUnemployabilityGranted',
        'hasSpecialMonthlyCompensation',
      ].forEach(option => {
        expect(getBenefitOptionText(option, true, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, true, false)).to.be.undefined;
      });
    });

    it('should only be defined for dependents', () => {
      [
        'hasSurvivorsIndemnityCompensationAward',
        'hasSurvivorsPensionAward',
        'hasDeathResultOfDisability',
      ].forEach(option => {
        expect(getBenefitOptionText(option, true, true)).to.be.undefined;
        expect(getBenefitOptionText(option, true, false)).not.to.be.undefined;
      });
    });

    it('should only be defined for veterans if value is true', () => {
      [
        'hasNonServiceConnectedPension',
        'hasAdaptedHousing',
        'hasIndividualUnemployabilityGranted',
        'hasSpecialMonthlyCompensation',
      ].forEach(option => {
        expect(getBenefitOptionText(option, true, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, false, true)).to.be.undefined;
      });
    });

    it('should only be defined for dependents if value is true', () => {
      [
        'hasSurvivorsIndemnityCompensationAward',
        'hasSurvivorsPensionAward',
      ].forEach(option => {
        expect(getBenefitOptionText(option, true, false)).not.to.be.undefined;
        expect(getBenefitOptionText(option, false, false)).to.be.undefined;
      });
    });

    it('should be defined whether value is true or false', () => {
      // For both veterans and dependents
      ['hasChapter35Eligibility'].forEach(option => {
        expect(getBenefitOptionText(option, true, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, false, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, true, false)).not.to.be.undefined;
        expect(getBenefitOptionText(option, false, false)).not.to.be.undefined;
      });
      // For veterans only
      ['hasServiceConnectedDisabilities'].forEach(option => {
        expect(getBenefitOptionText(option, true, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, false, true)).not.to.be.undefined;
      });
      // For dependents only
      ['hasDeathResultOfDisability'].forEach(option => {
        expect(getBenefitOptionText(option, true, false)).not.to.be.undefined;
        expect(getBenefitOptionText(option, false, false)).not.to.be.undefined;
      });
    });

    // Special cases for non-boolean options
    it('should never be defined', () => {
      expect(
        getBenefitOptionText(
          'awardEffectiveDate',
          '1965-01-01T05:00:00.000+00:00',
          true,
        ),
      ).to.be.undefined;
      expect(getBenefitOptionText('awardEffectiveDate', undefined, true)).to.be
        .undefined;
    });

    it('should only be defined if value is valid', () => {
      ['monthlyAwardAmount', 'serviceConnectedPercentage'].forEach(option => {
        expect(getBenefitOptionText(option, 0, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, 20, true)).not.to.be.undefined;
        expect(getBenefitOptionText(option, undefined, true)).to.be.undefined;
        expect(getBenefitOptionText(option, null, true)).to.be.undefined;
      });
    });

    it('should include the awardEffectiveDate in the text for monthlyAward', () => {
      const { container } = render(
        getBenefitOptionText(
          'monthlyAwardAmount',
          20,
          true,
          '1965-01-01T05:00:00.000+00:00',
        ),
      );
      expect(container.textContent).to.contain('The effective date');
    });
  });

  describe('resetDisallowedAddressFields', () => {
    it('should clear state and zipCode for international addresses', () => {
      const internationalAddress = {
        ...address,
        type: ADDRESS_TYPES_ALTERNATE.international,
      };
      const resetAddress = resetDisallowedAddressFields(internationalAddress);

      expect(resetAddress.state).to.equal('');
      expect(resetAddress.zipCode).to.equal('');
    });
  });

  // Check empty address parameters
  describe('isAddressEmpty', () => {
    expect(isAddressEmpty({})).to.be.true;
    // type & countryName are ignored
    expect(isAddressEmpty({ type: 'foo', countryName: 'bar' })).to.be.true;
    expect(isAddressEmpty({ foo: 'bar' })).to.be.false;
  });

  // reset time to midnight
  describe('stripOffTime', () => {
    it('should return an empty string', () => {
      expect(stripOffTime()).to.equal('');
      expect(stripOffTime('')).to.equal('');
      expect(stripOffTime(null)).to.equal('');
    });
    it('should replace time offsets with all zeros', () => {
      expect(stripOffTime('2017-12-01T06:00:00.000+00:00')).to.equal(
        '2017-12-01',
      );
      expect(stripOffTime('1965-01-01T06:00:00.000+00:00')).to.equal(
        '1965-01-01',
      );
      expect(stripOffTime('1972-10-01T05:00:00.000+00:00')).to.equal(
        '1972-10-01',
      );
    });
  });
});
