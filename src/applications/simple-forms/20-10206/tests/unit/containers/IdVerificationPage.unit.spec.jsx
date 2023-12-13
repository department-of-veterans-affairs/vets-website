import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';
import { expect } from 'chai';

import * as selectors from 'platform/user/selectors';
import IdVerificationPage from '../../../containers/IdVerificationPage';

const sandbox = sinon.createSandbox();
const mockStore = configureMockStore();
const store = mockStore({
  showLoadingIndicator: false,
});

describe('<IdVerificationPage />', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('renders without crashing', () => {
    sandbox.stub(selectors, 'isProfileLoading').returns(false);

    const mockProps = {
      route: {
        formConfig: {},
      },
      router: {
        location: {
          pathname: 'identity-verification',
        },
      },
    };

    render(
      <Provider store={store}>
        <IdVerificationPage {...mockProps} />
      </Provider>,
    );
  });

  it('renders loading indicator when showLoadingIndicator is true', () => {
    sandbox.stub(selectors, 'isProfileLoading').returns(true);

    const loadedStore = mockStore({
      showLoadingIndicator: true,
    });

    const mockProps = {
      route: {
        formConfig: {},
      },
      router: {
        location: {
          pathname: 'identity-verification',
        },
      },
    };

    const { container } = render(
      <Provider store={loadedStore}>
        <IdVerificationPage {...mockProps} />
      </Provider>,
    );

    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.not.be.null;
  });

  it('renders expected content when showLoadingIndicator is false', () => {
    sandbox.stub(selectors, 'isProfileLoading').returns(false);

    const mockProps = {
      route: {
        formConfig: {},
      },
      router: {
        location: {
          pathname: 'identity-verification',
        },
      },
    };

    const { container } = render(
      <Provider store={store}>
        <IdVerificationPage {...mockProps} />
      </Provider>,
    );

    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.be.null;

    const formTitle = container.querySelector('h1');
    expect(formTitle).to.not.be.null;
    expect(formTitle.textContent).to.equal('Request personal records');

    const vaAlert = container.querySelector('va-alert');
    expect(vaAlert).to.not.be.null;

    const verifyIdentityLink = container.querySelector(
      '[data-testid="id-verification-link"]',
    );
    expect(verifyIdentityLink).to.not.be.null;

    const downloadLink = container.querySelector(
      '[data-testid="download-link"]',
    );
    expect(downloadLink).to.not.be.null;
  });
});
