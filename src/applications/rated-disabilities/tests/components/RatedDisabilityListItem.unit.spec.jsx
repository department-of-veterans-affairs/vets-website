import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';

import RatedDisabilityListItem from '../../components/RatedDisabilityListItem';

describe('<RatedDisabilityListItem />', () => {
  let ratedDisability;
  beforeEach(() => {
    ratedDisability = {
      decisionText: 'Service Connected',
      diagnosticCode: 5238,
      effectiveDate: moment('1999-05-06'),
      relatedTo: 'Personal Trauma PTSD',
      name: 'Diabetes mellitus0',
      ratingPercentage: 100,
    };
  });

  it('should render a service connected disability', () => {
    const formattedEffectiveDate = ratedDisability.effectiveDate.format(
      'MMMM DD, YYYY',
    );

    const wrapper = shallow(
      <RatedDisabilityListItem ratedDisability={ratedDisability} />,
    );

    expect(
      wrapper
        .find('div')
        .first()
        .text(),
    ).to.contain(formattedEffectiveDate);
    wrapper.unmount();
  });

  it('should render a non-service connected disability', () => {
    ratedDisability.effectiveDate = null;
    const wrapper = shallow(
      <RatedDisabilityListItem ratedDisability={ratedDisability} />,
    );
    expect(wrapper.find('div').exists()).to.be.false;
    wrapper.unmount();
  });
});
