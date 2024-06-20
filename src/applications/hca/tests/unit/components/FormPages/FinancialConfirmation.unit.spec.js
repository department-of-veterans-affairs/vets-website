import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FinancialConfirmation from '../../../../components/FormPages/FinancialConfirmation';

describe('hca Financial Confirmation page', () => {
  const getData = () => ({
    props: { data: {}, goBack: () => {}, goForward: () => {} },
  });

  context('when the component renders', () => {
    const { props } = getData();

    it('should render `va-alert` with correct status', () => {
      const { container } = render(<FinancialConfirmation {...props} />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'info');
    });

    it('should render navigation buttons', () => {
      const { container } = render(<FinancialConfirmation {...props} />);
      expect(
        container.querySelectorAll('.hca-button-progress'),
      ).to.have.lengthOf(2);
    });
  });
});
