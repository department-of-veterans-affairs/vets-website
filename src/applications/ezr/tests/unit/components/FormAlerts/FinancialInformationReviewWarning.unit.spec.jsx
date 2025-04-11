import { expect } from 'chai';
import React from 'react';
import FinancialInformationReviewWarning from '../../../../components/FormAlerts/FinanicalInformationReviewWarning';
import { renderProviderWrappedComponent } from '../../../helpers';

describe('ezr <FinancialInformationReviewWarning>', () => {
  context(`when 'isFormReviewPage' is true`, () => {
    it('should not render', () => {
      const { container } = renderProviderWrappedComponent(
        {},
        <FinancialInformationReviewWarning isFormReviewPage />,
      );
      const selector = container.querySelector('va-alert');

      expect(selector).to.not.exist;
    });
  });

  context(`when 'isFormReviewPage' is false`, () => {
    it('should render `va-alert` with status of `warning`', () => {
      const { container } = renderProviderWrappedComponent(
        {},
        <FinancialInformationReviewWarning isFormReviewPage={false} />,
      );
      const selector = container.querySelector('va-alert');

      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'warning');
    });
  });
});
