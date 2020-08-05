import React from 'react';
import PropTypes from 'prop-types';
import LocationInfoBlock from '../search-results/LocationInfoBlock';
import LocationPhoneLink from '../search-results/LocationPhoneLink';
import LocationDirectionsLink from '../search-results/LocationDirectionsLink';

const UrgentCareResult = ({ result, query }) => null;

UrgentCareResult.propTypes = {
  result: PropTypes.object,
  query: PropTypes.object,
};

export default UrgentCareResult;
