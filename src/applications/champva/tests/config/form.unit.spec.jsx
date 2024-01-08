import sinon from 'sinon';
import { expect } from 'chai';
import { testNumberOfWebComponentFields } from '../../../simple-forms/shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';
import transformForSubmit from '../../config/submit-transformer';

const applicants = [
  {
    applicantSSN: '111221234',
    applicantDOB: '2000-01-03',
    applicantName: {
      first: 'Jerry',
      middle: 'J',
      last: 'Applicant',
      suffix: 'II',
    },
    applicantRelationshipToSponsor: { relationshipToVeteran: 'child' },
  },
];

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page1.schema,
  formConfig.chapters.sponsorInformation.pages.page1.uiSchema,
  5, // Expected number of fields
  'sponsor/veteran information', // Page title
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page3.schema,
  formConfig.chapters.sponsorInformation.pages.page3.uiSchema,
  1,
  'Sponsor status',
  { sponsorIsDeceased: true },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page4.schema,
  formConfig.chapters.sponsorInformation.pages.page4.uiSchema,
  2,
  'Sponsor status',
  { sponsorIsDeceased: false },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page7.schema,
  formConfig.chapters.sponsorInformation.pages.page7.uiSchema,
  2,
  "Sponsor's phone number continued",
  { sponsorIsDeceased: false, sponsorHasPhone: true },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page7a.schema,
  formConfig.chapters.sponsorInformation.pages.page7a.uiSchema,
  0,
  'Sponsor information complete',
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page9.schema,
  formConfig.chapters.applicantInformation.pages.page9.uiSchema,
  2,
  'Applicant SSN and date of birth',
  { applicants },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page13.schema,
  formConfig.chapters.applicantInformation.pages.page13.uiSchema,
  2,
  'Applicant health insurance and relationship',
  { applicants },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certification.pages.page14.schema,
  formConfig.chapters.certification.pages.page14.uiSchema,
  1,
  'Certification',
);

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
describe('title text logic', () => {
  it('should be called', () => {
    let titleCount = 0;

    Object.keys(formConfig.chapters).forEach(ch => {
      Object.keys(formConfig.chapters[`${ch}`].pages).forEach(pg => {
        const { title } = formConfig.chapters[`${ch}`].pages[`${pg}`];
        if (typeof title === 'function') {
          title();
          titleCount += 1;
        }
      });
    });

    expect(titleCount > 0).to.be.true;
  });
});

describe('transform for submit', () => {
  it('should adjust zip code keyname', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          sponsorAddress: { postalCode: '12345' },
        },
      }),
    );
    expect(transformed.veteran.address.postal_code).to.not.equal(undefined);
  });
  it('should adjust zip code keyname for applicants', () => {
    const zip = '12345';
    const transformed = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          applicants: [
            {
              applicantAddress: {
                postalCode: zip,
              },
            },
          ],
        },
      }),
    );
    expect(transformed.applicants[0].address.postal_code).to.equal(zip);
  });
  it('should return passed in relationship if already flat', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          certifierRelationship: 'Spouse',
        },
      }),
    );
    expect(transformed.certification.relationship).to.equal('Spouse');
  });
  it('should flatten relationship details', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          certifierRelationship: {
            relationshipToVeteran: 'other',
            otherRelationshipToVeteran: 'Sibling',
          },
        },
      }),
    );
    expect(transformed.certification.relationship).to.equal('Sibling');
  });
  it('should insert blank values as needed', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, { data: {} }),
    );
    expect(transformed.veteran.ssn_or_tin).to.equal('');
  });
});

describe('submit property of formConfig', () => {
  it('should be a promise', () => {
    const goToPathSpy = sinon.spy(formConfig.submit);
    formConfig.submit().then(() => {
      expect(goToPathSpy.called).to.be.true;
    });
  });
});
