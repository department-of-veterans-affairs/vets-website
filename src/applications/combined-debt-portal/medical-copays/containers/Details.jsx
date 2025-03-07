import React from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import DetailCopayPage from './DetailCopayPage';
import DetailPage from './DetailPage';

export const TOGGLE_NAMES = {
  showPaymentHistoryMVP: 'show_payment_history_mvp',
};

const Details = ({ match, ...rest }) => {
  const { useToggleValue } = useFeatureToggle();
  const showNewDetailPage = useToggleValue(TOGGLE_NAMES.showPaymentHistoryMVP);

  if (!match?.params?.id) {
    return null;
  }

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
