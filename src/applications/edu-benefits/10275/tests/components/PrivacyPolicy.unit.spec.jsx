import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import sinon from 'sinon';

import * as uiHelpers from 'platform/utilities/ui/webComponents';
import PrivacyPolicy, {
  patchStatementErrorText,
} from '../../components/PrivacyPolicy';

const defaultStore = createCommonStore();

describe('Privacy Policy modal', () => {
  it('Renders correct privacy policy text to open modal', () => {
    const { container, getByTestId, getByText } = render(<PrivacyPolicy />);
    expect(container.querySelector('p.short-line')).to.not.exist;
    expect(getByText('I have read and accept the')).length.to.be(1);
    expect(getByTestId('privacy-policy-text')).to.exist;
  });
  it('Opens and closes the modal when clicked', async () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <PrivacyPolicy />
      </Provider>,
    );
    fireEvent.click(container.querySelector('va-link'));
    expect($('va-modal[visible="true"]', container)).to.be.visible;
    const event = new CustomEvent('closeEvent');
    await $('va-modal', container).__events.closeEvent(event);
    waitFor(() => {
      expect($('va-modal[visible="false"]', container)).to.exist;
    });
  });
  it('changes the checkbox label to the custom certification sentence', async () => {
    const fakeLabel = document.createElement('span');
    fakeLabel.setAttribute('part', 'label');

    const fakeCheckbox = document.createElement('va-checkbox');
    fakeCheckbox.appendChild(fakeLabel);

    if (uiHelpers.querySelectorWithShadowRoot.restore) {
      uiHelpers.querySelectorWithShadowRoot.restore();
    }

    const qsStub = sinon.stub(uiHelpers, 'querySelectorWithShadowRoot');
    qsStub.onCall(0).resolves(null); // p.font-sans-6   (hide note)
    qsStub.onCall(1).resolves(null); // p.short-line    (hide default PP)
    qsStub.onCall(2).resolves(fakeCheckbox); // va-checkbox
    qsStub.onCall(3).resolves(fakeLabel); // span[part="label"]

    render(<PrivacyPolicy />);

    await waitFor(() =>
      expect(fakeLabel.innerHTML).to.equal(
        'I certify that the information I have provided is true and correct to the best of my knowledge and belief.',
      ),
    );

    qsStub.restore();
  });
});
describe('patchStatementErrorText helper', () => {
  let sot; // dummy <va-statement-of-truth>

  afterEach(() => {
    // clean the DOM between tests
    if (sot) {
      sot.remove();
      sot = null;
    }
  });

  it('does nothing when no <va-statement-of-truth> is present', () => {
    // just make sure it doesn’t throw
    patchStatementErrorText();
  });

  it('replaces "application" with "form" when the attribute changes', async () => {
    // 1. add dummy element
    sot = document.createElement('va-statement-of-truth');
    sot.setAttribute(
      'input-error',
      'Please enter your name exactly as it appears on your application: John Doe',
    );
    document.body.appendChild(sot);

    // 2. start the observer
    patchStatementErrorText();

    // 3. trigger a change to the attribute
    sot.setAttribute(
      'input-error',
      'Please enter your name exactly as it appears on your application: John Doe',
    );

    // 4. *wait* for the MutationObserver to run, then assert
    await waitFor(() => {
      expect(sot.getAttribute('input-error')).to.include('form');
      expect(sot.getAttribute('input-error')).to.not.include('application');
    });
  });

  it('leaves the attribute unchanged when it lacks the target word', () => {
    sot = document.createElement('va-statement-of-truth');
    sot.setAttribute('input-error', 'Some other message');
    document.body.appendChild(sot);

    patchStatementErrorText();
    sot.setAttribute('input-error', 'Another message');

    expect(sot.getAttribute('input-error')).to.equal('Another message');
  });
  it('should open modal when Enter key is pressed on privacy policy link', () => {
    const { container, getByTestId } = render(
      <Provider store={defaultStore}>
        <PrivacyPolicy />
      </Provider>,
    );

    const vaLink = container.querySelector('va-link');
    expect(vaLink).to.exist;

    const enterKeyEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    vaLink.dispatchEvent(enterKeyEvent);

    const privacyActNotice = getByTestId('privacy-policy-text');
    expect(privacyActNotice).to.exist;
    expect(privacyActNotice).to.be.visible;
  });
});
