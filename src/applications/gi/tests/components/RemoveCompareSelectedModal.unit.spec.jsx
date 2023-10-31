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

  it('should render jsx ', () => {
    const wrapper = shallow(
      <RemoveCompareSelectedModal onClose name="name" onRemove />,
    );
    expect(wrapper.find('p').text()).to.equal(
      'Do you want to remove name from your comparison?',
    );
    wrapper.unmount();
  });
});
