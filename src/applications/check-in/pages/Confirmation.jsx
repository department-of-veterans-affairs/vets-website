import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

const Confirmation = () => {
  const contactNumber = '555-867-5309';
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <h1>Thank you for checking in</h1>

      <va-alert status="success">
        <h3 slot="headline">We'll let you know when we're ready for you.</h3>
      </va-alert>
      <footer className="row">
        <h2 className="help-heading vads-u-font-size--lg">
          Not sure where to wait?
        </h2>
        <p>
          Ask a staff member or call us at <Telephone contact={contactNumber} />
          .
        </p>
      </footer>
    </div>
  );
};

export default Confirmation;
