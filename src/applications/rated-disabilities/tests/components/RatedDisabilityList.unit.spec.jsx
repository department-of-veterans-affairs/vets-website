import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import RatedDisabilityList from '../../components/RatedDisabilityList';

const fetchRatedDisabilities = () => {};
const noRatingsHeading = 'We don’t have rated disabilities on file for you';
const ratedDisabilities = {
  ratedDisabilities: [
    {
      decisionCode: 'SVCCONNCTED',
      decisionText: 'Service Connected',
      diagnosticCode: 5238,
      effectiveDate: '2008-10-01T00:00:00.000-06:00',
      name: 'Diabetes mellitus0',
      ratedDisabilityId: '0',
      ratingDecisionId: '63655',
      ratingPercentage: 100,
      relatedDisabilityDate: '2012-03-09T21:22:09.000+00:00',
      specialIssues: [
        {
          code: 'TRM',
          name: 'Personal Trauma PTSD',
        },
      ],
    },
  ],
};

describe('<RatedDisabilityList>', () => {
  it('should convert disability data into a readable format', () => {
    const screen = render(
      <RatedDisabilityList
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilities}
      />,
    );

    const expectedDate = 'October 01, 2008';
    expect(screen.getByText(expectedDate)).to.exist;
  });

  it('should render a rated disabilities list', () => {
    const screen = render(
      <RatedDisabilityList
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilities}
      />,
    );

    const [disability] = ratedDisabilities.ratedDisabilities;
    const headingText = `${disability.ratingPercentage}% rating for ${
      disability.name
    }`;

    expect(
      screen.getByRole('heading', {
        level: 4,
        name: headingText,
      }),
    ).to.exist;
  });

  it('should display a 500 alert', () => {
    const ratedDisabilitiesErr = {
      errors: [
        {
          code: '500',
        },
      ],
    };
    const screen = render(
      <RatedDisabilityList
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilitiesErr}
      />,
    );
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'We’re sorry. Something went wrong on our end',
      }),
    ).to.exist;
  });

  it('should display a 400 alert', () => {
    const ratedDisabilitiesErr = {
      errors: [
        {
          code: '400',
        },
      ],
    };
    const screen = render(
      <RatedDisabilityList
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilitiesErr}
      />,
    );
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: noRatingsHeading,
      }),
    ).to.exist;
  });

  it('should display a 400 alert if rated disabilities is an empty array', () => {
    const ratedDisabilitiesEmpty = {
      ratedDisabilities: [],
    };

    const screen = render(
      <RatedDisabilityList
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilitiesEmpty}
      />,
    );
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: noRatingsHeading,
      }),
    ).to.exist;
  });
});
