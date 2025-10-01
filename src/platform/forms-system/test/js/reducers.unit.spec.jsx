import { expect } from 'chai';

import reducers from '../../src/js/state/reducers';
import {
  CLOSE_REVIEW_CHAPTER,
  OPEN_REVIEW_CHAPTER,
  TOGGLE_ALL_REVIEW_CHAPTERS,
} from '../../src/js/actions';

describe('reducers', () => {
  context('CLOSE_REVIEW_CHAPTER', () => {
    it('should close named chapter', () => {
      const state = {
        reviewPageView: {
          openChapters: { test1: true, test2: false, test3: true },
          viewedPages: new Set(),
        },
      };
      const action = {
        type: CLOSE_REVIEW_CHAPTER,
        closedChapter: 'test1',
        pageKeys: [],
      };
      expect(reducers[CLOSE_REVIEW_CHAPTER](state, action)).to.deep.equal({
        reviewPageView: {
          openChapters: { test1: false, test2: false, test3: true },
          viewedPages: state.reviewPageView.viewedPages,
        },
      });
    });
    it('should close named chapter', () => {
      const state = {
        reviewPageView: {
          openChapters: { test1: true, test2: false, test3: true },
          viewedPages: new Set(),
        },
      };
      const action = {
        type: CLOSE_REVIEW_CHAPTER,
        closedChapter: 'test3',
        pageKeys: ['page1', 'page2'],
      };
      expect(reducers[CLOSE_REVIEW_CHAPTER](state, action)).to.deep.equal({
        reviewPageView: {
          openChapters: { test1: true, test2: false, test3: false },
          viewedPages: state.reviewPageView.viewedPages
            .add('page1')
            .add('page2'),
        },
      });
    });
  });

  context('OPEN_REVIEW_CHAPTER', () => {
    it('should open named chapter', () => {
      const state = {
        reviewPageView: {
          openChapters: { test1: true, test2: false, test3: true },
        },
      };
      const action = {
        type: OPEN_REVIEW_CHAPTER,
        openedChapter: 'test2',
      };
      expect(reducers[OPEN_REVIEW_CHAPTER](state, action)).to.deep.equal({
        reviewPageView: {
          openChapters: { test1: true, test2: true, test3: true },
        },
      });
    });
  });

  context('TOGGLE_ALL_REVIEW_CHAPTERS', () => {
    it('should set all chapters as open', () => {
      const state = {
        reviewPageView: {
          openChapters: { test1: true, test2: false, test3: true },
        },
      };
      const action = {
        type: TOGGLE_ALL_REVIEW_CHAPTERS,
        chapters: { test1: true, test2: true, test3: true },
      };
      expect(reducers[TOGGLE_ALL_REVIEW_CHAPTERS](state, action)).to.deep.equal(
        {
          reviewPageView: {
            openChapters: { test1: true, test2: true, test3: true },
          },
        },
      );
    });
  });
  it('should set all chapters to closed', () => {
    const state = {
      reviewPageView: {
        openChapters: { test1: false, test2: true, test3: true },
      },
    };
    const action = {
      type: TOGGLE_ALL_REVIEW_CHAPTERS,
      chapters: { test1: false, test2: false, test3: false },
    };
    expect(reducers[TOGGLE_ALL_REVIEW_CHAPTERS](state, action)).to.deep.equal({
      reviewPageView: {
        openChapters: { test1: false, test2: false, test3: false },
      },
    });
  });
});
