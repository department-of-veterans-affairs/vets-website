import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';

import environment from 'platform/utilities/environment';
import FormNav from '../../../src/js/components/FormNav';

describe('Schemaform FormNav', () => {
  const getDefaultData = () => ({
    chapters: {
      chapter1: {
        title: 'Testing',
        pages: {
          page1: {
            path: 'testing1',
          },
        },
      },
      chapter2: {
        title: 'Testing',
        pages: {
          page2: {
            path: 'testing2',
          },
        },
      },
      chapter3: {
        title: 'Testing',
        pages: {
          page3: {
            path: 'testing3',
          },
        },
      },
    },
  });
  const getReviewData = () => ({
    chapters: {
      chapter1: {
        title: 'Testing',
        pages: {
          page1: {
            path: 'testing1',
          },
        },
      },
      chapter2: {
        pages: {
          page2: {
            path: 'testing2',
          },
        },
      },
    },
    customText: {
      reviewPageTitle: 'Custom Review Page Title',
    },
  });

  it('should render current chapter stepText', () => {
    const currentPath = 'testing1';
    const formConfigDefaultData = getDefaultData();
    const { container } = render(
      <FormNav formConfig={formConfigDefaultData} currentPath={currentPath} />,
    );
    const v3SegmentedProgressBar = container.querySelector(
      'va-segmented-progress-bar',
    );

    expect(v3SegmentedProgressBar.getAttribute('heading-text')).to.eq(
      'Testing',
    );
    expect(v3SegmentedProgressBar.getAttribute('current')).to.eq('1');
    expect(v3SegmentedProgressBar.getAttribute('total')).to.eq('4');
  });
  it('should optionally hide current chapter progress-bar & stepText', () => {
    const currentPath = 'testing1';
    const formConfigDefaultData = { ...getDefaultData() };
    formConfigDefaultData.chapters.chapter1.hideFormNavProgress = true;

    const tree = render(
      <FormNav formConfig={formConfigDefaultData} currentPath={currentPath} />,
    );

    expect(tree.queryAllByRole('progressbar')).to.have.lengthOf(0);
    expect(tree.queryByTestId('navFormHeader')).to.be.null;
  });

  it('should render dynamic chapter-title stepText', () => {
    const currentPath = 'testing1';
    const formConfigDefaultData = { ...getDefaultData() };

    // use a function for chapter-title instead of a string
    formConfigDefaultData.chapters.chapter1.title = ({
      formData,
      formConfig,
    }) => {
      if (!!formData && !!formConfig) {
        return 'Title [from function]';
      }

      return '[no params provided to function]';
    };

    const { container } = render(
      <FormNav formConfig={formConfigDefaultData} currentPath={currentPath} />,
    );
    const v3SegmentedProgressBar = container.querySelector(
      'va-segmented-progress-bar',
    );

    expect(v3SegmentedProgressBar.getAttribute('heading-text')).to.eq(
      'Title [from function]',
    );
  });

  it('should display correct chapter number & total in stepText after previous progress-hidden chapter', function() {
    if (!environment.isLocalhost()) {
      this.skip();
    }

    const currentPath = 'testing2';
    const formConfigDefaultData = { ...getDefaultData() };

    // set PREVIOUS chapter to hide progress-bar
    formConfigDefaultData.chapters.chapter1.hideFormNavProgress = true;
    const tree = render(
      <FormNav formConfig={formConfigDefaultData} currentPath={currentPath} />,
    );

    expect(tree.getByTestId('navFormHeader')).to.contain.text(
      'Step 1 of 3: Testing',
    );
  });

  it('should display/return correct chapter title when title-function uses onReviewPage parameter', () => {
    const formConfigDefaultData = { ...getDefaultData() };
    const formPageChapterTitle = 'Testing';
    const reviewPageChapterTitle = 'Testing [on review page]';

    formConfigDefaultData.chapters.chapter1.title = ({ onReviewPage }) => {
      if (onReviewPage) {
        return reviewPageChapterTitle;
      }

      return formPageChapterTitle;
    };

    const { container } = render(
      <FormNav formConfig={formConfigDefaultData} currentPath="testing1" />,
    );
    const v3SegmentedProgressBar = container.querySelector(
      'va-segmented-progress-bar',
    );

    // assert actual chapter title on form-page
    expect(v3SegmentedProgressBar.getAttribute('heading-text')).to.eq(
      formPageChapterTitle,
    );

    // actual chapter accordions are outside FormNav, so we assert on
    // what's returned from calling the title-function directly
    expect(
      formConfigDefaultData.chapters.chapter1.title({ onReviewPage: true }),
    ).to.include(reviewPageChapterTitle);
  });

  it('should display a custom review page title', () => {
    const formConfigReviewData = getReviewData();
    const currentPath = 'review-and-submit';

    const { container } = render(
      <FormNav formConfig={formConfigReviewData} currentPath={currentPath} />,
    );
    const v3SegmentedProgressBar = container.querySelector(
      'va-segmented-progress-bar',
    );

    expect(v3SegmentedProgressBar.getAttribute('heading-text')).to.eq(
      'Custom Review Page Title',
    );
  });
  it('should display the auto-save message & in-progress ID on the first page', () => {
    const formConfigReviewData = getReviewData();
    const currentPath = 'testing1';

    const tree = render(
      <FormNav
        formConfig={formConfigReviewData}
        currentPath={currentPath}
        inProgressFormId={12345}
        isLoggedIn
      />,
    );
    expect(
      tree.getByText('We’ll save your application on every change.', {
        exact: false,
      }),
    ).to.not.be.null;
    expect(
      tree.getByText('Your in-progress ID number is 12345', {
        exact: false,
      }),
    ).to.not.be.null;
  });
  it('should not display the auto-save message', () => {
    const formConfigReviewData = getReviewData();
    const currentPath = 'review-and-submit';

    const tree = render(
      <FormNav
        formConfig={formConfigReviewData}
        currentPath={currentPath}
        inProgressFormId={12345}
        isLoggedIn={false}
      />,
    );
    expect(tree.queryByTestId('navFormDiv').textContent).to.eq('');
  });

  // Can't get this test to work... useEffect callback is calling the focus
  // function; but the page includes an empty div when focusElement is called
  it.skip('should focus on navigation H3', async () => {
    const currentPath = 'testing1';
    const formConfigDefaultData = {
      ...getDefaultData(),
      useCustomScrollAndFocus: false,
    };
    const App = () => (
      <>
        <FormNav formConfig={formConfigDefaultData} currentPath={currentPath} />
        <div id="main">
          <h3>H3</h3>
        </div>
      </>
    );

    const { unmount, rerender } = render(<App />);
    unmount();
    rerender(<App />);

    await waitFor(() => {
      expect(document.activeElement.tagName).to.eq('H3');
    });
  });

  it('should render current chapter stepText', () => {
    const currentPath = 'testing4';
    const formConfigDefaultData = getDefaultData();
    const { container } = render(
      <FormNav formConfig={formConfigDefaultData} currentPath={currentPath} />,
    );
    const v3SegmentedProgressBar = container.querySelector(
      'va-segmented-progress-bar',
    );

    expect(v3SegmentedProgressBar.getAttribute('heading-text')).to.eq('');
  });
});
