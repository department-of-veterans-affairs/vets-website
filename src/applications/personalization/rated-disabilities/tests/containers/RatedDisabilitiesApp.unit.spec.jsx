import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { RatedDisabilitiesApp } from '../../containers/RatedDisabilitiesApp';

describe('<RatedDisabilityApp/>', () => {
  const props = {
    ratedDisabilities: [],
    user: {},
    loginUrl: '',
    verifyUrl: '',
    fetchRatedDisabilities: sinon.stub(),
    fetchTotalDisabilityRating: sinon.stub(),
  };
  it('should render a RequiredLoginView', () => {
    const wrapper = shallow(
      <RatedDisabilitiesApp {...props}>
        <div>App Children</div>
      </RatedDisabilitiesApp>,
    );
    expect(wrapper.find('RequiredLoginView').length).to.equal(1);
    wrapper.unmount();
  });
});
