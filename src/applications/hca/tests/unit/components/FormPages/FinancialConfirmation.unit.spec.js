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

    it('should render `va-summary-box` with correct title', () => {
      const { container } = render(<FinancialConfirmation {...props} />);
      const selector = container.querySelector('va-summary-box');
      expect(selector).to.exist;
      expect(selector).to.contain.text(
        'Confirm that you don\u2019t want to provide your household financial information',
      );
    });

    it('should render navigation buttons', () => {
      const { container } = render(<FinancialConfirmation {...props} />);
      expect(
        container.querySelectorAll('.hca-button-progress'),
      ).to.have.lengthOf(2);
    });
  });
});
