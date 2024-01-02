import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import UnauthenticatedWarningAlert from '../../../containers/UnauthenticatedWarningAlert';

const isLoggedInStore = ({ isLoggedIn = true } = {}) => ({
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: isLoggedIn,
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('Unauthenticated warning alert', () => {
  const mockStoreLoggedIn = isLoggedInStore({ isLoggedIn: true });
  const mockStoreNotLoggedIn = isLoggedInStore({ isLoggedIn: false });

  it('should not render if the user is logged in', () => {
    const { container } = render(
      <Provider store={mockStoreLoggedIn}>
        <UnauthenticatedWarningAlert />
      </Provider>,
    );
    const selector = container.querySelector('va-alert');
    expect(selector).not.to.exist;
  });

  it('should render `va-alert` with correct title', () => {
    const { container } = render(
      <Provider store={mockStoreNotLoggedIn}>
        <UnauthenticatedWarningAlert />
      </Provider>,
    );
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.text(
      'This application is 7 steps long and it contains several substeps per step. We advise you sign in to save your progress.Note: You can sign in after you start your application. But you’ll lose any information you already filled in.',
    );
  });

  it('should render sign in link', () => {
    const { container } = render(
      <Provider store={mockStoreNotLoggedIn}>
        <UnauthenticatedWarningAlert />
      </Provider>,
    );
    const link = container.querySelector('a');
    expect(link).to.exist;
    expect(link).to.contain.text('sign in to save your progress');
  });
  it('should call toggleLoginModal when the "sign in" link is clicked', async () => {
    const toggleLoginModal = sinon.spy();
    const { container } = render(
      <Provider store={mockStoreNotLoggedIn}>
        <UnauthenticatedWarningAlert toggleLoginModal={toggleLoginModal} />
      </Provider>,
    );
    const link = container.querySelector('a');
    fireEvent.click(link);
    waitFor(() => {
      expect(toggleLoginModal.called).to.be.true;
    });
  });
});
