import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import Authorization from '../../components/Authorization';

describe('Authorization', () => {
  it('should render the component', () => {
    const wrapper = shallow(<Authorization />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should display the correct text', () => {
    const wrapper = shallow(<Authorization />);
    expect(wrapper.text()).to.include(
      'Authorize the release of non-VA medical records',
    );
    wrapper.unmount();
  });
});
