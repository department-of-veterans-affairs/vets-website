import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from '../../forms-system/src/js/utilities/ui';
import * as focusUtils from '../ui/focus';

import {
  getMotionPreference,
  defaultScrollOptions,
  getScrollOptions,
  getElement,
  getPageYPosition,
  getElementPosition,
} from '../scroll/utils';
import {
  scrollTo,
  scrollToTop,
  scrollToElement,
  scrollToFirstError,
  scrollAndFocus,
  customScrollAndFocus,
} from '../scroll';

describe('getMotionPreference', () => {
  it('should return true when reduced motion is preferred', () => {
    expect(getMotionPreference({ matches: true })).to.be.true;
  });
  it('should return false when reduced motion is not set', () => {
    expect(getMotionPreference({ matches: false })).to.be.false;
  });
  it('should return false when mediaQuery is null', () => {
    expect(getMotionPreference(null)).to.be.false;
  });
});

describe('getScrollOptions', () => {
  let undef;
  const stubMedia = { matches: false };
  beforeEach(() => {
    global.window.Forms = {};
  });
  afterEach(() => {
    global.window.Forms = {};
  });

  it('should return default scroll options', () => {
    expect(getScrollOptions(undef, stubMedia)).to.deep.equal(
      defaultScrollOptions,
    );
  });
  it('should return global scroll options', () => {
    global.window.Forms = {
      scroll: {
        top: 10,
        left: 10,
        offset: 10,
        delay: 100,
        behavior: 'auto',
      },
    };
    expect(getScrollOptions(undef, stubMedia)).to.deep.equal(
      global.window.Forms.scroll,
    );
  });
  it('should return custom scroll options', () => {
    const options = {
      top: 20,
      left: 20,
      offset: 20,
      delay: 200,
      behavior: 'auto',
    };
    expect(getScrollOptions(options, stubMedia)).to.deep.equal(options);
  });
  it('should return expected instant scroll if Cypress is detected', () => {
    global.Cypress = { env: () => true };
    expect(getScrollOptions(undef, stubMedia)).to.deep.equal({
      ...defaultScrollOptions,
      behavior: 'instant',
    });
    global.Cypress = undef;
  });

  it('should return expected motion preference in options', () => {
    const stubMediaTrue = { matches: true };
    expect(getScrollOptions(undef, stubMediaTrue)).to.deep.equal({
      ...defaultScrollOptions,
      behavior: 'instant',
    });
  });
});

describe('getElement', () => {
  const setup = () =>
    render(
      <main>
        <div id="test1">id</div>
        <div name="test2">name</div>
        <div className="test3 test4">class</div>
        <div data-id="test5">selector</div>
      </main>,
    );

  it('should return element by id', () => {
    setup();
    expect(getElement('test1').textContent).to.eq('id');
  });

  it('should return element by id within a root element', () => {
    const { container } = setup();
    expect(getElement('test1', container).textContent).to.eq('id');
  });
  it('should return element by name', () => {
    setup();
    expect(getElement('test2').textContent).to.eq('name');
  });

  it('should return element by name within a root element', () => {
    const { container } = setup();
    expect(getElement('test2', container).textContent).to.eq('name');
  });
  it('should return element by class name', () => {
    setup();
    expect(getElement('test3 test4').textContent).to.eq('class');
  });
  it('should return element by selector', () => {
    setup();
    expect(getElement('[data-id="test5"]').textContent).to.eq('selector');
  });

  it('should return the element', () => {
    const element = document.createElement('div');
    expect(getElement(element)).to.eq(element);
  });
});

describe('getPageYPosition', () => {
  it('should return 0', () => {
    expect(getPageYPosition()).to.eq(0);
  });
  it('should return window pageYOffset', () => {
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      value: 10,
    });
    expect(getPageYPosition()).to.eq(10);
  });
  it('should return documentElement scroll top', () => {
    Object.defineProperty(document, 'documentElement', {
      writable: true,
      value: { scrollTop: 20 },
    });
    expect(getPageYPosition()).to.eq(20);
  });
  it('should return document body scroll top', () => {
    Object.defineProperty(document, 'body', {
      writable: true,
      value: { scrollTop: 30 },
    });
    expect(getPageYPosition()).to.eq(30);
  });
});

