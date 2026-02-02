import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import * as uiHelpers from 'platform/utilities/ui/webComponents';
import PrivacyPolicy from '../../components/PrivacyPolicy';

describe('22-10278 <PrivacyPolicy>', () => {
  it('opens modal when privacy policy link is clicked', () => {
    const { container, getByTestId } = render(<PrivacyPolicy />);
    const vaLink = container.querySelector('va-link');
    fireEvent.click(vaLink);
    expect(getByTestId('privacy-act-notice')).to.exist;
  });

  it('opens modal when Enter key is pressed on privacy policy link', () => {
    const { container, getByTestId } = render(<PrivacyPolicy />);
    const vaLink = container.querySelector('va-link');
    const enterKeyEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    vaLink.dispatchEvent(enterKeyEvent);
    expect(getByTestId('privacy-act-notice')).to.exist;
  });

  it('sets certify checkbox label when shadow DOM label exists', async () => {
    const fakeLabel = document.createElement('span');
    fakeLabel.setAttribute('part', 'label');
    const fakeCheckbox = document.createElement('va-checkbox');
    fakeCheckbox.appendChild(fakeLabel);

    if (uiHelpers.querySelectorWithShadowRoot.restore) {
      uiHelpers.querySelectorWithShadowRoot.restore();
    }
    const qsStub = sinon.stub(uiHelpers, 'querySelectorWithShadowRoot');
    qsStub.onCall(0).resolves(null);
    qsStub.onCall(1).resolves(null);
    qsStub.onCall(2).resolves(fakeCheckbox);
    qsStub.onCall(3).resolves(fakeLabel);

    render(<PrivacyPolicy />);

    await waitFor(() =>
      expect(fakeLabel.innerHTML).to.equal(
        'I certify that the information above is correct and true to the best of my knowledge and belief.',
      ),
    );

    qsStub.restore();
  });
});
