import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FinancialInformation from '../../../components/FormPages/FinancialInformation';

describe('hca FinancialInformation', () => {
  const props = { data: {}, goBack: () => {}, goForward: () => {} };

  describe('when the component renders', () => {
    it('should render with correct title', () => {
      const { container } = render(<FinancialInformation {...props} />);
      const selector = container.querySelector(
        '[data-testid="hca-custom-page-title"]',
      );
      expect(selector).to.exist;
      expect(selector).to.contain.text('Financial information you’ll need');
    });

    it('should render navigation buttons', () => {
      const { container } = render(<FinancialInformation {...props} />);
      expect(container.querySelector('.usa-button-primary')).to.exist;
      expect(container.querySelector('.usa-button-secondary')).to.exist;
    });
  });
});
