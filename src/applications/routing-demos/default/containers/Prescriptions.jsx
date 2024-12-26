import React from 'react';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchPrescriptions() {
      try {
        const response = await apiRequest('/my_health/v1/prescriptions');
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
        {prescriptions.map(prescription => (
          <li key={prescription.id}>{prescription.prescriptionName}</li>
        ))}
      </ul>
    </div>
  );
}
