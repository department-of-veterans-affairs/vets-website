import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import PrivacyActStatement from '../../components/PrivacyActStatement';

describe('<PrivacyActStatement />', () => {
  it('should render Respondent Burden', () => {
    const { container } = render(<PrivacyActStatement />);
    const selector = container.querySelector(
      '[data-testid="respondent-burden"]',
    );

    expect(selector.innerHTML).to.contain('Respondent Burden:');
  });

  it('should render Privacy Act Notice', () => {
    const { container } = render(<PrivacyActStatement />);
    const selector = container.querySelector(
      '[data-testid="privacy-act-notice"]',
    );

    expect(selector.innerHTML).to.contain('Privacy Act Notice:');
  });
});
