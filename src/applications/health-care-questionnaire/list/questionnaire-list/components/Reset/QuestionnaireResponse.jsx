import React, { useState } from 'react';

export default function QuestionnaireResponse(props) {
  const { resource, token } = props;
  const [status, setStatus] = useState(resource.status);
  const resetQr = async questionnaireResponse => {
    const qr = { ...questionnaireResponse };
    qr.status = 'entered-in-error';
    const resp = await fetch(
      `https://sandbox-api.va.gov/services/pgd/v0/r4/QuestionnaireResponse/${
        resource.id
      }`,
      {
        method: 'PUT',
        body: JSON.stringify(qr),
        headers: {
          'Content-Type': 'application/fhir+json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const json = await resp.json();

    setStatus(json.status);
  };
  return (
    <li>
      id: {resource.id}
      <br />
      status:
      {status}
      <button onClick={() => resetQr(resource)}>reset</button>
    </li>
  );
}
