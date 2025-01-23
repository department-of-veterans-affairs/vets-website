import React from 'react';
import { expect } from 'chai';
import { testComponentRender } from '../../../../shared/tests/pages/pageTests.spec';
import {
  ApplicantDependentStatusPage,
  ApplicantDependentStatusReviewPage,
} from '../../../pages/ApplicantDependentStatus';
import {
  ApplicantGenderPage,
  ApplicantGenderReviewPage,
} from '../../../pages/ApplicantGenderPage';
import {
  ApplicantSponsorMarriageDetailsPage,
  ApplicantSponsorMarriageDetailsReviewPage,
} from '../../../pages/ApplicantSponsorMarriageDetailsPage';
import ApplicantOhiStatusPage, {
  ApplicantOhiStatusReviewPage,
} from '../../../pages/ApplicantOhiStatusPage';
import {
  ApplicantRelOriginPage,
  ApplicantRelOriginReviewPage,
} from '../../../pages/ApplicantRelOriginPage';
import {
  SignerContactInfoPage,
  signerContactOnGoForward,
} from '../../../pages/SignerContactInfoPage';
import mockData from '../../e2e/fixtures/data/test-data.json';

// Basic render tests:

testComponentRender(
  'ApplicantDependentStatusPage',
  <ApplicantDependentStatusPage
    data={{ ...mockData.data }}
    pagePerItemIndex="0"
  />,
);
testComponentRender(
  'ApplicantDependentStatusReviewPage',
  <ApplicantDependentStatusReviewPage
    data={{ ...mockData.data }}
    pagePerItemIndex="0"
    title={() => {}}
  />,
);
testComponentRender(
  'Applicant marriage details',
  <ApplicantSponsorMarriageDetailsPage data={{ ...mockData.data }} />,
);
testComponentRender(
  'Applicant marriage details',
  <ApplicantSponsorMarriageDetailsReviewPage
    data={{ ...mockData.data }}
    title={() => {}}
  />,
);
testComponentRender(
  'ApplicantGenderPage',
  <ApplicantGenderPage data={{ ...mockData.data }} />,
);
testComponentRender(
  'ApplicantGenderReviewPage',
  <ApplicantGenderReviewPage data={{ ...mockData.data }} title={() => {}} />,
);
testComponentRender(
  'ApplicantOhiStatusPage',
  <ApplicantOhiStatusPage data={{ ...mockData.data }} />,
);
testComponentRender(
  'ApplicantOhiStatusReviewPage',
  <ApplicantOhiStatusReviewPage data={{ ...mockData.data }} title={() => {}} />,
);
testComponentRender(
  'ApplicantRelOriginPage',
  <ApplicantRelOriginPage data={{ ...mockData.data }} />,
);
testComponentRender(
  'ApplicantRelOriginReviewPage',
  <ApplicantRelOriginReviewPage
    data={{ ...mockData.data, sponsorIsDeceased: false }}
    title={() => {}}
  />,
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
    expect(props.data.veteransFullName.first).to.eq(
      props.data.certifierName.first,
    );
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
});
