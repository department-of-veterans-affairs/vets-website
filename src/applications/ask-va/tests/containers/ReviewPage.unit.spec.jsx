import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as FileUpload from '../../components/FileUpload';
import * as ReviewCollapsibleChapter from '../../components/ReviewCollapsibleChapter';
import * as ReviewSectionContent from '../../components/reviewPage/ReviewSectionContent';
import ReviewPage from '../../containers/ReviewPage';
import * as StorageAdapterModule from '../../utils/StorageAdapter';
import { createMockStore } from '../common';
import { mockData } from '../fixtures/data/form-data-review';

import * as formUtils from '../../utils/reviewPageUtils';

describe('<ReviewPage /> container', () => {
  let sandbox;

  const stubReviewCollapsibleChapter = () => {
    const capturedProps = [];

    const stub = sandbox
      .stub(ReviewCollapsibleChapter, 'default')
      .callsFake(props => {
        capturedProps.push(props);
        return <div>Mock review collapsible chapter</div>;
      });

    return { stub, capturedProps };
  };

  const stubReviewSectionContent = () => {
    sandbox.stub(ReviewSectionContent, 'default').callsFake(() => {
      return <div>Mock review section content</div>;
    });
  };

  const stubFileUpload = () => {
    sandbox.stub(FileUpload, 'default').callsFake(() => {
      return <div>Mock file upload</div>;
    });
  };

  const stubStorageAdapter = () => {
    sandbox
      .stub(StorageAdapterModule.StorageAdapter.prototype, 'get')
      .resolves([]);
    sandbox
      .stub(StorageAdapterModule.StorageAdapter.prototype, 'set')
      .resolves([]);
    sandbox.stub(StorageAdapterModule, 'askVAAttachmentStorage').value({
      get: () => Promise.resolve([]),
      set: () => Promise.resolve(),
    });
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render', async () => {
    stubReviewCollapsibleChapter();
    stubReviewSectionContent();
    stubFileUpload();
    stubStorageAdapter();

    const store = createMockStore({
      openChapters: ['chapter-1', 'chapter-2'],
      viewedPages: new Set(['page-3']),
      askVA: mockData.askVA,
      formData: mockData.data,
    });

    const setViewedPages = sinon.spy();
    const setEdiMode = sinon.spy();

    const { container } = render(
      <Provider store={store}>
        <ReviewPage setViewedPages={setViewedPages} setEdiMode={setEdiMode} />
      </Provider>,
    );

    await waitFor(() => {
      expect(container.querySelector('h3')).to.have.text('Review and submit');
    });
  });

  it('should display 503 error alert when submission fails with non-JSON response', async () => {
    stubReviewCollapsibleChapter();
    stubReviewSectionContent();
    stubFileUpload();
    stubStorageAdapter();

    sandbox
      .stub(formUtils, 'handleFormSubmission')
      .callsFake(async ({ onError }) => {
        const error = new Error(
          'Non-JSON error response (likely 503 from gateway)',
        );
        onError?.(error);
        throw error;
      });

    const store = createMockStore({
      openChapters: ['chapter-1', 'chapter-2'],
      viewedPages: new Set(['page-3']),
      askVA: mockData.askVA,
      formData: mockData.data,
    });

    const { container } = render(
      <Provider store={store}>
        <ReviewPage />
      </Provider>,
    );

    // Wait for the Submit button to appear
    const submitVaButton = await waitFor(() =>
      Array.from(container.querySelectorAll('va-button')).find(
        btn => btn.getAttribute('text') === 'Submit question',
      ),
    );

    // Wait for the internal HTML button tag inside the shadow DOM
    expect(submitVaButton).to.exist;
    submitVaButton.click();

    // Wait for error alert to appear
    await waitFor(() => {
      const alert = container.querySelector(
        '[data-testid="review-alert"][status="error"]',
      );

      const heading = alert.querySelector('h3');
      expect(heading).to.exist;
      expect(heading).to.have.text('Ask VA isn’t working right now');
    });
  });
});
