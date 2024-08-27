import React from 'react';
import PropTypes from 'prop-types';
import CCLayout from '../../../components/layout/CCLayout';

export default function DetailsCC({ appointment }) {
  return <CCLayout data={appointment} />;
}

DetailsCC.propTypes = {
  appointment: PropTypes.object.isRequired,
  featureVaosV2Next: PropTypes.bool,
  useV2: PropTypes.bool,
};
DetailsCC.defaultProps = {
  featureVaosV2Next: false,
  useV2: false,
};
