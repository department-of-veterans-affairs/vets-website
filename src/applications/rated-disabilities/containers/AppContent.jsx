import React, { useEffect, useState } from 'react';

import { getRatedDisabilities } from '../actions';
import CombinedRating from '../components/CombinedRating';
import NeedHelp from '../components/NeedHelp';
import Learn from '../components/Learn';
import OnThisPage from '../components/OnThisPage';
import RatingLists from '../components/RatingLists';
import ServerError from '../components/ServerError';

const loadingIndicator = (
  <va-loading-indicator message="Loading your rating information..." />
);

export default function AppContent() {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [isRequestDone, setIsRequestDone] = useState(false);

  useEffect(() => {
    getRatedDisabilities()
      .then(res => {
        setData(res);
      })
      .catch(err => {
        setError({ code: 500 });
      })
      .then(() => setIsRequestDone(true));
  }, []);

  const { combinedDisabilityRating, individualRatings } = data || {};

  const hasRatedDisabilities = individualRatings?.length > 0;

  let contentOrError;
  if (!error) {
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
        <RatingLists ratings={individualRatings ?? []} />
      </>
    );
  } else {
    contentOrError = <ServerError />;
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
