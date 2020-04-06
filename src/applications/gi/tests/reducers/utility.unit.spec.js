import {
  normalizedInstitutionAttributes,
  normalizedProgramAttributes,
} from '../../reducers/utility';

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

    const results = normalizedInstitutionAttributes(state.attributes);

    expect(results.name).toBe('NAME');
    expect(results.city).toBe('CITY B'); // this function is expected to return physical City name, if available.
    expect(results.state).toBe('STATE B'); // this function is expected to return physical State name, if available.
  });
});

describe('normalized attributes function', () => {
  it('capitalizes attributes for name, city, and state', () => {
    const state = {
      attributes: {
        description: 'name',
        city: 'city',
        state: 'state',
        country: 'country',
      },
    };

    const results = normalizedProgramAttributes(state.attributes);

    expect(results.description).toBe('NAME');
    expect(results.city).toBe('CITY');
    expect(results.state).toBe('STATE');
    expect(results.country).toBe('COUNTRY');
  });
});
