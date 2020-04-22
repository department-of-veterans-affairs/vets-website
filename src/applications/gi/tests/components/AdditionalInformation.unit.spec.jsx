import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AdditionalInformation from '../../components/profile/AdditionalInformation';

describe('<AdditionalInformation>', () => {
  it('renders', () => {
    const wrapper = shallow(<AdditionalInformation />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
