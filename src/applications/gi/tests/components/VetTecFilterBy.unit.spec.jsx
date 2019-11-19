import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import VetTecFilterBy from '../../components/vet-tec/VetTecFilterBy';

describe('<VetTecFilterBy>', () => {
  it('renders correctly', () => {
    const props = {
      filters: {},
      showModal: () => {},
      handleFilterChange: () => {},
    };

    const wrapper = mount(<VetTecFilterBy {...props} />);
    expect(wrapper.find('input')).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
