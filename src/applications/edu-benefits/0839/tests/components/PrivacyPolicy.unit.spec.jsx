import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import PrivacyPolicy from '../../components/PrivacyPolicy';

describe('22-0839 <PrivacyPolicy>', () => {
  let dispatchSpy;
  let isLoggedInStub;

  const fakeStore = (formData = {}) => {
    dispatchSpy = sinon.spy();
    return {
      getState: () => ({
        form: {
          data: formData,
        },
      }),
      subscribe: () => {},
      dispatch: dispatchSpy,
    };
  };

  afterEach(() => {
    if (isLoggedInStub) {
      isLoggedInStub.restore();
    }
  });

  it('should render privacy policy link/button', () => {
    const { getByTestId } = render(
      <Provider store={fakeStore({})}>
        <PrivacyPolicy />
      </Provider>,
    );
    const privacyPolicyContainer = getByTestId('privacy-policy-text');
    expect(privacyPolicyContainer).to.exist;
  });

  it('should render modal', () => {
    const { container } = render(
      <Provider store={fakeStore({})}>
        <PrivacyPolicy />
      </Provider>,
    );
    const modal = container.querySelector('va-modal');
    expect(modal).to.have.attribute('large', 'true');
    expect(modal).to.have.attribute('modal-title', 'Privacy Act Statement');
  });

  it('should display title from form data when authorizedOfficial title is present', () => {
    const formData = {
      authorizedOfficial: {
        title: 'president',
      },
    };
    const { getByText } = render(
      <Provider store={fakeStore(formData)}>
        <PrivacyPolicy />
      </Provider>,
    );

    expect(getByText('President')).to.exist;
  });

  it('should display empty string when title is missing', () => {
    const formData = {
      authorizedOfficial: {},
    };
    const { container } = render(
      <Provider store={fakeStore(formData)}>
        <PrivacyPolicy />
      </Provider>,
    );

    const titleElement = container.querySelector(
      '.vads-u-font-size--h3.vads-u-margin-top--0',
    );
    expect(titleElement).to.exist;
    expect(titleElement.textContent).to.equal('');
  });

  it('should display empty string when authorizedOfficial is missing', () => {
    const { container } = render(
      <Provider store={fakeStore({})}>
        <PrivacyPolicy />
      </Provider>,
    );

    const titleElement = container.querySelector(
      '.vads-u-font-size--h3.vads-u-margin-top--0',
    );
    expect(titleElement).to.exist;
    expect(titleElement.textContent).to.equal('');
  });

  it('should capitalize title correctly', () => {
    const formData = {
      authorizedOfficial: {
        title: 'chief administrative officer',
      },
    };
    const { getByText } = render(
      <Provider store={fakeStore(formData)}>
        <PrivacyPolicy />
      </Provider>,
    );

    expect(getByText('Chief administrative officer')).to.exist;
  });

  it('should open modal when privacy policy link is clicked', () => {
    const { container, getByTestId } = render(
      <Provider store={fakeStore({})}>
        <PrivacyPolicy />
      </Provider>,
    );

    const vaLink = container.querySelector('va-link');
    expect(vaLink).to.exist;

    fireEvent.click(vaLink);

    const privacyActNotice = getByTestId('privacy-act-notice');
    expect(privacyActNotice).to.exist;
  });

  it('should open modal when Enter key is pressed on privacy policy link', () => {
    const { container, getByTestId } = render(
      <Provider store={fakeStore({})}>
        <PrivacyPolicy />
      </Provider>,
    );

    const vaLink = container.querySelector('va-link');
    expect(vaLink).to.exist;

    const enterKeyEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    vaLink.dispatchEvent(enterKeyEvent);

    const privacyActNotice = getByTestId('privacy-act-notice');
    expect(privacyActNotice).to.exist;
  });

  it('should render privacy policy text with link, title section, and handle modal interactions', () => {
    const formData = {
      authorizedOfficial: {
        title: 'president',
      },
    };
    const { container, getByTestId } = render(
      <Provider store={fakeStore(formData)}>
        <PrivacyPolicy />
      </Provider>,
    );

    const privacyPolicyContainer = getByTestId('privacy-policy-text');
    const vaLink = privacyPolicyContainer.querySelector('va-link');
    const modal = container.querySelector('va-modal');

    // Test onClick handler - clicking link should open modal and render PrivacyActStatement
    fireEvent.click(vaLink);
    const privacyActNoticeAfterClick = getByTestId('privacy-act-notice');
    expect(privacyActNoticeAfterClick).to.exist;

    // Test onKeyDown handler - Enter key should open modal
    // Close modal first by calling onCloseEvent handler
    if (modal.__events && modal.__events.closeEvent) {
      modal.__events.closeEvent();
    }

    // Press Enter key on link to test onKeyDown handler
    const enterKeyEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    });
    vaLink.dispatchEvent(enterKeyEvent);

    // Verify modal opens again after Enter key press
    const privacyActNoticeAfterEnter = getByTestId('privacy-act-notice');
    expect(privacyActNoticeAfterEnter).to.exist;
  });
});