describe('getElementPosition', () => {
  it('should return 0 if element not found', () => {
    expect(getElementPosition()).to.eq(0);
    expect(getElementPosition('test')).to.eq(0);
  });
  it('should return number passed into the function', () => {
    expect(getElementPosition(10)).to.eq(10);
  });
  it('should return element position', () => {
    const element = document.createElement('div');
    element.getBoundingClientRect = () => ({ top: 20 });
    expect(getElementPosition(element)).to.eq(20);
  });
  it('should return element position', () => {
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      value: 30,
    });
    const element = document.createElement('div');
    element.getBoundingClientRect = () => ({ top: 40 });
    expect(getElementPosition(element)).to.eq(70);
  });
});

describe('scrollTo', () => {
  const setup = async (spy, scrollOptions) => {
    global.window.Forms = {};
    Object.defineProperty(window, 'scrollTo', { value: spy });
    const { container } = render(
      <div>
        <div id="first" />
        <div id="second" />
      </div>,
    );
    const target = $('#second', container);
    target.getBoundingClientRect = () => ({ top: 30 });
    return scrollTo(target, scrollOptions);
  };

  it('should scroll element to top & focus element with a delay', async () => {
    const scrollSpy = sinon.spy();
    await setup(scrollSpy, {
      // top value from element.getBoundingClientRect
      left: 20,
      delay: 100,
      offset: -10,
    });

    expect(scrollSpy.called).to.be.true;
    expect(scrollSpy.args[0][0]).to.deep.equal({
      top: 20, // top 30 of target + offset -10
      left: 20,
      behavior: 'smooth',
    });
  });

  it('should scroll to defined top setting & focus element with no delay', async () => {
    const scrollSpy = sinon.spy();
    await setup(scrollSpy, {
      top: 100,
      left: 20,
      delay: 0,
      offset: -10,
    });

    expect(scrollSpy.called).to.be.true;
    expect(scrollSpy.args[0][0]).to.deep.equal({
      top: 90,
      left: 20,
      behavior: 'smooth',
    });
  });

  it('should scroll to defined top setting & focus element with a delay', async () => {
    const scrollSpy = sinon.spy();
    await setup(scrollSpy, {
      left: 20,
      delay: 100,
      offset: 10,
    });

    expect(scrollSpy.called).to.be.true;
    expect(scrollSpy.args[0][0]).to.deep.equal({
      top: 40,
      left: 20,
      behavior: 'smooth',
    });
  });
});

describe('scrollToElement', () => {
  // This function is an alias of scrollTo
  const setup = async (spy, scrollOptions) => {
    global.window.Forms = {};
    Object.defineProperty(window, 'scrollTo', { value: spy });
    const { container } = render(
      <div>
        <div id="first" />
        <div id="second" />
      </div>,
    );
    const target = $('#second', container);
    target.getBoundingClientRect = () => ({ top: 30 });
    return scrollToElement(target, scrollOptions);
  };

  it('should scroll element to top & focus element with a delay', async () => {
    const scrollSpy = sinon.spy();
    await setup(scrollSpy, {
      // top value from element.getBoundingClientRect
      left: 20,
      delay: 100,
      offset: -10,
    });

    expect(scrollSpy.called).to.be.true;
    expect(scrollSpy.args[0][0]).to.deep.equal({
      top: 20, // top 30 of target + offset -10
      left: 20,
      behavior: 'smooth',
    });
  });
});

describe('scrollToTop', () => {
  const setup = async (spy, selector, scrollOptions) => {
    global.window.Forms = {};
    Object.defineProperty(window, 'scrollTo', { value: spy });
    const { container } = render(
      <div>
        <div id="first" />
        <div id="second" name="topScrollElement" />
      </div>,
    );
    const target = $('#second', container);
    target.getBoundingClientRect = () => ({ top: 30 });
    return scrollToTop(selector, scrollOptions);
  };

  it('should scroll to name attribute of "topScrollElement"', async () => {
    const scrollSpy = sinon.spy();
    await setup(scrollSpy);

    expect(scrollSpy.called).to.be.true;
    expect(scrollSpy.args[0][0]).to.deep.equal({
      top: 30,
      left: 0,
      behavior: 'smooth',
    });
  });
  it('should scroll selected element to top & apply offset', async () => {
    const scrollSpy = sinon.spy();
    await setup(scrollSpy, '#second', { offset: -10 });

    expect(scrollSpy.called).to.be.true;
    expect(scrollSpy.args[0][0]).to.deep.equal({
      top: 20, // top 30 of target + offset -10
      left: 0,
      behavior: 'smooth',
    });
  });
});

