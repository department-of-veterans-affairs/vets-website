import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FinancialInformation from '../../../components/FormPages/FinancialInformation';

describe('hca FinancialInformation', () => {
  const props = { data: {}, goBack: () => {}, goForward: () => {} };

  it('should render', () => {
    const view = render(<FinancialInformation {...props} />);
    const selector = view.container.querySelector(
      '[data-testid="hca-custom-page-title"]',
    );
    expect(selector).to.exist;
    expect(selector).to.contain.text('Financial information you’ll need');
  });

  it('should render progress buttons', () => {
    const view = render(<FinancialInformation {...props} />);
    expect(view.container.querySelector('.usa-button-primary')).to.exist;
    expect(view.container.querySelector('.usa-button-secondary')).to.exist;
  });
});
