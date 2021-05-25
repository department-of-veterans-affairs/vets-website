import React from 'react';
import PropTypes from 'prop-types';

function VetCenterImageSection(props) {
  if (!props.vetCenter.fieldMedia) return null;
  return (
    <a
      href={props.vetCenter.path}
      aria-label={props.vetCenter.fieldMedia.entity.image.alt}
    >
      <img
        className="region-img"
        src={props.vetCenter.fieldMedia.entity.image.derivative.url}
        alt={props.vetCenter.fieldMedia.entity.image.alt}
      />
    </a>
  );
}

VetCenterImageSection.propTypes = {
  vetCenter: PropTypes.object,
};

export default VetCenterImageSection;
