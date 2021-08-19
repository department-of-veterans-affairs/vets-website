import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import {
  errorMessage,
  missingTotalMessage,
  totalRatingMessage,
} from './TotalRatingStates';
import { isServerError, isClientError } from '../util';

const TotalRatedDisabilities = props => {
  const { loading, totalDisabilityRating } = props;
  const errorCode = props.error ? props.error.code : null;
  let content;
  // If the data from the parent is loading ( loading prop ), show a loading indicator
  // If there is an error, display an error message,
  // If there is no rating, display a no rating message
  // If there is a rating, display the rating and content
  if (loading) {
    content = (
      <LoadingIndicator message="Loading your total disability rating..." />
    );
  } else if (errorCode && isServerError(errorCode)) {
    content = errorMessage();
  } else if (
    !totalDisabilityRating ||
    (errorCode && isClientError(errorCode))
  ) {
    content = missingTotalMessage();
  } else {
    content = totalRatingMessage(totalDisabilityRating);
  }

  return <>{content}</>;
};

TotalRatedDisabilities.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  totalDisabilityRating: PropTypes.number,
};

export default TotalRatedDisabilities;
