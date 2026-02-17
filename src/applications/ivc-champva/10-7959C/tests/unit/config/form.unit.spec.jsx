import { expect } from 'chai';
import { testNumberOfWebComponentFields } from '../../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../../config/form';
import mockData from '../../e2e/fixtures/data/test-data.json';
import maxData from '../../e2e/fixtures/data/maximal-test.json';

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

// Call the title fn for any page that has a computed title
// NOTE: if mockData.data doesn't have all the properties accessed by your
// titles, this test will fail and point you to the title with the property
// that is missing.
describe('title text logic', () => {
  it('should be called', () => {
    let titleCount = 0;

    Object.keys(formConfig.chapters).forEach(ch => {
      Object.keys(formConfig.chapters[`${ch}`].pages).forEach(pg => {
        const { title } = formConfig.chapters[`${ch}`].pages[`${pg}`];
        if (typeof title === 'function') {
          title({ data: mockData.data });
          titleCount += 1;
        }
      });
    });

    expect(titleCount > 0).to.be.true;
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
  formConfig.chapters.medicareInformation.pages.hasMedicareAB.schema,
  formConfig.chapters.medicareInformation.pages.hasMedicareAB.uiSchema,
  1,
  'Applicant has medicare AB',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.medicareInformation.pages.medicareClass.schema,
  formConfig.chapters.medicareInformation.pages.medicareClass.uiSchema,
  1,
  'Applicant medicare class (coverage)',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.medicareInformation.pages.partACarrier.schema,
  formConfig.chapters.medicareInformation.pages.partACarrier.uiSchema,
  2,
  'Applicant medicare A carrier',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.medicareInformation.pages.medicareABCards.schema,
  formConfig.chapters.medicareInformation.pages.medicareABCards.uiSchema,
  0,
  'Applicant medicare AB cards',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.medicareInformation.pages.partBCarrier.schema,
  formConfig.chapters.medicareInformation.pages.partBCarrier.uiSchema,
  2,
  'Applicant medicare B carrier',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.medicareInformation.pages.pharmacyBenefits.schema,
  formConfig.chapters.medicareInformation.pages.pharmacyBenefits.uiSchema,
  1,
  'Applicant medicare pharmacy benefits',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.medicareInformation.pages.hasMedicareD.schema,
  formConfig.chapters.medicareInformation.pages.hasMedicareD.uiSchema,
  1,
  'Applicant has medicare D',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.medicareInformation.pages.partDCarrier.schema,
  formConfig.chapters.medicareInformation.pages.partDCarrier.uiSchema,
  2,
  'Applicant medicare D carrier',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.medicareInformation.pages.medicareDCards.schema,
  formConfig.chapters.medicareInformation.pages.medicareDCards.uiSchema,
  0,
  'Applicant medicare D cards',
  { ...mockData.data },
);

describe('Medicare part D screen depends function', () => {
  it('should return true if applicant has Medicare parts A, B, and D', () => {
    const depRes =
      formConfig.chapters.medicareInformation.pages.partDCarrier.depends({
        applicantMedicareStatus: true,
        applicantMedicareStatusD: true,
      });
    expect(depRes).to.be.true;
  });
});

describe('Medicare part D upload screen depends function', () => {
  it('should return true if applicant has Medicare parts A, B, and D', () => {
    const depRes =
      formConfig.chapters.medicareInformation.pages.medicareDCards.depends({
        applicantMedicareStatus: true,
        applicantMedicareStatusD: true,
      });
    expect(depRes).to.be.true;
  });
});

describe('Healthcare Medigap screens depends functions', () => {
  it('should return true if applicant has primary insurance and Medigap', () => {
    const depRes =
      formConfig.chapters.healthcareInformation.pages.primaryMedigap.depends({
        applicantHasPrimary: true,
        applicantPrimaryInsuranceType: 'medigap',
      });
    expect(depRes).to.be.true;
  });

  it('should return true if applicant has secondary insurance and Medigap', () => {
    const depRes =
      formConfig.chapters.healthcareInformation.pages.secondaryMedigap.depends({
        applicantHasPrimary: true,
        applicantHasSecondary: true,
        applicantSecondaryInsuranceType: 'medigap',
      });
    expect(depRes).to.be.true;
  });
});

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.hasPrimaryHealthInsurance
    .schema,
  formConfig.chapters.healthcareInformation.pages.hasPrimaryHealthInsurance
    .uiSchema,
  1,
  'Applicant has primary healthcare',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.hasSecondaryHealthInsurance
    .schema,
  formConfig.chapters.healthcareInformation.pages.hasSecondaryHealthInsurance
    .uiSchema,
  1,
  'Applicant has secondary healthcare',
  { applicantHasSecondary: true },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.primaryProvider.schema,
  formConfig.chapters.healthcareInformation.pages.primaryProvider.uiSchema,
  3,
  'Applicant has primary provider',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.primaryThroughEmployer.schema,
  formConfig.chapters.healthcareInformation.pages.primaryThroughEmployer
    .uiSchema,
  1,
  'Applicant primary through employer',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.primaryPrescription.schema,
  formConfig.chapters.healthcareInformation.pages.primaryPrescription.uiSchema,
  1,
  'Applicant primary prescription coverage',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.primaryEob.schema,
  formConfig.chapters.healthcareInformation.pages.primaryEob.uiSchema,
  1,
  'Applicant primary provides EOB',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.primaryType.schema,
  formConfig.chapters.healthcareInformation.pages.primaryType.uiSchema,
  1,
  'Applicant primary insurance type',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.secondaryType.schema,
  formConfig.chapters.healthcareInformation.pages.secondaryType.uiSchema,
  1,
  'Applicant secondary insurance type',
  { ...maxData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.primaryMedigap.schema,
  formConfig.chapters.healthcareInformation.pages.primaryMedigap.uiSchema,
  1,
  'Applicant primary Medigap type',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.secondaryMedigap.schema,
  formConfig.chapters.healthcareInformation.pages.secondaryMedigap.uiSchema,
  1,
  'Applicant secondary Medigap type',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.primaryComments.schema,
  formConfig.chapters.healthcareInformation.pages.primaryComments.uiSchema,
  1,
  'Applicant primary comments',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.secondaryComments.schema,
  formConfig.chapters.healthcareInformation.pages.secondaryComments.uiSchema,
  1,
  'Applicant secondary comments',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.primaryScheduleOfBenefits
    .schema,
  formConfig.chapters.healthcareInformation.pages.primaryScheduleOfBenefits
    .uiSchema,
  0,
  'Applicant primary schedule of benefits upload',
  mockData.data,
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.secondaryScheduleOfBenefits
    .schema,
  formConfig.chapters.healthcareInformation.pages.secondaryScheduleOfBenefits
    .uiSchema,
  0,
  'Applicant secondary schedule of benefits upload',
  mockData.data,
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.primaryCard.schema,
  formConfig.chapters.healthcareInformation.pages.primaryCard.uiSchema,
  0,
  'Applicant primary card',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.secondaryCard.schema,
  formConfig.chapters.healthcareInformation.pages.secondaryCard.uiSchema,
  0,
  'Applicant secondary card',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.formSignature.pages.formSignature.schema,
  formConfig.chapters.formSignature.pages.formSignature.uiSchema,
  1,
  'Form signature page',
  { ...mockData.data },
);
