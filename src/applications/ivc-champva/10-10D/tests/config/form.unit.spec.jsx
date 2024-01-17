import sinon from 'sinon';
import { expect } from 'chai';
import { testNumberOfWebComponentFields } from '../../../../simple-forms/shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

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
  formConfig.chapters.sponsorInformation.pages.page7.schema,
  formConfig.chapters.sponsorInformation.pages.page7.uiSchema,
  2,
  "Sponsor's phone number continued",
  { sponsorIsDeceased: false },
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

describe('submit property of formConfig', () => {
  it('should be a promise', () => {
    const goToPathSpy = sinon.spy(formConfig.submit);
    formConfig.submit().then(() => {
      expect(goToPathSpy.called).to.be.true;
    });
  });
});
