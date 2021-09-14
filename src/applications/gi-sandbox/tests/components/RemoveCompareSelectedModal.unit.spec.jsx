import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import RemoveCompareSelectedModal from '../../components/RemoveCompareSelectedModal';

describe('<RemoveCompareSelectedModal/>', () => {
  it('should render', () => {
    const wrapper = shallow(<RemoveCompareSelectedModal />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
