import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import NotInMVI from '../../components/NotInMVI';

describe('NotInMVI', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<NotInMVI />);
  });

  it('should render the correct text', () => {
    expect(wrapper.text().includes('We can’t match your information with our Veteran records'))
      .to.be.true;
    wrapper.unmount();
  });

  it('should render the correct link', () => {
    const link = wrapper.find('a');
    expect(link.text().includes('Find your nearest VA medical center')).to.be.true;
    expect(link.prop('href')).to.equal('/find-locations');
    wrapper.unmount();
  });
});
