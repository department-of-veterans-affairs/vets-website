import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import GetFormHelp from '../../components/GetFormHelp';

describe('GetFormHelp in Pre-need components', () => {
  it('should render', () => {
    const wrapper = mount(<GetFormHelp />);
    expect(wrapper.find('va-telephone').length).to.equal(4);
    wrapper.unmount();
  });
});
