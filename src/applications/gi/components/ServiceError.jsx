import React from 'react';

export const ServiceError = () => (
  <div className="row vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--0">
    <h3 data-testid="service-error-message"> We’ve run into a problem. </h3>

    <div className="vads-u-padding-bottom--5">
      We’re sorry. Something went wrong on our end. Please refresh this page or
      check back soon.
    </div>
  </div>
);

export default ServiceError;
