import React from 'react';
import { expect } from 'chai';
import {
  testComponentRender,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import { ApplicantRelOriginPage } from '../../../chapters/ApplicantRelOriginPage';
import { ApplicantGenderPage } from '../../../chapters/ApplicantGenderPage';
import {
  SignerContactInfoPage,
  signerContactOnGoForward,
} from '../../../chapters/signerInformation';
import mockData from '../../e2e/fixtures/data/veteran.json';
import formConfig from '../../../config/form';
import { sponsorPages } from '../../../chapters/sponsor';

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
  sponsorPages.personalInformation.schema,
  sponsorPages.personalInformation.uiSchema,
  5,
  'Sponsor Information - Name and DOB',
  {},
);
testNumberOfWebComponentFields(
  formConfig,
  sponsorPages.identityInformation.schema,
  sponsorPages.identityInformation.uiSchema,
  1,
  'Sponsor Information - Identification info',
  {},
);
testNumberOfWebComponentFields(
  formConfig,
  sponsorPages.identityInformation.schema,
  sponsorPages.identityInformation.uiSchema,
  1,
  'Sponsor Information - Identification info (role: sponsor)',
  { certifierRole: 'sponsor' },
);
testNumberOfWebComponentFields(
  formConfig,
  sponsorPages.livingStatus.schema,
  sponsorPages.livingStatus.uiSchema,
  1,
  'Sponsor Information - Status',
  {},
);
testNumberOfWebComponentFields(
  formConfig,
  sponsorPages.mailingAddress.schema,
  sponsorPages.mailingAddress.uiSchema,
  7,
  'Sponsor Information - Mailing Address',
  {},
);
testNumberOfWebComponentFields(
  formConfig,
  sponsorPages.mailingAddress.schema,
  sponsorPages.mailingAddress.uiSchema,
  7,
  'Sponsor Information - Mailing Address (role: sponsor)',
  { certifierRole: 'sponsor' },
);
testNumberOfWebComponentFields(
  formConfig,
  sponsorPages.contactInformation.schema,
  sponsorPages.contactInformation.uiSchema,
  2,
  'Sponsor Information - Contact info',
  {},
);
testNumberOfWebComponentFields(
  formConfig,
  sponsorPages.contactInformation.schema,
  sponsorPages.contactInformation.uiSchema,
  2,
  'Sponsor Information - Contact info (role: sponsor)',
  { certifierRole: 'sponsor' },
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
