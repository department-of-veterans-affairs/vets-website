import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MoreInfoCard from '../../components/MoreInfoCard';

describe('when <MoreInfoCard/> renders', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<MoreInfoCard />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
