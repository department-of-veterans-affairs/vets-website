import React from 'react';
import moment from 'moment';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import RatedDisabilityList from '../../components/RatedDisabilityList';

describe('<RatedDisabilityList/>', () => {
  const ratedDisabilities = {
    ratedDisabilities: [
      {
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        diagnosticCode: 5238,
        effectiveDate: '2008-10-01T05:00:00.000+00:00',
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
  const fetchRatedDisabilities = () => {};

  it('should convert disability data into a readable format', () => {
    const wrapper = render(
      <RatedDisabilityList
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilities}
      />,
    );
    const date = moment(
      ratedDisabilities.ratedDisabilities[0].effectiveDate,
    ).format('MMMM DD, YYYY');
    expect(wrapper.getByText(date)).to.exist;
  });

  it('should render a rated disabilities list', () => {
    const wrapper = render(
      <RatedDisabilityList
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilities}
      />,
    );

    const disability = ratedDisabilities.ratedDisabilities[0];
    const headingText = `${disability.ratingPercentage}% rating for ${
      disability.name
    }`;

    expect(
      wrapper.getByRole('heading', {
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
    const wrapper = render(
      <RatedDisabilityList
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilitiesErr}
      />,
    );
    expect(
      wrapper.getByRole('heading', {
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
    const wrapper = render(
      <RatedDisabilityList
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilitiesErr}
      />,
    );
    expect(
      wrapper.getByRole('heading', {
        level: 2,
        name: 'We don’t have rated disabilities on file for you',
      }),
    ).to.exist;
  });

  it('should display a 400 alert if rated disabilities is an empty array', () => {
    const ratedDisabilitiesEmpty = {
      ratedDisabilities: [],
    };

    const wrapper = render(
      <RatedDisabilityList
        fetchRatedDisabilities={fetchRatedDisabilities}
        ratedDisabilities={ratedDisabilitiesEmpty}
      />,
    );
    expect(
      wrapper.getByRole('heading', {
        level: 2,
        name: 'We don’t have rated disabilities on file for you',
      }),
    ).to.exist;
  });
});
