import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import FormNav from '../../../src/js/components/FormNav';

describe('Schemaform FormNav', () => {
  const getDefaultData = () => ({
    chapters: {
      chapter1: {
        title: 'Testing',
        pages: {
          page1: {
            path: 'testing',
          },
        },
      },
      chapter2: {
        pages: {
          page2: {
            path: 'testing',
          },
        },
      },
      chapter3: {
        pages: {
          page3: {
            path: 'testing',
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
            path: 'testing',
          },
        },
      },
      chapter2: {
        pages: {
          page2: {
            path: 'testing',
          },
        },
      },
    },
    customText: {
      reviewPageTitle: 'Custom Review Page Title',
    },
  });

  it('should render current chapter data', () => {
    const currentPath = 'testing';
    const formConfigDefaultData = getDefaultData();
    const tree = render(
      <FormNav formConfig={formConfigDefaultData} currentPath={currentPath} />,
    );

    expect(tree.getByText('Step 1 of 4: Testing')).to.not.be.null;
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
  it.skip('should diplay the auto-save message & application ID', () => {
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
    expect(
      tree.getByText('Step 3 of 3: Custom Review Page Title', { exact: true }),
    ).to.not.be.null;
  });
});
