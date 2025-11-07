import { expect } from 'chai';
import sinon from 'sinon';

import { skipToContent } from '../../../utils/skipToContent';

describe('21-4140 utils/skipToContent', () => {
  let originalFocusContent;
  let originalScrollTo;
  let originalPageYOffsetDescriptor;

  beforeEach(() => {
    originalFocusContent = window.focusContent;
    originalScrollTo = window.scrollTo;
    originalPageYOffsetDescriptor = Object.getOwnPropertyDescriptor(
      window,
      'pageYOffset',
    );
  });

  afterEach(() => {
    window.focusContent = originalFocusContent;
    window.scrollTo = originalScrollTo;
    if (originalPageYOffsetDescriptor) {
      Object.defineProperty(
        window,
        'pageYOffset',
        originalPageYOffsetDescriptor,
      );
    } else {
      delete window.pageYOffset;
    }
    if (typeof document !== 'undefined') {
      document.body.innerHTML = '';
    }
  });

  it('delegates to window.focusContent when available', () => {
    const event = { preventDefault: sinon.spy() };
    const focusContentSpy = sinon.spy();
    window.focusContent = focusContentSpy;

    skipToContent(event);

    expect(event.preventDefault.calledOnce).to.be.true;
    expect(focusContentSpy.calledOnce).to.be.true;
    expect(focusContentSpy.firstCall.args).to.deep.equal([event]);
  });

  it('focuses #main-content, scrolls to it, and removes the temporary tabindex on blur', () => {
    const event = { preventDefault: sinon.spy() };
    const main = document.createElement('div');
    main.id = 'main-content';
    document.body.appendChild(main);

    const focusSpy = sinon.spy();
    main.focus = focusSpy;

    let blurHandler;
    const addEventListener = sinon.spy((name, handler, _useCapture) => {
      if (name === 'blur') {
        blurHandler = handler;
      }
    });
    const removeEventListener = sinon.spy();
    main.addEventListener = addEventListener;
    main.removeEventListener = removeEventListener;

    const getBoundingClientRectStub = sinon
      .stub(main, 'getBoundingClientRect')
      .returns({ top: 150 });
    const scrollToStub = sinon.stub(window, 'scrollTo');
    Object.defineProperty(window, 'pageYOffset', {
      configurable: true,
      value: 25,
    });
    window.focusContent = undefined;

    skipToContent(event);

    expect(event.preventDefault.calledOnce).to.be.true;
    expect(main.getAttribute('tabindex')).to.equal('-1');
    expect(blurHandler).to.be.a('function');
    expect(addEventListener.calledOnce).to.be.true;
    expect(addEventListener.firstCall.args).to.deep.equal([
      'blur',
      blurHandler,
      true,
    ]);
    expect(scrollToStub.calledOnce).to.be.true;
    expect(scrollToStub.firstCall.args).to.deep.equal([0, 175]);
    expect(focusSpy.calledOnce).to.be.true;

    blurHandler();

    expect(removeEventListener.calledOnce).to.be.true;
    expect(removeEventListener.firstCall.args).to.deep.equal([
      'blur',
      blurHandler,
      true,
    ]);
    expect(main.hasAttribute('tabindex')).to.be.false;

    getBoundingClientRectStub.restore();
    scrollToStub.restore();
  });

  it('falls back to scrollIntoView when window.scrollTo is unavailable', () => {
    const event = { preventDefault: sinon.spy() };
    const main = document.createElement('div');
    main.id = 'main-content';
    document.body.appendChild(main);

    const focusSpy = sinon.spy();
    const scrollIntoViewSpy = sinon.spy();
    main.focus = focusSpy;
    main.scrollIntoView = scrollIntoViewSpy;

    window.focusContent = undefined;
    window.scrollTo = undefined;

    skipToContent(event);

    expect(event.preventDefault.calledOnce).to.be.true;
    expect(scrollIntoViewSpy.calledOnce).to.be.true;
    expect(scrollIntoViewSpy.firstCall.args).to.deep.equal([
      { block: 'start' },
    ]);
    expect(focusSpy.calledOnce).to.be.true;
  });

  it('gracefully handles environments without document', () => {
    const event = { preventDefault: sinon.spy() };
    const originalDocument = global.document;
    // eslint-disable-next-line no-undef
    delete global.document;

    try {
      skipToContent(event);
    } finally {
      global.document = originalDocument;
    }

    expect(event.preventDefault.calledOnce).to.be.true;
  });

  it('exits early when the main content target is missing', () => {
    const event = { preventDefault: sinon.spy() };
    const querySelectorStub = sinon
      .stub(document, 'querySelector')
      .returns(null);
    window.focusContent = undefined;

    skipToContent(event);

    expect(event.preventDefault.calledOnce).to.be.true;
    expect(querySelectorStub.calledOnce).to.be.true;
    expect(querySelectorStub.calledWith('#main-content')).to.be.true;

    querySelectorStub.restore();
  });

  it('leaves an existing tabindex untouched while wiring blur cleanup', () => {
    const event = { preventDefault: sinon.spy() };
    const main = document.createElement('div');
    main.id = 'main-content';
    main.setAttribute('tabindex', '0');
    document.body.appendChild(main);

    window.focusContent = undefined;

    let blurHandler;
    main.addEventListener = sinon.spy((name, handler, _useCapture) => {
      if (name === 'blur') {
        blurHandler = handler;
      }
      return { name, handler, useCapture: _useCapture };
    });
    main.removeEventListener = sinon.spy();
    main.focus = sinon.spy();

    const scrollToStub = sinon.stub(window, 'scrollTo');

    skipToContent(event);

    expect(event.preventDefault.calledOnce).to.be.true;
    expect(main.getAttribute('tabindex')).to.equal('0');
    expect(typeof blurHandler).to.equal('function');
    expect(scrollToStub.calledOnce).to.be.true;

    blurHandler();

    expect(main.getAttribute('tabindex')).to.equal('0');
    expect(main.removeEventListener.calledWith('blur', blurHandler, true)).to.be
      .true;

    scrollToStub.restore();
  });
});
