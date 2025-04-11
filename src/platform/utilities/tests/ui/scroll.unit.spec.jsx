import React from 'react';
import Scroll from 'react-scroll';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from '../../../forms-system/src/js/utilities/ui';
import * as focusUtils from '../../ui/focus';

import { getScrollOptions, scrollToFirstError, scrollAndFocus } from '../../ui';

describe('scrollToFirstError', () => {
  let scrollSpy;
  let focusSpy;

  beforeEach(() => {
    scrollSpy = sinon.stub(Scroll.animateScroll, 'scrollTo');
    focusSpy = sinon.stub(focusUtils, 'focusElement');
  });
  afterEach(() => {
    scrollSpy.restore();
    focusSpy.restore();
  });

  it('should scroll to & focus first usa-input-error class', () => {
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
    scrollToFirstError();
    waitFor(() => {
      expect(scrollSpy.args[0]).to.deep.equal([
        -10, // offsets, scrollTop & top all return zero (-10 hard-coded offset)
        { duration: 0, delay: 0, smooth: false },
      ]);
      expect(focusSpy.args[0][0].id).to.eq('second');
    });
  });

  it('should scroll to & focus first input-error-date class', () => {
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
    scrollToFirstError();
    waitFor(() => {
      expect(scrollSpy.args[0]).to.deep.equal([
        -10, // offsets, scrollTop & top all return zero (-10 hard-coded offset)
        { duration: 0, delay: 0, smooth: false },
      ]);
      expect(focusSpy.args[0][0].id).to.eq('second');
    });
  });

  it('should scroll to & focus first error attribute (web component)', () => {
    render(
      <form>
        <p />
        <div id="first" className="usa-input">
          not an error
        </div>
        <div id="second">error 1</div>
        <div id="third" className="usa-input-error input-error-date">
          error 2
        </div>
      </form>,
    );
    scrollToFirstError();
    waitFor(() => {
      expect(scrollSpy.args[0]).to.deep.equal([
        -10, // offsets, scrollTop & top all return zero (-10 hard-coded offset)
        { duration: 0, delay: 0, smooth: false },
      ]);
      expect(focusSpy.args[0][0].id).to.eq('second');
    });
  });

  it('should scroll to & focus first error attribute (web component) and ignore empty error attributes', () => {
    render(
      <form>
        <p />
        <div id="first" className="usa-input">
          not an error
        </div>
        <div id="second">error 1</div>
        <div id="third" className="usa-input-error input-error-date">
          error 2
        </div>
      </form>,
    );
    scrollToFirstError();
    waitFor(() => {
      expect(scrollSpy.args[0]).to.deep.equal([
        -10, // offsets, scrollTop & top all return zero (-10 hard-coded offset)
        { duration: 0, delay: 0, smooth: false },
      ]);
      expect(focusSpy.args[0][0].id).to.eq('third');
    });
  });

  it('should scroll to first error attribute (web component) & focus internal role="alert"', () => {
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
    scrollToFirstError({ focusOnAlertRole: true });
    waitFor(() => {
      expect(scrollSpy.args[0]).to.deep.equal([
        -10, // offsets, scrollTop & top all return zero (-10 hard-coded offset)
        { duration: 0, delay: 0, smooth: false },
      ]);
      expect(focusSpy.args[0][0]).to.eq('[role="alert"]');
    });
  });

  it('should not scroll or focus if a modal is open', () => {
    render(
      <form>
        <p />
        <div id="first" className="usa-input">
          not an error
        </div>
        <div id="second">error 1</div>
        <div id="third" className="usa-input-error input-error-date">
          error 2
        </div>
        <va-modal visible="true" />
      </form>,
    );
    scrollToFirstError();
    waitFor(() => {
      expect(scrollSpy.notCalled).to.be.true;
      expect(focusSpy.notCalled).to.be.true;
    });
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
