import { expect } from 'chai';
import React from 'react';
import FileFieldWrapped from '../../../components/FileUploadWrapper';
import {
  testNumberOfWebComponentFields,
  testComponentRender,
} from '../../../../shared/tests/pages/pageTests.spec';
import ApplicantRelationshipPage from '../../../../shared/components/applicantLists/ApplicantRelationshipPage';
import formConfig from '../../../config/form';
import { getFileSize } from '../../../helpers/utilities';
import { isRequiredFile } from '../../../components/Applicant/applicantFileUpload';
import { REQUIRED_FILES } from '../../../config/constants';
import { ApplicantAddressCopyPage } from '../../../../shared/components/applicantLists/ApplicantAddressPage';

import FileFieldCustom from '../../../../shared/components/fileUploads/FileUpload';

import mockData from '../../e2e/fixtures/data/test-data.json';

const applicants = [
  {
    applicantSSN: '111221234',
    applicantDob: '2007-01-03',
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
  formConfig.chapters.certifierInformation.pages.page5.schema,
  formConfig.chapters.certifierInformation.pages.page5.uiSchema,
  7,
  'Signer relationship',
  {
    certifierRelationship: {
      relationshipToVeteran: { other: true },
    },
  },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page6.schema,
  formConfig.chapters.sponsorInformation.pages.page6.uiSchema,
  5,
  'Sponsor - name and date of birth',
  { ...mockData.data },
);

// Signer is applicant:
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page6.schema,
  formConfig.chapters.sponsorInformation.pages.page6.uiSchema,
  5,
  'Sponsor - name and date of birth (alternate)',
  {
    ...mockData.data,
    certifierRelationship: { relationshipToVeteran: { applicant: true } },
  },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page7.schema,
  formConfig.chapters.sponsorInformation.pages.page7.uiSchema,
  2,
  'Sponsor - SSN (with VA File Number)',
  { ssn: { vaFileNumber: '123123123' } },
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
  formConfig.chapters.applicantInformation.pages.page13.schema,
  formConfig.chapters.applicantInformation.pages.page13.uiSchema,
  5,
  'Applicant - Name Dob',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page13a.schema,
  formConfig.chapters.applicantInformation.pages.page13a.uiSchema,
  0,
  'Applicant - Start screen',
  { applicants: [...mockData.data.applicants, []] },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page14.schema,
  formConfig.chapters.applicantInformation.pages.page14.uiSchema,
  2,
  'Applicant - SSN and VA File Num',
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
  0,
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
  formConfig.chapters.applicantInformation.pages.page18b2.schema,
  formConfig.chapters.applicantInformation.pages.page18b2.uiSchema,
  0,
  'Applicant - helpless child documentation',
  { ...mockData.data },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page18c.schema,
  formConfig.chapters.applicantInformation.pages.page18c.uiSchema,
  0,
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

const marriageData = JSON.parse(JSON.stringify(mockData));
marriageData.data.applicants[0].applicantRelationshipToSponsor.relationshipToVeteran =
  'spouse';
marriageData.data.sponsorIsDeceased = true;

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
  formConfig.chapters.applicantInformation.pages.page18f3.schema,
  formConfig.chapters.applicantInformation.pages.page18f3.uiSchema,
  1,
  'Applicant - marriage dates (to sponsor)',
  { ...marriageData.data },
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
  formConfig.chapters.applicantInformation.pages.page20c.schema,
  formConfig.chapters.applicantInformation.pages.page20c.uiSchema,
  0,
  'Applicant - over 65 ineligible',
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

testComponentRender(
  'ApplicantRelationshipPage ',
  <ApplicantRelationshipPage data={{}} />,
);

testComponentRender('FileFieldCustom', <FileFieldCustom data={{}} />);

testComponentRender(
  'ApplicantAddressCopyPage',
  <ApplicantAddressCopyPage
    contentBeforeButtons={<></>}
    contentAfterButtons={<></>}
    data={mockData.data}
    setFormData={() => {}}
    goBack={() => {}}
    goForward={() => {}}
    pagePerItemIndex={0}
    updatePage={() => {}}
    onReviewPage={false}
  />,
);

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

describe('isRequiredFile', () => {
  it("should return '(Required)' if required file in formContext", () => {
    // Grab whatever the first required file key is and toss into this
    // mocked context object:
    const context = {
      schema: { properties: { [Object.keys(REQUIRED_FILES)[0]]: '' } },
    };
    expect(isRequiredFile(context)).to.equal('(Required)');
  });
});

describe('FileFieldWrapped', () => {
  it('should be called', () => {
    const ffw = FileFieldWrapped({});
    expect(ffw).to.not.be.undefined;
  });
});
