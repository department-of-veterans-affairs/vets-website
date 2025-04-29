import React from 'react';
import Scroll from 'react-scroll';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { $ } from '../../../forms-system/src/js/utilities/ui';
import * as focusUtils from '../../ui/focus';
import { getScrollOptions, scrollToFirstError, scrollAndFocus } from '../../ui';

describe('scrollToFirstError', () => {
  let scrollStub;
  let focusStub;
  let consoleStub;

  const renderForm = children =>
    render(
      <form>
        <p />
        {children}
      </form>,
    );

  const assertScrollStub = () =>
    sinon.assert.calledWithExactly(scrollStub, -10, {
      duration: 0,
      delay: 0,
      smooth: false,
    });

  const assertFocusStub = value =>
    sinon.assert.calledWithMatch(focusStub, value);

  beforeEach(() => {
    scrollStub = sinon.stub(Scroll.animateScroll, 'scrollTo');
    focusStub = sinon.stub(focusUtils, 'focusElement');
    consoleStub = sinon.stub(console, 'warn');
  });
  afterEach(() => {
    scrollStub.restore();
    focusStub.restore();
    consoleStub.restore();
  });

  it('should scroll & apply focus to first element with `usa-input-error` class', async () => {
    renderForm(
      <>
        <div id="first" className="usa-input">
          not an error
        </div>
        <div id="second" className="usa-input-error">
          error 1
        </div>
        <div id="third" className="usa-input-error input-error-date">
          error 2
        </div>
      </>,
    );
    await scrollToFirstError();

    assertScrollStub();
    assertFocusStub(sinon.match.has('id', 'second'));
  });

  it('should scroll & apply focus to first element with `input-error-date` class', async () => {
    renderForm(
      <>
        <div id="first" className="usa-input">
          not an error
        </div>
        <div id="second" className="input-error-date">
          error 1
        </div>
        <div id="third" className="usa-input-error input-error-date">
          error 2
        </div>
      </>,
    );
    await scrollToFirstError();

    assertScrollStub();
    assertFocusStub(sinon.match.has('id', 'second'));
  });

  it('should scroll & apply focus to first element with error attribute', async () => {
    renderForm(
      <>
        <div id="first" className="usa-input">
          not an error
        </div>
        <div id="second" error="some error">
          error 1
        </div>
        <div id="third" className="usa-input-error input-error-date">
          error 2
        </div>
      </>,
    );
    await scrollToFirstError();

    assertScrollStub();
    assertFocusStub(sinon.match.has('id', 'second'));
  });

  it('should scroll & apply focus fo first element with error attribute and ignore empty error attributes', async () => {
    renderForm(
      <>
        <div id="first" className="usa-input" error>
          not an error
        </div>
        <div id="second" error="">
          error 1
        </div>
        <div
          id="third"
          className="usa-input-error input-error-date"
          error="some error"
        >
          error 2
        </div>
      </>,
    );
    await scrollToFirstError();

    assertScrollStub();
    assertFocusStub(sinon.match.has('id', 'third'));
  });

  it('should scroll to first element with error attribute & apply focus to internal `role="alert"`', async () => {
    renderForm(
      <>
        <div id="first" className="usa-input">
          not an error
        </div>
        <va-text-input id="second" label="test" error="some error" />
        <div id="third" className="usa-input-error input-error-date">
          error 2
        </div>
      </>,
    );
    await scrollToFirstError({ focusOnAlertRole: true });

    assertScrollStub();
    assertFocusStub('[role="alert"]');
  });

  it('should scroll and focus when error element appears via DOM mutation', async () => {
    // render with no initial error element & simulate re-render
    const { container } = renderForm();

    await new Promise(resolve => {
      const el = document.createElement('div');
      el.className = 'usa-input-error';
      el.id = 'delayed';
      container.querySelector('form').appendChild(el);
      requestAnimationFrame(resolve);
    });
    await scrollToFirstError();

    assertScrollStub();
    assertFocusStub(sinon.match.has('id', 'delayed'));
  });

  it('should scroll and focus when error appears nested in a newly added node', async () => {
    // render with no initial error element & simulate re-render
    const { container } = renderForm();

    await new Promise(resolve => {
      const wrapper = document.createElement('div');
      const nested = document.createElement('div');
      nested.className = 'usa-input-error';
      nested.id = 'nested-error';
      wrapper.appendChild(nested);
      container.querySelector('form').appendChild(wrapper);
      requestAnimationFrame(resolve);
    });
    await scrollToFirstError();

    assertScrollStub();
    assertFocusStub(sinon.match.has('id', 'nested-error'));
  });

  it('should not scroll or apply focus when a modal is open', async () => {
    renderForm(
      <>
        <div id="first" className="usa-input">
          not an error
        </div>
        <div id="second" error="some error">
          error 1
        </div>
        <div id="third" className="usa-input-error input-error-date">
          error 2
        </div>
        <va-modal visible="true" />
      </>,
    );
    await scrollToFirstError();

    sinon.assert.notCalled(scrollStub);
    sinon.assert.notCalled(focusStub);
  });

  it('should not scroll or apply focus when a modal is open inside of a shadow root', async () => {
    // render with existing error element
    const { container } = renderForm(
      <>
        <div id="first" className="usa-input-error">
          error 1
        </div>
      </>,
    );

    // create `va-omb-info` component with open modal in its shadow root
    const shadowHost = document.createElement('va-omb-info');
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
    const modal = document.createElement('va-modal');
    modal.setAttribute('visible', 'true');
    shadowRoot.appendChild(modal);
    container.querySelector('form').appendChild(shadowHost);

    await scrollToFirstError();
    sinon.assert.notCalled(scrollStub);
    sinon.assert.notCalled(focusStub);
  });

  it('should call `focusElement` with element when `focusOnAlertRole` is false and element is a VA-* tag', async () => {
    const { container } = renderForm();
    const el = document.createElement('va-text-input');
    el.setAttribute('error', 'some error');
    el.id = 'va-input';
    container.querySelector('form').appendChild(el);

    await scrollToFirstError();
    sinon.assert.calledWithExactly(focusStub, el);
  });

  it('should log a warning to the console when no error element is found and timer expires ', async () => {
    renderForm();
    await scrollToFirstError();

    sinon.assert.calledWithMatch(consoleStub, /Error element not found/);
    sinon.assert.notCalled(focusStub);
    sinon.assert.notCalled(scrollStub);
  });

  it('should disconnect observer after finding the first error', async () => {
    const { container } = renderForm(
      <div id="first" className="usa-input-error" />,
    );
    await scrollToFirstError();

    // Add second error element after a small delay
    await new Promise(resolve => {
      const el = document.createElement('div');
      el.className = 'usa-input-error';
      el.id = 'second';
      container.querySelector('form').appendChild(el);
      requestAnimationFrame(resolve);
    });

    sinon.assert.calledOnce(focusStub);
    sinon.assert.calledOnce(scrollStub);
  });

  it('should ignore non-element nodes in mutation observer', async () => {
    const { container } = renderForm();

    await new Promise(resolve => {
      const textNode = document.createTextNode('Some text');
      container.querySelector('form').appendChild(textNode);
      requestAnimationFrame(resolve);
    });
    await scrollToFirstError();

    sinon.assert.notCalled(focusStub);
    sinon.assert.notCalled(scrollStub);
  });
});

