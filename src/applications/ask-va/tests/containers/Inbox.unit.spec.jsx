import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import React from 'react';

import Inbox from '../../containers/Inbox';
import { ENDPOINTS } from '../../utils/api';

describe('<Inbox />', () => {
  beforeEach(() => {
    server.use(
      createGetHandler(ENDPOINTS.inquiries, () => {
        return jsonResponse(
          {
            data: [
              {
                id: '1',
                attributes: {
                  inquiryNumber: 'A-1',
                  status: 'In Progress',
                  categoryName: 'Benefits',
                  createdOn: '01/01/2024 12:00:00 PM',
                  lastUpdate: '01/01/2024 12:00:00 PM',
                  submitterQuestion: 'Personal question',
                  levelOfAuthentication: 'Personal',
                },
              },
            ],
          },
          { status: 200 },
        );
      }),
    );
  });

  it('renders InboxLayout when API succeeds', async () => {
    const view = render(<Inbox />);

    await waitFor(() => {
      // Check for heading and filters
      expect(view.getByRole('heading', { name: 'Your questions' })).to.exist;
      const status = view.container.querySelector('va-select[name="status"]');
      expect(status).to.exist;

      // Check that the inquiry content is displayed
      expect(view.getByText('Personal question')).to.exist;
      expect(view.getByText('A-1')).to.exist;
    });
  });

  it('shows a loading indicator before content', async () => {
    const view = render(<Inbox />);

    // Initially should show loading indicator
    const loadingIndicator = view.getByTestId('loading-indicator');
    expect(loadingIndicator).to.exist;
    expect(loadingIndicator.getAttribute('message')).to.equal('Loading...');

    const heading = await view.findByRole('heading', {
      level: 2,
      name: /your questions/i,
    });
    const loadingGone = view.queryByTestId('loading-indicator');

    expect(heading).to.exist;
    expect(loadingGone).to.not.exist;
  });

  it('shows an alert when the API request fails', async () => {
    server.use(
      createGetHandler(ENDPOINTS.inquiries, () => {
        return jsonResponse({}, { status: 500 });
      }),
    );
    const view = render(<Inbox />);

    await waitFor(() => {
      const errorAlert = view.container.querySelector('va-alert');
      expect(errorAlert).to.exist;
      expect(errorAlert.getAttribute('status')).to.equal('info');
    });
  });
});
