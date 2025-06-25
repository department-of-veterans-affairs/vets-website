import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import sinon from 'sinon';

import * as uiHelpers from 'platform/utilities/ui/webComponents';
import PrivacyPolicy from '../../components/PrivacyPolicy';

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
