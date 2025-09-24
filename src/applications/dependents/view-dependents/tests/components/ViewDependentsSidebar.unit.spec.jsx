import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ViewDependentsSidebar from '../../components/ViewDependentsSidebar/ViewDependentsSidebar';

describe('<ViewDependentsSidebar />', () => {
  it('should render', () => {
    const wrapper = shallow(<ViewDependentsSidebar />);
    expect(wrapper.find('div.medium-screen:vads-u-padding-left--4')).to.exist;
    wrapper.unmount();
  });
});
