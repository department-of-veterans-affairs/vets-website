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
import * as StorageAdapter from '../../utils/StorageAdapter';
import { mockData } from '../fixtures/data/form-data-review';

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
    sandbox.stub(StorageAdapter, 'StorageAdapter').callsFake(() => {
      return {
        get: () => Promise.resolve([]),
        set: () => Promise.resolve(),
      };
    });
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render', async () => {
    const chapterComponents = stubReviewCollapsibleChapter();
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
      expect(chapterComponents.capturedProps.length).to.equal(4);
      expect(container.querySelector('h3')).to.have.text('Editing answers');
    });
  });
});
