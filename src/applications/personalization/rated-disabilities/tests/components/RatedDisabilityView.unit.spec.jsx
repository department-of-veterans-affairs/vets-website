import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import RatedDisabilityView from '../../components/RatedDisabilityView';

describe('<RatedDisabilityView/>', () => {
  const user = {
    profile: {
      status: 'OK',
      verified: true,
    },
  };
  const ratedDisabilities = { ratedDisabilities: [] };
  const fetchRatedDisabilities = sinon.stub();
  const fetchTotalDisabilityRating = sinon.stub();

  it('should render', () => {
    const wrapper = shallow(
      <RatedDisabilityView
        user={user}
        fetchRatedDisabilities={fetchRatedDisabilities}
        fetchTotalDisabilityRating={fetchTotalDisabilityRating}
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

  it('should render a MVI warning if profile status is not OK', () => {
    const userError = {
      profile: {
        verified: true,
        status: 'NOT_FOUND',
      },
    };
    const wrapper = shallow(
      <RatedDisabilityView
        user={userError}
        fetchRatedDisabilities={fetchRatedDisabilities}
        fetchTotalDisabilityRating={fetchTotalDisabilityRating}
        ratedDisabilities={ratedDisabilities}
      />,
    );

    expect(wrapper.find('.usa-alert-warning')).to.exist;
    wrapper.unmount();
  });
});
