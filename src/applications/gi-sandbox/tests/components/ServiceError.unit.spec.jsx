import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ServiceError from '../../components/ServiceError';

describe('<ServiceError/>', () => {
  it('should render', () => {
    const wrapper = shallow(<ServiceError />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
