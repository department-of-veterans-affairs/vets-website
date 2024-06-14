import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import SubmissionErrorAlert from '../../../../components/FormAlerts/SubmissionErrorAlert';
import content from '../../../../locales/en/content.json';

describe('ezr <SubmissionErrorAlert>', () => {
  describe('when the component renders', () => {
    it('should render wrapper div that receives focus', async () => {
      const { container } = render(<SubmissionErrorAlert />);
      const selector = container.querySelector('.ezr-error-message');
      expect(selector).to.exist;
      await waitFor(() => {
        expect(selector).to.have.attr('tabindex', '-1');
      });
    });

    it('should render `va-alert` with status of `error`', () => {
      const { container } = render(<SubmissionErrorAlert />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'error');
    });

    it('should render proper heading level & content', () => {
      const { container } = render(<SubmissionErrorAlert />);
      const selector = container.querySelector('h3');
      expect(selector).to.exist;
      expect(selector).to.contain.text(content['alert-submission-title']);
    });
  });
});
