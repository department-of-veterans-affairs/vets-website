import React from 'react';
import PropTypes from 'prop-types';

const ListItemView = ({ title }) => {
  return (
    <h3 className="vads-u-font-size--h5 vads-u-margin-y--1 vads-u-margin-right--2">
      {title}
    </h3>
  );
};

ListItemView.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ListItemView;
