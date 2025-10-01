import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom-v5-compat';
import { useDispatch, useSelector } from 'react-redux';

import { HelpTextManage } from './HelpText';
import ClaimDetailsContent from './ClaimDetailsContent';
import { getClaimDetails } from '../redux/actions';
import { REIMBURSEMENT_URL } from '../constants';

export default function TravelClaimDetailsContent() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data, error } = useSelector(state => state.travelPay.claimDetails);

  useEffect(
    () => {
      if (id && !data[id] && !error) {
        dispatch(getClaimDetails(id));
      }
    },
    [dispatch, data, error, id],
  );

  return (
    <>
      {error && <h1>There was an error loading the claim details.</h1>}
      {data[id] && <ClaimDetailsContent {...data[id]} />}
      <hr />

      <div className="vads-u-margin-bottom--4">
        <p>
          If you’re eligible for reimbursement, we’ll deposit your reimbursement
          in your bank account.
        </p>
        <va-link
          href={REIMBURSEMENT_URL}
          text="Learn how to set up direct deposit for travel pay reimbursement"
        />
        <p>
          <strong>Note:</strong> Even if you already set up direct deposit for
          your VA benefits, you’ll need to set up another direct deposit for VA
          travel pay reimbursements.
        </p>
      </div>
      <va-need-help>
        <div slot="content">
          <HelpTextManage />
        </div>
      </va-need-help>
    </>
  );
}
