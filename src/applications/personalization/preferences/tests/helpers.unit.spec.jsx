import { expect } from 'chai';

import { transformPreferencesForSaving } from '../helpers';

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
});
