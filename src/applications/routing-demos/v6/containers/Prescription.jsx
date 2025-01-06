import React from 'react';
import { Link, useLoaderData } from 'react-router-dom-v5-compat';

export default function Prescription() {
  const prescription = useLoaderData();

  return (
    <div>
      <h1>Prescription information</h1>
      <p>
        <strong>Name:</strong>{' '}
        {prescription.prescriptions.data.attributes.prescriptionName}
        <br />
        <strong>Name:</strong>{' '}
        {prescription.prescriptions.data.attributes.facilityName}
        <br />
        <Link
          to={`/routing-demos/v6/prescription/${
            prescription.prescriptions.data.attributes.prescriptionId
          }/info`}
        >
          View drug information
        </Link>
      </p>
    </div>
  );
}
