import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Disclaimer from '../../../components/content/Disclaimer';

describe('<Disclaimer>', () => {
  it('should render', () => {
    const wrapper = shallow(<Disclaimer />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
