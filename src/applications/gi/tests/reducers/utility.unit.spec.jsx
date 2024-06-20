import { expect } from 'chai';
import {
  normalizeAddresses,
  normalizedInstitutionAttributes,
  normalizedProgramAttributes,
} from '../../reducers/utility';

describe('Address Normalization', () => {
  it('should normalize address attributes to uppercase', () => {
    const attributes = {
      city: 'New York',
      state: 'ny',
      country: 'usa',
      zip: '10001',
      physicalCity: 'Boston',
      physicalState: 'ma',
      physicalCountry: 'usa',
      physicalZip: '02101',
    };

    const normalized = normalizeAddresses(attributes);

    expect(normalized).to.deep.equal({
      city: 'NEW YORK',
      state: 'NY',
      country: 'USA',
      zip: '10001',
      physicalCity: 'BOSTON',
      physicalState: 'MA',
      physicalCountry: 'USA',
      physicalZip: '02101',
    });
  });

  it('should handle undefined attributes gracefully', () => {
    const attributes = {};

    const normalized = normalizeAddresses(attributes);

    expect(normalized).to.deep.equal({
      city: undefined,
      state: undefined,
      country: undefined,
      zip: undefined,
      physicalCity: undefined,
      physicalState: undefined,
      physicalCountry: undefined,
      physicalZip: undefined,
    });
  });
});

describe('Institution Attributes Normalization', () => {
  it('should normalize institution attributes including name and address', () => {
    const attributes = {
      name: 'university',
      city: 'Chicago',
      state: 'il',
    };

    const normalized = normalizedInstitutionAttributes(attributes);

    expect(normalized).to.deep.equal({
      name: 'UNIVERSITY',
      city: 'CHICAGO',
      state: 'IL',
      country: undefined,
      zip: undefined,
      physicalCity: undefined,
      physicalState: undefined,
      physicalCountry: undefined,
      physicalZip: undefined,
    });
  });
});

describe('Program Attributes Normalization', () => {
  it('should normalize program attributes including description and address', () => {
    const attributes = {
      description: 'undergraduate program',
      physicalCity: 'Seattle',
      physicalState: 'wa',
      city: 'city',
      country: 'country',
      physicalCountry: '123 some st',
      physicalZip: '123456',
      state: 'some state',
      zip: '909090',
    };

    const normalized = normalizedProgramAttributes(attributes);

    expect(normalized).to.deep.equal({
      description: 'UNDERGRADUATE PROGRAM',
      physicalCity: 'SEATTLE',
      physicalState: 'WA',
      city: 'CITY',
      country: 'COUNTRY',
      physicalCountry: '123 SOME ST',
      physicalZip: '123456',
      state: 'SOME STATE',
      zip: '909090',
    });
  });
});
