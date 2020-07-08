import React from 'react';

export default function CompleteDetails({ className }) {
  return (
    <div className={className}>
      <p>
        A decision packet has been mailed to you. Typically, decision notices
        are received within 10 days, but this is dependent upon U.S. Postal
        Service timeframes.
      </p>
      <h4>Payments</h4>
      <p>
        If you are entitled to back payment (based on an effective date), you
        can expect to receive payment within 1 month of your claim’s decision
        date.
      </p>
    </div>
  );
}
