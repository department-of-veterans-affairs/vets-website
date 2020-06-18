import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import FormNav from '../../../src/js/components/FormNav';

describe('Schemaform FormNav', () => {
  let formConfigDefaultData;
  before(() => {
    formConfigDefaultData = {
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
    };
  });
  it('should render current chapter data', () => {
    const currentPath = 'testing';

    const tree = SkinDeep.shallowRender(
      <FormNav formConfig={formConfigDefaultData} currentPath={currentPath} />,
    );

    expect(tree.subTree('SegmentedProgressBar').props.total).to.equal(4);
    expect(tree.subTree('SegmentedProgressBar').props.current).to.equal(1);
    expect(tree.subTree('.nav-header').text()).to.equal('1 of 4 Testing');
  });
  it('should display a custom review page title', () => {
    const formConfigReviewData = {
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
      savedFormMessages: {
        reviewPageTitle: 'Custom Review Page Title',
      },
    };
    const currentPath = 'review-and-submit';

    const tree = SkinDeep.shallowRender(
      <FormNav formConfig={formConfigReviewData} currentPath={currentPath} />,
    );
    expect(tree.text()).to.include('Custom Review Page Title');
  });
});
