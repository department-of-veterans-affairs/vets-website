import React from 'react';
import PropTypes from 'prop-types';

export default function VAFacilityTitle({ vaFacility }) {
  if (!vaFacility?.title) return null;

  return (
    <h3 className="vads-u-margin-bottom--1 vads-u-margin-top--0 vads-u-font-size--md vads-u-font-size--lg">
      {vaFacility.website ? (
        <va-link href={vaFacility.website} text={vaFacility.title} />
      ) : (
        vaFacility.title
      )}
    </h3>
  );
}

VAFacilityTitle.propTypes = {
  vaFacility: PropTypes.shape({
    title: PropTypes.string.isRequired,
    website: PropTypes.string,
  }),
};
