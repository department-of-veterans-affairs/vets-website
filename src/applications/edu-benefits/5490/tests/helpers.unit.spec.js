import { expect } from 'chai';
import formConfig from '../config/form';
import { eighteenOrOver, transform } from '../helpers';

describe('5490 helpers', () => {
  describe('transform', () => {
    const getForm = serialized => {
      return JSON.parse(JSON.parse(serialized).educationBenefitsClaim.form);
    };

    it('does not transform veteranDateOfDeath for chapter 35 benefit', () => {
      const transformed = transform(formConfig, {
        data: {
          benefit: 'chapter35',
          sponsorStatus: 'powOrMia',
          'view:sponsorDateListedMiaOrPow': '1999-01-01',
        },
      });
      expect(getForm(transformed)).to.not.have.property('veteranDateOfDeath');
    });
    it('does not set veteranDateOfDeath with no sponsorStatus', () => {
      const transformed = transform(formConfig, {
        data: {
          benefit: 'chapter33',
          'view:sponsorDateListedMiaOrPow': '1999-01-01',
        },
      });
      expect(getForm(transformed)).to.not.have.property('veteranDateOfDeath');
    });
    it('sets veteranDateOfDeath as view:sponsorDateListedMiaOrPow for sponsorStatus of powOrMia', () => {
      const formData = {
        data: {
          benefit: 'chapter33',
          sponsorStatus: 'powOrMia',
          'view:sponsorDateListedMiaOrPow': '1999-01-01',
        },
      };
      const transformed = transform(formConfig, formData);
      expect(getForm(transformed).veteranDateOfDeath).to.eq(
        formData.data['view:sponsorDateListedMiaOrPow'],
      );
    });
    it('sets veteranDateOfDeath as view:sponsorDateOfDeath for sponsorStatus of diedOnDuty', () => {
      const formData = {
        data: {
          benefit: 'chapter33',
          sponsorStatus: 'diedOnDuty',
          'view:sponsorDateOfDeath': '1999-01-01',
        },
      };
      const transformed = transform(formConfig, formData);
      expect(getForm(transformed).veteranDateOfDeath).to.eq(
        formData.data['view:sponsorDateOfDeath'],
      );
    });
    it('sets veteranDateOfDeath as view:sponsorDateOfDeath for sponsorStatus of diedFromDisabilityOrOnReserve', () => {
      const formData = {
        data: {
          benefit: 'chapter33',
          sponsorStatus: 'diedFromDisabilityOrOnReserve',
          'view:sponsorDateOfDeath': '1999-01-01',
        },
      };
      const transformed = transform(formConfig, formData);
      expect(getForm(transformed).veteranDateOfDeath).to.eq(
        formData.data['view:sponsorDateOfDeath'],
      );
    });
  });
  describe('eighteenOrOver', () => {
    it('validate all possible paths', () => {
      const veteranDateOfBirth = eighteenOrOver('1980-01-01');
      expect(veteranDateOfBirth).to.be.true;
    });
  });
});
