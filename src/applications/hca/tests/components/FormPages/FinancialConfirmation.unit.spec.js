import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FinancialConfirmation from '../../../components/FormPages/FinancialConfirmation';

describe('hca FinancialConfirmation', () => {
  const props = { data: {}, goBack: () => {}, goForward: () => {} };

  describe('when the component renders', () => {
    it('should render `va-alert` with correct title', () => {
      const { container } = render(<FinancialConfirmation {...props} />);
      const selector = container.querySelector('va-alert');
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
