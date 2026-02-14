import React from 'react';
import PropTypes from 'prop-types';
import DetailCopayPage from './DetailCopayPage';

const Details = ({ match, ...rest }) => {
  if (!match?.params?.id) {
    return null;
  }
  // DetailCopayPage is the updated page for OTPP and VHA payment history (lighthouse)
  return <DetailCopayPage match={match} {...rest} />;
};

Details.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Details;
