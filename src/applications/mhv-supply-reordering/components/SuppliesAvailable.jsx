import React from 'react';
import PropTypes from 'prop-types';

import { numberOfSuppliesPhrase } from '../utils/helpers';

const SuppliesAvailable = ({ supplies }) => (
  <va-card background class="vads-u-margin-bottom--2">
    <h2 className="vads-u-margin-top--0">Available for reorder</h2>
    <p className="vads-u-margin-bottom--0">
      You have {numberOfSuppliesPhrase(supplies?.length)} available for reorder.
    </p>
    <ul className="vads-u-margin-top--1 vads-u-margin-bottom--0">
      {supplies.map(({ productId, productName }) => (
        <li key={productId}>{productName}</li>
      ))}
    </ul>
  </va-card>
);

SuppliesAvailable.propTypes = {
  supplies: PropTypes.array.isRequired,
};

export default SuppliesAvailable;
