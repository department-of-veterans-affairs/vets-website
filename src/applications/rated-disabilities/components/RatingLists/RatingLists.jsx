import React from 'react';
import PropTypes from 'prop-types';

import {
  getServiceConnectedRatings,
  getNonServiceConnectedRatings,
} from './helpers';
import NoRatings from './NoRatings';
import Section from './List';

export default function RatingLists({ ratings }) {
  const serviceConnectedRatings = getServiceConnectedRatings(ratings);
  const nonServiceConnectedRatings = getNonServiceConnectedRatings(ratings);

  // NOTE: These are true for now to mimic the behavior of the EVSS implementation. It probably makes
  // sense to not show the section if there are no ratings
  const hasRatings = ratings.length !== 0;
  const hasServiceConnectedRatings = true;
  const hasNonServiceConnectedRatings = true;

  if (!hasRatings) {
    return <NoRatings />;
  }

  return (
    <>
      {hasServiceConnectedRatings && (
        <>
          <h3 className="vads-u-margin-y--2">Service-connected ratings</h3>
          <Section ratings={serviceConnectedRatings} />
        </>
      )}
      {hasNonServiceConnectedRatings && (
        <>
          <h3 className="vads-u-margin-y--2 vads-u-margin-top--3">
            Conditions VA determined aren’t service-connected
          </h3>
          <Section ratings={nonServiceConnectedRatings} />
        </>
      )}
    </>
  );
}

RatingLists.propTypes = {
  ratings: PropTypes.arrayOf(
    PropTypes.shape({
      decision: PropTypes.string,
      diagnosticText: PropTypes.string,
      diagnosticTypeCode: PropTypes.string,
      diagnosticTypeName: PropTypes.string,
      disabilityRatingId: PropTypes.string,
      effectiveDate: PropTypes.string,
      ratingEndDate: PropTypes.string,
      ratingPercentage: PropTypes.number,
    }),
  ).isRequired,
};
