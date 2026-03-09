import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import App from '../containers/App';

const getData = ({ featureToggles = {} } = {}) => ({
  mockStore: {
    getState: () => ({
      featureToggles,
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('App Component', () => {
  let originalLocation;
  let mockLocation;
  const sinon = require('sinon');
  beforeEach(() => {
    originalLocation = window.location;

    mockLocation = {
      href: 'http://localhost/',
      assign: sinon.stub(),
      replace: sinon.stub(),
    };

    delete window.location;
    window.location = mockLocation;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('renders the id when the dependents_enable_form_viewer_mfe feature flag is on', async () => {
    const { mockStore } = getData({
      featureToggles: {
        [`dependents_enable_form_viewer_mfe`]: true,
      },
    });
    const mockParams = { id: 'test-123' };

    const { container } = render(
      <Provider store={mockStore}>
        <App params={mockParams} />
      </Provider>,
    );
    const loadingIndicator = $('va-loading-indicator', container);

    expect(loadingIndicator).not.to.exist;

    expect(container.textContent).to.include('test-123');
  });

  it('redirects and does NOT render the id when the dependents_enable_form_viewer_mfe feature flag is off', async () => {
    const { mockStore } = getData({
      featureToggles: {
        [`dependents_enable_form_viewer_mfe`]: false,
      },
    });
    const mockParams = { id: 'test-456' };

    const { container } = render(
      <Provider store={mockStore}>
        <App params={mockParams} />
      </Provider>,
    );

    const loadingIndicator = $('va-loading-indicator', container);

    expect(loadingIndicator).to.exist;
    expect(container.textContent).not.to.include('test-456');
    expect(window.location.href).to.include('/my-va');
  });
  it('shouldnt render anything if the feature toggles are still loading', async () => {
    const { mockStore } = getData({
      featureToggles: {
        [`dependents_enable_form_viewer_mfe`]: true,
        loading: true,
      },
    });
    const mockParams = { id: 'test-123' };

    const { container } = render(
      <Provider store={mockStore}>
        <App params={mockParams} />
      </Provider>,
    );
    const loadingIndicator = $('va-loading-indicator', container);

    expect(loadingIndicator).not.to.exist;

    expect(container.textContent).to.include('');
    expect(container.textContent).not.to.include('test-123');
  });
});
