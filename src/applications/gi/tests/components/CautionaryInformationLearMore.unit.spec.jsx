import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CautionaryInformationLearMore from '../../components/CautionaryInformationLearMore';

describe('<CautionaryInformationLearMore/>', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<CautionaryInformationLearMore />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
