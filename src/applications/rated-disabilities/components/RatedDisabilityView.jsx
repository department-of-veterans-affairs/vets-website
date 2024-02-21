import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { checkForDiscrepancies } from '../actions';
import Learn from './Learn';
import NeedHelp from './NeedHelp';
import OnThisPage from './OnThisPage';
import RatedDisabilityList from './RatedDisabilityList';
import TotalRatedDisabilities from './TotalRatedDisabilities';

const RatedDisabilityView = ({
  detectDiscrepancies,
  error,
  fetchRatedDisabilities,
  fetchTotalDisabilityRating,
  loading,
  ratedDisabilities,
  sortToggle,
  totalDisabilityRating,
}) => {
  useEffect(() => {
    fetchTotalDisabilityRating();

    if (detectDiscrepancies) {
      checkForDiscrepancies();
    }
  }, []);

  const hasRatedDisabilities = ratedDisabilities?.ratedDisabilities?.length > 0;

  // Total Disability Calculation and Pending Disabilities should go here.
  return (
    <div className="vads-l-grid-container">
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--12">
          <div className="vads-l-row">
            <div className="vads-l-col--12">
              <h1>View your VA disability ratings</h1>
            </div>
            {hasRatedDisabilities && <OnThisPage />}
          </div>
          <h2 id="combined-rating" className="vads-u-margin-y--1p5">
            Your combined disability rating
          </h2>
          <TotalRatedDisabilities
            totalDisabilityRating={totalDisabilityRating}
            loading={loading}
            error={error}
          />
          <h2 id="individual-ratings" className="vads-u-margin-y--2">
            Your individual ratings
          </h2>
          <RatedDisabilityList
            fetchRatedDisabilities={fetchRatedDisabilities}
            ratedDisabilities={ratedDisabilities}
            sortToggle={sortToggle}
          />
          <Learn />
          <NeedHelp />
        </div>
      </div>
    </div>
  );
};

RatedDisabilityView.propTypes = {
  fetchRatedDisabilities: PropTypes.func.isRequired,
  detectDiscrepancies: PropTypes.bool,
  error: PropTypes.object,
  fetchTotalDisabilityRating: PropTypes.func,
  loading: PropTypes.bool,
  ratedDisabilities: PropTypes.shape({
    ratedDisabilities: PropTypes.array,
  }),
  sortToggle: PropTypes.bool,
  totalDisabilityRating: PropTypes.number,
};

export default RatedDisabilityView;
