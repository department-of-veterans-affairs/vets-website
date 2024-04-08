import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import RatedDisabilityListItem from '../../components/RatedDisabilityListItem';

const ratedDisability = {
  decisionText: 'Service Connected',
  diagnosticCode: 5238,
  effectiveDate: '1995-05-06T00:00:00.000-06:00',
  relatedTo: 'Personal Trauma PTSD',
  name: 'Diabetes mellitus0',
  ratingPercentage: 100,
};

const expectedEffectiveDate = 'May 06, 1995';

describe('<RatedDisabilityListItem>', () => {
  it('should render a service connected disability', () => {
    const screen = render(
      <RatedDisabilityListItem ratedDisability={ratedDisability} />,
    );

    expect(screen.getByText(expectedEffectiveDate)).to.exist;
  });

  it('should render a non-service connected disability', () => {
    const nonServiceConnectedDisability = {
      ...ratedDisability,
      effectiveDate: null,
    };

    const screen = render(
      <RatedDisabilityListItem
        ratedDisability={nonServiceConnectedDisability}
      />,
    );

    expect(screen.queryByText(expectedEffectiveDate)).not.to.exist;
  });
});
