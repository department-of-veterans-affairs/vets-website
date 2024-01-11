import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import {
  ReviewChapters,
  mapStateToProps,
} from '../../../src/js/review/ReviewChapters';

describe('Schemaform review: ReviewChapters', () => {
  it('should handle editing', () => {
    const chapters = [
      {
        expandedPages: [],
        formConfig: {},
        name: 'chapter1',
        open: false,
        pageKeys: ['page1'],
      },
      {
        expandedPages: [],
        formConfig: {},
        name: 'chapter2',
        open: false,
        pageKeys: ['page2'],
      },
    ];

    const pageList = [
      {
        path: 'previous-page',
      },
      {
        path: 'next-page',
      },
    ];

    const setEditMode = sinon.spy();
    const setViewedPages = sinon.spy();

    const tree = shallow(
      <ReviewChapters
        chapters={chapters}
        pageList={pageList}
        setEditMode={setEditMode}
        setViewedPages={setViewedPages}
      />,
    );

    tree.instance().handleEdit('testPage', true);
    expect(setViewedPages.calledWith(['testPage']));
    expect(setEditMode.calledWith('testPage', true, null));
    tree.unmount();
  });

  it('should handle toggling', () => {
    const formConfig = {
      chapters: {
        chapter1: {
          pages: {
            page1: {},
          },
        },
        chapter2: {
          pages: {
            page2: {},
          },
        },
      },
    };

    const pageList = [
      {
        path: 'previous-page',
      },
      {
        path: 'next-page',
      },
    ];

    const chapters = [
      {
        expandedPages: [],
        formConfig: {},
        name: 'chapter1',
        open: false,
        pageKeys: ['page1'],
      },
      {
        expandedPages: [],
        formConfig: {},
        name: 'chapter2',
        open: false,
        pageKeys: ['page2'],
      },
    ];

    const openReviewChapter = sinon.spy();
    const closeReviewChapter = sinon.spy();

    const tree = shallow(
      <ReviewChapters
        chapters={chapters}
        closeReviewChapter={closeReviewChapter}
        openReviewChapter={openReviewChapter}
        pageList={pageList}
        route={{ formConfig, pageList }}
        viewedPages={['page1', 'page2']}
        setViewedPages={f => f}
      />,
    );

    const instance = tree.instance();

    instance.handleToggleChapter({
      target: {
        dataset: { chapter: 'chapter1' },
        getAttribute: () => true,
      },
    });
    expect(openReviewChapter.args[0][0]).to.eq('chapter1');
    instance.handleToggleChapter({
      target: {
        dataset: { chapter: 'chapter2' },
        getAttribute: () => false,
      },
    });
    expect(closeReviewChapter.args[0][0]).to.eq('chapter2');
    tree.unmount();
  });

  it('should pass index to depends for pagePerItem pages', () => {
    const formData = {
      testArray: [{}],
    };

    const dependsStub = sinon.stub();
    dependsStub.withArgs(formData, 0).returns(true);

    mapStateToProps(
      {
        form: {
          pages: {},
          submission: {},
          reviewPageView: {
            viewedPages: new Set(),
          },
          data: formData,
        },
      },
      {
        formConfig: {
          chapters: {
            test: {
              pages: {
                testPage: {
                  path: '/testing/:index',
                  pagePerItem: true,
                  arrayPath: 'testArray',
                  depends: dependsStub,
                },
              },
            },
          },
        },
        pageList: [{}],
      },
    );

    expect(dependsStub.calledWith(formData, 0));
  });
});
