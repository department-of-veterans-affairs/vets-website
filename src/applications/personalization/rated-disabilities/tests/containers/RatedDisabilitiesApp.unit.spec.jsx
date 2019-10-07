import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { RatedDisabilitiesApp } from '../../containers/RatedDisabilitiesApp';

describe('<RatedDisabilityApp/>', () => {
  const props = {
    ratedDisabilities: [],
    user: {},
    profile: { loading: false },
    fetchRatedDisabilities: sinon.stub(),
  };
  it('should render a CallToActionWidget', () => {
    const wrapper = shallow(<RatedDisabilitiesApp {...props} />);
    wrapper.update();
    expect(wrapper.find('Connect(CallToActionWidget)').length).to.equal(1);
    wrapper.unmount();
  });
});
