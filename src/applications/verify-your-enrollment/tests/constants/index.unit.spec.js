import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Paragraph } from '../../constants';

describe('when <Paragraph/> renders', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<Paragraph />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
