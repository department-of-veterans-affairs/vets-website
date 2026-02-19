import { expect } from 'chai';
import vaProfile from '@@profile/reducers/vaProfile';
import { FETCH_HERO_SUCCESS, FETCH_HERO_FAILED } from '@@profile/actions';
import {
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
  UPDATE_PERSONAL_INFORMATION_FIELD,
} from '@@vap-svc/actions/personalInformation';
import {
  FETCH_SCHEDULING_PREFERENCES,
  FETCH_SCHEDULING_PREFERENCES_SUCCESS,
  FETCH_SCHEDULING_PREFERENCES_FAILED,
  UPDATE_SCHEDULING_PREFERENCES_FIELD,
} from '@@vap-svc/actions/schedulingPreferences';

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

  it('should handle FETCH_POWER_OF_ATTORNEY_SUCCESS', () => {
    const poa = { type: 'organization', name: 'Veterans Organization' };
    const action = {
      type: 'FETCH_POWER_OF_ATTORNEY_SUCCESS',
      poa,
    };
    expect(vaProfile(initialState, action)).to.deep.equal({
      ...initialState,
      powerOfAttorney: poa,
    });
  });

  it('should handle FETCH_POWER_OF_ATTORNEY_FAILED', () => {
    const poa = { error: 'Failed to fetch power of attorney' };
    const action = {
      type: 'FETCH_POWER_OF_ATTORNEY_FAILED',
      poa,
    };
    expect(vaProfile(initialState, action)).to.deep.equal({
      ...initialState,
      powerOfAttorney: poa,
    });
  });

  it('should handle FETCH_SCHEDULING_PREFERENCES', () => {
    const action = { type: FETCH_SCHEDULING_PREFERENCES };
    const expectedState = {
      ...initialState,
      schedulingPreferences: {
        error: false,
        loading: true,
      },
    };
    expect(vaProfile(initialState, action)).to.deep.equal(expectedState);
  });

  it('should handle FETCH_SCHEDULING_PREFERENCES_SUCCESS', () => {
    const schedulingPreferences = {
      preferences: [
        {
          itemId: 123,
          optionIds: ['1', '2'],
        },
      ],
    };
    const action = {
      type: FETCH_SCHEDULING_PREFERENCES_SUCCESS,
      schedulingPreferences,
    };
    // The exact structure depends on the convertSchedulingPreferencesToReduxFormat function
    const result = vaProfile(initialState, action);
    expect(result.schedulingPreferences).to.have.property('loading', false);
    expect(result.schedulingPreferences).to.not.have.property('error');
  });

  it('should handle FETCH_SCHEDULING_PREFERENCES_FAILED', () => {
    const action = { type: FETCH_SCHEDULING_PREFERENCES_FAILED };
    const expectedState = {
      ...initialState,
      schedulingPreferences: {
        error: true,
        loading: false,
      },
    };
    expect(vaProfile(initialState, action)).to.deep.equal(expectedState);
  });

  it('should handle UPDATE_SCHEDULING_PREFERENCES_FIELD', () => {
    const action = {
      type: UPDATE_SCHEDULING_PREFERENCES_FIELD,
      fieldName: 'notificationFrequency',
      value: { notificationFrequency: 'option-123' },
    };
    const result = vaProfile(initialState, action);
    expect(result.schedulingPreferences).to.have.property(
      'notificationFrequency',
    );
  });

  it('should handle FETCH_MILITARY_INFORMATION_SUCCESS', () => {
    const militaryInformation = {
      serviceHistory: [{ branchOfService: 'Army', beginDate: '2000-01-01' }],
    };
    const action = {
      type: 'FETCH_MILITARY_INFORMATION_SUCCESS',
      militaryInformation,
    };
    expect(vaProfile(initialState, action)).to.deep.equal({
      ...initialState,
      militaryInformation,
    });
  });

  it('should handle FETCH_MILITARY_INFORMATION_FAILED', () => {
    const militaryInformation = {
      error: 'Failed to fetch military information',
    };
    const action = {
      type: 'FETCH_MILITARY_INFORMATION_FAILED',
      militaryInformation,
    };
    expect(vaProfile(initialState, action)).to.deep.equal({
      ...initialState,
      militaryInformation,
    });
  });

  it('should handle unknown action type', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(vaProfile(initialState, action)).to.deep.equal(initialState);
  });
});
