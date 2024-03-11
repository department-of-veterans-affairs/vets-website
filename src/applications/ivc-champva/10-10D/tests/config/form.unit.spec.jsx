import { expect } from 'chai';
import React from 'react';
import {
  testNumberOfWebComponentFields,
  testComponentRender,
} from '../../../shared/tests/pages/pageTests.spec';
import ApplicantMedicareStatusContinuedPage, {
  ApplicantMedicareStatusContinuedReviewPage,
} from '../../pages/ApplicantMedicareStatusContinuedPage';
import ApplicantOhiStatusPage from '../../pages/ApplicantOhiStatusPage';
import ApplicantRelationshipPage from '../../pages/ApplicantRelationshipPage';
import formConfig from '../../config/form';
import { getFileSize } from '../../helpers/utilities';

import FileFieldCustom from '../../components/File/FileUpload';
// import FileViewField from '../../components/File/FileViewField';

import mockData from '../fixtures/data/test-data.json';

const applicants = [
  {
    applicantSSN: '111221234',
    applicantDOB: '2007-01-03',
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
  formConfig.chapters.sponsorInformation.pages.page6.schema,
  formConfig.chapters.sponsorInformation.pages.page6.uiSchema,
  5,
  'Sponsor - name and date of birth',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page7.schema,
  formConfig.chapters.sponsorInformation.pages.page7.uiSchema,
  2,
  'Sponsor - identification information',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page9a.schema,
  formConfig.chapters.sponsorInformation.pages.page9a.uiSchema,
  0,
  'Sponsor - casualty report',
  { ...mockData.data, sponsorIsDeceased: true, sponsorDeathConditions: true },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page10b1.schema,
  formConfig.chapters.sponsorInformation.pages.page10b1.uiSchema,
  8,
  'Sponsor - mailing address',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page11.schema,
  formConfig.chapters.sponsorInformation.pages.page11.uiSchema,
  1,
  "Sponsor's phone number",
  { sponsorIsDeceased: false },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page12.schema,
  formConfig.chapters.sponsorInformation.pages.page12.uiSchema,
  0,
  'Sponsor - disability rating',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page12a.schema,
  formConfig.chapters.sponsorInformation.pages.page12a.uiSchema,
  0,
  'Sponsor - discharge papers',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page14.schema,
  formConfig.chapters.applicantInformation.pages.page14.uiSchema,
  2,
  'Applicant - SSN and date of birth',
  { applicants },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page15.schema,
  formConfig.chapters.applicantInformation.pages.page15.uiSchema,
  8,
  'Applicant - mailing address',
  { applicants },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page16.schema,
  formConfig.chapters.applicantInformation.pages.page16.uiSchema,
  2,
  'Applicant - contact information',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page17.schema,
  formConfig.chapters.applicantInformation.pages.page17.uiSchema,
  1,
  'Applicant - gender',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page18a.schema,
  formConfig.chapters.applicantInformation.pages.page18a.uiSchema,
  0,
  'Applicant - birth certificate',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page18b.schema,
  formConfig.chapters.applicantInformation.pages.page18b.uiSchema,
  0,
  'Applicant - school certificate',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page18c.schema,
  formConfig.chapters.applicantInformation.pages.page18c.uiSchema,
  1,
  'Applicant - relationship to sponsor',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page18d.schema,
  formConfig.chapters.applicantInformation.pages.page18d.uiSchema,
  0,
  'Applicant - adoption documents',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page18e.schema,
  formConfig.chapters.applicantInformation.pages.page18e.uiSchema,
  0,
  'Applicant - step marriage certificate',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page18f.schema,
  formConfig.chapters.applicantInformation.pages.page18f.uiSchema,
  0,
  'Applicant - marriage documents',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page20a.schema,
  formConfig.chapters.applicantInformation.pages.page20a.uiSchema,
  0,
  'Applicant - medicare parts A/B upload',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page20b.schema,
  formConfig.chapters.applicantInformation.pages.page20b.uiSchema,
  0,
  'Applicant - medicare part D upload',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page21a.schema,
  formConfig.chapters.applicantInformation.pages.page21a.uiSchema,
  0,
  'Applicant - ohi upload',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page22.schema,
  formConfig.chapters.applicantInformation.pages.page22.uiSchema,
  0,
  'Applicant - 10-7959c upload',
  { ...mockData.data },
);

/*
// Commented out because this page doesn't exist currently (but may in future)
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page20.schema,
  formConfig.chapters.applicantInformation.pages.page20.uiSchema,
  0,
  'Upload supporting documents',
  { applicants },
);
*/

testComponentRender(
  'ApplicantMedicareStatusContinuedPage',
  <ApplicantMedicareStatusContinuedPage data={{}} />,
);

testComponentRender(
  'ApplicantMedicareStatusContinuedReviewPage ',
  <>{ApplicantMedicareStatusContinuedReviewPage()}</>,
);

testComponentRender(
  'ApplicantOhiStatusPage',
  <ApplicantOhiStatusPage data={{}} />,
);

testComponentRender(
  'ApplicantRelationshipPage ',
  <ApplicantRelationshipPage data={{}} />,
);

testComponentRender('FileFieldCustom', <FileFieldCustom data={{}} />);

/* TODO: needs rework
testComponentRender(
  'FileViewField',
  <FileViewField
    data={{ supportingDocuments: [{ f1: { name: 'f1', size: 123 } }] }}
  />,
);
*/

describe('File sizes', () => {
  it('should be in bytes for values < 999', () => {
    expect(getFileSize(998)).to.equal('998 B');
  });
  it('should be in KB for values between a thousand and a million', () => {
    expect(getFileSize(1024)).to.equal('1.0 KB');
  });
  it('should be in MB for values greater than a million', () => {
    expect(getFileSize(2000000)).to.equal('2.0 MB');
  });
});

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

/*
// Existing dummy submit function is useless - commenting this test out
// until we have a proper submit method.
describe('submit property of formConfig', () => {
  it('should be a promise', () => {
    const goToPathSpy = sinon.spy(formConfig.submit);
    formConfig.submit().then(() => {
      expect(goToPathSpy.called).to.be.true;
    });
  });
});
*/
