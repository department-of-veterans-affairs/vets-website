import React from 'react';
import { render, waitFor, cleanup, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';

import {
  mockApiRequest,
  mockMultipleApiRequests,
  resetFetch,
} from 'platform/testing/unit/helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import IntentToFile from '../IntentToFile';
import { activeItf, nonActiveItf, mockItfData } from './helpers';

describe('IntentToFile', () => {
  beforeEach(() => {
    // Ensure clean state before each test
    resetFetch();
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    resetFetch();
    sessionStorage.clear();
  });
  const getData = ({
    baseUrl = '/path-to-app',
    itfType = 'compensation',
    loggedIn = true,
    path = '/inside-form',
  } = {}) => ({
    props: {
      baseUrl,
      itfType,
      location: { pathname: path },
    },
    mockStore: {
      getState: () => ({
        form: {
          loadedData: {
            metadata: {
              inProgressFormId: '12345',
            },
          },
        },
        user: {
          login: {
            currentlyLoggedIn: loggedIn,
          },
          profile: {
            accountUuid: '67890',
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => ({
        setFormData: () => {},
      }),
    },
  });

  const renderPage = ({ props, mockStore } = {}) =>
    render(
      <div id="test">
        <Provider store={mockStore}>
          <IntentToFile {...props} />
        </Provider>
      </div>,
    );

  // Helper for tests that need async fetch to complete before assertions
  const renderPageAsync = async ({ props, mockStore } = {}) => {
    let result;
    await act(async () => {
      result = render(
        <div id="test">
          <Provider store={mockStore}>
            <IntentToFile {...props} />
          </Provider>
        </div>,
      );
      // Give the fetch time to complete and state to update
      await new Promise(r => setTimeout(r, 100));
    });
    return result;
  };

  it('should render searching for ITF loading indicator', async () => {
    mockApiRequest({});
    const { container } = renderPage(getData());

    await waitFor(() => {
      expect($('.itf-wrapper', container)).to.exist;
      expect(
        $('va-loading-indicator', container).getAttribute('message'),
      ).to.include('Checking if you have an existing intent to file...');
    });
  });

  it('should render ITF found alert', async () => {
    mockApiRequest(mockItfData(activeItf));
    const { container } = await renderPageAsync(getData());

    await waitFor(() => {
      expect($('va-alert[status="success"]', container).textContent).to.include(
        'We have your intent to file',
      );
      expect(document.activeElement?.tagName).to.equal('VA-ALERT');
    });
  });

  it('should render ITF created alert', async () => {
    // First call: fetch ITF returns non-active, Second call: create ITF succeeds
    mockMultipleApiRequests([
      { response: mockItfData(nonActiveItf), shouldResolve: true },
      { response: mockItfData(activeItf), shouldResolve: true },
    ]);
    const { container } = await renderPageAsync(getData());

    await waitFor(() => {
      expect($('va-alert[status="success"]', container).textContent).to.include(
        'We recorded your intent to file',
      );
      expect(document.activeElement?.tagName).to.equal('VA-ALERT');
    });
  });

  it('should render ITF failed alert', async () => {
    // First call: fetch ITF fails, Second call: create ITF also fails
    mockMultipleApiRequests([
      { response: mockItfData(), shouldResolve: false },
      { response: mockItfData(), shouldResolve: false },
    ]);
    const { container } = await renderPageAsync(getData());

    await waitFor(() => {
      expect($('va-alert[status="warning"]', container).textContent).to.include(
        'We’re sorry. We can’t find a record of your intent to file',
      );
      expect(document.activeElement?.tagName).to.equal('VA-ALERT');
    });
  });

  it('should not render if not logged in', () => {
    mockApiRequest({});
    const { container } = renderPage(getData({ loggedIn: false }));
    expect($('.itf-wrapper', container)).to.not.exist;
    expect($('#test').innerHTML).to.equal('');
  });

  it('should not render if missing itfType', () => {
    mockApiRequest({});
    const { container } = renderPage(getData({ itfType: '' }));
    expect($('.itf-wrapper', container)).to.not.exist;
    expect($('#test').innerHTML).to.equal('');
  });

  it('should not render if unsupported itfType & throw an error', () => {
    mockApiRequest({});
    let page;
    try {
      page = renderPage(getData({ itfType: 'test' }));
    } catch (error) {
      expect($('.itf-wrapper', page.container)).to.not.exist;
      expect($('#test').innerHTML).to.equal('');
      expect(error).to.be.an('Error');
      expect(error.message).to.equal(
        'Unsupported itfType: test. Supported types are: compensation, pension, survivor',
      );
    }
  });

  it('should render full ITF page with navigation buttons and restore page when navigation is clicked', async () => {
    mockApiRequest(mockItfData(activeItf));
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <IntentToFile {...props}>
          <div id="test">
            <h2>Testing</h2>
            <p>Some content</p>
          </div>
        </IntentToFile>
      </Provider>,
    );

    // Wait for ITF wrapper to appear
    await waitFor(() => {
      expect($('.itf-wrapper', container)).to.exist;
      expect($('#test', container)).to.not.exist;
    });

    // Click the button and wait for the page to be restored
    $('va-button', container).click();

    await waitFor(() => {
      expect($('.itf-wrapper', container)).to.not.exist;
      expect($('#test', container)).to.exist;
    });
  });

  it('should not autofocus success alert when disableAutoFocus is true and ITF exists', async () => {
    mockApiRequest(mockItfData(activeItf));
    const { props, mockStore } = getData();
    let container;

    await act(async () => {
      const result = render(
        <Provider store={mockStore}>
          <IntentToFile {...props} disableAutoFocus />
        </Provider>,
      );
      container = result.container;
      await new Promise(r => setTimeout(r, 100));
    });

    await waitFor(() => {
      expect($('va-alert[status="success"]', container).textContent).to.include(
        'We have your intent to file',
      );
      expect(document.activeElement?.tagName).to.not.equal('VA-ALERT');
    });
  });

  it('should not autofocus ITF created alert when disableAutoFocus is true and new ITF is created', async () => {
    // First call: fetch ITF returns non-active, Second call: create ITF succeeds
    mockMultipleApiRequests([
      { response: mockItfData(nonActiveItf), shouldResolve: true },
      { response: mockItfData(activeItf), shouldResolve: true },
    ]);
    const { props, mockStore } = getData();
    let container;

    await act(async () => {
      const result = render(
        <Provider store={mockStore}>
          <IntentToFile {...props} disableAutoFocus />
        </Provider>,
      );
      container = result.container;
      await new Promise(r => setTimeout(r, 100));
    });

    await waitFor(() => {
      expect($('va-alert[status="success"]', container).textContent).to.include(
        'We recorded your intent to file',
      );
      expect(document.activeElement?.tagName).to.not.equal('VA-ALERT');
    });
  });

  it('should not autofocus ITF failed alert when disableAutoFocus is true and ITF lookup fails', async () => {
    // First call: fetch ITF fails, Second call: create ITF also fails
    mockMultipleApiRequests([
      { response: mockItfData(), shouldResolve: false },
      { response: mockItfData(), shouldResolve: false },
    ]);
    const { props, mockStore } = getData();
    let container;

    await act(async () => {
      const result = render(
        <Provider store={mockStore}>
          <IntentToFile {...props} disableAutoFocus />
        </Provider>,
      );
      container = result.container;
      await new Promise(r => setTimeout(r, 100));
    });

    await waitFor(() => {
      expect($('va-alert[status="warning"]', container).textContent).to.include(
        'We’re sorry. We can’t find a record of your intent to file',
      );
      expect(document.activeElement?.tagName).to.not.equal('VA-ALERT');
    });
  });
});
