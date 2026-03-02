import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';
import { Main } from '../../containers/Main';
import { AVAILABILITY_STATUSES } from '../../utils/constants';

const TestComponent = () => <div data-testid="children" />;

// Destructure AVAILABILITY_STATUSES object for easier access
const {
  awaitingResponse,
  available,
  backendServiceError,
  backendAuthenticationError,
  unavailable,
  letterEligibilityError,
} = AVAILABILITY_STATUSES;

const defaultProps = {
  letters: {},
  destination: {},
  lettersAvailability: awaitingResponse,
  benefitSummaryOptions: {
    benefitInfo: '',
    serviceInfo: '',
  },
  optionsAvailable: {},
  getLetterListAndBSLOptions: () => {},
  profileHasEmptyAddress: () => {},
  emptyAddress: false,
};

const getStore = () =>
  createStore(() => ({
    letters: {
      letters: {},
      lettersAvailability: awaitingResponse,
      benefitInfo: {},
      serviceInfo: {},
      optionsAvailable: {},
    },
    user: {
      login: {
        currentlyLoggedIn: false,
      },
    },
    ebenefits: {
      isProxyUrlActive: false,
    },
  }));

describe('<Main>', () => {
  it('renders', () => {
    const { container } = render(
      <Provider store={getStore()}>
        <Main {...defaultProps} />
      </Provider>,
    );
    expect(container).to.not.be.undefined;
  });

  it('shows a loading spinner when awaiting response', () => {
    const { container } = render(
      <Provider store={getStore()}>
        <Main {...defaultProps} />
      </Provider>,
    );
    expect(container.querySelector('va-loading-indicator')).to.not.be.null;
  });

  it('renders its children when letters are available', () => {
    const props = { ...defaultProps, lettersAvailability: available };
    const screen = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <Routes>
            <Route element={<Main {...props} />}>
              <Route path="/" element={<TestComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('children')).to.exist;
  });

  it('shows a system down message for backend service error', () => {
    const props = { ...defaultProps, lettersAvailability: backendServiceError };
    const { container } = render(
      <Provider store={getStore()}>
        <Main {...props} />
      </Provider>,
    );
    expect(container.querySelector('#systemDownMessage')).to.not.be.null;
  });

  it('should show backend authentication error', () => {
    const props = {
      ...defaultProps,
      lettersAvailability: backendAuthenticationError,
    };
    const { container } = render(
      <Provider store={getStore()}>
        <Main {...props} />
      </Provider>,
    );
    expect(container.querySelector('#records-not-found')).to.not.be.null;
  });

  it('renders children for letter eligibility errors', () => {
    const props = {
      ...defaultProps,
      lettersAvailability: letterEligibilityError,
    };
    const screen = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <Routes>
            <Route element={<Main {...props} />}>
              <Route path="/" element={<TestComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('children')).to.exist;
  });

  it('should show system down message when service is unavailable', () => {
    const props = { ...defaultProps, lettersAvailability: unavailable };
    const { container } = render(
      <Provider store={getStore()}>
        <Main {...props} />
      </Provider>,
    );
    expect(container.querySelector('#systemDownMessage')).to.not.be.null;
  });

  it('renders system down message for all unspecified errors', () => {
    const props = { ...defaultProps, lettersAvailability: 'bogusError' };
    const { container } = render(
      <Provider store={getStore()}>
        <Main {...props} />
      </Provider>,
    );
    expect(container.querySelector('#systemDownMessage')).to.not.be.null;
  });

  it('fetches all necessary data after mounting', () => {
    const spies = {
      getLetterListAndBSLOptions: sinon.spy(),
    };

    const props = { ...defaultProps, ...spies };
    render(
      <Provider store={getStore()}>
        <Main {...props} />
      </Provider>,
    );
    // componentDidMount is called automatically by React, check the spy was called
    expect(spies.getLetterListAndBSLOptions.callCount).to.equal(1);
  });

  it('render NoAddressBanner when emptyAddress is true', () => {
    const props = {
      ...defaultProps,
      lettersAvailability: 'hasEmptyAddress',
      emptyAddress: true,
    };
    const { container } = render(
      <Provider store={getStore()}>
        <Main {...props} />
      </Provider>,
    );
    // NoAddressBanner is a component, check for its text
    expect(container.textContent).to.include('have a valid address on file');
  });

  it('calls profileHasEmptyAddress when emptyAddress is true', () => {
    const getLetterListAndBSLOptions = sinon.spy();
    const profileHasEmptyAddress = sinon.spy();

    const props = {
      ...defaultProps,
      emptyAddress: true,
      getLetterListAndBSLOptions,
      profileHasEmptyAddress,
      shouldUseLighthouse: true,
    };

    render(
      <Provider store={getStore()}>
        <Main {...props} />
      </Provider>,
    );
    // componentDidMount is called, it should call profileHasEmptyAddress
    expect(getLetterListAndBSLOptions.called).to.be.false;
    expect(profileHasEmptyAddress.callCount).to.equal(1);
  });

  it('render Other resources section', () => {
    const { getByText } = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <Routes>
            <Route element={<Main {...defaultProps} />}>
              <Route path="/" element={<TestComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(getByText('Other sources of VA benefit documentation')).to.exist;
  });
});
