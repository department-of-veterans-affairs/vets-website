import { expect } from 'chai';
import moment from 'moment';

import { makeField } from '../../../src/js/common/model/fields';
import searchReducer from '../../../src/js/messaging/reducers/search';

import {
  CLOSE_ADVANCED_SEARCH,
  OPEN_ADVANCED_SEARCH,
  SET_ADVSEARCH_END_DATE,
  SET_ADVSEARCH_START_DATE,
  SET_SEARCH_PARAM,
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

  it('should open advanced search', () => {
    const newState = searchReducer({ advanced: { visible: false } }, { type: OPEN_ADVANCED_SEARCH });
    expect(newState.advanced.visible).to.be.true;
  });

  it('should close advanced search', () => {
    const newState = searchReducer({ advanced: { visible: true } }, { type: CLOSE_ADVANCED_SEARCH });
    expect(newState.advanced.visible).to.be.false;
  });

  it('should set search params', () => {
    const basicQuery = makeField('basic search', true);
    let newState = searchReducer(initialState, {
      type: SET_SEARCH_PARAM,
      path: 'term',
      field: basicQuery
    });
    expect(newState.params.term).to.eql(basicQuery);

    const fromFieldQuery = makeField('Clinician 1', true);
    newState = searchReducer(newState, {
      type: SET_SEARCH_PARAM,
      path: 'from.field',
      field: fromFieldQuery
    });
    expect(newState.params.from.field).to.eql(fromFieldQuery);

    const fromExactQuery = makeField(true, true);
    newState = searchReducer(newState, {
      type: SET_SEARCH_PARAM,
      path: 'from.exact',
      field: fromExactQuery
    });
    expect(newState.params.from.exact).to.eql(fromExactQuery);

    const subjectFieldQuery = makeField('tests', true);
    newState = searchReducer(newState, {
      type: SET_SEARCH_PARAM,
      path: 'subject.field',
      field: subjectFieldQuery
    });
    expect(newState.params.subject.field).to.eql(subjectFieldQuery);

    const subjectExactQuery = makeField(true, true);
    newState = searchReducer(newState, {
      type: SET_SEARCH_PARAM,
      path: 'subject.exact',
      field: subjectExactQuery
    });
    expect(newState.params.subject.exact).to.eql(subjectExactQuery);
  });
});
