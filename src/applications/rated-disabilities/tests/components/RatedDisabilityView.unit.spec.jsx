import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import RatedDisabilityView from '../../components/RatedDisabilityView';

describe('<RatedDisabilityView/>', () => {
  const ratedDisabilities = { ratedDisabilities: [] };
  const fetchRatedDisabilities = sinon.stub();
  const fetchTotalDisabilityRating = sinon.stub();

  it('should render', () => {
    const wrapper = shallow(
      <RatedDisabilityView
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
});
