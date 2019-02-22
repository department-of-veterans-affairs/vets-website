import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import SearchMenu from '../../components/SearchMenu.jsx';

describe('<SearchMenu>', () => {
  const props = {
    isOpen: false,
    clickHandler: f => f,
  };

  it('should hide the search bar', () => {
    const wrapper = shallow(<SearchMenu {...props} />);
    expect(wrapper.find('#searchmenu').prop('isOpen')).to.be.false;
    wrapper.unmount();
  });

  it('should show and focus the search bar when opened', () => {
    const wrapper = mount(<SearchMenu {...props} />);
    const searchField = wrapper.ref('searchField');
    searchField.focus = sinon.spy();
    wrapper.setProps({ isOpen: true });
    expect(searchField.focus.calledOnce).to.be.true;
    expect(wrapper.find('.va-dropdown-panel').prop('hidden')).to.be.false;
    wrapper.unmount();
  });

  it('should update the user input state', () => {
    const wrapper = mount(<SearchMenu {...props} isOpen />);
    const changeEvent = { target: { value: 'testing' } };
    wrapper.find('#query').simulate('change', changeEvent);
    expect(wrapper.state('userInput')).to.equal('testing');
    wrapper.unmount();
  });
});