describe('scrollToFirstError', () => {
  let scrollSpy;
  let focusStub;
  let consoleStub;

  const renderForm = children =>
    render(
      <form>
        <p />
        {children}
      </form>,
    );

  const assertScrollSpy = () =>
    sinon.assert.calledWithExactly(scrollSpy, {
      top: -10,
      left: 0,
      behavior: 'smooth',
    });

  const assertFocusStub = value =>
    sinon.assert.calledWithMatch(focusStub, value);

  beforeEach(() => {
    scrollSpy = sinon.spy();
    focusStub = sinon.stub(focusUtils, 'focusElement');
    consoleStub = sinon.stub(console, 'warn');

    Object.defineProperty(window, 'scrollTo', { value: scrollSpy });
    Object.defineProperty(window, 'Forms', { value: {} });
  });

  afterEach(() => {
    scrollSpy.reset();
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

    assertScrollSpy();
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

    assertScrollSpy();
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

    assertScrollSpy();
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

    assertScrollSpy();
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

    assertScrollSpy();
    await waitFor(() => {
      assertFocusStub('[role="alert"]');
    });
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

    assertScrollSpy();
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

    assertScrollSpy();
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

    sinon.assert.notCalled(scrollSpy);
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
    sinon.assert.notCalled(scrollSpy);
    sinon.assert.notCalled(focusStub);
  });

  it('should focus the va-text-input internal input when `focusOnAlertRole` is false', async () => {
    const { container } = renderForm();
    const el = document.createElement('va-text-input');
    el.setAttribute('error', 'some error');
    el.id = 'va-input';

    // Mock the shadow root and internal input element
    const shadowRoot = el.attachShadow({ mode: 'open' });
    const input = document.createElement('input');
    const focusSpy = sinon.spy();
    input.focus = focusSpy;
    shadowRoot.appendChild(input);

    container.querySelector('form').appendChild(el);

    await scrollToFirstError();

    // focusElement from focusUtils should NOT be called for supported VA components
    sinon.assert.notCalled(focusStub);
    // Instead, native focus should be called on the internal input
    await waitFor(() => {
      sinon.assert.calledOnce(focusSpy);
      sinon.assert.calledWithExactly(focusSpy, { preventScroll: true });
    });
  });

  it('should log a warning to the console when no error element is found and timer expires ', async () => {
    // Temporarily remove Mocha flag to test the warning behavior in non-test environments
    const originalMocha = window.Mocha;
    window.Mocha = undefined;

    renderForm();
    await scrollToFirstError();

    // Restore Mocha flag
    window.Mocha = originalMocha;

    sinon.assert.calledWithMatch(consoleStub, /Error element not found/);
    sinon.assert.notCalled(focusStub);
    sinon.assert.notCalled(scrollSpy);
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
    sinon.assert.calledOnce(scrollSpy);
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
    sinon.assert.notCalled(scrollSpy);
  });
});

