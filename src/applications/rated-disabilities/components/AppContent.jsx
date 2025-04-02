import React, { useEffect, useState } from 'react';

import { getRatedDisabilities } from '../actions';
import CombinedRating from './CombinedRating';
import Learn from './Learn';
import NeedHelp from './NeedHelp';
import NoRatings from './NoRatings';
import OnThisPage from './OnThisPage';
import RatingLists from './RatingLists';
import ServerError from './ServerError';

const loadingIndicator = (
  <va-loading-indicator message="Loading your rating information..." />
);

export default function AppContent() {
  const [data, setData] = useState(null);
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
  if (hasError || data?.errors) {
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
        {hasRatedDisabilities ? (
          <RatingLists ratings={individualRatings} />
        ) : (
          <NoRatings />
        )}
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
