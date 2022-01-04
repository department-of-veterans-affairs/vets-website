import { expect } from 'chai';

import {
  normalizedInstitutionAttributes,
  normalizedProgramAttributes,
} from '../../reducers/utility';

const testNormalizedAddresses = (result, attributes) => {
  expect(result.city).to.eql(attributes.city.toUpperCase());
  expect(result.state).to.eql(attributes.state.toUpperCase());
  expect(result.country).to.eql(attributes.country.toUpperCase());
  expect(result.physicalCity).to.eql(attributes.physicalCity.toUpperCase());
  expect(result.physicalState).to.eql(attributes.physicalState.toUpperCase());
  expect(result.physicalCountry).to.eql(
    attributes.physicalCountry.toUpperCase(),
  );
};

describe('normalized attributes function', () => {
  it('capitalizes attributes for name, city, state, country and physical values', () => {
    const attributes = {
      name: 'name',
      city: 'city a',
      state: 'state a',
      country: 'country',
      physicalCity: 'city b',
      physicalState: 'state b',
      physicalCountry: 'physical country',
    };

    const result = normalizedInstitutionAttributes(attributes);

    expect(result.name).to.eql(attributes.name.toUpperCase());
    testNormalizedAddresses(result, attributes);
  });

  it('capitalizes attributes for name, city, state, country and physical values', () => {
    const attributes = {
      description: 'name',
      city: 'city a',
      state: 'state a',
      country: 'country',
      physicalCity: 'city b',
      physicalState: 'state b',
      physicalCountry: 'physical country',
    };

    const result = normalizedProgramAttributes(attributes);

    expect(result.description).to.eql(attributes.description.toUpperCase());
    testNormalizedAddresses(result, attributes);
  });
});
