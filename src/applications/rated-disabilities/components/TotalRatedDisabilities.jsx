import React from 'react';
import PropTypes from 'prop-types';

import {
  errorMessage,
  missingTotalMessage,
  totalRatingMessage,
} from './TotalRatingStates';
import { isServerError, isClientError } from '../util';

const TotalRatedDisabilities = ({ error, loading, totalDisabilityRating }) => {
  const errorCode = error ? error.code : null;
  let content;
  // If the data from the parent is loading ( loading prop ), show a loading indicator
  // If there is an error, display an error message,
  // If there is no rating, display a no rating message
  // If there is a rating, display the rating and content
  if (loading) {
    content = (
      <va-loading-indicator message="Loading your total disability rating..." />
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

  return content;
};

TotalRatedDisabilities.propTypes = {
  error: PropTypes.object,
  loading: PropTypes.bool,
  totalDisabilityRating: PropTypes.number,
};

export default TotalRatedDisabilities;

// content = (
//   <>
//     <h2 slot="headline" className="vads-u-margin-y--0 vads-u-font-size--h3">
//       We’re sorry. Something went wrong on our end
//     </h2>
//     <p className="vads-u-font-size--base">
//       Please refresh this page or check back later. You can also sign out of
//       VA.gov and try signing back into this page.
//     </p>
//     <p className="vads-u-font-size--base">
//       If you get this error again, please call the VA.gov help desk at{' '}
//       <va-telephone contact={CONTACTS.VA_311} /> (
//       <va-telephone contact={CONTACTS['711']} tty />
//       ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
//     </p>
//   </>
// );
