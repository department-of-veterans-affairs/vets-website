import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Paragraph from '../../../components/ui/Paragraph';

describe('when <Paragraph/> renders', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<Paragraph />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
