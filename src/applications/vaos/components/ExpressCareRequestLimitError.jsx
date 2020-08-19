import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { FETCH_STATUS } from '../utils/constants';
import { Link } from 'react-router-dom';

export default function ExpressCareRequestLimitError({
  fetchRequestLimitsStatus,
}) {
  if (fetchRequestLimitsStatus === FETCH_STATUS.failed) {
    return (
      <div>
        <h1>We’ve run into a problem</h1>
        <AlertBox
          status="error"
          content={
            <p>
              Something went wrong when we tried to check your request
              eligibility. We suggest you wait a day to try again or you can
              call your medical center to help with this request.
            </p>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <h1>You’ve reached the limit for Express Care requests</h1>
      <AlertBox status="warning">
        <p>
          Our records show that you have an open Express Care appointment at
          this location. We can’t accept any more Express Care requests until
          your pending appointment is scheduled or canceled. To cancel a pending
          Express Care appointment, go to your{' '}
          <Link to="/express-care">appointment list</Link>.
        </p>
      </AlertBox>
    </div>
  );
}
