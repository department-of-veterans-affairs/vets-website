import React from 'react';
import { Await, useLoaderData } from 'react-router-dom-v5-compat';

export default function PrescriptionInfo() {
  const prescription = useLoaderData();

  const loadingIndicator = () => (
    <div>
      <va-loading-indicator />
    </div>
  );

  return (
    <div>
      <h1>Drug information</h1>
      <React.Suspense fallback={loadingIndicator()}>
        <Await resolve={prescription.info}>
          {info => (
            <p>
              <strong>Name: </strong>
              {prescription.prescriptions.data.attributes.prescriptionName}
              <br />
              <strong>Information:</strong> {info.data}
              <br />
            </p>
          )}
        </Await>
      </React.Suspense>
    </div>
  );
}
