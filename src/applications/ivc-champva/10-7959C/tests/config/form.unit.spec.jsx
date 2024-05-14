import { expect } from 'chai';

import { testNumberOfWebComponentFields } from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';
import mockData from '../fixtures/data/test-data.json';
import FileFieldWrapped from '../../components/FileUploadWrapper';

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

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.role.schema,
  formConfig.chapters.certifierInformation.pages.role.uiSchema,
  1,
  'Certifier information',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.name.schema,
  formConfig.chapters.certifierInformation.pages.name.uiSchema,
  4,
  'Certifier name',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.address.schema,
  formConfig.chapters.certifierInformation.pages.address.uiSchema,
  8,
  'Certifier address',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.phoneEmail.schema,
  formConfig.chapters.certifierInformation.pages.phoneEmail.uiSchema,
  2,
  'Certifier phone/email',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.relationship.schema,
  formConfig.chapters.certifierInformation.pages.relationship.uiSchema,
  2,
  'Certifier relationship',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.relationship.schema,
  formConfig.chapters.certifierInformation.pages.relationship.uiSchema,
  1,
  'Certifier relationship',
  {
    ...mockData.data,
    certifierRelationship: { relationshipToApplicants: 'applicant' },
  },
);

describe('Applicant Name/DOB page title', () => {
  it('should start with "Your" if role is "applicant"', () => {
    const {
      title,
    } = formConfig.chapters.applicantInformation.pages.applicantNameDob;
    const res = title({ ...mockData.data, certifierRole: 'applicant' });
    expect(res.startsWith('Your')).to.be.true;
  });
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.applicantInformation.pages.applicantNameDob.schema,
    formConfig.chapters.applicantInformation.pages.applicantNameDob.uiSchema,
    5,
    'Applicant name/DOB',
    { ...mockData.data },
  );
  testNumberOfWebComponentFields(
    formConfig,
    formConfig.chapters.applicantInformation.pages.applicantNameDob.schema,
    formConfig.chapters.applicantInformation.pages.applicantNameDob.uiSchema,
    5,
    'Applicant name/DOB',
    { certifierRole: 'applicant' },
  );
});

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.applicantIdentity.schema,
  formConfig.chapters.applicantInformation.pages.applicantIdentity.uiSchema,
  1,
  'Applicant identification',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.applicantAddressInfo.schema,
  formConfig.chapters.applicantInformation.pages.applicantAddressInfo.uiSchema,
  8,
  'Applicant address info',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.applicantContactInfo.schema,
  formConfig.chapters.applicantInformation.pages.applicantContactInfo.uiSchema,
  2,
  'Applicant contact info',
  { ...mockData.data },
);

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
  formConfig.chapters.medicareInformation.pages.hasMedicareAB.schema,
  formConfig.chapters.medicareInformation.pages.hasMedicareAB.uiSchema,
  1,
  'Applicant has medicare AB (certifier role: applicant)',
  { ...mockData.data, certifierRole: 'applicant' },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.medicareInformation.pages.medicareABContext.schema,
  formConfig.chapters.medicareInformation.pages.medicareABContext.uiSchema,
  1,
  'Applicant medicare AB context (certifier role: applicant)',
  { ...mockData.data, certifierRole: 'applicant' },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.medicareInformation.pages.medicareABContext.schema,
  formConfig.chapters.medicareInformation.pages.medicareABContext.uiSchema,
  1,
  'Applicant medicare AB context',
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
  formConfig.chapters.medicareInformation.pages.medicareIneligible.schema,
  formConfig.chapters.medicareInformation.pages.medicareIneligible.uiSchema,
  0,
  'Applicant medicare ineligible',
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

// Hit the useFirstPerson conditional branch in title
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.medicareInformation.pages.pharmacyBenefits.schema,
  formConfig.chapters.medicareInformation.pages.pharmacyBenefits.uiSchema,
  1,
  'Applicant medicare pharmacy benefits',
  { ...mockData.data, certifierRole: 'applicant' },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.medicareInformation.pages.advantagePlan.schema,
  formConfig.chapters.medicareInformation.pages.advantagePlan.uiSchema,
  1,
  'Applicant medicare advantage benefits',
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

