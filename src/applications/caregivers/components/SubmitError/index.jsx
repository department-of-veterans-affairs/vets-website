import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

const SubmitError = () => {
  const ErrorBody = () => {
    return (
      <div>
        <p>
          We’re sorry. Something went wrong when you tried to submit your
          application. Please review your application to make sure you entered
          your information correctly. If you think your information is correct,
          please call the VA.gov help desk at
          <Telephone contact={CONTACTS.HELP_DESK} />. We’re here Monday through
          Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>

        <p>
          Or, you can download, print, and sign your completed form and mail it
          to:
        </p>

        <div>
          <b>Program of Comprehensive Assistance for Family Caregivers</b>
          <p className="vads-u-margin--0">Health Eligibility Center</p>
          <p className="vads-u-margin--0">2957 Clairmont Road NE, Ste 200</p>
          <p className="vads-u-margin--0">Atlanta, GA 30329-1647</p>
        </div>
      </div>
    );
  };

  return (
    <AlertBox
      headline="We didn't receive your online application"
      content={ErrorBody()}
      status="error"
    />
  );
};

export default SubmitError;
