// TODO: update this import path when we move into the simple-forms directory
import sinon from 'sinon';
import { testNumberOfWebComponentFields } from '../../../simple-forms/shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorName.pages.page1.schema,
  formConfig.chapters.sponsorName.pages.page1.uiSchema,
  3, // Expected number of fields
  'sponsor/veteran information', // Page title
);

// TODO: Test more pages in here

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorDateOfBirthAndDeath.pages.page6.schema,
  formConfig.chapters.sponsorDateOfBirthAndDeath.pages.page6.uiSchema,
  2,
  'sponsor date of birth and death',
);

// Verify that when the sponsor is deceased we get two more
// fields on the page (date of death and whether the veteran
// died in the line of duty.)
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorDateOfBirthAndDeath.pages.page6.schema,
  formConfig.chapters.sponsorDateOfBirthAndDeath.pages.page6.uiSchema,
  4,
  'sponsor date of birth and death',
  { sponsorIsDeceased: true }, // Data
);

describe('submit property of formConfig', () => {
  it('should be a promise', () => {
    const goToPathSpy = sinon.spy(formConfig.submit);
    formConfig.submit().then(() => {
      expect(goToPathSpy.called).to.be.true;
    });
  });
});
