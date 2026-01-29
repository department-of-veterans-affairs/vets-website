import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import { App } from '../containers/App';

describe('form-renderer/App', () => {
  const mockFormSubmission = require('../../dependents/686c-674/tests/e2e/fixtures/form-submission.json');

  it('should call getData with correct endpoint and set config and data', async () => {
    mockApiRequest(mockFormSubmission);

    const { container } = render(<App />);
    expect(container).to.exist;
  });

  it('should render Loading message if theres no config and data', async () => {
    mockApiRequest({});

    const { container } = render(<App />);
    await waitFor(() => {
      expect(container.textContent).to.equal('Loading');
    });
  });

  it('should render form renderer if theres config and data', async () => {
    mockApiRequest(mockFormSubmission);

    const { container } = render(<App />);
    await waitFor(() => {
      expect(container.textContent).not.to.contain('Loading');
      expect(container.textContent).to.contain(
        'Add or remove a dependent on VA benefits',
      );
      expect(container.textContent).to.contain('Samantha Carrie Reid');
    });
  });
});
