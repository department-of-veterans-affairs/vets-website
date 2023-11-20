import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FinancialOnboarding from '../../../../components/FormPages/FinancialOnboarding';

describe('hca Financial Onboarding page', () => {
  const getData = () => ({
    props: { data: {}, goBack: () => {}, goForward: () => {} },
  });

  context('when the component renders', () => {
    const { props } = getData();

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
