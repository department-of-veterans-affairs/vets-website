import React, { useEffect, useState } from 'react';

import { getRatedDisabilities } from '../actions';
import CombinedRating from './CombinedRating';
import NeedHelp from './NeedHelp';
import Learn from './Learn';
import OnThisPage from './OnThisPage';
import RatingLists from './RatingLists';
import ServerError from './ServerError';

const loadingIndicator = (
  <va-loading-indicator message="Loading your rating information..." />
);

export default function AppContent() {
  const [data, setData] = useState({});
  const [hasError, setHasError] = useState(false);
  const [isRequestDone, setIsRequestDone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await getRatedDisabilities();
        setData(responseData);
      } catch (err) {
        setHasError(true);
      } finally {
        setIsRequestDone(true);
      }
    };

    fetchData();
  }, []);

  const { combinedDisabilityRating, individualRatings } = data || {};

  const hasRatedDisabilities = individualRatings?.length > 0;

  let contentOrError;
  if (hasError) {
    contentOrError = <ServerError />;
  } else {
    contentOrError = (
      <>
        <div>{hasRatedDisabilities && <OnThisPage />}</div>
        <h2 id="combined-rating" className="vads-u-margin-y--1p5">
          Your combined disability rating
        </h2>
        <CombinedRating combinedRating={combinedDisabilityRating} />
        <h2 id="individual-ratings" className="vads-u-margin-y--2">
          Your individual ratings
        </h2>
        <RatingLists ratings={individualRatings} />
      </>
    );
  }

  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--2">
      <div className="vads-l-row">
        <div className="vads-l-col--12">
          <h1>View your VA disability ratings</h1>
          {isRequestDone ? contentOrError : loadingIndicator}
          <Learn />
          <NeedHelp />
        </div>
      </div>
    </div>
  );
}
