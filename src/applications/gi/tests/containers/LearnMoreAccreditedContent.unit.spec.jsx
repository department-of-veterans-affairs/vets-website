import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LearnMoreAccreditedContent from '../../containers/search/LearnMoreAccreditedContent';

describe('<LearnMoreAccreditedContent>', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<LearnMoreAccreditedContent />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
