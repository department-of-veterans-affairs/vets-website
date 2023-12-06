import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getRatedDisabilities } from '../actions';
import CombinedRating from './CombinedRating';
import NeedHelp from './NeedHelp';
import Learn from './Learn';
import OnThisPage from './OnThisPage';
import RatingLists from './RatingLists';
import MVIError from './MVIError';
import ServerError from './ServerError';

const loadingIndicator = (
  <va-loading-indicator message="Loading your rating information..." />
);

export default function AppContent({ user }) {
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
      .finally(() => setIsRequestDone(true));
  }, []);

  const { combinedDisabilityRating, individualRatings } = data || {};

  const hasRatedDisabilities = individualRatings?.length > 0;

  let contentOrError;
  if (!user.profile.verified || user.profile.status !== 'OK') {
    contentOrError = <MVIError />;
  } else if (error) {
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
        <RatingLists ratings={[]} />
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

AppContent.propTypes = {
  user: PropTypes.object,
};
