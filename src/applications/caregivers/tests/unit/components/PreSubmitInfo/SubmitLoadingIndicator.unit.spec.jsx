import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import SubmitLoadingIndicator from '../../../../components/PreSubmitInfo/SubmitLoadingIndicator';

describe('CG <SubmitLoadingIndicator>', () => {
  const subject = ({ hasAttemptedSubmit = true, status = null }) => {
    const props = { submission: { hasAttemptedSubmit, status } };
    const { container } = render(<SubmitLoadingIndicator {...props} />);
    const selectors = () => ({
      loader: container.querySelector('.loading-container'),
    });
    return { container, selectors };
  };

  it('should not render loading container when submission has not been made', () => {
    const { selectors } = subject({ hasAttemptedSubmit: false });
    expect(selectors().loader).to.not.exist;
  });

  it('should not render loading container if submission has failed', () => {
    const { selectors } = subject({ status: 'submitFailed' });
    expect(selectors().loader).to.not.exist;
  });

  it('should render loading container when submission is pending', async () => {
    const { selectors } = subject({ status: 'submitPending' });
    await waitFor(() => {
      expect(selectors().loader).to.exist;
    });
  });
});
