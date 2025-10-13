import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import UnauthenticatedWarningAlert from '../../../components/UnauthenticatedWarningAlert';

const createMockStore = (isLoggedIn = false) => ({
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: isLoggedIn,
      },
    },
  }),
  subscribe: () => {},
  dispatch: sinon.spy(),
});

describe('UnauthenticatedWarningAlert', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = createMockStore();
  });

  it('should render without crashing when user is not logged in', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <UnauthenticatedWarningAlert />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('should display warning alert when user is not logged in', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <UnauthenticatedWarningAlert />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('warning');
  });

  it('should contain application length information', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <UnauthenticatedWarningAlert />
      </Provider>,
    );

    expect(container.textContent).to.include('7 steps long');
    expect(container.textContent).to.include('several substeps per step');
  });

  it('should contain sign in link', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <UnauthenticatedWarningAlert />
      </Provider>,
    );

    const signInLink = container.querySelector('va-link');
    expect(signInLink).to.exist;
    expect(signInLink.getAttribute('text')).to.equal(
      'sign in to save your progress',
    );
  });

  it('should dispatch toggleLoginModal when sign in link is clicked', () => {
    const mockToggleLoginModal = sinon.spy();
    const { container } = render(
      <Provider store={mockStore}>
        <UnauthenticatedWarningAlert toggleLoginModal={mockToggleLoginModal} />
      </Provider>,
    );

    const signInLink = container.querySelector('va-link');
    fireEvent.click(signInLink);

    expect(mockStore.dispatch.calledOnce).to.be.true;
  });

  it('should contain note about signing in after starting', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <UnauthenticatedWarningAlert />
      </Provider>,
    );

    expect(container.textContent).to.include('You can sign in after you start');
    expect(container.textContent).to.include(
      'lose any information you already filled in',
    );
  });

  it('should not render when user is logged in', () => {
    const loggedInStore = createMockStore(true);
    const { container } = render(
      <Provider store={loggedInStore}>
        <UnauthenticatedWarningAlert />
      </Provider>,
    );

    expect(container.firstChild).to.be.null;
  });

  it('should have correct paragraph structure', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <UnauthenticatedWarningAlert />
      </Provider>,
    );

    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).to.equal(2);

    // First paragraph should have margin classes
    expect(paragraphs[0].className).to.include('vads-u-margin-y--0');
  });
});
