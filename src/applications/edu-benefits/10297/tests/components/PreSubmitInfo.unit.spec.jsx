import React from 'react';
import { expect } from 'chai';
import { render, waitFor, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import * as webComponents from 'platform/utilities/ui/webComponents';

import PreSubmitInfo from '../../components/PreSubmitInfo';

describe('<PreSubmitInfo />', () => {
  let querySelectorStub;

  afterEach(() => {
    if (querySelectorStub) querySelectorStub.restore();
  });

  it('should render privacy policy link/button', () => {
    const { container } = render(<PreSubmitInfo />);
    const selector = container.querySelector('va-link');

    expect(selector)
      .to.have.attr('text')
      .to.contain('privacy policy.');
  });

  it('should render modal', () => {
    const { container } = render(<PreSubmitInfo />);
    const selector = container.querySelector('va-modal');

    expect(selector)
      .to.have.attr('large')
      .to.equal('true');
    expect(selector)
      .to.have.attr('modal-title')
      .to.contain('Privacy Act Statement');
  });

  it('should handle onClick event to open modal', () => {
    const { container } = render(<PreSubmitInfo />);
    const button = container.querySelector('va-link');
    const modal = container.querySelector('va-modal');

    expect(modal)
      .to.have.attr('visible')
      .to.equal('false');

    button.click();

    expect(modal)
      .to.have.attr('visible')
      .to.equal('true');
  });

  it('should set clarifying text when label element exists', async () => {
    const hiddenParagraph = { setAttribute: sinon.spy() };
    const checkbox = {};
    const labelEl = { innerHTML: '' };

    querySelectorStub = sinon
      .stub(webComponents, 'querySelectorWithShadowRoot')

      .onFirstCall()
      .resolves(hiddenParagraph)

      .onSecondCall()
      .resolves(checkbox)

      .onThirdCall()
      .resolves(labelEl);

    const { container } = render(<PreSubmitInfo />);

    await waitFor(() => {
      const modal = container.querySelector('va-modal');
      expect(modal).to.exist; // ensure component rendered
      expect(hiddenParagraph.setAttribute.calledWith('style', 'display:none;'))
        .to.be.true;
      expect(labelEl.innerHTML).to.contain(
        'I certify that the information I have provided is true and correct',
      );
    });
  });

  it('should open modal on Enter keydown and ignore other keys', async () => {
    const { container } = render(<PreSubmitInfo />);
    const link = container.querySelector('va-link');
    const modal = container.querySelector('va-modal');

    expect(modal)
      .to.have.attr('visible')
      .to.equal('false');

    fireEvent.keyDown(link, { key: ' ' });

    expect(modal)
      .to.have.attr('visible')
      .to.equal('false');

    fireEvent.keyDown(link, { key: 'Enter' });

    await waitFor(() => {
      expect(modal)
        .to.have.attr('visible')
        .to.equal('true');
    });
  });
});
