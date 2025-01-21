import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { filterMatches } from '../../hooks/useServiceType';
import vaHealthcareServices from './test-va-healthcare-services.json';

describe('filterMatches', () => {
  const getServiceNamesOnly = filteredServices =>
    filteredServices.map(service => service.hsdatum[0]);

  it('should return the correct match for a search term', () => {
    const results = filterMatches(
      vaHealthcareServices,
      'mental health',
      'vamc',
    );
    console.log('results: ', getServiceNamesOnly(results));
    const expected = [
      'Returning service member care',
      'Mental health care',
      'Suicide Prevention',
      'Addiction and substance use care',
      'PTSD care',
      'Military sexual trauma care',
      'Women Veteran care',
      'Psychiatry',
      'Psychology',
      'Complementary and integrative health',
      'Women centered care',
    ];

    expect(getServiceNamesOnly(results)).to.equal(expected);
  });
});
