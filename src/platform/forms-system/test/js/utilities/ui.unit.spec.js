import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  fixSelector,
  focusElement,
  focusOnChange,
  getFocusableElements,
} from '../../../src/js/utilities/ui';
import { ReviewCollapsibleChapter } from '../../../src/js/review/ReviewCollapsibleChapter';

describe('fixSelector', () => {
  it('should return an unmodified string', () => {
    expect(fixSelector('va-accordion')).to.eq('va-accordion');
    expect(fixSelector('.test')).to.eq('.test');
    expect(fixSelector('#test')).to.eq('#test');
    expect(fixSelector('[name="test"]')).to.eq('[name="test"]');
  });
  it('should escape colons withing the selector', () => {
    // we shouldn't be passing in `:not([name="test"])` as a selector
    expect(fixSelector('[name="view:test"]')).to.eq('[name="view\\:test"]');
    expect(fixSelector('[name="view:test:foo"]')).to.eq(
      '[name="view\\:test\\:foo"]',
    );
  });
});

describe('focusElement', () => {
  it('should focus on header element using tabindex -1, and remove it on blur', async () => {
    const screen = render(
      <div>
        <h2>test</h2>
      </div>,
    );
    const h2 = screen.getByRole('heading', { levh2: 2 });

    expect(h2.tabIndex).to.eq(-1);
    expect(h2.getAttribute('tabindex')).to.be.null;

    focusElement(h2);

    await waitFor(() => {
      expect(document.activeElement).to.eq(h2);
      expect(h2.tabIndex).to.eq(-1);
      expect(h2.getAttribute('tabindex')).to.eq('-1');
    });
    fireEvent.blur(h2);
    await waitFor(() => {
      expect(h2.tabIndex).to.eq(-1);
      expect(h2.getAttribute('tabindex')).to.be.null;
    });
  });
  it('should focus on header string selector using tabindex -1, and remove it on blur', async () => {
    const screen = render(
      <div>
        <h2>test</h2>
      </div>,
    );
    const h2 = screen.getByRole('heading', { levh2: 2 });

    expect(h2.tabIndex).to.eq(-1);
    expect(h2.getAttribute('tabindex')).to.be.null;

    focusElement('h2');

    await waitFor(() => {
      expect(document.activeElement).to.eq(h2);
      expect(h2.tabIndex).to.eq(-1);
      expect(h2.getAttribute('tabindex')).to.eq('-1');
    });
    fireEvent.blur(h2);
    await waitFor(() => {
      expect(h2.tabIndex).to.eq(-1);
      expect(h2.getAttribute('tabindex')).to.be.null;
    });
  });
  it('should focus on div with tabindex 0, and not remove it on blur', async () => {
    const screen = render(
      <div>
        <div role="button" tabIndex="0">
          test
        </div>
      </div>,
    );
    const div = screen.getByRole('button');

    expect(div.tabIndex).to.eq(0);
    expect(div.getAttribute('tabindex')).to.eq('0');

    focusElement('div[role]');

    await waitFor(() => {
      expect(document.activeElement).to.eq(div);
      expect(div.tabIndex).to.eq(0);
      expect(div.getAttribute('tabindex')).to.eq('0');
    });
    fireEvent.blur(div);
    await waitFor(() => {
      expect(div.tabIndex).to.eq(0);
      expect(div.getAttribute('tabindex')).to.eq('0');
    });
  });

  it('should focus on input element', async () => {
    const screen = render(
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" />
      </div>,
    );
    const input = screen.getByLabelText('Name');

    expect(input.tabIndex).to.eq(0);
    expect(input.getAttribute('tabindex')).to.be.null;

    focusElement(input);

    await waitFor(() => {
      expect(document.activeElement).to.eq(input);
      expect(input.tabIndex).to.eq(0);
      expect(input.getAttribute('tabindex')).to.be.null;
    });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(input.tabIndex).to.eq(0);
      expect(input.getAttribute('tabindex')).to.be.null;
    });
  });
  it('should focus on input element', async () => {
    const screen = render(
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" />
      </div>,
    );
    const input = screen.getByLabelText('Name');

    expect(input.tabIndex).to.eq(0);
    expect(input.getAttribute('tabindex')).to.be.null;

    focusElement('input');

    await waitFor(() => {
      expect(document.activeElement).to.eq(input);
      expect(input.tabIndex).to.eq(0);
      expect(input.getAttribute('tabindex')).to.be.null;
    });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(input.tabIndex).to.eq(0);
      expect(input.getAttribute('tabindex')).to.be.null;
    });
  });
  it('should focus on va-alert element', async () => {
    const screen = render(
      <div>
        <va-alert data-testid="test" status="info">
          <h2 slot="headline">test</h2>
        </va-alert>
      </div>,
    );
    const alert = screen.getByTestId('test');

    expect(alert.tabIndex).to.eq(-1);
    expect(alert.getAttribute('tabindex')).to.be.null;

    focusElement('va-alert');

    await waitFor(() => {
      expect(document.activeElement).to.eq(alert);
      expect(alert.tabIndex).to.eq(-1);
      expect(alert.getAttribute('tabindex')).to.eq('-1');
    });
    fireEvent.blur(alert);
    await waitFor(() => {
      expect(alert.tabIndex).to.eq(-1);
      expect(alert.getAttribute('tabindex')).to.be.null;
    });
  });
  it('should focus on button in inside of container', async () => {
    const screen = render(
      <div>
        <div>
          <button type="button">test-1</button>
        </div>
        <div data-testid="container">
          <button type="button" data-testid="button">
            test-2
          </button>
        </div>
      </div>,
    );
    const container = screen.getByTestId('container');
    const button = screen.getByTestId('button');

    expect(button.tabIndex).to.eq(0);
    expect(button.getAttribute('tabindex')).to.be.null;

    focusElement('button', {}, container);

    await waitFor(() => {
      expect(document.activeElement).to.eq(button);
      expect(button.tabIndex).to.eq(0);
      expect(button.getAttribute('tabindex')).to.be.null;
    });
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
      <div>
        <ReviewCollapsibleChapter
          viewedPages={new Set()}
          expandedPages={pages}
          chapterKey={chapterKey}
          chapterFormConfig={chapter}
          form={form}
          open
        />
      </div>,
    );

    const dom = findDOMNode(tree);
    global.document = dom;
    const target = 'va-button[text="edit"]';
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

  it('should return an array of focusable elements', async () => {
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
        <va-button />
        <va-select />
        <va-radio-option />
        <va-checkbox />
        <va-text-input />
        <va-textarea />
      </form>,
    );
    /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    const dom = findDOMNode(tree);
    global.document = dom;
    const focusableElements = await getFocusableElements(dom);
    // This is supposed to return focusable elements within the web component
    // shadow DOM;
    expect(focusableElements.length).to.eq(13);
  });

  it('should return an array and ignore focusable web components', async () => {
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
        <va-button />
        <va-select />
        <va-radio-option />
        <va-checkbox />
        <va-text-input />
        <va-textarea />
      </form>,
    );
    /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    const dom = findDOMNode(tree);
    global.document = dom;
    const focusableElements = await getFocusableElements(dom, {
      returnWebComponent: true,
      focusableWebComponents: [],
    });
    expect(focusableElements.length).to.eq(7);
  });

  it('should return an empty array from non-focusable elements', async () => {
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
    const focusableElements = await getFocusableElements(dom);
    expect(focusableElements.length).to.eq(0);
  });
  it('should return an empty array from hidden elements', async () => {
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
    const focusableElements = await getFocusableElements(dom);
    expect(focusableElements.length).to.eq(0);
  });
});
