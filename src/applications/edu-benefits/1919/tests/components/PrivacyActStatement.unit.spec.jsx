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
    expect(selector.innerHTML).to.contain('2900-0657');
    expect(selector.innerHTML).to.contain('03/31/2027');
  });

  it('should render Privacy Act Notice', () => {
    const { container } = render(<PrivacyActStatement />);
    const selector = container.querySelector(
      '[data-testid="privacy-act-notice"]',
    );

    expect(selector.innerHTML).to.contain('Privacy Act Notice:');
    expect(selector.innerHTML).to.contain('Privacy Act of 1974');
  });

  it('should contain a valid email link', () => {
    const { container } = render(<PrivacyActStatement />);
    const emailLink = container.querySelector(
      'a[href="mailto:VACOPaperworkReduAct@va.gov"]',
    );

    expect(emailLink).to.exist;
    expect(emailLink).to.have.attr('target', '_blank');
    expect(emailLink).to.have.attr('rel', 'noreferrer');
  });
});
