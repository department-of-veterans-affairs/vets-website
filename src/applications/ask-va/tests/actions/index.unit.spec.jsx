import { expect } from 'chai';
import {
  CLOSE_REVIEW_CHAPTER,
  closeReviewChapter,
  OPEN_REVIEW_CHAPTER,
  openReviewChapter,
  SET_CATEGORY_ID,
  SET_LOCATION_SEARCH,
  SET_TOPIC_ID,
  SET_UPDATED_IN_REVIEW,
  setCategoryID,
  setLocationInput,
  setTopicID,
  setUpdatedInReview,
} from '../../actions/index';

describe('Action Creators', () => {
  it('should create an action to set the category ID', () => {
    const id = '123';
    const expectedAction = {
      type: SET_CATEGORY_ID,
      payload: id,
    };
    expect(setCategoryID(id)).to.deep.equal(expectedAction);
  });

  it('should create an action to set the topic ID', () => {
    const id = '456';
    const expectedAction = {
      type: SET_TOPIC_ID,
      payload: id,
    };
    expect(setTopicID(id)).to.deep.equal(expectedAction);
  });

  it('should create an action to set updated in review', () => {
    const page = 'some-page';
    const expectedAction = {
      type: SET_UPDATED_IN_REVIEW,
      payload: page,
    };
    expect(setUpdatedInReview(page)).to.deep.equal(expectedAction);
  });

  it('should create an action to close a review chapter', () => {
    const closedChapter = 'chapter-1';
    const pageKeys = ['page-1', 'page-2'];
    const expectedAction = {
      type: CLOSE_REVIEW_CHAPTER,
      closedChapter,
      pageKeys,
    };
    expect(closeReviewChapter(closedChapter, pageKeys)).to.deep.equal(
      expectedAction,
    );
  });

  it('should create an action to open a review chapter', () => {
    const openedChapter = 'chapter-2';
    const expectedAction = {
      type: OPEN_REVIEW_CHAPTER,
      openedChapter,
    };
    expect(openReviewChapter(openedChapter)).to.deep.equal(expectedAction);
  });

  it('should create an action to set the location search input', () => {
    const searchInput = 'New York';
    const expectedAction = {
      type: SET_LOCATION_SEARCH,
      payload: searchInput,
    };
    expect(setLocationInput(searchInput)).to.deep.equal(expectedAction);
  });
});
