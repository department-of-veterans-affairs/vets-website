import { expect } from 'chai';
import { testNumberOfWebComponentFields } from '../../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../../config/form';
import mockData from '../../e2e/fixtures/data/test-data.json';

// Call the depends() function for any page that relies on it
describe('dependent page logic', () => {
  it('should be called', () => {
    let depCount = 0;

    Object.keys(formConfig.chapters).forEach(ch => {
      Object.keys(formConfig.chapters[`${ch}`].pages).forEach(pg => {
        const { depends } = formConfig.chapters[`${ch}`].pages[`${pg}`];
        if (depends) {
          depends({ data: '' });
          depCount += 1;
        }
      });
    });

    expect(depCount > 0).to.be.true;
  });
});

describe('Beneficiary information', () => {
  const { pages } = formConfig.chapters.beneficiaryInformation;

  testNumberOfWebComponentFields(
    formConfig,
    pages.beneficiaryName.schema,
    pages.beneficiaryName.uiSchema,
    4,
    'Beneficiary name',
    { ...mockData.data },
  );

  testNumberOfWebComponentFields(
    formConfig,
    pages.beneficiaryIdentityInfo.schema,
    pages.beneficiaryIdentityInfo.uiSchema,
    1,
    'Beneficiary identification information',
    { ...mockData.data },
  );

  testNumberOfWebComponentFields(
    formConfig,
    pages.beneficiaryAddress.schema,
    pages.beneficiaryAddress.uiSchema,
    9,
    'Beneficiary mailing address',
    { ...mockData.data },
  );

  testNumberOfWebComponentFields(
    formConfig,
    pages.beneficiaryContactInfo.schema,
    pages.beneficiaryContactInfo.uiSchema,
    2,
    'Beneficiary contact information',
    { ...mockData.data },
  );

  testNumberOfWebComponentFields(
    formConfig,
    pages.beneficiaryBirthSex.schema,
    pages.beneficiaryBirthSex.uiSchema,
    1,
    'Beneficiary birth sex',
    { ...mockData.data },
  );

  testNumberOfWebComponentFields(
    formConfig,
    pages.beneficiaryAge.schema,
    pages.beneficiaryAge.uiSchema,
    1,
    'Beneficiary age',
    { ...mockData.data },
  );
});

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.formSignature.pages.formSignature.schema,
  formConfig.chapters.formSignature.pages.formSignature.uiSchema,
  1,
  'Form signature page',
  { ...mockData.data },
);
