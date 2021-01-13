import React from 'react';
import ProfileInfoTable from '../ProfileInfoTable';

function PaymentHistory() {
  const tableData = [
    {
      value: (
        <>
          <p className="vads-u-margin-top--0">
            Check your payment history for your VA disability compensation,
            pension, and education benefits
          </p>
          <a href="/va-payment-history/payments/">View your payment history</a>
        </>
      ),
    },
  ];

  return (
    <ProfileInfoTable
      className="vads-u-margin-y--2 medium-screen:vads-u-margin-y--4"
      title="VA payment history"
      data={tableData}
    />
  );
}

export default PaymentHistory;
