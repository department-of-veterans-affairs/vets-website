import React from 'react';
import PropTypes from 'prop-types';

import formatCurrency from '../utilities/data/formatCurrency';

export default function CurrencyWidget(props) {
  const { name = 'currency value', value, ...settings } = props || {};
  return (
    <span className="dd-privacy-hidden" data-dd-action-name={name || ''}>
      {typeof value === 'number' ? formatCurrency(value, settings) : value}
    </span>
  );
}

CurrencyWidget.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
