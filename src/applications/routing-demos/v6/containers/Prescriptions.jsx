import React from 'react';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchPrescriptions() {
      try {
        const response = await apiRequest(
          `${environment.API_URL}/my_health/v1/prescriptions`,
        );
        setPrescriptions(response.data);
      } catch (e) {
        setError(e);
      }
    }

    fetchPrescriptions();
  }, []);

  if (error) {
    return <div>Error loading prescriptions</div>;
  }

  if (!prescriptions) {
    return <div>Loading prescriptions...</div>;
  }

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
              </p>
            </va-accordion-item>
          ))}
        </va-accordion>
      </ul>
    </div>
  );
}
