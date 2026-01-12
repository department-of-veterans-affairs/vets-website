import { expect } from 'chai';
import sinon from 'sinon';
import * as transformHelpers from 'platform/forms-system/src/js/helpers';
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
});
