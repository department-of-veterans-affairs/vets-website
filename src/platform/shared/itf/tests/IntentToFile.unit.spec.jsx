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
    itfApi = '/v0/intent_to_file',
    itfType = 'compensation',
    loggedIn = true,
    path = '/inside-form',
  } = {}) => ({
    props: {
      baseUrl,
      itfApi,
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

  it('should render searching for ITF loading indicator', () => {
    const { container } = renderPage(getData());

    waitFor(() => {
      expect($('.itf-wrapper', container)).to.exist;
      expect(
        $('va-loading-indicator', container).getAttribute('message'),
      ).to.include(
        'wait while we check to see if you have an existing Intent to File',
      );
    });
  });

  it('should render ITF found alert', () => {
    mockApiRequest(mockItfData(activeItf));
    const { container } = renderPage(getData());

    waitFor(() => {
      expect($('va-alert[status="success"]', container).textContent).to.include(
        'We’ve found your intent to file',
      );
      expect(document.activeElement?.tagName).to.equal('VA-ALERT');
    });
  });

  it('should render ITF created alert', () => {
    mockApiRequest(mockItfData(nonActiveItf));
    const { container } = renderPage(getData());

    waitFor(() => {
      expect($('va-alert[status="success"]', container).textContent).to.include(
        'We automatically recorded your intent to file',
      );
      expect(document.activeElement?.tagName).to.equal('VA-ALERT');
    });
  });

  it('should render ITF failed alert', () => {
    mockApiRequest(mockItfData(), false);
    const { container } = renderPage(getData());

    waitFor(() => {
      expect($('va-alert[status="success"]', container).textContent).to.include(
        'We tried to check for your intent to file',
      );
      expect(document.activeElement?.tagName).to.equal('VA-ALERT');
    });
  });

  it('should not render if not logged in', () => {
    const { container } = renderPage(getData({ loggedIn: false }));
    expect($('.itf-wrapper', container)).to.not.exist;
    expect($('#test').innerHTML).to.equal('');
  });

  it('should not render if missing itfType', () => {
    const { container } = renderPage(getData({ itfType: '' }));
    expect($('.itf-wrapper', container)).to.not.exist;
    expect($('#test').innerHTML).to.equal('');
  });

  it('should not render if unsupported itfType & throw an error', () => {
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
      $('va-button-pair', container).__events.primaryClick();
    }).then(() => {
      expect($('.itf-wrapper', container)).to.not.exist;
      expect($('#test', container)).to.exist;
    });
  });
});
