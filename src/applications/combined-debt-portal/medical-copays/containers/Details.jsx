import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import DetailCopayPage from './DetailCopayPage';
import DetailPage from './DetailPage';

const Details = ({ match, ...rest }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showNewDetailPage = useToggleValue(TOGGLE_NAMES.showCDPOneThingPerPage);
  const showVHAPaymentHistory = useToggleValue(
    TOGGLE_NAMES.showVHAPaymentHistory,
  );

  if (!match?.params?.id) {
    return null;
  }
  // DetailCopayPage is the updated page for OTPP and VHA payment history (lighthouse)
  // DetailPage is the legacy page
  return showNewDetailPage || showVHAPaymentHistory ? (
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
