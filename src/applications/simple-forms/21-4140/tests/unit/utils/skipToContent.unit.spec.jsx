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
    document.body.innerHTML = '';
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
    const addEventListener = sinon.spy((name, handler) => {
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
});
