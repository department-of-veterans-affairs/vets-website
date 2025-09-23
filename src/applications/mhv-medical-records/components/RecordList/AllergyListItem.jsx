import React from 'react';
import PropTypes from 'prop-types';
import AllergiesListItem from './AllergyListItems/AllergiesListItem';

const AllergyListItem = props => {
  return <AllergiesListItem {...props} />;
};

AllergyListItem.propTypes = {
  record: PropTypes.object,
};

export default AllergyListItem;
