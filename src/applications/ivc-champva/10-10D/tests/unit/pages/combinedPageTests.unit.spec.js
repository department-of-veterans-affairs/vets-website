import React from 'react';
import { testComponentRender } from '../../../../shared/tests/pages/pageTests.spec';
import { ApplicantDependentStatusPage } from '../../../pages/ApplicantDependentStatus';
import {
  ApplicantGenderPage,
  ApplicantGenderReviewPage,
} from '../../../pages/ApplicantGenderPage';
import {
  ApplicantSponsorMarriageDetailsPage,
  ApplicantSponsorMarriageDetailsReviewPage,
} from '../../../pages/ApplicantSponsorMarriageDetailsPage';
import ApplicantOhiStatusPage from '../../../pages/ApplicantOhiStatusPage';
import { ApplicantRelOriginPage } from '../../../pages/ApplicantRelOriginPage';
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
  'ApplicantRelOriginPage',
  <ApplicantRelOriginPage data={{ ...mockData.data }} />,
);
