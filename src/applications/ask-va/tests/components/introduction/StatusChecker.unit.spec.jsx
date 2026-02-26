import React from 'react';
import { server } from 'platform/testing/unit/mocha-setup';
import { expect } from 'chai';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { render, waitFor } from '@testing-library/react';
import { mockInquiryStatusResponse } from '~/applications/ask-va/utils/mockData';
import { ENDPOINTS } from '~/applications/ask-va/utils/api';
import StatusChecker from '~/applications/ask-va/components/introduction/StatusChecker';

describe('<StatusChecker />', () => {
  beforeEach(() => {
    server.use(
      createGetHandler(`${ENDPOINTS.inquiries}/:inquiryId/status`, () => {
        return jsonResponse(mockInquiryStatusResponse);
      }),
    );
  });

  it('starts with just the heading and search bar', () => {
    const view = render(<StatusChecker />);

    const heading = view.getByRole('heading', {
      level: 2,
      name: /check the status of your question/i,
    });
    const searchInput = view.container.querySelector('va-search-input');
    const noResultsMessage = view.queryByText(/we didn’t find/);
    const inquiryStatus = view.queryByRole('heading', {
      level: 3,
      name: /showing the status/i,
    });
    const loadingSpinner = view.container.querySelector('va-loading-indicator');

    expect(heading).to.exist;
    expect(searchInput.getAttribute('label')).to.equal('Reference number');
    expect(noResultsMessage).to.not.exist;
    expect(inquiryStatus).to.not.exist;
    expect(loadingSpinner).to.not.exist;
  });

  it('shows loading spinner on submit and removes to show status message', async () => {
    const view = render(<StatusChecker />);
    const searchInput = view.container.querySelector('va-search-input');
    searchInput.value = 'anything';
    searchInput.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      }),
    );

    await waitFor(() => {
      const loadingSpinner = view.container.querySelector(
        'va-loading-indicator',
      );
      expect(loadingSpinner).to.exist;
    });

    await waitFor(() => {
      const statusMessage = view.container.querySelector('#status-message');
      expect(statusMessage).to.exist;
    });
    const loadingSpinner = view.container.querySelector('va-loading-indicator');
    expect(loadingSpinner).to.not.exist;
  });

  it('shows and focuses the inquiry status on success', async () => {
    const view = render(<StatusChecker />);
    const query = 'A-20250106-308944';
    const searchInput = view.container.querySelector('va-search-input');

    // Simulate input change
    searchInput.value = query;

    // Simulate submit
    searchInput.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      }),
    );

    const inquiryStatus = await view.findByRole('heading', {
      level: 3,
      name: /showing the status/i,
    });
    const focusedElement = view.container.ownerDocument.activeElement;

    expect(inquiryStatus).to.exist;
    expect(inquiryStatus.textContent).to.include(query);
    expect(focusedElement).to.equal(inquiryStatus);
  });

  it('shows and focuses a "no results" message on fail', async () => {
    server.use(
      createGetHandler(`${ENDPOINTS.inquiries}/:inquiryId/status`, () => {
        return jsonResponse(new Error('Not found'), {
          status: 500,
        });
      }),
    );

    const view = render(<StatusChecker />);
    const query = 'invalid';
    const searchInput = view.container.querySelector('va-search-input');
    // Simulate input change
    searchInput.value = query;

    // Simulate submit
    searchInput.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      }),
    );

    const noResultsMessage = await view.findByText(/we didn’t find/i);
    const focusedElement = view.container.ownerDocument.activeElement;

    expect(noResultsMessage).to.exist;
    expect(noResultsMessage.textContent).to.include(query);
    expect(focusedElement).to.equal(noResultsMessage.parentElement);
  });
});
