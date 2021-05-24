import React from 'react';
import PropTypes from 'prop-types';

function PublishedVetCenterImageSection(props) {
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

PublishedVetCenterImageSection.propTypes = {
  vetCenter: PropTypes.object,
};

export default PublishedVetCenterImageSection;
