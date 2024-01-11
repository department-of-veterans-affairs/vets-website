import sinon from 'sinon';
import { expect } from 'chai';
import { testNumberOfWebComponentFields } from '../../../../simple-forms/shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page7.schema,
  formConfig.chapters.sponsorInformation.pages.page7.uiSchema,
  2,
  "Sponsor's phone number continued",
  { sponsorIsDeceased: false },
);

describe('submit property of formConfig', () => {
  it('should be a promise', () => {
    const goToPathSpy = sinon.spy(formConfig.submit);
    formConfig.submit().then(() => {
      expect(goToPathSpy.called).to.be.true;
    });
  });
});
