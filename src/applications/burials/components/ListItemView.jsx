import React from 'react';
import PropTypes from 'prop-types';

const ListItemView = ({ title }) => (
  <h3 className="vads-u-font-size--h5 vads-u-margin-y--1">{title}</h3>
);

ListItemView.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ListItemView;
