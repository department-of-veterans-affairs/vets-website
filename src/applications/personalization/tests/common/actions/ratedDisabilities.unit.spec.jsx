import { expect } from 'chai';
import sinon from 'sinon';
import {
  FETCH_RATED_DISABILITIES_SUCCESS,
  FETCH_RATED_DISABILITIES_FAILED,
  FETCH_TOTAL_RATING_STARTED,
  FETCH_TOTAL_RATING_SUCCEEDED,
  FETCH_TOTAL_RATING_FAILED,
  fetchTotalDisabilityRating,
} from '../../../common/actions/ratedDisabilities';

describe('ratedDisabilities actions', () => {
  describe('action type constants', () => {
    it('should export FETCH_RATED_DISABILITIES_SUCCESS constant', () => {
      expect(FETCH_RATED_DISABILITIES_SUCCESS).to.equal(
        'FETCH_RATED_DISABILITIES_SUCCESS',
      );
    });

    it('should export FETCH_RATED_DISABILITIES_FAILED constant', () => {
      expect(FETCH_RATED_DISABILITIES_FAILED).to.equal(
        'FETCH_RATED_DISABILITIES_FAILED',
      );
    });

    it('should export FETCH_TOTAL_RATING_STARTED constant', () => {
      expect(FETCH_TOTAL_RATING_STARTED).to.equal('FETCH_TOTAL_RATING_STARTED');
    });

    it('should export FETCH_TOTAL_RATING_SUCCEEDED constant', () => {
      expect(FETCH_TOTAL_RATING_SUCCEEDED).to.equal(
        'FETCH_TOTAL_RATING_SUCCEEDED',
      );
    });

    it('should export FETCH_TOTAL_RATING_FAILED constant', () => {
      expect(FETCH_TOTAL_RATING_FAILED).to.equal('FETCH_TOTAL_RATING_FAILED');
    });
  });

  describe('fetchTotalDisabilityRating', () => {
    it('should be a function', () => {
      expect(fetchTotalDisabilityRating).to.be.a('function');
    });

    it('should return an async function', () => {
      const action = fetchTotalDisabilityRating();
      expect(action).to.be.a('function');
    });

    it('should return a function that accepts dispatch', () => {
      const action = fetchTotalDisabilityRating();
      expect(action.length).to.equal(1);
    });

    it('should accept an optional recordAnalyticsEvent parameter', () => {
      const customEvent = sinon.spy();
      const action = fetchTotalDisabilityRating(customEvent);
      expect(action).to.be.a('function');
      expect(action.length).to.equal(1);
    });

    it('should use default recordEvent when not provided', () => {
      const action = fetchTotalDisabilityRating();
      expect(action).to.be.a('function');
    });
  });
});
