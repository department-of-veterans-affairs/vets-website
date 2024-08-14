import React from 'react';
import propTypes from 'prop-types';

const RegistrationOnlyDescription = ({ headingLevel = 3 }) => {
  const H = `h${headingLevel}`;
  return (
    <>
      <H className="vads-u-font-size--h3">
        Health care for your service-connected conditions
      </H>
      <p>Select the type of health care you want to apply for.</p>
      <p>
        You have the option to register for health care for your
        service-connected conditions only without enrolling in our full medical
        benefits package.
      </p>
    </>
  );
};

RegistrationOnlyDescription.propTypes = {
  headingLevel: propTypes.number,
};

export default RegistrationOnlyDescription;
