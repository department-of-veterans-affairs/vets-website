import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { focusableWebComponentList } from '../../../src/js/web-component-fields/webComponentList';
import { FOCUSABLE_ELEMENTS } from '../../../../utilities/constants';

import * as focusUtils from '../../../src/js/utilities/ui';
import * as moreFocusUtils from '../../../../utilities/ui/focus';
import { focusReview } from '../../../src/js/utilities/ui/focus-review';

describe('focusReview', () => {
  let focusElementSpy;
  let focusOnChangeSpy;

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
  const testOffsets = { configurable: true, value: 10 };

  beforeEach(() => {
    // focusElementSpy = sinon.stub(focusUtils, 'focusElement');
    focusElementSpy = sinon.stub(moreFocusUtils, 'focusElement');
    focusOnChangeSpy = sinon.stub(focusUtils, 'focusOnChange');
    setOffset('offsetHeight', testOffsets);
    setOffset('offsetWidth', testOffsets);
  });
  afterEach(() => {
    focusElementSpy.restore();
    focusOnChangeSpy.restore();
    setOffset('offsetHeight', offsets.height);
    setOffset('offsetWidth', offsets.width);
  });

  const setupEdit = () =>
    render(
      <div id="main">
        <div name="testScrollElement" />
        <div>
          <h3 id="header">Test header</h3>
          <va-text-input id="test" label="text" name="test" />
        </div>
      </div>,
    );

  it('should focus on the page edit button', async () => {
    render(
      <div className="form-review-panel-page">
        <div name="testScrollElement" />
        <form className="rjsf">
          <div className="form-review-panel-page-header-row">
            <h4 className="form-review-panel-page-header">Test</h4>
            <div className="vads-u-justify-content--flex-end">
              <va-button secondary label="Edit Test" text="Edit" />
            </div>
          </div>
          <dl className="review">
            <div className="review-row">
              <dt>Is this a test?</dt>
              <dd>
                <span>Yes</span>
              </dd>
            </div>
          </dl>
          <div />
        </form>
      </div>,
    );

    focusReview(
      'test', // name results in "testScrollElement"
      false, // editing (review page edit mode)
      false, // reviewEditFocusOnHeaders
    );

    await waitFor(() => {
      expect(focusOnChangeSpy.args[0][0]).to.eq('test');
      expect(focusOnChangeSpy.args[0][1]).to.eq('VA-BUTTON');
    });
  });

  it('should focus on va-text-input when reviewEditFocusOnHeaders is not set', async () => {
    setupEdit();

    focusReview(
      'test', // name results in "testScrollElement"
      true, // editing (review page edit mode)
      false, // reviewEditFocusOnHeaders
    );

    await waitFor(() => {
      expect(focusOnChangeSpy.args[0]).to.deep.equal([
        'test',
        '#test',
        [...FOCUSABLE_ELEMENTS, ...focusableWebComponentList].join(','),
      ]);
    });
  });

  it('should focus on header in edit mode when reviewEditFocusOnHeaders is set', async () => {
    setupEdit();

    focusReview(
      'test', // name results in "testScrollElement"
      true, // editing (review page edit mode)
      true, // reviewEditFocusOnHeaders
    );

    await waitFor(() => {
      expect(focusElementSpy.args[0][0].innerHTML).to.eq('Test header');
    });
  });

  it('should focus va-text-input when no header exists', async () => {
    render(
      <div id="main">
        <div name="testScrollElement" />
        <div>
          <va-text-input id="test" label="text" name="test" />
          <va-button text="update page" />
        </div>
      </div>,
    );

    focusReview(
      'test', // name results in "testScrollElement"
      true, // editing (review page edit mode)
      true, // reviewEditFocusOnHeaders
    );

    await waitFor(() => {
      expect(focusOnChangeSpy.args[0][0]).to.eq('test');
      expect(focusOnChangeSpy.args[0][1]).to.eq('#test');
    });
  });
});
