import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import BenefitsExpirationDate from '../../components/BenefitsExpirationDate';

describe('when <BenefitsExpirationDate/> renders', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<BenefitsExpirationDate />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
  it('Should show renders loader', () => {
    const wrapper = shallow(<BenefitsExpirationDate loading />);
    expect(wrapper.find('va-loading-indicator')).to.exist;
    wrapper.unmount();
  });
});
