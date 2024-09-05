import React from 'react';
import PropTypes from 'prop-types';

export default function SupplyField({ formData }) {
  const { supplyName } = formData.supplies;

  return (
    <div>
      <strong>{supplyName}</strong>
    </div>
  );
}

SupplyField.propTypes = {
  formData: PropTypes.shape({
    supplies: PropTypes.shape({
      supplyName: PropTypes.string,
    }),
  }),
};
