import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import BenefitsProfileStatement from '../../components/BenefitsProfileStatement';

describe('when <BenefitsProfileStatement/> renders', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<BenefitsProfileStatement />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
