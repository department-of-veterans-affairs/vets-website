import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import SubmitLoadingIndicator from '../../../../components/PreSubmitInfo/SubmitLoadingIndicator';

describe('CG <SubmitLoadingIndicator>', () => {
  const getData = ({ hasAttemptedSubmit = true, status = null }) => ({
    props: {
      submission: {
        hasAttemptedSubmit,
        status,
      },
    },
  });
  const subject = ({ props }) => {
    const { container } = render(<SubmitLoadingIndicator {...props} />);
    const selectors = () => ({
      loader: container.querySelector('.loading-container'),
    });
    return { container, selectors };
  };

  context('when no submission has been made', () => {
    it('should not render loading container', () => {
      const { props } = getData({ hasAttemptedSubmit: false });
      const { selectors } = subject({ props });
      expect(selectors().loader).to.not.exist;
    });
  });

  context('when submission has been made', () => {
    it('should render loading container when submission is pending', async () => {
      const { props } = getData({ status: 'submitPending' });
      const { selectors } = subject({ props });
      await waitFor(() => {
        expect(selectors().loader).to.exist;
      });
    });

    it('should not render loading container if submission has failed', () => {
      const { props } = getData({ status: 'submitFailed' });
      const { selectors } = subject({ props });
      expect(selectors().loader).to.not.exist;
    });
  });
});
