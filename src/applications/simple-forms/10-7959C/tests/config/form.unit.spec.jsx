// TODO: update this import path when we move into the simple-forms directory
import sinon from 'sinon';
import { testNumberOfWebComponentFields } from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.chapter1.pages.page1.schema,
  formConfig.chapters.chapter1.pages.page1.uiSchema,
  3, // Expected number of fields
  'Beneficiary Name', // Page title
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.chapter2.pages.page5.schema,
  formConfig.chapters.chapter2.pages.page5.uiSchema,
  3, // Expected number of fields
  'Medicare Part A Information', // Page title
  { hasMedicarePartA: true },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.chapter2.pages.page6.schema,
  formConfig.chapters.chapter2.pages.page6.uiSchema,
  3, // Expected number of fields
  'Medicare Part B Information', // Page title
  { hasMedicarePartB: true },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.chapter2.pages.page7.schema,
  formConfig.chapters.chapter2.pages.page7.uiSchema,
  4, // Expected number of fields
  'Medicare Part D Information', // Page title
  { hasMedicarePartD: true },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.chapter2.pages.page8.schema,
  formConfig.chapters.chapter2.pages.page8.uiSchema,
  2, // Expected number of fields
  'Medicare Coverage Details', // Page title
  { hasMedicarePartA: true }, // TODO: doesn't work
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.chapter3.pages.page9.schema,
  formConfig.chapters.chapter3.pages.page9.uiSchema,
  1, // Expected number of fields
  'Other Health Insurance (OHI)', // Page title
  { hasOtherHealthInsurance: true },
);

// TODO: Test more pages in here

/*
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
*/

describe('submit property of formConfig', () => {
  it('should be a promise', () => {
    const goToPathSpy = sinon.spy(formConfig.submit);
    formConfig.submit().then(() => {
      expect(goToPathSpy.called).to.be.true;
    });
  });
});
