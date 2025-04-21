import React from 'react';
import PropTypes from 'prop-types';

import formatCurrency from '../utilities/data/formatCurrency';

export default function CurrencyWidget(props) {
  const { name = 'currency value', value, ...settings } = props || {};

  let displayValue = value;

  if (typeof value === 'number') {
    displayValue = formatCurrency(value, settings);
  } else if (typeof value === 'string') {
    const numericValue = Number(value);
    if (!Number.isNaN(numericValue)) {
      displayValue = formatCurrency(numericValue, settings);
    }
  }

  return (
    <span className="dd-privacy-hidden" data-dd-action-name={name}>
      {displayValue}
    </span>
  );
}

CurrencyWidget.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
