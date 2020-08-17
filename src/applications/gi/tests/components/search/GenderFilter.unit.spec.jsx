import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import GenderFilter from '../../../components/search/GenderFilter';

describe('<CautionFlagHeading>', () => {
  it('renders', () => {
    const wrapper = shallow(
      <GenderFilter filters={{}} onChange={() => {}} onFocus={() => {}} />,
    );
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
