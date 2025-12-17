import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import PrivacyActStatement from '../../components/PrivacyActStatement';

describe('<PrivacyActStatement />', () => {
  it('should render privacy act notice text', () => {
    const { getByTestId } = render(<PrivacyActStatement />);

    const privacyActNotice = getByTestId('privacy-act-notice');
    expect(privacyActNotice).to.exist;
    expect(privacyActNotice.tagName).to.equal('P');
  });

  it('should contain the correct privacy act statement text', () => {
    const { getByTestId } = render(<PrivacyActStatement />);

    const privacyActNotice = getByTestId('privacy-act-notice');
    expect(privacyActNotice.textContent).to.contain(
      'VA will not disclose information collected on this form',
    );
    expect(privacyActNotice.textContent).to.contain('Privacy Act of 1974');
    expect(privacyActNotice.textContent).to.contain(
      '58VA21/22/28, Compensation, Pension, Education and Veteran Readiness and Employment Records - VA',
    );
  });
});
