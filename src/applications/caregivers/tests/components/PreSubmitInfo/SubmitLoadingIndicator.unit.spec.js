import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import SubmitLoadingIndicator from '../../../components/PreSubmitInfo/SubmitLoadingIndicator';

describe('CG <SubmitLoadingIndicator>', () => {
  describe('when no submission has been made', () => {
    it('should not render loading container', () => {
      const props = {
        submission: {
          hasAttemptedSubmit: false,
          status: null,
        },
      };
      const view = render(<SubmitLoadingIndicator {...props} />);
      const selector = view.container.querySelector('.loading-container');
      expect(selector).to.not.exist;
    });
  });

  describe('when submission has been made', () => {
    it('should render loading container when submission is pending', async () => {
      const props = {
        submission: {
          hasAttemptedSubmit: true,
          status: 'submitPending',
        },
      };
      const view = render(<SubmitLoadingIndicator {...props} />);
      const selectors = {
        wrapper: view.container.querySelector('.loading-container'),
        component: view.container.querySelector('va-loading-indicator'),
      };
      waitFor(() => {
        expect(selectors.wrapper).to.exist;
        expect(selectors.component).to.have.attribute(
          'message',
          'We\u2019re processing your application. This may take up to 1 minute. Please don\u2019t refresh your browser.',
        );
      });
    });

    it('should not render loading container if submission has failed', () => {
      const props = {
        submission: {
          hasAttemptedSubmit: true,
          status: 'submitFailed',
        },
      };
      const view = render(<SubmitLoadingIndicator {...props} />);
      const selector = view.container.querySelector('.loading-container');
      expect(selector).to.not.exist;
    });
  });
});
