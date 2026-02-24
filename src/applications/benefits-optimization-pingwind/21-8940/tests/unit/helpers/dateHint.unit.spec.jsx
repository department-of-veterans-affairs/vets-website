import { expect } from 'chai';
import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import * as webComponents from 'platform/utilities/ui/webComponents';
import { HideDefaultDateHint } from '../../../helpers/dateHint';

describe('21-8940 dateHint', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    cleanup();
    sandbox.restore();
  });

  it('adds a style and marks the element as updated', async () => {
    const element = {
      hasAttribute: sandbox.stub().returns(false),
      setAttribute: sandbox.spy(),
      removeAttribute: sandbox.spy(),
    };
    const shadowRoot = {
      querySelector: sandbox.stub().returns(null),
      appendChild: sandbox.spy(),
    };

    sandbox.stub(webComponents, 'waitForShadowRoot').resolves({ shadowRoot });
    sandbox.stub(document, 'querySelectorAll').returns([element]);

    render(<HideDefaultDateHint />);

    await waitFor(() => {
      expect(
        element.setAttribute.calledWith('data-hide-default-date-hint', 'true'),
      ).to.be.true;
      expect(shadowRoot.appendChild.calledOnce).to.be.true;
    });
  });

  it('clears the attribute when a shadow root is missing', async () => {
    const element = {
      hasAttribute: sandbox.stub().returns(false),
      setAttribute: sandbox.spy(),
      removeAttribute: sandbox.spy(),
    };

    sandbox
      .stub(webComponents, 'waitForShadowRoot')
      .resolves({ shadowRoot: null });
    sandbox.stub(document, 'querySelectorAll').returns([element]);

    render(<HideDefaultDateHint />);

    await waitFor(() => {
      expect(element.removeAttribute.calledWith('data-hide-default-date-hint'))
        .to.be.true;
    });
  });

  it('skips work when the element is already marked', async () => {
    const element = {
      hasAttribute: sandbox.stub().returns(true),
      setAttribute: sandbox.spy(),
      removeAttribute: sandbox.spy(),
    };

    sandbox
      .stub(webComponents, 'waitForShadowRoot')
      .resolves({ shadowRoot: {} });
    sandbox.stub(document, 'querySelectorAll').returns([element]);

    render(<HideDefaultDateHint />);

    await waitFor(() => {
      expect(element.setAttribute.called).to.be.false;
      expect(element.removeAttribute.called).to.be.false;
    });
  });
});
