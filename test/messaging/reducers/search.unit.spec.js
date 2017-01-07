import { expect } from 'chai';
import moment from 'moment';
import { makeField } from '../../../src/js/common/model/fields';

import searchReducer from '../../../src/js/messaging/reducers/search';

import {
  SET_ADVSEARCH_END_DATE,
  SET_ADVSEARCH_START_DATE,
  TOGGLE_ADVANCED_SEARCH
} from '../../../src/js/messaging/utils/constants';

const initialState = {
  params: {
    dateRange: {
      start: null,
      end: null
    },
    term: makeField(''),
    from: {
      field: makeField(''),
      exact: false
    },
    subject: {
      field: makeField(''),
      exact: false
    }
  },
  advanced: {
    visible: false
  }
};

describe('search reducer', () => {
  it('should set end date for advanced search', () => {
    const today = moment().startOf('day');
    let newState = searchReducer(initialState, {
      type: SET_ADVSEARCH_END_DATE,
      date: today
    });

    expect(newState.params.dateRange.end.toString())
      .to.eql(today.endOf('day').toString());

    const weekAgo = today.clone().subtract(1, 'weeks');
    newState = searchReducer(newState, {
      type: SET_ADVSEARCH_END_DATE,
      date: weekAgo
    });

    expect(newState.params.dateRange.end.toString())
      .to.eql(weekAgo.endOf('day').toString());
  });

  it('should set start date for advanced search', () => {
    const today = moment().startOf('day');
    let newState = searchReducer(initialState, {
      type: SET_ADVSEARCH_START_DATE,
      date: today
    });

    expect(newState.params.dateRange.start.toString())
      .to.eql(today.toString());

    const weekAgo = today.clone().subtract(1, 'weeks');
    newState = searchReducer(newState, {
      type: SET_ADVSEARCH_START_DATE,
      date: weekAgo
    });

    expect(newState.params.dateRange.start.toString())
      .to.eql(weekAgo.toString());
  });

  it('should toggle advanced search', () => {
    let newState = searchReducer(initialState, { type: TOGGLE_ADVANCED_SEARCH });
    expect(newState.advanced.visible).to.be.true;
    newState = searchReducer(newState, { type: TOGGLE_ADVANCED_SEARCH });
    expect(newState.advanced.visible).to.be.false;
  });
});
