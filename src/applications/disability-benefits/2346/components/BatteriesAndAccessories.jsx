import React from 'react';
import Accessories from './Accessories';
import Batteries from './Batteries';

const BatteriesAndAccessories = () => {
  return (
    <>
      <h3>Add supplies to your order</h3>
      <p>
        We'll send you a 6-month supply of each item added to your order. You
        can only order each item once every 5 months.
      </p>
      <p>
        If you need unavailable items sooner, please call the DLC Customer
        Service Section at{' '}
        <a aria-label="3 0 3. 2 7 3. 6 2 0 0." href="tel:303-273-6200">
          303-273-6200
        </a>{' '}
        or email <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
      </p>
      <Batteries />
      <Accessories />
    </>
  );
};
export default BatteriesAndAccessories;
