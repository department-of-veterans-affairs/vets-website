import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { SearchMenu } from '../../components/SearchMenu.jsx';

describe('<SearchMenu>', () => {
  const props = {
    isOpen: false,
    clickHandler: f => f,
  };

  it('should hide the search bar', () => {
    const wrapper = shallow(<SearchMenu {...props} />);
    expect(wrapper.find('#search').prop('isOpen')).to.be.false;
    wrapper.unmount();
  });

  it('should show the search bar when opened', () => {
    const wrapper = mount(<SearchMenu {...props} />);
    wrapper.setProps({ isOpen: true });
    expect(wrapper.find('.va-dropdown-panel').prop('hidden')).to.be.false;
    wrapper.unmount();
  });
});
