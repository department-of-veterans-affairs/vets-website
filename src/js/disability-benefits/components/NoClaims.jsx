import React from 'react';

export default function NoClaims() {
  return (
    <div className="usa-alert usa-alert-info claims-alert">
      <h4>You do not have any submitted claims</h4>
      <p>Claims that you have submitted will appear here. If you have an open application for a claim but have not yet submitted it, you can continue your application on <a href="https://www.ebenefits.va.gov/">ebenefits</a></p>
    </div>
  );
}
