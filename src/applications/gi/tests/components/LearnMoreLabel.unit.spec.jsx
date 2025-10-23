import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, cleanup } from '@testing-library/react';
import * as ui from 'platform/utilities/ui';
import LearnMoreLabel from '../../components/LearnMoreLabel';

describe('<LearnMoreLabel/>', () => {
  let sandbox;
  let createdRecordEvent;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    createdRecordEvent = false;
    if (typeof window.recordEvent !== 'function') {
      Object.defineProperty(window, 'recordEvent', {
        value: () => {},
        writable: true,
        configurable: true,
      });
      createdRecordEvent = true;
    }
  });

  afterEach(() => {
    cleanup();
    sandbox.restore();
    if (createdRecordEvent) {
      delete window.recordEvent;
    }
  });

  it('should render', () => {
    const { container } = render(<LearnMoreLabel />);
    expect(container.firstChild).to.exist;
  });

  it('should bold text', () => {
    const { container } = render(<LearnMoreLabel bold />);
    expect(container.querySelector('strong')).to.exist;
  });

  it('then should call focus with labelFor and record an event on click', () => {
    const focusMock = sandbox.stub(ui, 'focusElement');
    const recordEventMock = sandbox.stub(window, 'recordEvent');

    const { container } = render(<LearnMoreLabel labelFor="test" />);
    const outerSpan = container.querySelector(
      'span.vads-u-margin--0.vads-u-display--inline-block',
    );

    fireEvent.click(outerSpan);

    expect(focusMock.called).to.be.false;
    expect(recordEventMock.called).to.be.false;
  });

  it('sets button text to lower-case "learn more" by default', () => {
    const { container } = render(<LearnMoreLabel />);
    const vaBtn = container.querySelector('va-button');
    expect(vaBtn).to.exist;
    expect(vaBtn.getAttribute('text')).to.equal('learn more');
  });

  it('capitalizes button text when capitalize=true', () => {
    const { container } = render(<LearnMoreLabel capitalize />);
    const vaBtn = container.querySelector('va-button');
    expect(vaBtn).to.exist;
    expect(vaBtn.getAttribute('text')).to.equal('Learn more');
  });
});
