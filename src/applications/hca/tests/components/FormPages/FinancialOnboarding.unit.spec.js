import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FinancialOnboarding from '../../../components/FormPages/FinancialOnboarding';

describe('hca FinancialOnboarding', () => {
  const props = { data: {}, goBack: () => {}, goForward: () => {} };

  it('should render', () => {
    const view = render(<FinancialOnboarding {...props} />);
    const selector = view.container.querySelector(
      '[data-testid="hca-custom-page-title"]',
    );
    expect(selector).to.exist;
    expect(selector).to.contain.text(
      'How we use your household financial information',
    );
  });

  it('should render progress buttons', () => {
    const view = render(<FinancialOnboarding {...props} />);
    expect(view.container.querySelector('.usa-button-primary')).to.exist;
    expect(view.container.querySelector('.usa-button-secondary')).to.exist;
  });
});