describe('scrollAndFocus', () => {
  let scrollSpy;
  let focusSpy;

  beforeEach(() => {
    scrollSpy = sinon.stub(Scroll.scroller, 'scrollTo');
    focusSpy = sinon.stub(focusUtils, 'focusElement');
  });
  afterEach(() => {
    scrollSpy.restore();
    focusSpy.restore();
  });

  it('should scroll to & focus element', () => {
    const { container } = render(
      <div>
        <div id="first" />
        <div id="second" />
      </div>,
    );
    scrollAndFocus($('#second', container));
    waitFor(() => {
      expect(scrollSpy.args[0]).to.deep.equal([
        -10, // offsets, scrollTop & top all return zero (-10 hard-coded offset)
        { duration: 0, delay: 0, smooth: false },
      ]);
      expect(focusSpy.args[0][0].id).to.eq('second');
    });
  });

  it('should not scroll or focus when element is missing', () => {
    const { container } = render(
      <div>
        <div id="first" />
        <div id="second" />
      </div>,
    );
    scrollAndFocus($('#third', container));
    waitFor(() => {
      expect(scrollSpy.notCalled).to.be.true;
      expect(focusSpy.notCalled).to.be.true;
    });
  });
});

describe('getScrollOptions', () => {
  beforeEach(() => {
    // Reset window.Forms before each test
    window.Forms = undefined;

    // Clear the mock for matchMedia before each test
    window.matchMedia = () => ({ matches: false });
  });

  it('should return default scroll options if nothing else exists', () => {
    const options = getScrollOptions();

    expect(options).to.deep.equal({
      duration: 500,
      delay: 0,
      smooth: true,
    });
  });

  it('should return window.Forms.scroll option when it exists', () => {
    window.Forms = {
      scroll: {
        duration: 1000,
        delay: 100,
        smooth: false,
      },
    };

    const options = getScrollOptions();

    expect(options).to.deep.equal({
      duration: 1000,
      delay: 100,
      smooth: false,
    });
  });

  it('should include additionalOptions when they exist', () => {
    window.Forms = {
      scroll: {
        delay: 200,
        duration: 1000,
      },
    };

    const options = getScrollOptions({ offset: -100 });

    expect(options).to.deep.equal({
      delay: 200,
      duration: 1000,
      offset: -100,
      smooth: true, // Default value since it's not overridden
    });
  });

  it('should override all other scroll options when user prefers reduced motion', () => {
    window.Forms = {
      scroll: {
        delay: 200,
        duration: 1000,
        smooth: true,
      },
    };
    // Simulate prefers-reduced-motion
    window.matchMedia = () => ({
      matches: true,
    });

    const options = getScrollOptions({ delay: 5, offset: 20 });

    expect(options).to.deep.equal({
      duration: 0,
      delay: 0,
      offset: 20,
      smooth: false,
    });
  });
});
