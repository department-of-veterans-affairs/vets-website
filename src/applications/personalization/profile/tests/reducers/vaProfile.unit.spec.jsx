import { expect } from 'chai';
import vaProfile from '@@profile/reducers/vaProfile';
import { FETCH_HERO_SUCCESS, FETCH_HERO_FAILED } from '@@profile/actions';
import {
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
  UPDATE_PERSONAL_INFORMATION_FIELD,
} from '@@vap-svc/actions/personalInformation';

import { PERSONAL_INFO_FIELD_NAMES } from '@@vap-svc/constants';

describe('vaProfile reducer', () => {
  const initialState = {
    hero: null,
    personalInformation: null,
    militaryInformation: null,
    powerOfAttorney: null,
  };

  it('should return the initial state', () => {
    expect(vaProfile(undefined, {})).to.deep.equal(initialState);
  });

  it('should handle FETCH_HERO_SUCCESS', () => {
    const hero = { name: 'John Doe' };
    const action = { type: FETCH_HERO_SUCCESS, hero };
    expect(vaProfile(initialState, action)).to.deep.equal({
      ...initialState,
      hero,
    });
  });

  it('should handle FETCH_HERO_FAILED', () => {
    const hero = { error: 'Failed to fetch hero' };
    const action = { type: FETCH_HERO_FAILED, hero };
    expect(vaProfile(initialState, action)).to.deep.equal({
      ...initialState,
      hero,
    });
  });

  it('should handle FETCH_PERSONAL_INFORMATION_SUCCESS', () => {
    const personalInformation = { name: 'John Doe' };
    const action = {
      type: FETCH_PERSONAL_INFORMATION_SUCCESS,
      personalInformation,
    };
    expect(vaProfile(initialState, action)).to.deep.equal({
      ...initialState,
      personalInformation,
    });
  });

  it('should handle FETCH_PERSONAL_INFORMATION_FAILED', () => {
    const personalInformation = {
      error: 'Failed to fetch personal information',
    };
    const action = {
      type: FETCH_PERSONAL_INFORMATION_FAILED,
      personalInformation,
    };
    expect(vaProfile(initialState, action)).to.deep.equal({
      ...initialState,
      personalInformation,
    });
  });

  it('should handle UPDATE_PERSONAL_INFORMATION_FIELD for free text field', () => {
    const action = {
      type: UPDATE_PERSONAL_INFORMATION_FIELD,
      fieldName: PERSONAL_INFO_FIELD_NAMES.SEXUAL_ORIENTATION,
      value: { [PERSONAL_INFO_FIELD_NAMES.SEXUAL_ORIENTATION]: 'test text' },
    };
    const expectedState = {
      ...initialState,
      personalInformation: {
        [PERSONAL_INFO_FIELD_NAMES.SEXUAL_ORIENTATION]: 'test text',
      },
    };
    expect(vaProfile(initialState, action)).to.deep.equal(expectedState);
  });

  it('should handle UPDATE_PERSONAL_INFORMATION_FIELD for PREFERRED_NAME', () => {
    const action = {
      type: UPDATE_PERSONAL_INFORMATION_FIELD,
      fieldName: PERSONAL_INFO_FIELD_NAMES.PREFERRED_NAME,
      value: { [PERSONAL_INFO_FIELD_NAMES.PREFERRED_NAME]: 'john' },
    };
    const expectedState = {
      ...initialState,
      personalInformation: { preferredName: 'John' },
    };
    expect(vaProfile(initialState, action)).to.deep.equal(expectedState);
  });

  it('should handle UPDATE_PERSONAL_INFORMATION_FIELD for GENDER_IDENTITY', () => {
    const action = {
      type: UPDATE_PERSONAL_INFORMATION_FIELD,
      fieldName: PERSONAL_INFO_FIELD_NAMES.GENDER_IDENTITY,
      value: { [PERSONAL_INFO_FIELD_NAMES.GENDER_IDENTITY]: 'M' },
    };
    const expectedState = {
      ...initialState,
      personalInformation: {
        genderIdentity: { code: 'M' },
      },
    };
    expect(vaProfile(initialState, action)).to.deep.equal(expectedState);
  });

  it('should handle unknown action type', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(vaProfile(initialState, action)).to.deep.equal(initialState);
  });
});
