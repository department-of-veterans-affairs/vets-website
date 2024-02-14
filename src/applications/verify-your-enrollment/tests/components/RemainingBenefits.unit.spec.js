import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RemainingBenefits from '../../components/RemainingBenefits';

describe('when <RemainingBenefits/> renders', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<RemainingBenefits />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
