import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import WhatHappensNextSection from '../../../../components/complex-claims/pages/WhatHappensNextSection';
import {
  BTSSS_PORTAL_URL,
  FORM_103542_LINK,
  REIMBURSEMENT_URL,
} from '../../../../constants';

describe('<WhatHappensNextSection />', () => {
  it('renders error content when isError = true', () => {
    const { getByText, container } = render(<WhatHappensNextSection isError />);

    // Heading
    expect(getByText('What happens next')).to.exist;

    // Error message text
    expect(getByText(/You can still file a claim within 30 days/i)).to.exist;

    // Assert BTSSS link exists
    const btsssLink = container.querySelector(
      `va-link[href="${BTSSS_PORTAL_URL}"]`,
    );
    expect(btsssLink).to.exist;

    // Assert BTSSS link text is present
    expect(
      container.querySelector(`va-link[text="File a travel claim online"]`),
    ).to.exist;

    // Asset Form 10-3542 link exists
    const formLink = container.querySelector(
      `va-link[href="${FORM_103542_LINK}"]`,
    );
    expect(formLink).to.exist;
    // Asset Form 10-3542 link text is present
    expect(
      container.querySelector(
        `va-link[text="Learn more about VA Form 10-3542"]`,
      ),
    ).to.exist;
  });

  it('renders success content when isError = false', () => {
    const { getByText, container } = render(
      <WhatHappensNextSection isError={false} />,
    );

    // Heading
    expect(getByText('What happens next')).to.exist;

    // Process list item headers
    expect(
      container.querySelector(
        `va-process-list-item[header="We’ll review your claim"]`,
      ),
    ).to.exist;
    expect(
      container.querySelector(
        `va-process-list-item[header*="If we approve your claim"]`,
      ),
    ).to.exist;

    // Claim status link
    expect(
      container.querySelector(
        `va-link[href="/my-health/travel-pay/claims/"][text="Review your travel reimbursement claim status"]`,
      ),
    ).to.exist;

    const directDepositLink = container.querySelector(
      `va-link[href="${REIMBURSEMENT_URL}"]`,
    );
    expect(directDepositLink).to.exist;

    // Assert Direct deposit link text is present
    expect(
      container.querySelector(
        `va-link[text="Learn how to set up direct deposit for travel pay"]`,
      ),
    ).to.exist;
  });

  it('renders success content by default when isError is undefined', () => {
    const { container } = render(<WhatHappensNextSection />);

    // Should still show success content
    expect(
      container.querySelector(
        `va-process-list-item[header="We’ll review your claim"]`,
      ),
    ).to.exist;
  });
});