describe('scrollAndFocus', () => {
  beforeEach(() => {
    global.window.Forms = {};
  });

  it('should scroll to & focus element', async () => {
    const scrollSpy = sinon.spy();
    const focusSpy = sinon.stub(focusUtils, 'focusElement');
    Object.defineProperty(window, 'scrollTo', { value: scrollSpy });
    const { container } = render(
      <div>
        <div id="first" />
        <div id="second" />
      </div>,
    );
    await scrollAndFocus($('#second', container));

    expect(scrollSpy.called).to.be.true;
    expect(scrollSpy.args[0][0]).to.deep.equal({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    expect(focusSpy.args[0][0].id).to.eq('second');
    expect(focusSpy.args[0][1]).to.deep.equal({ preventScroll: true });
    focusSpy.restore();
  });

  it('should not scroll or focus when element is missing', async () => {
    const scrollSpy = sinon.spy();
    const focusSpy = sinon.stub(focusUtils, 'focusElement');
    Object.defineProperty(window, 'scrollTo', { value: scrollSpy });
    const { container } = render(
      <div>
        <div id="first" />
        <div id="second" />
      </div>,
    );
    await scrollAndFocus($('#third', container));

    expect(scrollSpy.notCalled).to.be.true;
    expect(focusSpy.notCalled).to.be.true;
    focusSpy.restore();
  });
});

describe('customScrollAndFocus', () => {
  it('should focus on h3 when no param is passed', async () => {
    const scrollSpy = sinon.spy();
    const focusSpy = sinon.stub(focusUtils, 'focusElement');
    Object.defineProperty(window, 'scrollTo', { value: scrollSpy });

    render(
      <>
        <div id="main">
          <div name="topScrollElement" />
          <h1>H1</h1>
          <h2>H2</h2>
          <h3>H3</h3>
        </div>
      </>,
    );

    await customScrollAndFocus('h3');
    expect(scrollSpy.called).to.be.true;
    expect(scrollSpy.args[0][0]).to.deep.equal({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    expect(focusSpy.args[0][0].textContent).to.eq('H3');
    focusSpy.restore();
  });

  it('should focus when passed a string selector', async () => {
    const scrollSpy = sinon.spy();
    const focusSpy = sinon.stub(focusUtils, 'focusElement');
    Object.defineProperty(window, 'scrollTo', { value: scrollSpy });

    render(
      <>
        <div id="main">
          <div name="topScrollElement" />
          <h1>H1</h1>
          <h2>H2</h2>
          <h3>H3</h3>
        </div>
      </>,
    );

    await customScrollAndFocus('h2');

    expect(scrollSpy.called).to.be.true;
    expect(scrollSpy.args[0][0]).to.deep.equal({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    expect(focusSpy.args[0][0].textContent).to.eq('H2');
    focusSpy.restore();
  });

  it('should call function when passed a function', async () => {
    const spy = sinon.spy();
    await customScrollAndFocus(spy, 2);
    expect(spy.called).to.be.true;
  });
});

describe('Error Scaffolding', () => {
  const {
    isSupportedVaElement,
    findFocusTarget,
    addErrorAnnotations,
    cleanupErrorAnnotations,
    collectAllErrorElements,
    getErrorPropText,
  } = require('../scroll/error-scaffolding');

  describe('isSupportedVaElement', () => {
    it('should return true for supported VA web components', () => {
      const vaCheckbox = document.createElement('va-checkbox');
      const vaCheckboxGroup = document.createElement('va-checkbox-group');
      const vaComboBox = document.createElement('va-combo-box');
      const vaRadio = document.createElement('va-radio');
      const vaRadioOption = document.createElement('va-radio-option');
      const vaSelect = document.createElement('va-select');
      const vaStatementOfTruth = document.createElement(
        'va-statement-of-truth',
      );
      const vaTextInput = document.createElement('va-text-input');
      const vaTextarea = document.createElement('va-textarea');

      expect(isSupportedVaElement(vaCheckbox)).to.be.true;
      expect(isSupportedVaElement(vaCheckboxGroup)).to.be.true;
      expect(isSupportedVaElement(vaComboBox)).to.be.true;
      expect(isSupportedVaElement(vaRadio)).to.be.true;
      expect(isSupportedVaElement(vaRadioOption)).to.be.true;
      expect(isSupportedVaElement(vaSelect)).to.be.true;
      expect(isSupportedVaElement(vaStatementOfTruth)).to.be.true;
      expect(isSupportedVaElement(vaTextInput)).to.be.true;
      expect(isSupportedVaElement(vaTextarea)).to.be.true;
    });

    it('should return false for regular HTML elements', () => {
      const div = document.createElement('div');
      const input = document.createElement('input');
      const span = document.createElement('span');

      expect(isSupportedVaElement(div)).to.be.false;
      expect(isSupportedVaElement(input)).to.be.false;
      expect(isSupportedVaElement(span)).to.be.false;
    });

    it('should return false for unsupported VA components', () => {
      const vaModal = document.createElement('va-modal');
      const vaAlert = document.createElement('va-alert');

      expect(isSupportedVaElement(vaModal)).to.be.false;
      expect(isSupportedVaElement(vaAlert)).to.be.false;
    });

    it('should return false for null or undefined', () => {
      expect(isSupportedVaElement(null)).to.be.false;
      expect(isSupportedVaElement(undefined)).to.be.false;
    });
  });

  describe('getErrorPropText', () => {
    it('should extract error message from error attribute', () => {
      const el = document.createElement('va-text-input');
      el.setAttribute('error', 'This field is required');

      expect(getErrorPropText(el)).to.equal('This field is required');
    });

    it('should extract error message from input-error attribute', () => {
      const el = document.createElement('va-statement-of-truth');
      el.setAttribute('input-error', 'Invalid input');

      expect(getErrorPropText(el)).to.equal('Invalid input');
    });

    it('should extract error message from checkbox-error attribute', () => {
      const el = document.createElement('va-statement-of-truth');
      el.setAttribute('checkbox-error', 'Select at least one option');

      expect(getErrorPropText(el)).to.equal('Select at least one option');
    });

    it('should return empty string when no error exists', () => {
      const el = document.createElement('va-text-input');

      expect(getErrorPropText(el)).to.equal('');
    });

    it('should prioritize error attribute over others', () => {
      const el = document.createElement('div');
      el.setAttribute('error', 'Error message');
      el.setAttribute('input-error', 'Input error message');

      expect(getErrorPropText(el)).to.equal('Error message');
    });
  });

  describe('findFocusTarget', () => {
    it('should return input element from shadow root for va-text-input', () => {
      const vaTextInput = document.createElement('va-text-input');
      const shadowRoot = vaTextInput.attachShadow({ mode: 'open' });
      const input = document.createElement('input');
      input.id = 'test-input';
      shadowRoot.appendChild(input);

      const target = findFocusTarget(vaTextInput);
      expect(target.id).to.equal('test-input');
    });

    it('should return textarea element from shadow root for va-textarea', () => {
      const vaTextarea = document.createElement('va-textarea');
      const shadowRoot = vaTextarea.attachShadow({ mode: 'open' });
      const textarea = document.createElement('textarea');
      textarea.id = 'test-textarea';
      shadowRoot.appendChild(textarea);

      const target = findFocusTarget(vaTextarea);
      expect(target.id).to.equal('test-textarea');
    });

    it('should return select element from shadow root for va-select', () => {
      const vaSelect = document.createElement('va-select');
      const shadowRoot = vaSelect.attachShadow({ mode: 'open' });
      const select = document.createElement('select');
      select.id = 'test-select';
      shadowRoot.appendChild(select);

      const target = findFocusTarget(vaSelect);
      expect(target.id).to.equal('test-select');
    });

    it('should return the element itself when no shadow root exists', () => {
      const vaTextInput = document.createElement('va-text-input');

      const target = findFocusTarget(vaTextInput);
      expect(target).to.equal(vaTextInput);
    });

    it('should return first radio option input for va-radio group', () => {
      const vaRadio = document.createElement('va-radio');
      const option1 = document.createElement('va-radio-option');
      const option2 = document.createElement('va-radio-option');

      const shadowRoot1 = option1.attachShadow({ mode: 'open' });
      const input1 = document.createElement('input');
      input1.type = 'radio';
      input1.id = 'radio-1';
      shadowRoot1.appendChild(input1);

      const shadowRoot2 = option2.attachShadow({ mode: 'open' });
      const input2 = document.createElement('input');
      input2.type = 'radio';
      input2.id = 'radio-2';
      shadowRoot2.appendChild(input2);

      vaRadio.appendChild(option1);
      vaRadio.appendChild(option2);

      const target = findFocusTarget(vaRadio);
      expect(target.id).to.equal('radio-1');
    });

    it('should return first checkbox input for va-checkbox-group', () => {
      const vaCheckboxGroup = document.createElement('va-checkbox-group');
      const checkbox1 = document.createElement('va-checkbox');
      const checkbox2 = document.createElement('va-checkbox');

      const shadowRoot1 = checkbox1.attachShadow({ mode: 'open' });
      const input1 = document.createElement('input');
      input1.type = 'checkbox';
      input1.id = 'checkbox-1';
      shadowRoot1.appendChild(input1);

      const shadowRoot2 = checkbox2.attachShadow({ mode: 'open' });
      const input2 = document.createElement('input');
      input2.type = 'checkbox';
      input2.id = 'checkbox-2';
      shadowRoot2.appendChild(input2);

      vaCheckboxGroup.appendChild(checkbox1);
      vaCheckboxGroup.appendChild(checkbox2);

      const target = findFocusTarget(vaCheckboxGroup);
      expect(target.id).to.equal('checkbox-1');
    });

    it('should skip hidden elements when finding focus target', () => {
      const vaTextInput = document.createElement('va-combo-box');
      const shadowRoot = vaTextInput.attachShadow({ mode: 'open' });

      const hiddenInput = document.createElement('select');
      hiddenInput.setAttribute('hidden', 'true');
      hiddenInput.id = 'hidden-input';

      const visibleInput = document.createElement('input');
      visibleInput.id = 'visible-input';

      shadowRoot.appendChild(hiddenInput);
      shadowRoot.appendChild(visibleInput);

      const target = findFocusTarget(vaTextInput);
      expect(target.id).to.equal('visible-input');
    });
  });

  describe('collectAllErrorElements', () => {
    it('should collect elements with error attributes', () => {
      render(
        <div>
          <va-text-input error="some error" id="error-1">
            Error 1
          </va-text-input>
          <va-text-input id="no-error">Not an error</va-text-input>
          <va-textarea error="another error" id="error-2">
            Error 2
          </va-textarea>
        </div>,
      );

      const selectors = '[error]:not([error=""])';
      const errors = collectAllErrorElements(selectors);

      expect(errors.length).to.equal(2);
      expect(errors[0].id).to.equal('error-1');
      expect(errors[1].id).to.equal('error-2');
    });

    it('should collect nested VA components with errors in shadow roots', () => {
      const { container } = render(<div id="test-container" />);

      // Create a parent VA component with a nested child that has an error
      const parent = document.createElement('va-text-input');
      parent.id = 'parent';
      parent.setAttribute('error', 'Parent error');

      const shadowRoot = parent.attachShadow({ mode: 'open' });
      const child = document.createElement('va-select');
      child.id = 'child';
      child.setAttribute('error', 'Child error');
      shadowRoot.appendChild(child);

      container.appendChild(parent);

      const selectors = '[error]:not([error=""])';
      const errors = collectAllErrorElements(selectors);

      // Should find both parent and nested child
      const errorIds = errors.map(e => e.id);
      expect(errorIds).to.include('parent');
      expect(errorIds).to.include('child');
    });
  });

  describe('addErrorAnnotations', () => {
    it('should add aria-labelledby to input element in shadow root', () => {
      const vaTextInput = document.createElement('va-text-input');
      vaTextInput.setAttribute('error', 'This field is required');
      vaTextInput.setAttribute('label', 'First Name');

      const shadowRoot = vaTextInput.attachShadow({ mode: 'open' });
      const input = document.createElement('input');
      shadowRoot.appendChild(input);

      addErrorAnnotations(vaTextInput);

      expect(input.getAttribute('aria-labelledby')).to.not.be.null;
    });

    it('should create sr-only span with error message', () => {
      const vaTextInput = document.createElement('va-text-input');
      vaTextInput.setAttribute('error', 'This field is required');
      vaTextInput.setAttribute('label', 'Email Address');

      const shadowRoot = vaTextInput.attachShadow({ mode: 'open' });
      const input = document.createElement('input');
      shadowRoot.appendChild(input);

      addErrorAnnotations(vaTextInput);

      const srSpan = shadowRoot.querySelector('span.usa-sr-only');
      expect(srSpan).to.not.be.null;
      expect(srSpan.textContent).to.include('Error');
      expect(srSpan.textContent).to.include('This field is required');
      expect(srSpan.textContent).to.include('Email Address');
    });

    it('should not add annotations to unsupported elements', () => {
      const div = document.createElement('div');
      div.setAttribute('error', 'Some error');

      addErrorAnnotations(div);

      expect(div.querySelector('span.usa-sr-only')).to.be.null;
    });

    it('should remove role="alert" from error message elements', () => {
      const vaTextInput = document.createElement('va-text-input');
      vaTextInput.setAttribute('error', 'This field is required');

      const shadowRoot = vaTextInput.attachShadow({ mode: 'open' });
      const input = document.createElement('input');
      const errorMessage = document.createElement('span');
      errorMessage.id = 'input-error-message';
      errorMessage.setAttribute('role', 'alert');
      errorMessage.setAttribute('aria-live', 'polite');
      shadowRoot.appendChild(input);
      shadowRoot.appendChild(errorMessage);

      addErrorAnnotations(vaTextInput);

      expect(errorMessage.getAttribute('role')).to.be.null;
      expect(errorMessage.getAttribute('aria-live')).to.be.null;
    });

    it('should handle va-radio groups by adding labels to each option', () => {
      const vaRadio = document.createElement('va-radio');
      vaRadio.setAttribute('error', 'Select an option');
      vaRadio.setAttribute('label', 'Choose your answer');

      const option1 = document.createElement('va-radio-option');
      option1.setAttribute('label', 'Option 1');
      const shadowRoot1 = option1.attachShadow({ mode: 'open' });
      const input1 = document.createElement('input');
      input1.type = 'radio';
      shadowRoot1.appendChild(input1);

      const option2 = document.createElement('va-radio-option');
      option2.setAttribute('label', 'Option 2');
      const shadowRoot2 = option2.attachShadow({ mode: 'open' });
      const input2 = document.createElement('input');
      input2.type = 'radio';
      shadowRoot2.appendChild(input2);

      vaRadio.appendChild(option1);
      vaRadio.appendChild(option2);

      addErrorAnnotations(vaRadio);

      // Both options should have generated-error attribute
      expect(option1.getAttribute('generated-error')).to.equal(
        'Select an option',
      );
      expect(option2.getAttribute('generated-error')).to.equal(
        'Select an option',
      );

      // Both inputs should have aria-labelledby
      expect(input1.getAttribute('aria-labelledby')).to.not.be.null;
      expect(input2.getAttribute('aria-labelledby')).to.not.be.null;
    });

    it('should handle va-checkbox-group by adding labels to each checkbox', () => {
      const vaCheckboxGroup = document.createElement('va-checkbox-group');
      vaCheckboxGroup.setAttribute('error', 'Select at least one');
      vaCheckboxGroup.setAttribute('label', 'Select all that apply');

      const checkbox1 = document.createElement('va-checkbox');
      checkbox1.setAttribute('label', 'Checkbox 1');
      const shadowRoot1 = checkbox1.attachShadow({ mode: 'open' });
      const input1 = document.createElement('input');
      input1.type = 'checkbox';
      shadowRoot1.appendChild(input1);

      const checkbox2 = document.createElement('va-checkbox');
      checkbox2.setAttribute('label', 'Checkbox 2');
      const shadowRoot2 = checkbox2.attachShadow({ mode: 'open' });
      const input2 = document.createElement('input');
      input2.type = 'checkbox';
      shadowRoot2.appendChild(input2);

      vaCheckboxGroup.appendChild(checkbox1);
      vaCheckboxGroup.appendChild(checkbox2);

      addErrorAnnotations(vaCheckboxGroup);

      // Both checkboxes should have generated-error attribute
      expect(checkbox1.getAttribute('generated-error')).to.equal(
        'Select at least one',
      );
      expect(checkbox2.getAttribute('generated-error')).to.equal(
        'Select at least one',
      );

      // Both inputs should have aria-labelledby
      expect(input1.getAttribute('aria-labelledby')).to.not.be.null;
      expect(input2.getAttribute('aria-labelledby')).to.not.be.null;
    });
  });

  describe('cleanupErrorAnnotations', () => {
    it('should remove aria-labelledby when error is cleared', () => {
      const vaTextInput = document.createElement('va-text-input');
      vaTextInput.setAttribute('error', 'This field is required');
      vaTextInput.setAttribute('label', 'First Name');

      const shadowRoot = vaTextInput.attachShadow({ mode: 'open' });
      const input = document.createElement('input');
      shadowRoot.appendChild(input);

      document.body.appendChild(vaTextInput);

      // Add annotations
      addErrorAnnotations(vaTextInput);
      expect(input.getAttribute('aria-labelledby')).to.not.be.null;

      // Clear error and cleanup
      vaTextInput.removeAttribute('error');
      cleanupErrorAnnotations();

      expect(input.getAttribute('aria-labelledby')).to.be.null;

      document.body.removeChild(vaTextInput);
    });

    it('should remove sr-only span when error is cleared', () => {
      const vaTextInput = document.createElement('va-text-input');
      vaTextInput.setAttribute('error', 'This field is required');
      vaTextInput.setAttribute('label', 'Email');

      const shadowRoot = vaTextInput.attachShadow({ mode: 'open' });
      const input = document.createElement('input');
      shadowRoot.appendChild(input);

      document.body.appendChild(vaTextInput);

      // Add annotations
      addErrorAnnotations(vaTextInput);
      let srSpan = shadowRoot.querySelector('span.usa-sr-only');
      expect(srSpan).to.not.be.null;

      // Clear error and cleanup
      vaTextInput.removeAttribute('error');
      cleanupErrorAnnotations();

      srSpan = shadowRoot.querySelector('span.usa-sr-only');
      expect(srSpan).to.be.null;

      document.body.removeChild(vaTextInput);
    });

    it('should update error message when it changes', () => {
      const vaTextInput = document.createElement('va-text-input');
      vaTextInput.setAttribute('error', 'First error message');
      vaTextInput.setAttribute('label', 'Username');

      const shadowRoot = vaTextInput.attachShadow({ mode: 'open' });
      const input = document.createElement('input');
      shadowRoot.appendChild(input);

      document.body.appendChild(vaTextInput);

      // Add initial annotations
      addErrorAnnotations(vaTextInput);
      let srSpan = shadowRoot.querySelector('span.usa-sr-only');
      expect(srSpan.textContent).to.include('First error message');

      // Change error message
      vaTextInput.setAttribute('error', 'Second error message');
      cleanupErrorAnnotations();
      addErrorAnnotations(vaTextInput);

      srSpan = shadowRoot.querySelector('span.usa-sr-only');
      expect(srSpan.textContent).to.include('Second error message');
      expect(srSpan.textContent).to.not.include('First error message');

      document.body.removeChild(vaTextInput);
    });

    it('should clear generated-error from radio options when group error is cleared', () => {
      const vaRadio = document.createElement('va-radio');
      vaRadio.setAttribute('error', 'Select an option');

      const option1 = document.createElement('va-radio-option');
      const shadowRoot1 = option1.attachShadow({ mode: 'open' });
      const input1 = document.createElement('input');
      input1.type = 'radio';
      shadowRoot1.appendChild(input1);

      vaRadio.appendChild(option1);
      document.body.appendChild(vaRadio);

      // Add annotations
      addErrorAnnotations(vaRadio);
      expect(option1.getAttribute('generated-error')).to.equal(
        'Select an option',
      );

      // Clear error and cleanup
      vaRadio.removeAttribute('error');
      cleanupErrorAnnotations();

      expect(option1.getAttribute('generated-error')).to.be.null;

      document.body.removeChild(vaRadio);
    });

    it('should handle multiple elements with errors', () => {
      const vaTextInput1 = document.createElement('va-text-input');
      vaTextInput1.setAttribute('error', 'Error 1');
      vaTextInput1.id = 'input-1';
      const shadowRoot1 = vaTextInput1.attachShadow({ mode: 'open' });
      const input1 = document.createElement('input');
      shadowRoot1.appendChild(input1);

      const vaTextInput2 = document.createElement('va-text-input');
      vaTextInput2.setAttribute('error', 'Error 2');
      vaTextInput2.id = 'input-2';
      const shadowRoot2 = vaTextInput2.attachShadow({ mode: 'open' });
      const input2 = document.createElement('input');
      shadowRoot2.appendChild(input2);

      document.body.appendChild(vaTextInput1);
      document.body.appendChild(vaTextInput2);

      // Add annotations to both
      addErrorAnnotations(vaTextInput1);
      addErrorAnnotations(vaTextInput2);

      expect(input1.getAttribute('aria-labelledby')).to.not.be.null;
      expect(input2.getAttribute('aria-labelledby')).to.not.be.null;

      // Clear first error only
      vaTextInput1.removeAttribute('error');
      cleanupErrorAnnotations();

      expect(input1.getAttribute('aria-labelledby')).to.be.null;
      expect(input2.getAttribute('aria-labelledby')).to.not.be.null;

      document.body.removeChild(vaTextInput1);
      document.body.removeChild(vaTextInput2);
    });
  });
});
