import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import RatedDisabilityView from '../../components/RatedDisabilityView';

describe('<RatedDisabilityView/>', () => {
  const user = {
    profile: {
      verified: true,
      status: 'OK',
    },
  };
  const ratedDisabilities = [];
  const fetchRatedDisabilities = sinon.stub();

  it('should render', () => {
    const wrapper = shallow(
      <RatedDisabilityView
        user={user}
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilities}
      />,
    );

    expect(
      wrapper
        .find('div')
        .first()
        .exists(),
    ).to.be.true;
    wrapper.unmount();
  });
});
