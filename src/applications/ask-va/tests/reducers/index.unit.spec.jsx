import { expect } from 'chai';
import reducers from '../../reducers';

const initialState = {
  categoryID: '',
  topicID: '',
  subtopicID: '',
  updatedInReview: '',
  searchLocationInput: '',
  getLocationInProgress: false,
  currentUserLocation: '',
  getLocationError: false,
  selectedFacility: null,
  vaHealthFacility: '',
  reviewPageView: {
    openChapters: [],
  },
};

describe('reducers', () => {
  it('SET_CATEGORY_ID', () => {
    const newData = reducers.askVA(undefined, {
      type: 'SET_CATEGORY_ID',
      payload: 'test',
    });
    expect(newData).to.deep.equal({
      ...initialState,
      categoryID: 'test',
    });
  });

  it('SET_TOPIC_ID', () => {
    const newData = reducers.askVA(undefined, {
      type: 'SET_TOPIC_ID',
      payload: 'test',
    });
    expect(newData).to.deep.equal({
      ...initialState,
      topicID: 'test',
    });
  });

  it('SET_SUBTOPIC_ID', () => {
    const newData = reducers.askVA(undefined, {
      type: 'SET_SUBTOPIC_ID',
      payload: 'test',
    });
    expect(newData).to.deep.equal({
      ...initialState,
      subtopicID: 'test',
    });
  });

  it('SET_UPDATED_IN_REVIEW', () => {
    const newData = reducers.askVA(undefined, {
      type: 'SET_UPDATED_IN_REVIEW',
      payload: 'test',
    });
    expect(newData).to.deep.equal({
      ...initialState,
      updatedInReview: 'test',
    });
  });

  it('OPEN_REVIEW_CHAPTER', () => {
    const newData = reducers.askVA(undefined, {
      type: 'OPEN_REVIEW_CHAPTER',
      openedChapter: 'test',
    });
    expect(newData).to.deep.equal({
      ...initialState,
      reviewPageView: {
        openChapters: ['test'],
      },
    });
  });

  it('CLOSE_REVIEW_CHAPTER', () => {
    const state = {
      reviewPageView: {
        openChapters: ['chapter-1', 'chapter-2'],
        viewedPages: new Set(['page-3']),
      },
    };

    const newData = reducers.askVA(state, {
      type: 'CLOSE_REVIEW_CHAPTER',
      closedChapter: 'chapter-1',
      pageKeys: ['page-1', 'page-2'],
    });

    expect(newData).to.deep.equal({
      reviewPageView: {
        openChapters: ['chapter-2'],
        viewedPages: new Set(['page-1', 'page-2', 'page-3']),
      },
    });
  });

  it('GEOLOCATE_USER', () => {
    const newData = reducers.askVA(undefined, {
      type: 'GEOLOCATE_USER',
    });
    expect(newData).to.deep.equal({
      ...initialState,
      getLocationInProgress: true,
    });
  });

  it('GEOCODE_FAILED', () => {
    const newData = reducers.askVA(undefined, {
      type: 'GEOCODE_FAILED',
    });
    expect(newData).to.deep.equal({
      ...initialState,
      getLocationError: true,
      getLocationInProgress: false,
    });
  });

  it('GEOCODE_COMPLETE', () => {
    const newData = reducers.askVA(undefined, {
      type: 'GEOCODE_COMPLETE',
      payload: 'test',
    });
    expect(newData).to.deep.equal({
      ...initialState,
      currentUserLocation: 'test',
      getLocationInProgress: false,
    });
  });
});
