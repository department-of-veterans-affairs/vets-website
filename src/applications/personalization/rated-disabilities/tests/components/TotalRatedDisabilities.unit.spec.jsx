import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TotalRatedDisabilities from '../../components/TotalRatedDisabilities';

describe('<TotalRatedDisabilities />', () => {
  it('Should Render', () => {
    const wrapper = shallow(
      <TotalRatedDisabilities loading={false} totalDisabilityRating={80} />,
    );
    expect(
      wrapper
        .find('div')
        .first()
        .hasClass('feature'),
    ).to.be.true;
  });
});
