import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  focusElement,
  focusOnChange,
  getFocusableElements,
} from '../../../src/js/utilities/ui';
import { ReviewCollapsibleChapter } from '../../../src/js/review/ReviewCollapsibleChapter';

describe('focus on element', () => {
  it('should focus on element based on selector string', () => {
    const tree = ReactTestUtils.renderIntoDocument(
      <div>
        <button type="button" aria-label="button" />
      </div>,
    );
    const dom = findDOMNode(tree);
    global.document = dom;
    const focused = sinon.stub(dom.querySelector('button'), 'focus');
    focusElement('button', {});
    expect(focused.calledOnce).to.be.true;
  });

  it('should focus on element passed to the function', () => {
    const tree = ReactTestUtils.renderIntoDocument(
      <div>
        <button type="button" aria-label="button" />
      </div>,
    );
    const dom = findDOMNode(tree);
    const button = dom.querySelector('button');
    const focused = sinon.stub(button, 'focus');
    focusElement(button);
    expect(focused.calledOnce).to.be.true;
  });
});

describe('focus on change', () => {
  it('should focus on edit button after updating a review form', done => {
    const pages = [
      {
        title: '',
        pageKey: 'test',
      },
    ];
    const chapterKey = 'test';
    const chapter = {};
    const form = {
      pages: {
        test: {
          title: '',
          schema: {
            type: 'object',
            properties: {
              test2: {
                type: 'boolean',
              },
            },
          },
          uiSchema: {},
          editMode: false,
        },
      },
      data: {},
    };

    const tree = ReactTestUtils.renderIntoDocument(
      <ReviewCollapsibleChapter
        viewedPages={new Set()}
        expandedPages={pages}
        chapterKey={chapterKey}
        chapterFormConfig={chapter}
        form={form}
        open
      />,
    );

    const dom = findDOMNode(tree);
    global.document = dom;
    const target = '.edit-btn';
    const focused = sinon.stub(dom.querySelector(target), 'focus');
    focusOnChange('test', target);

    // setTimeout used by focusOnChange function
    setTimeout(() => {
      expect(focused.calledOnce).to.be.true;
      done();
    }, 0);
  });
});

describe('getFocuableElements', () => {
  // set offsets source:
  // https://github.com/testing-library/react-testing-library/issues/353#issuecomment-510046921
  const getOffset = name =>
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, name);
  const setOffset = (name, value) =>
    Object.defineProperty(HTMLElement.prototype, name, value);

  const offsets = {
    height: getOffset('offsetHeight'),
    width: getOffset('offsetWidth'),
  };

  afterEach(() => {
    setOffset('offsetHeight', offsets.height);
    setOffset('offsetWidth', offsets.width);
  });

  it.skip('should return an array of focusable elements', () => {
    setOffset('offsetHeight', { configurable: true, value: 10 });
    setOffset('offsetWidth', { configurable: true, value: 10 });
    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    const tree = ReactTestUtils.renderIntoDocument(
      <form>
        <a href="http://test.com">x</a>
        <button type="button" aria-label="button" />
        <details>
          <summary>foo</summary>
          baz
        </details>
        <input type="text" />
        <select>
          <option>bar</option>
        </select>
        <textarea />
        <div tabIndex="0" />
      </form>,
    );
    /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    const dom = findDOMNode(tree);
    global.document = dom;
    const focusableElements = getFocusableElements(dom);
    expect(focusableElements.length).to.eq(7);
  });

  it.skip('should return an empty array from non-focusable elements', () => {
    setOffset('offsetHeight', { configurable: true, value: 10 });
    setOffset('offsetWidth', { configurable: true, value: 10 });
    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    /* eslint-disable jsx-a11y/label-has-associated-control */
    const tree = ReactTestUtils.renderIntoDocument(
      <form>
        <input type="hidden" />
        <div tabIndex="-1" />
        <label>boo</label>
        <img alt="" />
        <button disabled type="button">
          test
        </button>
      </form>,
    );
    /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    /* eslint-enable jsx-a11y/label-has-associated-control */
    const dom = findDOMNode(tree);
    global.document = dom;
    const focusableElements = getFocusableElements(dom);
    expect(focusableElements.length).to.eq(0);
  });
  it.skip('should return an empty array from hidden elements', () => {
    setOffset('offsetHeight', offsets.height);
    setOffset('offsetWidth', offsets.width);
    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    const tree = ReactTestUtils.renderIntoDocument(
      <form>
        <a href="http://test.com" style={{ display: 'none' }}>
          x
        </a>
        <button type="button" style={{ display: 'none' }} aria-label="button" />
        <details style={{ display: 'none' }}>
          <summary>foo</summary>
          baz
        </details>
        <input type="text" style={{ display: 'none' }} />
        <select style={{ display: 'none' }}>
          <option>bar</option>
        </select>
        <textarea style={{ display: 'none' }} />
        <div tabIndex="0" style={{ display: 'none' }} />
      </form>,
    );
    /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    const dom = findDOMNode(tree);
    global.document = dom;
    const focusableElements = getFocusableElements(dom);
    expect(focusableElements.length).to.eq(0);
  });
});
