import { expect } from 'chai';

import {
  FETCH_PROFILE_CONTACTS_FAILED,
  FETCH_PROFILE_CONTACTS_STARTED,
  FETCH_PROFILE_CONTACTS_SUCCEEDED,
} from '@@profile/actions/contacts';
import { profileContactsReducer as reducer } from '@@profile/reducers/contacts';

import contacts from '@@profile/tests/fixtures/contacts.json';

describe('profileContactsReducer', () => {
  let state;
  let nextState;
  let action;

  beforeEach(() => {
    state = undefined;
  });

  describe('FETCH_PROFILE_CONTACTS_STARTED', () => {
    it('sets loading', () => {
      action = {
        type: FETCH_PROFILE_CONTACTS_STARTED,
      };
      nextState = reducer(state, action);
      expect(nextState.loading).to.be.true;
    });
  });

  describe('FETCH_PROFILE_CONTACTS_SUCCEEDED', () => {
    it('sets data', () => {
      action = {
        type: FETCH_PROFILE_CONTACTS_SUCCEEDED,
        payload: contacts,
      };
      nextState = reducer(state, action);
      expect(nextState.data).to.equal(contacts.data);
      expect(nextState.loading).to.be.false;
      expect(nextState.error).to.be.false;
    });
  });

  describe('FETCH_PROFILE_CONTACTS_FAILED', () => {
    it('sets error', () => {
      action = {
        type: FETCH_PROFILE_CONTACTS_FAILED,
        payload: 'err',
      };
      nextState = reducer(state, action);
      expect(nextState.error).to.be.true;
      expect(nextState.loading).to.be.false;
      expect(nextState.data).to.deep.equal([]);
    });
  });
});
