import { expect } from 'chai';
import { getInsuranceSrLabel } from '../../../../utils/helpers/insurance';
import content from '../../../../locales/en/content.json';

describe('ezr insurance information helpers', () => {
  context('when `getInsuranceSrLabel` executes', () => {
    context('when the provider name does not exist in the form data', () => {
      it('should return the generic label string', () => {
        const formData = {};
        expect(getInsuranceSrLabel(formData)).to.equal(
          content['insurance-policy-generic-label'],
        );
      });
    });

    context('when the provider name exists in the form data', () => {
      it('should return a string with the provider name included', () => {
        const formData = { insuranceName: 'Aetna' };
        expect(getInsuranceSrLabel(formData)).to.contain(
          formData.insuranceName,
        );
      });
    });

    context('when the policy number does not exist in the form data', () => {
      it('should return a string that does not contain reference to the policy number', () => {
        const formData = { insuranceName: 'Aetna' };
        expect(getInsuranceSrLabel(formData)).to.not.contain(
          content['insurance-policy-number-label'],
        );
      });
    });

    context('when the policy number exists in the form data', () => {
      it('should return a properly-formatted string with the policy number referenced', () => {
        const formData = {
          insuranceName: 'Aetna',
          insurancePolicyNumber: '005588',
        };
        expect(getInsuranceSrLabel(formData)).to.equal(
          `${formData.insuranceName}, ${
            content['insurance-policy-number-label']
          } ${formData.insurancePolicyNumber}`,
        );
      });
    });

    context('when group code does not exist in the form data', () => {
      it('should return a string that does not contain reference to the group code', () => {
        const formData = { insuranceName: 'Aetna' };
        expect(getInsuranceSrLabel(formData)).to.not.contain(
          content['insurance-group-code-label'],
        );
      });
    });

    context('when group code exists in the form data', () => {
      it('should return a properly-formatted string with the group code referenced', () => {
        const formData = {
          insuranceName: 'Aetna',
          insuranceGroupCode: '005588',
        };
        expect(getInsuranceSrLabel(formData)).to.equal(
          `${formData.insuranceName}, ${
            content['insurance-group-code-label']
          } ${formData.insuranceGroupCode}`,
        );
      });
    });
  });
});
