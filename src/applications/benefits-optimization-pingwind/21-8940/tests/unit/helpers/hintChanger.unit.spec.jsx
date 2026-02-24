import { expect } from 'chai';
import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import * as webComponents from 'platform/utilities/ui/webComponents';
import { changeDefaultDateHint } from '../../../helpers/hintChanger';

describe('21-8940 hintChanger', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    cleanup();
    sandbox.restore();
  });

  it('updates the date hint text when a shadow root exists', async () => {
    const dateHintElement = { textContent: 'before' };
    const shadowRoot = {
      querySelector: sandbox
        .stub()
        .withArgs('#dateHint')
        .returns(dateHintElement),
    };

    sandbox.stub(webComponents, 'waitForShadowRoot').resolves({ shadowRoot });
    sandbox.stub(document, 'querySelectorAll').returns([{}]);

    const ChangeDefaultDateHint = changeDefaultDateHint;
    render(<ChangeDefaultDateHint />);

    await waitFor(() => {
      expect(dateHintElement.textContent).to.equal(
        'For example: January 19 2022',
      );
    });
  });

  it('swallows waitForShadowRoot errors', async () => {
    sandbox.stub(webComponents, 'waitForShadowRoot').rejects(new Error('fail'));
    sandbox.stub(document, 'querySelectorAll').returns([{}]);

    const ChangeDefaultDateHint = changeDefaultDateHint;
    render(<ChangeDefaultDateHint />);

    await waitFor(() => {
      expect(webComponents.waitForShadowRoot.called).to.be.true;
    });
  });
});
