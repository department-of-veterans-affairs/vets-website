import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import DetailCopayPage from './DetailCopayPage';
import DetailPage from './DetailPage';

const Details = ({ match, ...rest }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showNewDetailPage = useToggleValue(TOGGLE_NAMES.showCDPOneThingPerPage);

  if (!match?.params?.id) {
    return null;
  }
  // DetailCopayPage is the updated page for OTPP and VHA payment history
  // DetailPage is the legacy page
  return showNewDetailPage ? (
    <DetailCopayPage match={match} {...rest} />
  ) : (
    <DetailPage match={match} {...rest} />
  );
};

Details.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Details;
