import React from 'react';
import { expect } from 'chai';
import { testComponentRender } from '../../../../shared/tests/pages/pageTests.spec';
import { ApplicantRelOriginPage } from '../../../chapters/ApplicantRelOriginPage';
import { ApplicantGenderPage } from '../../../chapters/ApplicantGenderPage';
import {
  SignerContactInfoPage,
  signerContactOnGoForward,
} from '../../../chapters/signerInformation';
import mockData from '../../fixtures/data/test-data.json';

testComponentRender(
  'ApplicantRelOriginPage',
  <ApplicantRelOriginPage data={{ ...mockData.data }} />,
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
