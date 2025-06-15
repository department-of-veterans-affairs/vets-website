import React from 'react';

import { DLC_PHONE } from '../constants';

import Accessories from './Accessories';
import ApneaSupplies from './ApneaSupplies';
import Batteries from './Batteries';

const BatteriesAndAccessories = () => (
  <>
    <h3>Add supplies to your order</h3>
    <p>
      We’ll send you a 6-month supply of each item added to your order. You can
      only order each item once every 5 months.
    </p>
    <p>
      If you need unavailable items sooner, please call the DLC Customer Service
      Section at <va-telephone contact={DLC_PHONE} /> or email{' '}
      <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
    </p>
    <Batteries />
    <Accessories />
    <ApneaSupplies />
  </>
);

export default BatteriesAndAccessories;
