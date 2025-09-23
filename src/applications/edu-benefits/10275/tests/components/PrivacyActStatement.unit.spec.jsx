import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import PrivacyActStatement from '../../components/PrivacyActStatement';

describe('<PrivacyActStatement />', () => {
  it('should render Privacy Act Statement', () => {
    const { container } = render(<PrivacyActStatement />);
    const privacyActStatement = container.querySelector(
      '[data-testid="privacy-act-statement"]',
    );

    expect(privacyActStatement).to.exist;
    expect(privacyActStatement.textContent).to.contain(
      'VA will not disclose information collected on this form to any sources other than what has been authorized under the Privacy Act of 1974',
    );
    expect(privacyActStatement.textContent).to.contain(
      'Title 38, Code of Federal Regulations, Section 1.526',
    );
  });

  it('should contain all required privacy policy content', () => {
    const { container } = render(<PrivacyActStatement />);
    const privacyActStatement = container.querySelector(
      '[data-testid="privacy-act-statement"]',
    );

    expect(privacyActStatement.textContent).to.contain(
      "veteran's school or training establishment",
    );
    expect(privacyActStatement.textContent).to.contain(
      'VA System of Records, 58VA21/22/28',
    );
    expect(privacyActStatement.textContent).to.contain(
      'Compensation, Pension, Education and Veteran Readiness and Employment Records - VA',
    );
  });
});
