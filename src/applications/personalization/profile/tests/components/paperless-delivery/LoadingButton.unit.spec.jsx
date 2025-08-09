import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { expect } from 'chai';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import { LoadingButton } from '../../../components/paperless-delivery/LoadingButton';

describe('LoadingButton', () => {
  let timer;

  beforeEach(() => {
    timer = sinon.useFakeTimers({
      toFake: ['setTimeout'],
    });
  });

  afterEach(() => {
    timer.restore();
    cleanup();
  });

  it('focuses the button on render', () => {
    const { container } = render(<LoadingButton />);
    const button = container.querySelector('va-button');
    expect(button).to.exist;
    const mockButton = { focus: sinon.spy() };
    Object.defineProperty(button, 'shadowRoot', {
      value: { querySelector: () => mockButton },
      configurable: true,
    });
    expect(mockButton.focus.calledOnce).to.be.false;
    act(() => {
      timer.tick(50);
    });
    expect(mockButton.focus.calledOnce).to.be.true;
  });
});
