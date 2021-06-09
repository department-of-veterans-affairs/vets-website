import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

const Failed = () => {
  const contactNumber = '555-867-5309';

  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <h1>Please check in with a staff member.</h1>

      <footer className="row">
        <h2 className="help-heading vads-u-font-size--lg">
          Not sure who to check in with?
        </h2>
        <p>
          Call us at <Telephone contact={contactNumber} />
        </p>
      </footer>
    </div>
  );
};

export default Failed;
