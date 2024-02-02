import React from 'react';
import PropTypes from 'prop-types';
import { ACTIVEDUTYBENEFITSSTATEMENT } from '../constants/index';

const BenefitsExpirationDate = ({ date }) => {
  return (
    <div id="benefits-expiration-statement">
      <h2>Benefits Expiration Date</h2>

      {ACTIVEDUTYBENEFITSSTATEMENT}

      <p className="vads-u-font-weight--bold">{date}</p>
    </div>
  );
};
BenefitsExpirationDate.propTypes = {
  date: PropTypes.string,
};
export default BenefitsExpirationDate;
