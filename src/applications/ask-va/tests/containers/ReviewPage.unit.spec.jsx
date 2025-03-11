import * as platformHelpers from '@department-of-veterans-affairs/platform-forms-system/helpers';
import * as platformSelectors from '@department-of-veterans-affairs/platform-forms-system/selectors';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import ReviewPage from '../../containers/ReviewPage';

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
    expect(accordionItem.getAttribute('header')).to.equal('Your information');
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
    expect(reviewChapter.getAttribute('header')).to.equal('Your information');

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
});
