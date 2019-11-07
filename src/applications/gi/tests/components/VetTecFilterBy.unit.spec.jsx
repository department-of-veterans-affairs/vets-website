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
      providers: { Test: 1 },
      showModal: () => {},
      handleProviderFilterChange: () => {},
      handleFilterChange: () => {},
    };

    const wrapper = mount(<VetTecFilterBy {...props} />);
    expect(wrapper.find('input')).to.have.lengthOf(2);
    expect(wrapper.find('input[name="Test"]')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('sets selected provider filter as checked', () => {
    const props = {
      filters: {
        provider: ['Test'],
      },
      providers: { Test: 1 },
      showModal: () => {},
      handleProviderFilterChange: () => {},
      handleFilterChange: () => {},
    };

    const wrapper = mount(<VetTecFilterBy {...props} />);
    expect(wrapper.find('input[name="Test"]').props().checked).to.eq(true);
    wrapper.unmount();
  });

  it('handles provider filter selection', () => {
    let selectedVal;
    const props = {
      filters: {
        provider: ['Provider 2'],
      },
      providers: { 'Provider 1': 1, 'Provider 2': 1 },
      showModal: () => {},
      handleProviderFilterChange: provider => {
        selectedVal = provider;
      },
      handleFilterChange: () => {},
    };

    const wrapper = mount(<VetTecFilterBy {...props} />);
    expect(wrapper.find('input[name="Provider 1"]').props().checked).to.eq(
      false,
    );
    wrapper.find('input[name="Provider 1"]').simulate('change', {
      target: { checked: true },
    });
    expect(Object.keys(selectedVal.provider)).to.have.lengthOf(2);
    wrapper.unmount();
  });
});
