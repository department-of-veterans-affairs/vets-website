import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
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

  // Don't use render container as a getElement parameter. The `getElement`
  // functions are undefined. Only document (default) appears to work.
  it('should return element by id', () => {
    setup();
    expect(getElement('test1').textContent).to.eq('id');
  });
  it('should return element by name', () => {
    setup();
    expect(getElement('test2').textContent).to.eq('name');
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
    Object.defineProperty(document.body, 'scrollTo', { value: spy });
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
    Object.defineProperty(document.body, 'scrollTo', { value: spy });
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
    Object.defineProperty(document.body, 'scrollTo', { value: spy });
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
  beforeEach(() => {
    global.window.Forms = {};
  });

  it('should scroll to & focus first usa-input-error class', async () => {
    const scrollSpy = sinon.spy();
    const focusSpy = sinon.stub(focusUtils, 'focusElement');
    Object.defineProperty(document.body, 'scrollTo', { value: scrollSpy });
    render(
      <form>
        <p />
        <div id="first" className="usa-input">
          not an error
        </div>
        <div id="second" className="usa-input-error">
          error 1
        </div>
        <div id="third" className="usa-input-error input-error-date">
          error 2
        </div>
      </form>,
    );
    await scrollToFirstError();

    expect(scrollSpy.called).to.be.true;
    expect(scrollSpy.args[0][0]).to.deep.equal({
      top: -10,
      left: 0,
      behavior: 'smooth',
    });
    expect(focusSpy.args[0][0].id).to.eq('second');
    focusSpy.restore();
  });

  it('should scroll to & focus first input-error-date class', async () => {
    const scrollSpy = sinon.spy();
    const focusSpy = sinon.stub(focusUtils, 'focusElement');
    Object.defineProperty(document.body, 'scrollTo', { value: scrollSpy });
    render(
      <form>
        <p />
        <div id="first" className="usa-input">
          not an error
        </div>
        <div id="second" className="input-error-date">
          error 1
        </div>
        <div id="third" className="usa-input-error input-error-date">
          error 2
        </div>
      </form>,
    );
    await scrollToFirstError();

    expect(scrollSpy.called).to.be.true;
    expect(scrollSpy.args[0][0]).to.deep.equal({
      top: -10,
      left: 0,
      behavior: 'smooth',
    });
    expect(focusSpy.args[0][0].id).to.eq('second');
    focusSpy.restore();
  });

  it('should scroll to & focus first error attribute (web component)', async () => {
    const scrollSpy = sinon.spy();
    const focusSpy = sinon.stub(focusUtils, 'focusElement');
    Object.defineProperty(document.body, 'scrollTo', { value: scrollSpy });
    render(
      <form>
        <p />
        <div id="first" className="usa-input">
          not an error
        </div>
        <div id="second" error="some error">
          error 1
        </div>
        <div id="third" className="usa-input-error input-error-date">
          error 2
        </div>
      </form>,
    );
    await scrollToFirstError();

    expect(scrollSpy.called).to.be.true;
    expect(scrollSpy.args[0][0]).to.deep.equal({
      top: -10,
      left: 0,
      behavior: 'smooth',
    });
    expect(focusSpy.args[0][0].id).to.eq('second');
    focusSpy.restore();
  });

  it('should scroll to & focus first error attribute (web component) and ignore empty error attributes', async () => {
    const scrollSpy = sinon.spy();
    const focusSpy = sinon.stub(focusUtils, 'focusElement');
    Object.defineProperty(document.body, 'scrollTo', { value: scrollSpy });
    render(
      <form>
        <p />
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
      </form>,
    );
    await scrollToFirstError();

    expect(scrollSpy.called).to.be.true;
    expect(scrollSpy.args[0][0]).to.deep.equal({
      top: -10,
      left: 0,
      behavior: 'smooth',
    });
    expect(focusSpy.args[0][0].id).to.eq('third');
    focusSpy.restore();
  });

  it('should scroll to first error attribute (web component) & focus internal role="alert"', async () => {
    const scrollSpy = sinon.spy();
    const focusSpy = sinon.stub(focusUtils, 'focusElement');
    Object.defineProperty(document.body, 'scrollTo', { value: scrollSpy });
    render(
      <form>
        <p />
        <div id="first" className="usa-input">
          not an error
        </div>
        <va-text-input id="second" label="test" error="some error" />
        <div id="third" className="usa-input-error input-error-date">
          error 2
        </div>
      </form>,
    );
    await scrollToFirstError({ focusOnAlertRole: true });

    expect(scrollSpy.called).to.be.true;
    expect(scrollSpy.args[0][0]).to.deep.equal({
      top: -10,
      left: 0,
      behavior: 'smooth',
    });
    expect(focusSpy.args[0][0]).to.eq('[role="alert"]');
    focusSpy.restore();
  });

  it('should not scroll or focus if a modal is open', async () => {
    const scrollSpy = sinon.spy();
    const focusSpy = sinon.stub(focusUtils, 'focusElement');
    Object.defineProperty(document.body, 'scrollTo', { value: scrollSpy });
    render(
      <form>
        <p />
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
      </form>,
    );
    await scrollToFirstError();

    expect(scrollSpy.notCalled).to.be.true;
    expect(focusSpy.notCalled).to.be.true;
    focusSpy.restore();
  });
});

describe('scrollAndFocus', () => {
  beforeEach(() => {
    global.window.Forms = {};
  });

  it('should scroll to & focus element', async () => {
    const scrollSpy = sinon.spy();
    const focusSpy = sinon.stub(focusUtils, 'focusElement');
    Object.defineProperty(document.body, 'scrollTo', { value: scrollSpy });
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
    focusSpy.restore();
  });

  it('should not scroll or focus when element is missing', async () => {
    const scrollSpy = sinon.spy();
    const focusSpy = sinon.stub(focusUtils, 'focusElement');
    Object.defineProperty(document.body, 'scrollTo', { value: scrollSpy });
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
    Object.defineProperty(document.body, 'scrollTo', { value: scrollSpy });

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
    Object.defineProperty(document.body, 'scrollTo', { value: scrollSpy });

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
