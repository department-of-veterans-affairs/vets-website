import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import GettingStartedWithVetTec from '../../../components/vet-tec/GettingStartedWithVetTec';

describe('<GettingStartedWithVetTec/>', () => {
  it('should render', () => {
    const wrapper = shallow(<GettingStartedWithVetTec />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
