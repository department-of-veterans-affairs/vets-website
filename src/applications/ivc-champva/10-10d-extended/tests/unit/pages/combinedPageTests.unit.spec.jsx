import React from 'react';
import { expect } from 'chai';
import {
  testComponentRender,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import { ApplicantRelOriginPage } from '../../../chapters/ApplicantRelOriginPage';
import { ApplicantGenderPage } from '../../../chapters/ApplicantGenderPage';
import { SelectHealthcareParticipantsPage } from '../../../chapters/SelectHealthcareParticipantsPage';
import {
  SignerContactInfoPage,
  signerContactOnGoForward,
} from '../../../chapters/signerInformation';
import mockData from '../../fixtures/data/test-data.json';
import formConfig from '../../../config/form';

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.page1.schema,
  formConfig.chapters.certifierInformation.pages.page1.uiSchema,
  1,
  'Certifier Information - Role',
  {},
);
// check number of webcomponent fields when certifier role is 'other'
// so the extra text field is displayed
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.certifierInformation.pages.page5.schema,
  formConfig.chapters.certifierInformation.pages.page5.uiSchema,
  6,
  'Certifier Information - Relationship',
  { certifierRelationship: { relationshipToVeteran: { other: true } } },
);
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page6.schema,
  formConfig.chapters.sponsorInformation.pages.page6.uiSchema,
  5,
  'Sponsor Information - Name and DOB',
  {},
);
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page7.schema,
  formConfig.chapters.sponsorInformation.pages.page7.uiSchema,
  2,
  'Sponsor Information - Identification info',
  {},
);
describe('sponsor information title function', () => {
  it('should compute title text for the page', () => {
    expect(
      formConfig.chapters.sponsorInformation.pages.page10b0
        .title(mockData.data)
        .includes('address selection'),
    ).to.be.true;
  });
});
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page8.schema,
  formConfig.chapters.sponsorInformation.pages.page8.uiSchema,
  1,
  'Sponsor Information - Status',
  {},
);
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page10.schema,
  formConfig.chapters.sponsorInformation.pages.page10.uiSchema,
  8,
  'Sponsor Information - Address',
  {},
);
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page11.schema,
  formConfig.chapters.sponsorInformation.pages.page11.uiSchema,
  1,
  'Sponsor Information - Contact info',
  {},
);
testComponentRender(
  'ApplicantRelOriginPage',
  <ApplicantRelOriginPage data={{ ...mockData.data }} />,
);
testComponentRender(
  'ApplicantRelOriginPage',
  <ApplicantRelOriginPage
    data={{ ...mockData.data, sponsorIsDeceased: false }}
  />,
);
testComponentRender(
  'SelectHealthcareParticipantsPage',
  <SelectHealthcareParticipantsPage
    fullData={{ ...mockData.data }}
    data={{ ...mockData.data.healthInsurance[0] }}
  />,
);
testComponentRender(
  'ApplicantRelOriginPage',
  <ApplicantGenderPage data={{ ...mockData.data }} />,
);
testComponentRender(
  'SignerContactInfoPage',
  <SignerContactInfoPage data={{}} />,
);
testComponentRender(
  'SignerContactInfoPage',
  <SignerContactInfoPage onReviewPage />,
);
describe('SignerContactOnGoForward', () => {
  it("should copy certifier info to sponsor if certifierRole === 'sponsor'", () => {
    const props = {
      data: {
        certifierRole: 'sponsor',
        certifierName: { first: 'first', last: 'last' },
      },
    };
    signerContactOnGoForward(props); // operates directly on `props`
    expect(props.data.sponsorName.first).to.eq(props.data.certifierName.first);
  });
  it("should copy certifier info to applicant array if certifierRole === 'applicant'", () => {
    const props = {
      data: {
        certifierRole: 'applicant',
        certifierName: { first: 'first', last: 'last' },
      },
    };
    signerContactOnGoForward(props); // operates directly on `props`
    expect(props.data.applicants[0].applicantName.first).to.eq(
      props.data.certifierName.first,
    );
  });
  it("should not modify applicants array if certifierRole === 'other'", () => {
    const props = {
      data: {
        certifierRole: 'other',
        certifierName: { first: 'first', last: 'last' },
        applicants: [],
      },
    };
    signerContactOnGoForward(props); // operates directly on `props`
    expect(props.data.applicants[0]).to.eq(undefined);
  });
});
