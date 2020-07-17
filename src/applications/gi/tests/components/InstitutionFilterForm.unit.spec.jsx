import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import InstitutionFilterForm from '../../components/search/InstitutionFilterForm';
import { getStateNameForCode } from '../../utils/helpers';

const defaultProps = {
  search: {
    facets: {
      category: { school: 17, employer: 0 },
      type: { 'for profit': 1, private: 16 },
      state: { PR: 1 },
      country: [{ name: 'USA', count: 17 }],
    },
  },
  filters: {},
  handleFilterChange: () => {},
  showModal: () => {},
};

describe('<InstitutionFilterForm>', () => {
  it('Should display full state or US territory name based on state abbreviation', () => {
    const wrapper = mount(<InstitutionFilterForm {...defaultProps} />);
    const stateLabel = wrapper.find('option[value="PR"]').text();
    expect(stateLabel).to.eq('Puerto Rico');
    wrapper.unmount();
  });

  it('Should display abbreviation if full state or US territory is undefined', () => {
    const props = {
      search: {
        facets: {
          category: { school: 17, employer: 0 },
          type: { 'for profit': 1, private: 16 },
          state: { ZZ: 1 },
          country: [{ name: 'USA', count: 17 }],
        },
      },
      filters: {},
      handleFilterChange: () => {},
      showModal: () => {},
    };
    const wrapper = mount(<InstitutionFilterForm {...props} />);
    const stateCode = wrapper.find('option[value="ZZ"]').text();
    expect(getStateNameForCode(stateCode)).to.eq('ZZ');
    wrapper.unmount();
  });
});
