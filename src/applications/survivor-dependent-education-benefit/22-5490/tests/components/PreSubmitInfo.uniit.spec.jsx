import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import CustomPreSubmitInfo from '../../components/PreSubmitInfo';

describe('CustomPreSubmitInfo component', () => {
  it('renders the CustomPreSubmitInfo footer', () => {
    const wrapper = mount(<CustomPreSubmitInfo />);
    expect(wrapper.text()).to.include(
      'According to federal law, there are criminal',
    );

    wrapper.unmount();
  });
});
