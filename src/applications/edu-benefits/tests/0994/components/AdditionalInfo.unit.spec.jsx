import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import AdditionalInfo from '../../../0994/components/AdditionalInfo.jsx';

describe('<AdditionalInfo/>', () => {
  let wrapper;
  // for the sake of more tests could be written
  // declared beforeEach and assigned to wrapper
  beforeEach(() => {
    wrapper = mount(<AdditionalInfo triggerText="test" />).setState({
      open: true,
    });
  });

  it('should render', () => {
    expect(wrapper.text()).to.contain('test');
  });
  it('renders both children when open is true', () => {
    const first = wrapper.find('ExpandingGroup').props();
    expect(first.open).to.be.true;
  });
});
