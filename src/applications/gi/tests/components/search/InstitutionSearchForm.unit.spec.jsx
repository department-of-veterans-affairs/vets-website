import React from 'react';
import { expect } from 'chai';

import { shallow } from 'enzyme';

import InstitutionSearchForm from '../../../components/search/InstitutionSearchForm';

const filtersClass = 'filters-sidebar small-12 medium-3 columns';

describe('<InstitutionSearchForm>', () => {
  it('should render', () => {
    const search = {
      filterOpened: false,
    };
    const eligibility = {
      onlineClasses: 'no',
    };
    const wrapper = shallow(
      <InstitutionSearchForm
        filtersClass={filtersClass}
        search={search}
        eligibility={eligibility}
      />,
    );
    expect(wrapper).to.not.be.undefined;
    wrapper.unmount();
  });

  const search = {
    facets: {
      category: { school: 1, employer: 0 },
      type: { PRIVATE: 1 },
      state: { NC: 1 },
      country: [{ name: 'USA', count: 1 }],
    },
    links: {},
    results: [
      {
        name: 'BENNETT COLLEGE',
        facilityCode: '31001833',
        type: 'PRIVATE',
        city: 'GREENSBORO',
        state: 'NC',
        zip: '27401',
        country: 'USA',
      },
    ],
  };
  const autocomplete = {
    suggestions: [],
  };
  const eligibility = {
    onlineClasses: 'no',
  };

  it('should render html', () => {
    const wrapper = shallow(
      <InstitutionSearchForm
        filtersClass={filtersClass}
        search={search}
        autocomplete={autocomplete}
        eligibility={eligibility}
        filters
        showModal={() => {}}
        hideModal={() => {}}
        clearAutocompleteSuggestions={() => {}}
        fetchAutocompleteSuggestions={() => {}}
        toggleFilter={() => {}}
        updateAutocompleteSearchTerm={() => {}}
        handleFilterChange={() => {}}
      />,
    );

    const html = wrapper.html();
    expect(html).to.not.be.undefined;
    wrapper.unmount();
  });
});
