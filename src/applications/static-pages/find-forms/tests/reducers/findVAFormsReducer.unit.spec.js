import { expect } from 'chai';
import {
  FAF_OPTION_CLOSEST_MATCH,
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
  UPDATE_HOW_TO_SORT,
  UPDATE_PAGINATION,
  UPDATE_RESULTS,
} from '../../constants';
import findVAFormsReducer, {
  initialState,
} from '../../reducers/findVAFormsReducer';

describe('Find VA Forms reducer: findVAFormsReducer', () => {
  it('returns the default state when no action is given', () => {
    expect(findVAFormsReducer(initialState, { type: 'TEST' })).to.be.deep.equal(
      initialState,
    );
  });

  describe('FETCH_FORMS', () => {
    it('returns the correct state', () => {
      expect(
        findVAFormsReducer(initialState, {
          type: FETCH_FORMS,
          query: 'testing',
        }),
      ).to.be.deep.equal({
        ...initialState,
        fetching: true,
        query: 'testing',
      });
    });
  });

  describe('FETCH_FORMS_FAILURE', () => {
    it('returns the correct state', () => {
      const error = 'service failed';

      expect(
        findVAFormsReducer(
          {
            ...initialState,
            fetching: true,
          },
          {
            type: FETCH_FORMS_FAILURE,
            error,
          },
        ),
      ).to.be.deep.equal({
        ...initialState,
        error,
      });
    });
  });

  describe('FETCH_FORMS_SUCCESS', () => {
    it('returns the correct state when Closest Match is used', () => {
      const results = [
        {
          attributes: {
            formName: 'test1',
          },
        },
        {
          attributes: {
            formName: 'test2',
          },
        },
        {
          attributes: {
            formName: 'test2',
          },
        },
      ];

      expect(
        findVAFormsReducer(
          {
            ...initialState,
            fetching: true,
          },
          {
            type: FETCH_FORMS_SUCCESS,
            results,
            hasOnlyRetiredForms: false,
            sortByPropertyName: FAF_OPTION_CLOSEST_MATCH,
          },
        ),
      ).to.be.deep.equal({
        ...initialState,
        closestMatchSearchResults: results,
        results,
      });
    });

    it('returns the correct state when Closest Match is not used', () => {
      const results = [
        {
          attributes: {
            formName: 'cantaloupe',
          },
        },
        {
          attributes: {
            formName: 'apple',
          },
        },
        {
          attributes: {
            formName: 'banana',
          },
        },
      ];

      expect(
        findVAFormsReducer(
          {
            ...initialState,
            fetching: true,
            sortByPropertyName: 'ALPHA_DESCENDING',
          },
          {
            type: FETCH_FORMS_SUCCESS,
            results,
            closestMatchSearchResults: results,
            hasOnlyRetiredForms: false,
          },
        ),
      ).to.be.deep.equal({
        ...initialState,
        closestMatchSearchResults: results,
        sortByPropertyName: 'ALPHA_DESCENDING',
        results,
      });
    });
  });

  describe('UPDATE_HOW_TO_SORT', () => {
    it('returns the correct state', () => {
      const sort = 'test';

      expect(
        findVAFormsReducer(initialState, {
          type: UPDATE_HOW_TO_SORT,
          sortByPropertyName: sort,
        }),
      ).to.be.deep.equal({
        ...initialState,
        sortByPropertyName: sort,
      });
    });
  });

  describe('UPDATE_RESULTS', () => {
    it('returns the correct state when Closest Match is used', () => {
      const results = [
        {
          attributes: {
            formName: 'test1',
          },
        },
        {
          attributes: {
            formName: 'test2',
          },
        },
        {
          attributes: {
            formName: 'test3',
          },
        },
      ];

      expect(
        findVAFormsReducer(
          {
            ...initialState,
            sortByPropertyName: FAF_OPTION_CLOSEST_MATCH,
            closestMatchSearchResults: results,
          },
          {
            type: UPDATE_RESULTS,
            results,
          },
        ),
      ).to.be.deep.equal({
        ...initialState,
        results,
        closestMatchSearchResults: results,
      });
    });

    it('returns the correct state when Closest Match is not used', () => {
      const results = [
        {
          attributes: {
            formName: 'cantaloupe',
          },
        },
        {
          attributes: {
            formName: 'apple',
          },
        },
        {
          attributes: {
            formName: 'banana',
          },
        },
      ];

      expect(
        findVAFormsReducer(
          {
            ...initialState,
            sortByPropertyName: 'ALPHA_DESCENDING',
          },
          {
            type: UPDATE_RESULTS,
            results,
            closestMatchSearchResults: results,
          },
        ),
      ).to.be.deep.equal({
        ...initialState,
        sortByPropertyName: 'ALPHA_DESCENDING',
        results,
      });
    });
  });

  describe('UPDATE_PAGINATION', () => {
    it('returns the correct state when UPDATE_PAGINATION is given', () => {
      expect(
        findVAFormsReducer(initialState, {
          type: UPDATE_PAGINATION,
          page: 2,
          startIndex: 2,
        }),
      ).to.be.deep.equal({
        ...initialState,
        page: 2,
        startIndex: 2,
      });
    });
  });
});
