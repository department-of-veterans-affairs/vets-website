import React from 'react';

export const ServiceError = () => (
  <div className="backenderror">
    <h3 className="backend-error-bold"> We’ve run into a problem. </h3>

    <div className="backend-error vads-u-padding-bottom--5">
      We're sorry. Something went wrong on our end. Please refresh this page or
      check back soon.
    </div>
  </div>
);

export default ServiceError;
