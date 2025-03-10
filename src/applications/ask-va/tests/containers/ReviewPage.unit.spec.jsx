import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createMockStore } from '../common';
import ReviewPage from '../../containers/ReviewPage';
import * as ReviewCollapsibleChapter from '../../components/ReviewCollapsibleChapter';
import * as ReviewSectionContent from '../../components/reviewPage/ReviewSectionContent';
import * as FileUpload from '../../components/FileUpload';
import * as StorageAdapterModule from '../../utils/StorageAdapter';
import { mockData } from '../fixtures/data/form-data-review';

describe.skip('<ReviewPage /> container', () => {
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
      expect(container.querySelector('h3')).to.have.text('Editing answers');
    });
  });
});
