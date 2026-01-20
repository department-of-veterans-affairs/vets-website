import React from 'react';
import { render, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { server, rest } from 'platform/testing/unit/mocha-setup';
import IntentToFile from '../IntentToFile';
import { activeItf, nonActiveItf, mockItfData } from './helpers';

describe('IntentToFile', () => {
  afterEach(() => {
    cleanup();
    server.resetHandlers();
  });

  // Helper to set up MSW handler for ITF API
  const mockItfApi = (responseData, shouldSucceed = true) => {
    server.use(
      rest.get(/\/v0\/intent_to_file\//, (req, res, ctx) => {
        if (shouldSucceed) {
          return res(ctx.status(200), ctx.json(responseData));
        }
        return res(ctx.status(500), ctx.json({ errors: ['Server error'] }));
      }),
      rest.post(/\/v0\/intent_to_file\//, (req, res, ctx) => {
        if (shouldSucceed) {
          return res(ctx.status(200), ctx.json(responseData));
        }
        return res(ctx.status(500), ctx.json({ errors: ['Server error'] }));
      }),
    );
  };

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

  it('should render searching for ITF loading indicator', async () => {
    mockItfApi({});
    const { container } = renderPage(getData());

    await waitFor(() => {
      expect($('.itf-wrapper', container)).to.exist;
      expect(
        $('va-loading-indicator', container).getAttribute('message'),
      ).to.include('Checking if you have an existing intent to file...');
    });
  });

  it('should render ITF found alert', async () => {
    mockItfApi(mockItfData(activeItf));
    const { container } = renderPage(getData());

    await waitFor(() => {
      expect($('va-alert[status="success"]', container).textContent).to.include(
        'We have your intent to file',
      );
      expect(document.activeElement?.tagName).to.equal('VA-ALERT');
    });
  });

  it('should render ITF created alert', async () => {
    mockItfApi(mockItfData(nonActiveItf));
    const { container } = renderPage(getData());

    await waitFor(() => {
      expect($('va-alert[status="success"]', container).textContent).to.include(
        'We recorded your intent to file',
      );
      expect(document.activeElement?.tagName).to.equal('VA-ALERT');
    });
  });

  it('should render ITF failed alert', async () => {
    mockItfApi(mockItfData(), false);
    const { container } = renderPage(getData());

    await waitFor(() => {
      expect($('va-alert[status="warning"]', container).textContent).to.include(
        'We’re sorry. We can’t find a record of your intent to file',
      );
      expect(document.activeElement?.tagName).to.equal('VA-ALERT');
    });
  });

  it('should not render if not logged in', () => {
    mockItfApi({});
    const { container } = renderPage(getData({ loggedIn: false }));
    expect($('.itf-wrapper', container)).to.not.exist;
    expect($('#test').innerHTML).to.equal('');
  });

  it('should not render if missing itfType', () => {
    mockItfApi({});
    const { container } = renderPage(getData({ itfType: '' }));
    expect($('.itf-wrapper', container)).to.not.exist;
    expect($('#test').innerHTML).to.equal('');
  });

  it('should not render if unsupported itfType & throw an error', () => {
    mockItfApi({});
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
    mockItfApi(mockItfData(activeItf));
    const { props, mockStore } = getData();
    const { container } = await render(
      <Provider store={mockStore}>
        <IntentToFile {...props}>
          <div id="test">
            <h2>Testing</h2>
            <p>Some content</p>
          </div>
        </IntentToFile>
      </Provider>,
    );

    await waitFor(() => {
      expect($('.itf-wrapper', container)).to.exist;
      expect($('#test', container)).to.not.exist;
      $('va-button', container).click();
    }).then(() => {
      expect($('.itf-wrapper', container)).to.not.exist;
      expect($('#test', container)).to.exist;
    });
  });

  it('should not autofocus success alert when disableAutoFocus is true and ITF exists', async () => {
    mockItfApi(mockItfData(activeItf));
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <IntentToFile {...props} disableAutoFocus />
      </Provider>,
    );

    await waitFor(() => {
      expect($('va-alert[status="success"]', container).textContent).to.include(
        'We have your intent to file',
      );
      expect(document.activeElement?.tagName).to.not.equal('VA-ALERT');
    });
  });

  it('should not autofocus ITF created alert when disableAutoFocus is true and new ITF is created', async () => {
    mockItfApi(mockItfData(nonActiveItf));
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <IntentToFile {...props} disableAutoFocus />
      </Provider>,
    );

    await waitFor(() => {
      expect($('va-alert[status="success"]', container).textContent).to.include(
        'We recorded your intent to file',
      );
      expect(document.activeElement?.tagName).to.not.equal('VA-ALERT');
    });
  });

  it('should not autofocus ITF failed alert when disableAutoFocus is true and ITF lookup fails', async () => {
    mockItfApi(mockItfData(), false);
    const { container } = renderPage(getData());

    await waitFor(() => {
      expect($('va-alert[status="warning"]', container).textContent).to.include(
        'We’re sorry. We can’t find a record of your intent to file',
      );
      expect(document.activeElement?.tagName).to.not.equal('VA-ALERT');
    });
  });
});
