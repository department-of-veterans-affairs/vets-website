import { expect } from 'chai';
import React from 'react';
import FinancialInformationReviewWarning from '../../../../components/FormAlerts/FinancialInformationReviewWarning';
import { renderProviderWrappedComponent } from '../../../helpers';

describe('ezr <FinancialInformationReviewWarning>', () => {
  const subject = () => {
    const { container } = renderProviderWrappedComponent(
      {},
      <FinancialInformationReviewWarning />,
    );
    return () => ({ vaAlert: container.querySelector('va-alert') });
  };

  context('when on the review and submit page', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/review-and-submit' },
        configurable: true,
      });
    });

    it('should not render alert component', () => {
      const selectors = subject();
      expect(selectors().vaAlert).to.not.exist;
    });
  });

  context('when on the summary page', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/household-information/financial-information',
        },
        configurable: true,
      });
    });

    it('should render the alert component', () => {
      const selectors = subject();
      expect(selectors().vaAlert).to.exist;
    });
  });
});
