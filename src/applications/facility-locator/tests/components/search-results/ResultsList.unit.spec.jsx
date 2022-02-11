import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { ResultsList } from '../../../components/ResultsList.jsx';
import searchResults from '../../fixtures/covid19-search-results.json';
import { Covid19Vaccine } from '../../../constants';

describe('ResultsList', () => {
  it('should set showCovidVaccineWalkInAvailabilityText correctly for Covid19 search', () => {
    const facilityTypeName = 'VA health';
    const query = {
      facilityType: 'health',
      serviceType: Covid19Vaccine,
    };
    const wrapper = shallow(
      <ResultsList
        results={searchResults.data}
        facilityTypeName={facilityTypeName}
        query={query}
        currentQuery={query}
      />,
    );
    expect(
      wrapper
        .find('Covid19Result')
        .map(node => node.prop('showCovidVaccineWalkInAvailabilityText')),
    ).to.deep.equal([false, true, false]);
    wrapper.unmount();
  });
});
