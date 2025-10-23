/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import PropTypes from 'prop-types';

function VetCenterImageSection(props) {
  return (
    <a
      href={props.vetCenter.fieldMedia && props.vetCenter.path}
      aria-label={props.vetCenter.fieldMedia?.entity.image.alt}
    >
      <img
        className="region-img"
        src={props.vetCenter.fieldMedia?.entity.image.derivative.url}
        alt={props.vetCenter.fieldMedia?.entity.image.alt}
      />
    </a>
  );
}

VetCenterImageSection.propTypes = {
  vetCenter: PropTypes.object,
};

export default VetCenterImageSection;
