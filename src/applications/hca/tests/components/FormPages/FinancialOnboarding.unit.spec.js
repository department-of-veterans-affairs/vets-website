import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FinancialOnboarding from '../../../components/FormPages/FinancialOnboarding';

describe('hca FinancialOnboarding', () => {
  const props = { data: {}, goBack: () => {}, goForward: () => {} };

  describe('when the component renders', () => {
    it('should render with correct title', () => {
      const { container } = render(<FinancialOnboarding {...props} />);
      const selector = container.querySelector(
        '[data-testid="hca-custom-page-title"]',
      );
      expect(selector).to.exist;
      expect(selector).to.contain.text(
        'How we use your household financial information',
      );
    });

    it('should render navigation buttons', () => {
      const { container } = render(<FinancialOnboarding {...props} />);
      expect(container.querySelector('.usa-button-primary')).to.exist;
      expect(container.querySelector('.usa-button-secondary')).to.exist;
    });
  });
});
