import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import * as userSelectors from 'platform/user/selectors';
import sinon from 'sinon';
import PrivacyPolicy from '../../containers/PrivacyPolicy';

describe('22-1919 <PrivacyPolicy>', () => {
  let dispatchSpy;
  let isLoggedInStub;

  const fakeStore = (formData = {}, isAuthenticated = false) => {
    dispatchSpy = sinon.spy();
    return {
      getState: () => ({
        form: {
          data: formData,
        },
        user: {
          login: {
            currentlyLoggedIn: isAuthenticated,
          },
        },
      }),
      subscribe: () => {},
      dispatch: dispatchSpy,
    };
  };

  beforeEach(() => {
    isLoggedInStub = sinon
      .stub(userSelectors, 'isLoggedIn')
      .callsFake(state => state?.user?.login?.currentlyLoggedIn || false);
  });

  afterEach(() => {
    if (isLoggedInStub) {
      isLoggedInStub.restore();
    }
  });

  const formData = {
    certifyingOfficial: {
      role: { level: 'certifyingOfficial' },
    },
  };

  it('should render privacy policy link/button', () => {
    const { getByTestId } = render(
      <Provider store={fakeStore(formData)}>
        <PrivacyPolicy />,
      </Provider>,
    );
    const privacyPolicyContainer = getByTestId('privacy-policy-text');
    expect(privacyPolicyContainer).to.exist;
  });

  it('should render modal', () => {
    const { container } = render(
      <Provider store={fakeStore(formData)}>
        <PrivacyPolicy />
      </Provider>,
    );
    const modal = container.querySelector('va-modal');
    expect(modal).to.have.attribute('large', 'true');
    expect(modal).to.have.attribute('modal-title', 'Privacy Act Statement');
  });

  it('should display title from form data when certifyingOfficial role is present', () => {
    const store = fakeStore(formData);
    const { getByText } = render(
      <Provider store={store}>
        <PrivacyPolicy />
      </Provider>,
    );

    expect(getByText('Certifying official')).to.exist;
  });

  it('should display "Owner" title when role level is owner', () => {
    const _formData = {
      certifyingOfficial: {
        role: { level: 'owner' },
      },
    };
    const store = fakeStore(_formData);
    const { getByText } = render(
      <Provider store={store}>
        <PrivacyPolicy />
      </Provider>,
    );

    expect(getByText('Owner')).to.exist;
  });

  it('should display "Officer" title when role level is officer', () => {
    const _formData = {
      certifyingOfficial: {
        role: { level: 'officer' },
      },
    };
    const store = fakeStore(_formData);
    const { getByText } = render(
      <Provider store={store}>
        <PrivacyPolicy />
      </Provider>,
    );

    expect(getByText('Officer')).to.exist;
  });

  it('should display custom title when role has other property', () => {
    const _formData = {
      certifyingOfficial: {
        role: { other: 'Custom Title' },
      },
    };
    const store = fakeStore(_formData);
    const { getByText } = render(
      <Provider store={store}>
        <PrivacyPolicy />
      </Provider>,
    );

    expect(getByText('Custom Title')).to.exist;
  });

  it('should open modal when Enter key is pressed on privacy policy link', () => {
    const { container, getByTestId } = render(
      <Provider store={fakeStore(formData)}>
        <PrivacyPolicy />
      </Provider>,
    );

    const vaLink = container.querySelector('va-link');
    expect(vaLink).to.exist;

    const enterKeyEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    vaLink.dispatchEvent(enterKeyEvent);

    const privacyActNotice = getByTestId('privacy-act-notice');
    expect(privacyActNotice).to.exist;
    expect(privacyActNotice).to.be.visible;
  });
});
