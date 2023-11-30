import React, { useEffect, useState } from 'react';

import { getRatedDisabilities } from '../actions';
import OnThisPage from '../components/OnThisPage';
import TotalRatedDisabilities from '../components/TotalRatedDisabilities';
import RatingList from '../components/RatingList';

const loadingIndicator = (
  <va-loading-indicator message="Loading your rating information..." />
);

export default function AppContent() {
  const [data, setData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    getRatedDisabilities().then(res => {
      setData(res);
      setDataLoaded(true);
    });
  }, []);

  const { combinedDisabilityRating, individualRatings } = data.attributes || {};

  const hasRatedDisabilities = individualRatings?.length > 0;

  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--2">
      <div className="vads-l-row">
        <div className="vads-l-col--12">
          <h1>View your VA disability ratings</h1>
          {dataLoaded ? (
            <>
              <div>{hasRatedDisabilities && <OnThisPage />}</div>
              <h2 id="combined-rating" className="vads-u-margin-y--1p5">
                Your combined disability rating
              </h2>
              <TotalRatedDisabilities
                totalDisabilityRating={combinedDisabilityRating}
                loading={false}
                error={null}
              />
              <h2 id="individual-ratings" className="vads-u-margin-y--2">
                Your individual ratings
              </h2>
              <RatingList ratings={individualRatings} />
            </>
          ) : (
            loadingIndicator
          )}
        </div>
      </div>
    </div>
  );
}
