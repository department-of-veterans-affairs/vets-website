import { expect } from 'chai';
import React from 'react';
import SpouseInformationReviewWarning from '../../../../components/FormAlerts/SpouseInformationReviewWarning';
import { renderProviderWrappedComponent } from '../../../helpers';

describe('ezr <SpouseInformationReviewWarning>', () => {
  context(`when 'isFormReviewPage' is true`, () => {
    it('should not render', () => {
      const { container } = renderProviderWrappedComponent(
        {},
        <SpouseInformationReviewWarning isFormReviewPage />,
      );
      const selector = container.querySelector('va-alert');

      expect(selector).to.not.exist;
    });
  });

  context(`when 'isFormReviewPage' is false`, () => {
    it('should render `va-alert` with status of `info`', () => {
      const { container } = renderProviderWrappedComponent(
        {},
        <SpouseInformationReviewWarning isFormReviewPage={false} />,
      );
      const selector = container.querySelector('va-alert');

      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'info');
    });

    it('should render the correct message text', () => {
      const { container } = renderProviderWrappedComponent(
        {},
        <SpouseInformationReviewWarning isFormReviewPage={false} />,
      );
      const messageText = container.textContent;

      expect(messageText).to.include(
        'You can review and edit your spouse information',
      );
      expect(messageText).to.include('Continue');
    });
  });
});
