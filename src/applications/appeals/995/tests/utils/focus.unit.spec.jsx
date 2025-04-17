import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as focusUtils from 'platform/utilities/ui/focus';
import * as focusReview from 'platform/forms-system/src/js/utilities/ui/focus-review';

import { focusEvidence, focusH3AfterAlert } from '../../utils/focus';

describe('focusEvidence', () => {
  const renderPage = () =>
    render(
      <div id="main">
        <h3>Title</h3>
        <div />
      </div>,
    );

  it('should focus on header', async () => {
    const { container } = await renderPage();

    await focusEvidence(null, container);
    await waitFor(() => {
      const target = $('h3', container);
      expect(document.activeElement).to.eq(target);
    });
  });
  it('should focus on error', async () => {
    const { container } = await renderPage();

    await focusEvidence(null, container);
    await waitFor(() => {
      const target = $('[error]', container);
      expect(document.activeElement).to.eq(target);
    });
  });
});

describe('focusH3AfterAlert', () => {
  let focusElementSpy;
  let focusReviewSpy;
  beforeEach(() => {
    focusElementSpy = sinon.stub(focusUtils, 'focusElement');
    focusReviewSpy = sinon.stub(focusReview, 'focusReview');
  });
  afterEach(() => {
    focusElementSpy.restore();
    focusReviewSpy.restore();
  });

  const setup = () =>
    render(
      <div id="main">
        <div name="topContentElement" />
        <div name="testScrollElement" />
        <div>
          <va-alert status="info" visible="false">
            <h3 id="alert" slot="headline">
              Alert header
            </h3>
          </va-alert>
          <h3 id="header">Page header</h3>
        </div>
      </div>,
    );

  it('should focus on h3 outside of va-alert on review page', async () => {
    setup();

    await focusH3AfterAlert();
    await waitFor(() => {
      expect(focusElementSpy.args[0][0]).to.eq('h3#header');
    });
  });

  it('should focus on header on review page', async () => {
    setup();

    await focusH3AfterAlert({ name: 'test', onReviewPage: true });
    await waitFor(() => {
      expect(focusReviewSpy.args[0]).to.deep.equal(['test', true, true]);
    });
  });
});
