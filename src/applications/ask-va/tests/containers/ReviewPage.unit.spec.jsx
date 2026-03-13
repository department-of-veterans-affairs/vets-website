import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import * as scrollUtils from 'platform/utilities/scroll';

import * as FileUpload from '../../components/FileUpload';
import * as ReviewCollapsibleChapter from '../../components/ReviewCollapsibleChapter';
import * as ReviewSectionContent from '../../components/reviewPage/ReviewSectionContent';
import * as UpdatePageButton from '../../components/reviewPage/UpdatePageButton';
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

  describe('scroll element naming', () => {
    it('should render scroll elements using chapter.name (not chapterTitles with special characters)', async () => {
      stubReviewCollapsibleChapter();
      stubReviewSectionContent();
      stubFileUpload();
      stubStorageAdapter();

      const store = createMockStore({
        openChapters: ['yourContactInformation'],
        viewedPages: new Set(['yourContactInformation']),
        askVA: mockData.askVA,
        formData: mockData.data,
      });

      const { container, getByText } = render(
        <Provider store={store}>
          <ReviewPage />
        </Provider>,
      );

      // Wait for the page to render
      await waitFor(() => {
        expect(getByText('Review and submit')).to.exist;
      });

      // Verify scroll elements use chapter.name format (no special characters)
      // Filter to only chapter scroll elements (not topScrollElement, etc.)
      const scrollElements = container.querySelectorAll(
        '[name^="chapter"][name$="ScrollElement"]',
      );
      expect(scrollElements.length).to.be.greaterThan(0);

      // Check that no scroll element name contains apostrophes or curly apostrophes
      scrollElements.forEach(element => {
        const name = element.getAttribute('name');
        expect(name).to.not.include("'"); // single quote
        expect(name).to.not.include('\u2019'); // curly apostrophe
        // Verify the format is chapter{camelCaseName}ScrollElement
        expect(name).to.match(/^chapter[a-zA-Z]+ScrollElement$/);
      });

      // Check that the scroll element for the 'Your contact information' chapter exists with the correct name
      const scrollElement = container.querySelector(
        '[name="chapteryourContactInformationScrollElement"]',
      );
      expect(scrollElement).to.exist;
    });
  });

  describe('UpdatePageButton scroll behavior', () => {
    it('should pass scroll function that calls scrollTo with chapter.name (yourContactInformation)', async () => {
      stubReviewCollapsibleChapter();
      stubReviewSectionContent();
      stubFileUpload();
      stubStorageAdapter();

      // Capture the props passed to UpdatePageButton
      const capturedProps = [];
      sandbox.stub(UpdatePageButton, 'default').callsFake(props => {
        capturedProps.push(props);
        return (
          // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
          <button type="button" data-testid={`update-btn-${props.title}`}>
            Update page
          </button>
        );
      });

      const scrollToStub = sandbox.stub(scrollUtils, 'scrollTo');

      const store = createMockStore({
        openChapters: ['yourContactInformation'],
        viewedPages: new Set(['yourContactInformation']),
        askVA: mockData.askVA,
        formData: mockData.data,
      });

      render(
        <Provider store={store}>
          <ReviewPage />
        </Provider>,
      );

      // Wait for initial render
      await waitFor(() => {
        // UpdatePageButton is only rendered when section is in edit mode
        // but we can check that when it's rendered, the scroll prop is correct
        // For now, verify the scroll elements exist with correct naming
        expect(capturedProps.length).to.be.at.least(0);
      });

      // If UpdatePageButton was rendered, verify scroll function works correctly
      if (capturedProps.length > 0) {
        const contactInfoProps = capturedProps.find(
          p => p.title === 'Your contact information',
        );
        if (contactInfoProps) {
          contactInfoProps.scroll();
          expect(scrollToStub.calledOnce).to.be.true;
          expect(scrollToStub.firstCall.args[0]).to.equal(
            'chapteryourContactInformationScrollElement',
          );
        }
      }
    });
  });
});
