import React from 'react';
import PropTypes from 'prop-types';

export default function VAFacilityTitle({ vaFacility }) {
  if (!vaFacility?.title) return null;
  const titleComponent = (
    <h3 className="vads-u-margin-bottom--1 vads-u-margin-top--0 vads-u-font-size--md vads-u-font-size--lg">
      {vaFacility.title}
    </h3>
  );
  return vaFacility.website ? (
    <a href={vaFacility.website}>{titleComponent}</a>
  ) : (
    titleComponent
  );
}

VAFacilityTitle.propTypes = {
  vaFacility: PropTypes.shape({
    title: PropTypes.string.isRequired,
    website: PropTypes.string,
  }),
};
