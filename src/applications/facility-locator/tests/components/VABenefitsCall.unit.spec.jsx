import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import VABenefitsCall from '../../components/VABenefitsCall';

describe('<VABenefitsCall>', () => {
  it('Should always render when used.', () => {
    const wrapper = shallow(<VABenefitsCall />);
    expect(wrapper.type()).to.not.equal(null);
    expect(wrapper.find('div').length).to.equal(1);
    expect(wrapper.find('p').length).to.equal(2);
    expect(wrapper.find('va-link').length).to.equal(1);
    expect(wrapper.find('va-telephone').length).to.equal(2);
    wrapper.unmount();
  });
});
