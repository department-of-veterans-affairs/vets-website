import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RatedDisabilitiesSidebar from '../../components/RatedDisabilitiesSidebar';

describe('<TotalRatedDisabilities />', () => {
  it('Should Render', () => {
    const wrapper = shallow(<RatedDisabilitiesSidebar />);
    expect(
      wrapper
        .find('div')
        .first()
        .hasClass('medium-screen:vads-u-padding-left--4'),
    ).to.be.true;
    wrapper.unmount();
  });
});
