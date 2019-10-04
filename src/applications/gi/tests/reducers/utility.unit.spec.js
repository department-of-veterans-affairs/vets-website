import { expect } from 'chai';

import { normalizedAttributes } from '../../reducers/utility';

describe('normalized attributes function', () => {
  it('capitalizes attributes for name, city, and state', () => {
    const state = {
      attributes: {
        name: 'name',
        city: 'city a',
        physicalCity: 'city b',
        state: 'state a',
        physicalState: 'state b',
      },
    };

    const results = normalizedAttributes(state.attributes);

    expect(results.name).to.eql('NAME');
    expect(results.city).to.eql('CITY B'); // this function is expected to return physical City name, if available.
    expect(results.state).to.eql('STATE B'); // this function is expected to return physical State name, if available.
  });
});
