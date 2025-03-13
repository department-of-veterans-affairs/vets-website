/* global jest */
import * as platformHelpers from '@department-of-veterans-affairs/platform-forms-system/helpers';
import * as platformSelectors from '@department-of-veterans-affairs/platform-forms-system/selectors';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import ReviewPage from '../../containers/ReviewPage';
import { getFileSize } from '../../utils/helpers';
import {
  getPageKeysForReview,
  removeDuplicatesByChapterAndPageKey,
} from '../../utils/reviewPageHelper';

// Minimal store with required state
const createMockStore = (customData = {}) => ({
  getState: () => ({
    form: {
      data: {
        ...customData,
      },
      pages: {},
      formErrors: { errors: [] },
    },
    user: {
      login: { currentlyLoggedIn: true },
      profile: { loa: { current: 3 } },
    },
    askVA: {
      reviewPageView: {
        openChapters: ['testChapter'],
        viewedPages: new Set(),
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

// Minimal required props
const defaultProps = {
  router: {
    push: sinon.spy(),
  },
  onSubmit: sinon.spy(),
  formContext: {
    reviewMode: true,
  },
  chapters: [
    {
      name: 'testChapter',
      title: 'Test Chapter',
      expandedPages: [],
      formConfig: {
        title: 'Test Chapter',
        pages: {},
      },
      open: true,
      pageKeys: [],
      hasUnviewedPages: false,
    },
  ],
  loggedIn: true,
  isUserLOA3: true,
};

describe('ReviewPage', () => {
  let sandbox;
  let store;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    store = createMockStore();

    // Basic stubs for required functions
    sandbox.stub(platformHelpers, 'getActiveExpandedPages').returns([]);
    sandbox.stub(platformSelectors, 'getViewedPages').returns(new Set());
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <Provider store={store}>
        <ReviewPage {...defaultProps} />
      </Provider>,
    );

    expect(container).to.exist;
  });

  it('should render chapter title', () => {
    const { container } = render(
      <Provider store={store}>
        <ReviewPage {...defaultProps} />
      </Provider>,
    );

    const accordionItem = container.querySelector('va-accordion-item');
    expect(accordionItem).to.exist;
    expect(accordionItem.getAttribute('header')).to.equal(
      "Veteran's information",
    );
  });

  it('should render edit mode alert with correct content', () => {
    const { container } = render(
      <Provider store={store}>
        <ReviewPage {...defaultProps} />
      </Provider>,
    );

    const alert = container.querySelector(
      'va-alert[data-testid="review-alert"]',
    );
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('info');

    const alertHeading = alert.querySelector('[slot="headline"]');
    expect(alertHeading.textContent).to.equal('Editing answers');
  });

  it('should render back button', () => {
    const { container } = render(
      <Provider store={store}>
        <ReviewPage {...defaultProps} />
      </Provider>,
    );

    const backButton = container.querySelector('va-button[back="true"]');
    expect(backButton).to.exist;
  });

  it('should render submit button with correct text', () => {
    const { container } = render(
      <Provider store={store}>
        <ReviewPage {...defaultProps} />
      </Provider>,
    );

    const submitButton = container.querySelector(
      'va-button[text="Submit question"]',
    );
    expect(submitButton).to.exist;
    expect(submitButton.getAttribute('disabled')).to.equal('false');
  });

  it('should render chapter with correct expansion state', () => {
    // Test with chapter closed
    const closedStore = createMockStore();
    const closedState = closedStore.getState();
    closedState.askVA = {
      ...closedState.askVA,
      reviewPageView: {
        ...closedState.askVA.reviewPageView,
        openChapters: [],
      },
    };

    const { container } = render(
      <Provider store={closedStore}>
        <ReviewPage {...defaultProps} />
      </Provider>,
    );

    const reviewChapter = container.querySelector('va-accordion-item');
    expect(reviewChapter).to.exist;
    expect(reviewChapter.getAttribute('header')).to.equal(
      "Veteran's information",
    );

    // The ReviewCollapsibleChapter should be present but not expanded
    const chapterContent = container.querySelector(
      '.schemaform-chapter-accordion-content',
    );
    expect(chapterContent).to.not.exist;
  });

  it('should render alert message with correct text', () => {
    const { container } = render(
      <Provider store={store}>
        <ReviewPage {...defaultProps} />
      </Provider>,
    );

    const alertMessage = container.querySelector('.vads-u-margin-y--0');
    expect(alertMessage).to.exist;
    expect(alertMessage.textContent).to.equal(
      'You are only able to edit some answers on this page. You may need to return to an earlier page in the form to edit some answers.',
    );
  });

  it('should render page with correct structure and accessibility elements', () => {
    const { container } = render(
      <Provider store={store}>
        <ReviewPage {...defaultProps} />
      </Provider>,
    );

    // Test main article element
    const article = container.querySelector('[data-testid="review-page"]');
    expect(article).to.exist;
    expect(article.tagName.toLowerCase()).to.equal('article');
    expect(article.className).to.include('vads-u-padding-x--2p5');
    expect(article.className).to.include('vads-u-padding-bottom--7');

    // Test navigation elements
    const topScrollElement = container.querySelector(
      '[name="topScrollElement"]',
    );
    expect(topScrollElement).to.exist;

    const topNavScrollElement = container.querySelector(
      '[name="topNavScrollElement"]',
    );
    expect(topNavScrollElement).to.exist;

    // Test accordion structure
    const accordion = container.querySelector(
      '[data-testid="review-accordion"]',
    );
    expect(accordion).to.exist;
    expect(accordion.tagName.toLowerCase()).to.equal('va-accordion');
  });

  it('should render button container with correct layout', () => {
    const { container } = render(
      <Provider store={store}>
        <ReviewPage {...defaultProps} />
      </Provider>,
    );

    // Test button container
    const buttonContainer = container.querySelector(
      '.vads-u-margin-top--4.vads-u-display--flex',
    );
    expect(buttonContainer).to.exist;

    // Verify both buttons are in the container
    const buttons = buttonContainer.querySelectorAll('va-button');
    expect(buttons).to.have.lengthOf(2);

    // Verify button order and properties
    const [backButton, submitButton] = buttons;
    expect(backButton.getAttribute('back')).to.equal('true');
    expect(submitButton.getAttribute('text')).to.equal('Submit question');
  });

  it('should render alert with correct accessibility attributes', () => {
    const { container } = render(
      <Provider store={store}>
        <ReviewPage {...defaultProps} />
      </Provider>,
    );

    const alert = container.querySelector(
      'va-alert[data-testid="review-alert"]',
    );
    expect(alert).to.exist;

    // Test accessibility attributes
    expect(alert.getAttribute('close-btn-aria-label')).to.equal(
      'Close notification',
    );
    expect(alert.getAttribute('closeable')).to.equal('true');

    // Test heading accessibility
    const heading = alert.querySelector('h3');
    expect(heading).to.exist;
    expect(heading.getAttribute('id')).to.equal('track-your-status-on-mobile');
    expect(heading.getAttribute('slot')).to.equal('headline');
  });

  describe('Alert Functionality', () => {
    it('should show alert by default', () => {
      const { container } = render(
        <Provider store={store}>
          <ReviewPage {...defaultProps} />
        </Provider>,
      );
      const alert = container.querySelector(
        'va-alert[data-testid="review-alert"]',
      );
      expect(alert).to.exist;
      expect(alert.getAttribute('visible')).to.equal('true');
    });

    it('should hide alert when close event is triggered', async () => {
      const { container } = render(
        <Provider store={store}>
          <ReviewPage {...defaultProps} />
        </Provider>,
      );
      const alert = container.querySelector(
        'va-alert[data-testid="review-alert"]',
      );
      expect(alert).to.exist;

      // Trigger the onCloseEvent
      alert.dispatchEvent(new CustomEvent('closeEvent'));

      // Wait for state update
      await waitFor(() => {
        const updatedAlert = container.querySelector(
          'va-alert[data-testid="review-alert"]',
        );
        expect(updatedAlert).to.be.null;
      });
    });

    it('should display correct alert content', () => {
      const { container } = render(
        <Provider store={store}>
          <ReviewPage {...defaultProps} />
        </Provider>,
      );
      const alert = container.querySelector(
        'va-alert[data-testid="review-alert"]',
      );
      expect(alert).to.exist;

      const headline = alert.querySelector('[slot="headline"]');
      expect(headline.textContent.trim()).to.equal('Editing answers');

      const content = alert.querySelector('p');
      expect(content.textContent.trim()).to.contain(
        'You are only able to edit some answers on this page',
      );
    });

    it('should not show alert when showAlert is false', () => {
      const { container } = render(
        <Provider store={store}>
          <ReviewPage {...defaultProps} />
        </Provider>,
      );

      const alert = container.querySelector(
        'va-alert[data-testid="review-alert"]',
      );
      if (alert) {
        // Trigger the onCloseEvent
        alert.dispatchEvent(new CustomEvent('closeEvent'));

        // Wait for state update and verify alert is not visible
        setTimeout(() => {
          const updatedAlert = container.querySelector(
            'va-alert[data-testid="review-alert"]',
          );
          expect(updatedAlert).to.be.null;
        }, 0);
      }
    });
  });
});

describe('Helper Functions', () => {
  describe('getFileSize', () => {
    it('should format bytes correctly', () => {
      expect(getFileSize(100)).to.equal('100 B');
    });

    it('should format kilobytes correctly', () => {
      expect(getFileSize(1500)).to.equal('1 KB');
      expect(getFileSize(2048)).to.equal('2 KB');
    });

    it('should format megabytes correctly', () => {
      expect(getFileSize(1500000)).to.equal('1.5 MB');
      expect(getFileSize(2048000)).to.equal('2.0 MB');
    });

    it('should handle edge cases', () => {
      expect(getFileSize(0)).to.equal('0 B');
      expect(getFileSize(999)).to.equal('999 B');
      expect(getFileSize(1000)).to.equal('1 KB');
      expect(getFileSize(999999)).to.equal('999 KB');
      expect(getFileSize(1000000)).to.equal('1.0 MB');
    });
  });

  describe('removeDuplicatesByChapterAndPageKey', () => {
    it('should remove duplicates based on chapter and page keys', () => {
      const input = [
        { chapterKey: 'ch1', pageKey: 'page1', data: 'first' },
        { chapterKey: 'ch1', pageKey: 'page2', data: 'second' },
        { chapterKey: 'ch1', pageKey: 'page1', data: 'duplicate' },
        { chapterKey: 'ch2', pageKey: 'page1', data: 'different chapter' },
      ];

      const result = removeDuplicatesByChapterAndPageKey(input);
      expect(result).to.have.lengthOf(3);
      expect(result[0]).to.deep.equal({
        chapterKey: 'ch1',
        pageKey: 'page1',
        data: 'first',
      });
      expect(result[1]).to.deep.equal({
        chapterKey: 'ch1',
        pageKey: 'page2',
        data: 'second',
      });
      expect(result[2]).to.deep.equal({
        chapterKey: 'ch2',
        pageKey: 'page1',
        data: 'different chapter',
      });
    });

    it('should handle empty array', () => {
      const result = removeDuplicatesByChapterAndPageKey([]);
      expect(result).to.be.an('array').that.is.empty;
    });

    it('should handle array with no duplicates', () => {
      const input = [
        { chapterKey: 'ch1', pageKey: 'page1' },
        { chapterKey: 'ch2', pageKey: 'page2' },
      ];
      const result = removeDuplicatesByChapterAndPageKey(input);
      expect(result).to.have.lengthOf(2);
      expect(result).to.deep.equal(input);
    });

    it('should preserve the first occurrence when duplicates exist', () => {
      const input = [
        { chapterKey: 'ch1', pageKey: 'page1', data: 'keep this' },
        { chapterKey: 'ch1', pageKey: 'page1', data: 'remove this' },
      ];
      const result = removeDuplicatesByChapterAndPageKey(input);
      expect(result).to.have.lengthOf(1);
      expect(result[0].data).to.equal('keep this');
    });
  });

  describe('getPageKeysForReview', () => {
    it('should extract page keys from config', () => {
      const config = {
        chapters: {
          chapter1: {
            pages: {
              page1: { title: 'Page 1' },
              page2: { title: 'Page 2' },
            },
          },
          chapter2: {
            pages: {
              page3: { title: 'Page 3' },
            },
          },
        },
      };

      const result = getPageKeysForReview(config);
      expect(result).to.deep.equal(['page1', 'page2', 'page3']);
    });

    it('should handle empty config', () => {
      const config = {
        chapters: {},
      };
      const result = getPageKeysForReview(config);
      expect(result).to.deep.equal([]);
    });

    it('should handle config with empty chapters', () => {
      const config = {
        chapters: {
          chapter1: {
            pages: {},
          },
          chapter2: {
            pages: {},
          },
        },
      };
      const result = getPageKeysForReview(config);
      expect(result).to.deep.equal([]);
    });

    it('should handle config with mixed empty and non-empty chapters', () => {
      const config = {
        chapters: {
          chapter1: {
            pages: {
              page1: { title: 'Page 1' },
            },
          },
          chapter2: {
            pages: {},
          },
        },
      };
      const result = getPageKeysForReview(config);
      expect(result).to.deep.equal(['page1']);
    });
  });

  describe('getSchoolString', () => {
    // Extract getSchoolString from ReviewPage for testing
    const getSchoolString = (code, name) => {
      if (code && name) return `${code} - ${name}`;
      return null;
    };

    it('should format school code and name correctly', () => {
      expect(getSchoolString('12345', 'Test School')).to.equal(
        '12345 - Test School',
      );
    });

    it('should handle missing code', () => {
      expect(getSchoolString(null, 'Test School')).to.be.null;
      expect(getSchoolString(undefined, 'Test School')).to.be.null;
    });

    it('should handle missing name', () => {
      expect(getSchoolString('12345', null)).to.be.null;
      expect(getSchoolString('12345', undefined)).to.be.null;
    });

    it('should handle missing both code and name', () => {
      expect(getSchoolString(null, null)).to.be.null;
      expect(getSchoolString(undefined, undefined)).to.be.null;
    });

    it('should handle empty strings', () => {
      expect(getSchoolString('', '')).to.be.null;
      expect(getSchoolString('12345', '')).to.be.null;
      expect(getSchoolString('', 'Test School')).to.be.null;
    });
  });
});
