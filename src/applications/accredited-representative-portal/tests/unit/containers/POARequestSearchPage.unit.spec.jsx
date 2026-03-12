import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import * as featureToggleModule from '~/platform/utilities/feature-toggles/useFeatureToggle';
import * as uiModule from 'platform/utilities/ui';

import POARequestSearchPage from '../../../containers/POARequestSearchPage';

describe('POARequestSearchPage', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(uiModule, 'focusElement');
  });

  afterEach(() => {
    sandbox.restore();
  });

  const renderPage = ({
    flagEnabled = true,
    flagLoading = false,
    loaderData = {
      data: [],
      meta: {
        page: {
          total: 0,
          number: 1,
          totalPages: 1,
        },
      },
      showPOA403Alert: false,
    },
    initialEntries = [
      '/?status=pending&sort=newest&perPage=20&page=1&show=false',
    ],
  } = {}) => {
    sandbox.stub(featureToggleModule, 'useFeatureToggle').returns({
      TOGGLE_NAMES: {
        accreditedRepresentativePortalIndividualAccept:
          'accredited_representative_portal_individual_accept',
      },
      useToggleValue: () => flagEnabled,
      useToggleLoadingValue: () => flagLoading,
    });

    const router = createMemoryRouter(
      [
        {
          path: '/',
          loader: async () => loaderData,
          element: (
            <POARequestSearchPage
              title={{ title: 'Representation requests' }}
            />
          ),
        },
      ],
      { initialEntries },
    );

    return render(<RouterProvider router={router} />);
  };

  it('renders new copy when individual accept flag is enabled', async () => {
    const { findByText, container } = renderPage({
      flagEnabled: true,
    });

    await findByText('Representation requests');

    const text = container.textContent;

    expect(text).to.include('Representation requests');
    expect(text).to.include(
      'This list shows representation requests that have been received in the portal over the last 60 days.',
    );
    expect(text).to.include('Here’s how to receive requests in the portal:');

    const additionalInfo = container.querySelector(
      '[data-testid="representation-requests-additional-info"]',
    );

    expect(additionalInfo).to.exist;
    expect(additionalInfo.getAttribute('trigger')).to.equal(
      'Receiving and reviewing requests in the portal',
    );

    expect(text).to.not.include(
      'You can accept or decline representation requests (power of attorney) in the Accredited Representative Portal.',
    );
  });

  it('renders loading indicator while feature flag is loading', async () => {
    const { container, queryByTestId } = renderPage({ flagLoading: true });

    await waitFor(() => {
      expect(container.querySelector('va-loading-indicator')).to.exist;
    });

    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator.getAttribute('message')).to.equal('Loading...');
    expect(queryByTestId('representation-requests-heading')).to.not.exist;
  });

  it('renders old copy when individual accept flag is disabled', async () => {
    const { findByText, container } = renderPage({
      flagEnabled: false,
    });

    await findByText('Representation requests');

    const text = container.textContent;

    expect(text).to.include('Representation requests');
    expect(text).to.include(
      'You can accept or decline representation requests (power of attorney) in the Accredited Representative Portal. Requests will expire after 60 days. Expired requests will be removed from the portal.',
    );
    expect(text).to.include('Note:');
    expect(text).to.not.include(
      'This list shows representation requests that have been received in the portal over the last 60 days.',
    );

    const additionalInfo = container.querySelector(
      '[data-testid="representation-requests-additional-info"]',
    );

    expect(additionalInfo).to.not.exist;
  });

  it('renders new 403 alert copy when alert is shown and flag is enabled', async () => {
    const { findByText, container } = renderPage({
      flagEnabled: true,
      loaderData: {
        data: [],
        meta: {
          page: {
            total: 0,
            number: 1,
            totalPages: 1,
          },
        },
        showPOA403Alert: true,
      },
    });

    await findByText('Representation requests');

    const text = container.textContent;

    expect(text).to.include('This feature hasn’t been activated');
    expect(text).to.include(
      'Veterans Service Organizations (VSOs) have to activate the Representation Requests feature for their organization if they want to receive requests in the portal.',
    );
    expect(text).to.include(
      'This feature is currently not available to claims agents or attorneys.',
    );

    expect(text).to.not.include(
      'You currently can’t receive requests in the portal',
    );
  });

  it('renders old 403 alert copy when alert is shown and flag is disabled', async () => {
    const { findByText, container } = renderPage({
      flagEnabled: false,
      loaderData: {
        data: [],
        meta: {
          page: {
            total: 0,
            number: 1,
            totalPages: 1,
          },
        },
        showPOA403Alert: true,
      },
    });

    await findByText('Representation requests');

    const text = container.textContent;

    expect(text).to.include(
      'You currently can’t receive requests in the portal',
    );
    expect(text).to.include(
      'None of your organizations have activated the Representation Request feature.',
    );
    expect(text).to.include(
      'This feature is not yet available for establishing representation with claims agents or attorneys.',
    );

    expect(text).to.not.include('This feature hasn’t been activated');
  });

  it('renders pending empty state text', async () => {
    const { findByText, container } = renderPage({
      initialEntries: [
        '/?status=pending&sort=newest&perPage=20&page=1&show=false',
      ],
    });

    await findByText('Pending representation requests');

    expect(container.textContent).to.include(
      'No pending representation requests.',
    );
  });

  it('renders processed empty state text', async () => {
    const { findByText, container } = renderPage({
      initialEntries: [
        '/?status=processed&sort=newest&perPage=20&page=1&show=false',
      ],
    });

    await findByText('Processed representation requests');

    expect(container.textContent).to.include(
      'No processed representation requests.',
    );
  });
});
