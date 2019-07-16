import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { PaymentInformationTOCItem } from '../../containers/PaymentInformationTOCItem';

describe('<PaymentInformationTOCItem />', () => {
  it('renders when the user is eligible for direct deposit', () => {
    const wrapper = shallow(<PaymentInformationTOCItem isEligible />);
    expect(wrapper.find('li > a')).to.have.length(1);
    wrapper.unmount();
  });

  it('does not render if the user is not eligible for jdirect deposit', () => {
    const wrapper = shallow(<PaymentInformationTOCItem isEligible={false} />);
    expect(wrapper.text()).to.be.empty;
    wrapper.unmount();
  });
});
