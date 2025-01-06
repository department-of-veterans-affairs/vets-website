import React from 'react';
import { Link, useLoaderData } from 'react-router-dom-v5-compat';

export default function Prescriptions() {
  const prescriptions = useLoaderData();

  return (
    <div>
      <h1>Prescriptions</h1>
      <ul>
        <va-accordion title="Prescriptions">
          {prescriptions.map(prescription => (
            <va-accordion-item
              key={prescription.id}
              header={prescription.attributes.prescriptionName}
            >
              <p>
                Facility: {prescription.attributes.facilityName}
                <br />
                Status: {prescription.attributes.dispStatus}
                <br />
                <Link to={`/routing-demos/v6/prescription/${prescription.id}`}>
                  View details
                </Link>
              </p>
            </va-accordion-item>
          ))}
        </va-accordion>
      </ul>
    </div>
  );
}
