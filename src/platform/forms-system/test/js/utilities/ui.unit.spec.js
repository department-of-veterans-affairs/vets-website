import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';

import { focusElement, focusOnChange } from '../../../src/js/utilities/ui';
import { ReviewCollapsibleChapter } from '../../../src/js/review/ReviewCollapsibleChapter';

describe('focus on element', () => {
  it('should focus on element based on selector string', () => {
    const tree = ReactTestUtils.renderIntoDocument(
      <div>
        <button />
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
        <button />
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
