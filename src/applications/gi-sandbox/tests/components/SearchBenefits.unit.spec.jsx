import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SearchBenefits from '../../components/SearchBenefits';

describe('<SearchBenefits/>', () => {
  it('should render', () => {
    const wrapper = shallow(<SearchBenefits />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
