import React from 'react';
import { Navigate, useParams } from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';
import {
  selectAllExpenses,
  selectAppointment,
  selectComplexClaim,
} from '../../../redux/selectors';

const ComplexClaimRedirect = () => {
  const { apptId: apptIdFromParams, claimId } = useParams();
  const allExpenses = useSelector(selectAllExpenses);
  const { data: appointment } = useSelector(selectAppointment);
  const complexClaim = useSelector(selectComplexClaim);

  // Get apptId from params or fallback to appointment data from store
  const apptId = apptIdFromParams || appointment?.id;

  // Get claimId from params or fallback to claim data from store
  const effectiveClaimId = claimId || complexClaim?.data?.claimId;

  // if no claim, navigate to intro
  if (!effectiveClaimId) {
    return <Navigate to={`/file-new-claim/${apptId}`} replace />;
  }

  // if claim and no expenses, navigate to choose-expense
  const expenses = allExpenses ?? [];
  if (expenses.length === 0) {
    return (
      <Navigate
        to={`/file-new-claim/${apptId}/${effectiveClaimId}/choose-expense`}
        replace
      />
    );
  }

  // if claim and expenses, navigate to review
  return (
    <Navigate
      to={`/file-new-claim/${apptId}/${effectiveClaimId}/review`}
      replace
    />
  );
};

export default ComplexClaimRedirect;
