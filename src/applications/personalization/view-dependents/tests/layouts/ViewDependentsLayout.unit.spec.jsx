import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ViewDependentsLayout } from '../../layouts/ViewDependentsLayout';

describe('<ViewDependentsLayout />', () => {
  it('should render a ViewDependentsHeader', () => {
    const wrapper = shallow(<ViewDependentsLayout />);
    expect(wrapper.find('ViewDependentsHeader').length).to.equal(1);
    wrapper.unmount();
  });
});
