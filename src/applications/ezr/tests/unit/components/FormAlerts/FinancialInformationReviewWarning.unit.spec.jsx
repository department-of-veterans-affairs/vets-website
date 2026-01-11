import { expect } from 'chai';
import React from 'react';
import { mockLocation } from 'platform/testing/unit/helpers';
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
    let restoreLocation;

    beforeEach(() => {
      restoreLocation = mockLocation('http://localhost:3001/review-and-submit');
    });

    afterEach(() => {
      restoreLocation?.();
    });

    it('should not render alert component', () => {
      const selectors = subject();
      expect(selectors().vaAlert).to.not.exist;
    });
  });

  context('when on the summary page', () => {
    let restoreLocation;

    beforeEach(() => {
      restoreLocation = mockLocation(
        'http://localhost:3001/household-information/financial-information',
      );
    });

    afterEach(() => {
      restoreLocation?.();
    });

    it('should render the alert component', () => {
      const selectors = subject();
      expect(selectors().vaAlert).to.exist;
    });
  });
});
