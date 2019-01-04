import { expect } from 'chai';

import localStorage from 'platform/utilities/storage/localStorage';

import {
  DISMISSED_BENEFIT_ALERTS,
  getDismissedBenefitAlerts,
  setDismissedBenefitAlerts,
  dismissBenefitAlert,
  restoreDismissedBenefitAlerts,
  getNewSelections,
  transformPreferencesForSaving,
  filterItems,
  didPreferencesChange,
  didJustSave,
  didJustFailToSave,
} from '../helpers';
import { LOADING_STATES } from '../constants';

describe('getDismissedBenefitAlerts', () => {
  beforeEach(() => {
    localStorage.removeItem(DISMISSED_BENEFIT_ALERTS);
  });

  it('returns an empty array from localStorage', () => {
    const result = getDismissedBenefitAlerts();
    expect(result).to.deep.equal([]);
  });

  it('returns previously-dismissed benefit announcements', () => {
    dismissBenefitAlert('test');

    const result = getDismissedBenefitAlerts();
    expect(result).to.be.deep.equal(['test']);
  });
});

describe('setDismissedBenefitAlerts', () => {
  beforeEach(() => {
    localStorage.removeItem(DISMISSED_BENEFIT_ALERTS);
  });

  it('sets a list of benefit alerts to local storage', () => {
    setDismissedBenefitAlerts(['test-1', 'test-2']);
    const result = getDismissedBenefitAlerts();
    expect(result).to.deep.equal(['test-1', 'test-2']);
  });
});
describe('dismissBenefitAlert', () => {
  beforeEach(() => {
    localStorage.removeItem(DISMISSED_BENEFIT_ALERTS);
  });

  it('add a benefit alert name to the list of dismissed alerts', () => {
    dismissBenefitAlert('test-1');
    const result = getDismissedBenefitAlerts();
    expect(result).to.deep.equal(['test-1']);
  });
});
describe('restoreDismissedBenefitAlerts', () => {
  beforeEach(() => {
    localStorage.removeItem(DISMISSED_BENEFIT_ALERTS);
  });

  it('should remove alerts from the dismissed list', () => {
    dismissBenefitAlert('test-1');
    restoreDismissedBenefitAlerts(['test-1']);
    const result = getDismissedBenefitAlerts();
    expect(result).to.deep.equal([]);
  });
});
describe('getNewSelections', () => {
  it('should return a list of recently added benefit choices', () => {
    const result = getNewSelections(
      { 'test-1': true },
      { 'test-1': true, 'test-2': true },
    );
    expect(result).to.deep.equal(['test-2']);
  });
});
describe('transformPreferencesForSaving', () => {
  let preferences;
  it('should return the correct JSON data', () => {
    preferences = {
      'pref-one': false,
      prefTwo: true,
      'another-preference': true,
    };
    const formattedPreferences = transformPreferencesForSaving(preferences);
    expect(formattedPreferences).to.be.a('string');
    const benefitPreferences = JSON.parse(formattedPreferences)[0];
    expect(benefitPreferences).to.be.an('object');
    expect(benefitPreferences.preference).to.deep.equal({
      code: 'benefits',
    });
    expect(benefitPreferences.user_preferences).to.deep.equal([
      { code: 'prefTwo' },
      { code: 'another-preference' },
    ]);
  });
  describe('filterItems', () => {
    it('should return a list with the specified items filtered out', () => {
      const filteredList = filterItems([1, 2, 6, 6], [1, 2, 3, 4, 5]);
      expect(filteredList).to.have.members([6]);
      expect(filteredList.length).to.equal(1);
    });
  });
  describe('didPreferencesChange', () => {
    it('should return `true` if the `preferences` do not match', () => {
      const prevProps = { preferences: { key: { key: true } } };
      const nextProps = { preferences: { key: { key: false } } };
      expect(didPreferencesChange(prevProps, nextProps)).to.equal(true);
    });
    it('should return `false` if the `preferences` match', () => {
      const prevProps = { preferences: { key: { key: true } } };
      const nextProps = { preferences: { key: { key: true } } };
      expect(didPreferencesChange(prevProps, nextProps)).to.equal(false);
    });
  });
  describe('didJustSave', () => {
    it('should return `true` if the `preferences.saveStatus` flipped from pending to loaded', () => {
      const prevProps = { preferences: { saveStatus: LOADING_STATES.pending } };
      const nextProps = { preferences: { saveStatus: LOADING_STATES.loaded } };
      expect(didJustSave(prevProps, nextProps)).to.equal(true);
    });
  });
  describe('didJustFailToSave', () => {
    it('should return `true` if the `preferences.saveStatus` flipped from pending to error', () => {
      const prevProps = { preferences: { saveStatus: LOADING_STATES.pending } };
      const nextProps = { preferences: { saveStatus: LOADING_STATES.error } };
      expect(didJustFailToSave(prevProps, nextProps)).to.equal(true);
    });
  });
});
