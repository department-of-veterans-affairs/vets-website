import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ConfirmationPage from '../../../../components/submit-flow/pages/ConfirmationPage';

it('should render with expected content', () => {
  const screen = render(
    <ConfirmationPage
      appointment={{
        vaos: {
          apiData: {
            location: { attributes: { name: 'VA location name' } },
            start: '2025-01-15T21:39:27.698Z',
          },
        },
      }}
    />,
  );

  expect(screen.getByText('We’re processing your travel reimbursement claim'))
    .to.exist;

  expect(
    screen.container.querySelector(
      '[href="/my-health/travel-pay/claims/"]',
      '[text="Check your travel reimbursement claim status"]',
    ),
  ).to.exist;

  expect(
    screen.container.querySelector(
      '[href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"]',
      '[text="Learn how to set up direct deposit for travel pay reimbursement"]',
    ),
  ).to.exist;
});

it('should render practictioner name if available', () => {
  const screen = render(
    <ConfirmationPage
      appointment={{
        vaos: {
          apiData: {
            location: { attributes: { name: 'VA location name' } },
            start: '2025-01-15T21:39:27.698Z',
            practitioners: [
              {
                name: { family: 'Last', given: ['First', 'Middle'] },
              },
            ],
          },
        },
      }}
    />,
  );

  expect(screen.getByText('We’re processing your travel reimbursement claim'))
    .to.exist;

  expect(
    screen.queryAllByText((_, element) =>
      element.textContent.includes('with First Middle Last'),
    ),
  ).to.not.be.empty;
});
