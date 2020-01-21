import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import RatedDisabilityListItem from '../../components/RatedDisabilityListItem';

describe('<RatedDisabilityListItem />', () => {
  let ratedDisability;
  beforeEach(() => {
    ratedDisability = {
      decisionText: 'Service Connected',
      diagnosticCode: 5238,
      effectiveDate: '05/06/1999',
      relatedTo: 'Personal Trauma PTSD',
      name: 'Diabetes mellitus0',
      ratingPercentage: 100,
    };
  });
  it('should render a service connected disability', () => {
    const wrapper = shallow(
      <RatedDisabilityListItem ratedDisability={ratedDisability} />,
    );
    expect(
      wrapper
        .find('dt')
        .first()
        .text(),
    ).to.contain(ratedDisability.name);
    wrapper.unmount();
  });

  it('should render a non-service connected disability', () => {
    ratedDisability.decisionText = 'Not Service Connected';
    const wrapper = shallow(
      <RatedDisabilityListItem ratedDisability={ratedDisability} />,
    );
    expect(
      wrapper
        .find('dt')
        .first()
        .text(),
    ).to.contain(ratedDisability.name);
    wrapper.unmount();
  });
});
