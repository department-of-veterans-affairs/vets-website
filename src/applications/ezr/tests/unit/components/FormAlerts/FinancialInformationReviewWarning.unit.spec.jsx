import { render } from '@testing-library/react';
import { expect } from 'chai';

import FinancialInformationReviewWarning from '../../../../components/FormAlerts/FinanicalInformationReviewWarning';

describe('ezr <FinancialInformationReviewWarning>', () => {
  describe('when the component renders', () => {
    it('should render `va-alert` with status of `warning`', () => {
      const { container } = render(FinancialInformationReviewWarning);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'warning');
    });
  });
});
