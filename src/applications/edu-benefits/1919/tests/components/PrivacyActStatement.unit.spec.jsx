import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import PrivacyActStatement from '../../components/PrivacyActStatement';

describe('<PrivacyActStatement />', () => {
  it('should render Privacy Act Notice', () => {
    const { container } = render(<PrivacyActStatement />);
    const selector = container.querySelector(
      '[data-testid="privacy-act-notice"]',
    );

    expect(selector.innerHTML).to.contain(
      'VA will not disclose information collected on this form to any source other than what has been authorized under the Privacy Act of 1974 or Title 38, Code of Federal Regulations 1.576 for routine uses as identified in the VA system of records, 58VA21/22/28, Compensation, Pension, Education, Veteran Readiness and Employment Records - VA, published in the Federal Register.',
    );
  });
});
