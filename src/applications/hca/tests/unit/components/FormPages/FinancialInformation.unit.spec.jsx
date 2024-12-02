import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FinancialInformation from '../../../../components/FormPages/FinancialInformation';

describe('hca Financial Information page', () => {
  const getData = () => ({
    props: { data: {}, goBack: () => {}, goForward: () => {} },
  });

  context('when the component renders', () => {
    const { props } = getData();

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
