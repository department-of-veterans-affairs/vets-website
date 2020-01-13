import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import VetTecFilterBy from '../../components/vet-tec/VetTecFilterBy';

describe('<VetTecFilterBy>', () => {
  it('renders correctly', () => {
    const props = {
      filters: {
        provider: [],
      },
      providers: [
        {
          name: 'PROVIDER 1',
          count: 1,
        },
      ],
      showModal: () => {},
      handleProviderFilterChange: () => {},
      handleFilterChange: () => {},
      giVetTecProgramProviderFilters: true,
    };

    const wrapper = mount(<VetTecFilterBy {...props} />);
    expect(wrapper.find('input')).to.have.lengthOf(2);
    expect(wrapper.find('input[name="PROVIDER 1"]')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('sorts provider filters correctly', () => {
    const props = {
      filters: {
        provider: [],
      },
      providers: [
        {
          name: 'C PROVIDER',
          count: 1,
        },
        {
          name: 'A PROVIDER',
          count: 2,
        },
      ],
      showModal: () => {},
      handleProviderFilterChange: () => {},
      handleFilterChange: () => {},
      giVetTecProgramProviderFilters: true,
    };

    const wrapper = mount(<VetTecFilterBy {...props} />);

    expect(wrapper.find('.vet-tec-provider-filters input')).to.have.lengthOf(2);
    expect(
      wrapper
        .find('.vet-tec-provider-filters label')
        .at(0)
        .text(),
    ).to.eq('A PROVIDER (2)');
    wrapper.unmount();
  });

  it('sets selected provider filter as checked', () => {
    const props = {
      filters: {
        provider: ['PROVIDER 1'],
      },
      providers: [
        {
          name: 'PROVIDER 1',
          count: 1,
        },
      ],
      showModal: () => {},
      handleProviderFilterChange: () => {},
      handleFilterChange: () => {},
      giVetTecProgramProviderFilters: true,
    };

    const wrapper = mount(<VetTecFilterBy {...props} />);
    expect(wrapper.find('input[name="PROVIDER 1"]').props().checked).to.eq(
      true,
    );
    wrapper.unmount();
  });

  it('handles provider filter selection', () => {
    let selectedVal;
    const props = {
      filters: {
        provider: ['PROVIDER 2'],
      },
      providers: [
        {
          name: 'PROVIDER 1',
          count: 1,
        },
        {
          name: 'PROVIDER 2',
          count: 1,
        },
      ],
      showModal: () => {},
      handleProviderFilterChange: provider => {
        selectedVal = provider;
      },
      handleFilterChange: () => {},
      giVetTecProgramProviderFilters: true,
    };

    const wrapper = mount(<VetTecFilterBy {...props} />);
    expect(wrapper.find('input[name="PROVIDER 1"]').props().checked).to.eq(
      false,
    );
    wrapper.find('input[name="PROVIDER 1"]').simulate('change', {
      target: { checked: true },
    });
    expect(Object.keys(selectedVal.provider)).to.have.lengthOf(2);
    wrapper.unmount();
  });
});