// Follow title else path
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.medicareInformation.pages.hasMedicareD.schema,
  formConfig.chapters.medicareInformation.pages.hasMedicareD.uiSchema,
  1,
  'Applicant has medicare D',
  { ...mockData.data, certifierRole: 'applicant' },
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

describe('Medicare ineligibility screen depends function', () => {
  // Get date 65 yrs ago in format MM-DD-YYYY (to match what form would produce)
  const date65YrAgo = new Date();
  date65YrAgo.setFullYear(date65YrAgo.getFullYear() - 65);

  it('should return true if applicant is ineligible and over 65', () => {
    const depRes = formConfig.chapters.medicareInformation.pages.medicareIneligible.depends(
      {
        applicantMedicareStatusContinued: 'ineligible',
        applicantDOB: date65YrAgo,
      },
    );

    expect(depRes).to.be.true;
  });
});

describe('Medicare part D screen depends function', () => {
  it('should return true if applicant has Medicare parts A, B, and D', () => {
    const depRes = formConfig.chapters.medicareInformation.pages.partDCarrier.depends(
      {
        applicantMedicareStatus: true,
        applicantMedicareStatusD: true,
      },
    );
    expect(depRes).to.be.true;
  });
});

describe('Medicare part D upload screen depends function', () => {
  it('should return true if applicant has Medicare parts A, B, and D', () => {
    const depRes = formConfig.chapters.medicareInformation.pages.medicareDCards.depends(
      {
        applicantMedicareStatus: true,
        applicantMedicareStatusD: true,
      },
    );
    expect(depRes).to.be.true;
  });
});

describe('Healthcare Medigap screens depends functions', () => {
  it('should return true if applicant has primary insurance and Medigap', () => {
    const depRes = formConfig.chapters.healthcareInformation.pages.primaryMedigap.depends(
      {
        applicantHasPrimary: true,
        applicantPrimaryInsuranceType: { medigap: true },
      },
    );
    expect(depRes).to.be.true;
  });

  it('should return true if applicant has secondary insurance and Medigap', () => {
    const depRes = formConfig.chapters.healthcareInformation.pages.secondaryMedigap.depends(
      {
        applicantHasSecondary: true,
        applicantSecondaryInsuranceType: { medigap: true },
      },
    );
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
  { applicantHasSecondary: true, certifierRole: 'applicant' },
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
  formConfig.chapters.healthcareInformation.pages.primaryEOB.schema,
  formConfig.chapters.healthcareInformation.pages.primaryEOB.uiSchema,
  1,
  'Applicant primary provides EOB',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.primaryType.schema,
  formConfig.chapters.healthcareInformation.pages.primaryType.uiSchema,
  6,
  'Applicant primary insurance type',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.healthcareInformation.pages.secondaryType.schema,
  formConfig.chapters.healthcareInformation.pages.secondaryType.uiSchema,
  6,
  'Applicant secondary insurance type',
  { ...mockData.data, certifierRole: 'applicant' },
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
  { ...mockData.data, certifierRole: 'applicant' },
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

describe('fullNamePath', () => {
  it('should be "applicantName" if certifierRole is "applicant"', () => {
    const v = formConfig.preSubmitInfo.statementOfTruth.fullNamePath({
      certifierRole: 'applicant',
    });
    expect(v).to.equal('applicantName');
  });
  it('should be "certifierName" if certifierRole is "applicant"', () => {
    const v = formConfig.preSubmitInfo.statementOfTruth.fullNamePath({
      certifierRole: 'other',
    });
    expect(v).to.equal('certifierName');
  });
});

describe('FileFieldWrapped', () => {
  it('should be called', () => {
    const ffw = FileFieldWrapped({});
    expect(ffw).to.not.be.undefined;
  });
});
