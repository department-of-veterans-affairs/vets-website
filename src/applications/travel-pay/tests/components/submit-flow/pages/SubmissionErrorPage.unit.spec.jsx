import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import SubmissionErrorPage from '../../../../components/submit-flow/pages/SubmissionErrorPage';

it('should render submission error page with expected links', () => {
  const screen = render(<SubmissionErrorPage />);
  expect(screen.getByText('We couldn’t file your claim')).to.exist;

  // Text only found in HelpTextGeneral used in SubmissionErrorPage
  expect(
    screen.getByText(
      'Or call your VA health facility’s Beneficiary Travel contact.',
    ),
  ).to.exist;

  expect(
    screen.container.querySelector(
      '[href="/health-care/get-reimbursed-for-travel-pay/"]',
      '[text="Find out how to file for travel reimbursement"]',
    ),
  ).to.exist;

  expect(
    screen.container.querySelector(
      '[href="https://dvagov-btsss.dynamics365portals.us/"]',
      '[text="File a travel claim online"]',
    ),
  ).to.exist;

  expect(
    screen.container.querySelector(
      '[href="/find-forms/about-form-10-3542/"]',
      '[text="Learn more about VA Form 10-3542"]',
    ),
  ).to.exist;

  expect(
    screen.container.querySelector(
      '[href="/HEALTHBENEFITS/vtp/beneficiary_travel_pocs.asp"]',
      '[text="Find the travel contact for your facility"]',
    ),
  ).to.exist;
});
