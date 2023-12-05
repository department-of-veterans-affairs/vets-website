import React from 'react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { App, mapDispatchToProps, mapStateToProps } from '.';

const store = ({ pensionFormEnabled = false } = {}) => ({
  getState: () => ({
    user: {
      profile: {
        loading: false,
        savedForms: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    },
    featureToggles: {
      loading: false,
      // eslint-disable-next-line camelcase
      pension_form_enabled: pensionFormEnabled,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('Pension Widget <App>', () => {
  it('renders the pension widget app', () => {
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect($('h3', container).textContent).to.equal(
      `You can’t use our online application right now`,
    );
  });

  it('renders the application status component', () => {
    const mockStore = store({ pensionFormEnabled: true });
    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect($('h2', container).textContent).to.equal(`How do I apply?`);
  });

  it('shows "Refer to your saved form" link when user is logged in', () => {
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <App loggedIn />
      </Provider>,
    );

    const selector = 'va-link[href="/pension/application/527EZ/introduction"]';
    expect($(selector, container)).to.not.be.null;
  });

  it('shows "Sign in to VA.gov" button when user is not logged in', () => {
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );

    const selector = 'va-button[text="Sign in to VA.gov"]';
    expect($(selector, container)).to.not.be.null;
  });

  it('calls toggleLoginModal when "Sign in to VA.gov" button is clicked', () => {
    const toggleLoginMock = sinon.spy();

    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <App toggleLoginModal={toggleLoginMock} />
      </Provider>,
    );
    const button = $('va-button', container);
    fireEvent.click(button);
    expect(toggleLoginMock.called).to.be.true;
  });

  describe('mapStateToProps', () => {
    it('should render appropriately', () => {
      const goodObj = { user: { login: { currentlyLoggedIn: false } } };
      expect(mapStateToProps(goodObj)).to.eql({ loggedIn: false });
    });
  });

  describe('mapDispatchToProps', () => {
    it('does it', () => {
      const dispatchSpy = sinon.spy();
      const props = mapDispatchToProps(dispatchSpy);

      props.toggleLoginModal(true);

      expect(dispatchSpy.calledOnce).to.be.true;
      expect(dispatchSpy.calledWithExactly(toggleLoginModalAction(true))).to.be
        .true;
    });
  });
});
