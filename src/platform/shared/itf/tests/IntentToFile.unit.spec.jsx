import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';

import { mockApiRequest } from 'platform/testing/unit/helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import IntentToFile from '../IntentToFile';
import { activeItf, nonActiveItf, mockItfData } from './helpers';

describe('IntentToFile', () => {
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
    const { container } = renderPage(getData());

    await waitFor(() => {
      expect($('va-alert[status="success"]', container).textContent).to.include(
        'We have your intent to file',
      );
      expect(document.activeElement?.tagName).to.equal('VA-ALERT');
    });
  });

  it('should render ITF created alert', async () => {
    mockApiRequest(mockItfData(nonActiveItf));
    const { container } = renderPage(getData());

    await waitFor(() => {
      expect($('va-alert[status="success"]', container).textContent).to.include(
        'We recorded your intent to file',
      );
      expect(document.activeElement?.tagName).to.equal('VA-ALERT');
    });
  });

  it('should render ITF failed alert', async () => {
    mockApiRequest(mockItfData(), false);
    const { container } = renderPage(getData());

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
    mockApiRequest(mockItfData(activeItf));
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
    mockApiRequest(mockItfData(nonActiveItf));
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

  it('should not autofocus ITF failed alert when disableAutoFocus is true and ITF lookup fails', () => {
    mockApiRequest(mockItfData(), false);
    const { container } = renderPage(getData());

    waitFor(() => {
      expect($('va-alert[status="success"]', container).textContent).to.include(
        'We’re sorry. We can’t find a record of your intent to file',
      );
      expect(document.activeElement?.tagName).to.not.equal('VA-ALERT');
    });
  });
});
