import React from 'react';
import PropTypes from 'prop-types';
import StandardAllergyListItem from './StandardAllergyListItem';

const AllergiesListItem = props => {
  const { record } = props;

  // Since v2 data is now converted to match v1 format exactly,
  // we can use the same component for both v1 and v2 data
  return <StandardAllergyListItem record={record} />;
};

AllergiesListItem.propTypes = {
  record: PropTypes.object,
};

export default AllergiesListItem;
