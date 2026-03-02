import { expect } from 'chai';
import sinon from 'sinon';
import * as transformHelpers from 'platform/forms-system/src/js/helpers';
import * as transformers from '../../utils/transformers';
import { transform } from '../../config/submit-transformer';
import completedForm from '../fixtures/mocks/completed-form.json';

describe('Survivors Benefits submit transformer', () => {
  let transformForSubmitStub;
  beforeEach(() => {
    transformForSubmitStub = sinon
      .stub(transformHelpers, 'transformForSubmit')
      .callsFake((formConfig, form) => {
        return JSON.stringify({
          ...form,
        });
      });
  });

  afterEach(() => {
    transformForSubmitStub.restore();
  });
  it('should truncate middle names to initials in veteran and claimant full names', () => {
    const formConfig = {}; // Mock or import your formConfig as needed
    const transformed = JSON.parse(transform(formConfig, completedForm));
    const form = JSON.parse(transformed.survivorsBenefitsClaim.form);

    expect(form.veteranFullName.middle).to.equal('K');
    expect(form.claimantFullName.middle).to.equal('M');
  });
  it('should split SSN field correctly', () => {
    const formConfig = {}; // Mock or import your formConfig as needed
    const transformed = JSON.parse(transform(formConfig, completedForm));
    const form = JSON.parse(transformed.survivorsBenefitsClaim.form);

    expect(form.veteranSocialSecurityNumber).to.equal('321313311');
  });

  describe('feature flag - unit name and address transformation', () => {
    let buildUnitAddressStub;
    let combineUnitNameAddressStub;

    beforeEach(() => {
      // Stub both functions to pass through the data
      buildUnitAddressStub = sinon
        .stub(transformers, 'buildUnitAddress')
        .callsFake(data => data);
      combineUnitNameAddressStub = sinon
        .stub(transformers, 'combineUnitNameAddress')
        .callsFake(data => data);
    });

    afterEach(() => {
      buildUnitAddressStub.restore();
      combineUnitNameAddressStub.restore();
    });

    it('should call buildUnitAddress when use2025Version is true', () => {
      const formConfig = {};
      const formData = {
        data: {
          ...completedForm.data,
          survivorsBenefitsForm2025VersionEnabled: true,
        },
      };

      transform(formConfig, formData);

      expect(buildUnitAddressStub.calledOnce).to.be.true;
      expect(combineUnitNameAddressStub.called).to.be.false;
    });

    it('should call combineUnitNameAddress when use2025Version is false', () => {
      const formConfig = {};
      const formData = {
        data: {
          ...completedForm.data,
          survivorsBenefitsForm2025VersionEnabled: false,
        },
      };

      transform(formConfig, formData);

      expect(combineUnitNameAddressStub.calledOnce).to.be.true;
      expect(buildUnitAddressStub.called).to.be.false;
    });

    it('should call combineUnitNameAddress when use2025Version is undefined', () => {
      const formConfig = {};
      const formData = {
        data: {
          ...completedForm.data,
        },
      };
      // Ensure flag is not set
      delete formData.data.survivorsBenefitsForm2025VersionEnabled;

      transform(formConfig, formData);

      expect(combineUnitNameAddressStub.calledOnce).to.be.true;
      expect(buildUnitAddressStub.called).to.be.false;
    });
  });
});
