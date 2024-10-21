import React from 'react';
import Scroll from 'react-scroll';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from '../../../forms-system/src/js/utilities/ui';
import * as focusUtils from '../../ui/focus';

import { scrollToFirstError, scrollAndFocus } from '../../ui';

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
        <div id="second" error="some error">
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

  it('should scroll to & focus first error attribute (web component) and ignore empty error attributes', () => {
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
        <div id="second" error="some error">
          error 1
        </div>
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
