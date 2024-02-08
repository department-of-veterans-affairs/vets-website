import React from 'react';

export default function AppointmentsTable() {
  return (
    <va-table table-title="Travel claims">
      <va-table-row slot="headers">
        <span>Travel claim Number</span>
        <span>Status</span>
        <span>Details</span>
      </va-table-row>
      <va-table-row>
        <span>#1234567</span>
        <span>
          <span className="usa-label">In Process</span>
        </span>
        <span>Consequat cillum, voluptate labore.</span>
      </va-table-row>
      <va-table-row>
        <span>#09876543</span>
        <span>
          <span className="usa-label uswds-system-color-gold-20v">
            In Manual Review
          </span>
        </span>
        <span>---</span>
      </va-table-row>
    </va-table>
  );
}
