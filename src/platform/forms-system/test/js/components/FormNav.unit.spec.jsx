import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';

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
    const tree = render(
      <FormNav formConfig={formConfigDefaultData} currentPath={currentPath} />,
    );

    expect(tree.getByTestId('navFormHeader').textContent).to.contain(
      'Step 1 of 3: Testing',
    );
  });
  it('should optionally hide current chapter progress-bar & stepText', () => {
    const currentPath = 'testing1';
    const formConfigDefaultData = { ...getDefaultData() };
    formConfigDefaultData.chapters.chapter1.hideFormNavProgress = true;

    const tree = render(
      <FormNav formConfig={formConfigDefaultData} currentPath={currentPath} />,
    );

    expect(tree.queryAllByRole('progressbar')).to.have.lengthOf(0);
    expect(tree.getByTestId('navFormHeader')).to.be.empty;
  });

  it('should display correct chapter number & total in stepText after previous progress-hidden chapter', () => {
    const currentPath = 'testing2';
    const formConfigDefaultData = { ...getDefaultData() };

    // set PREVIOUS chapter to hide progress-bar
    formConfigDefaultData.chapters.chapter1.hideFormNavProgress = true;
    const tree = render(
      <FormNav formConfig={formConfigDefaultData} currentPath={currentPath} />,
    );

    expect(tree.getByTestId('navFormHeader')).to.contain.text(
      'Step 1 of 2: Testing',
    );
  });

  it('should display a custom review page title', () => {
    const formConfigReviewData = getReviewData();
    const currentPath = 'review-and-submit';

    const tree = render(
      <FormNav formConfig={formConfigReviewData} currentPath={currentPath} />,
    );
    expect(tree.getByText('Custom Review Page Title', { exact: false })).to.not
      .be.null;
  });
  it('should display the auto-save message & application ID', () => {
    const formConfigReviewData = getReviewData();
    const currentPath = 'review-and-submit';

    const tree = render(
      <FormNav
        formConfig={formConfigReviewData}
        currentPath={currentPath}
        inProgressFormId={12345}
        isLoggedIn
      />,
    );
    expect(
      tree.getByText('Your application will be saved on every change', {
        exact: false,
      }),
    ).to.not.be.null;
    expect(
      tree.getByText('Your application ID number is 12345', {
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
    expect(tree.getByText(/^step [0-9]+ of [0-9]+: Custom Review Page Title$/i))
      .to.not.be.null;
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
});
