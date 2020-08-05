import _ from 'lodash';
import React from 'react';
import { expect } from 'chai';

import { shallow } from 'enzyme';

import InstitutionSearchForm from '../../components/search/InstitutionSearchForm';

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
        gibctFilterEnhancement
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
      menonly: { true: null, false: null },
      womenonly: { true: null, false: null },
      hbcu: { true: null, false: null },
      relaffil: { '71': 1 },
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
        hbcu: 1,
        menonly: 0,
        relaffil: 71,
        womenonly: 1,
      },
    ],
  };
  const autocomplete = {
    suggestions: [],
  };
  const filters = {
    relaffil: '71',
    womenonly: true,
    hbcu: true,
    menonly: false,
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
        filters={filters}
        gibctCh33BenefitRateUpdate
        showModal={() => {}}
        hideModal={() => {}}
        gibctEstimateYourBenefits
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

  it('should render html including filter components when gibctFilterEnhancement feature flag is enabled', () => {
    const wrapper = shallow(
      <InstitutionSearchForm
        filtersClass={filtersClass}
        search={search}
        autocomplete={autocomplete}
        eligibility={eligibility}
        filters={filters}
        gibctFilterEnhancement
        gibctCh33BenefitRateUpdate
        showModal={() => {}}
        hideModal={() => {}}
        gibctEstimateYourBenefits
        clearAutocompleteSuggestions={() => {}}
        fetchAutocompleteSuggestions={() => {}}
        toggleFilter={() => {}}
        updateAutocompleteSearchTerm={() => {}}
        handleFilterChange={() => {}}
      />,
    );

    const html = wrapper.html();
    expect(html).to.include('Gender');
    expect(html).to.include('Specialized mission');
    expect(html).to.include('Religious affiliation');
    wrapper.unmount();
  });
});
