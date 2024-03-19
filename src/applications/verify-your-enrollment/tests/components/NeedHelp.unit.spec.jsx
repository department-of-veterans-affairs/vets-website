import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import NeedHelp from '../../components/NeedHelp';

describe('when <NeedHelp/> renders', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<NeedHelp />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
