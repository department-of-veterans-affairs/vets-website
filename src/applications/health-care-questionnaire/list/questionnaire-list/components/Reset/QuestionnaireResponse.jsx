import React, { useState } from 'react';

export default function QuestionnaireResponse(props) {
  const { resource, apiKey } = props;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const resetQr = async questionnaireResponse => {
    const qr = { ...questionnaireResponse };
    qr.status = 'entered-in-error';
    setIsDeleting(true);
    const resp = await fetch(
      `https://sandbox-api.va.gov/services/pgd/v0/sandbox-data/r4/QuestionnaireResponse/${
        resource.id
      }`,
      {
        method: 'DELETE',
        headers: {
          apiKey,
        },
      },
    );
    setIsDeleting(false);
    if (resp.status === 200) {
      setIsDeleted(true);
    }
  };

  const getButton = () => {
    if (isDeleted) {
      return <button disabled>deleted</button>;
    } else if (isDeleting) {
      return <button disabled>deleting...</button>;
    } else {
      return <button onClick={() => resetQr(resource)}>reset</button>;
    }
  };
  if (isDeleted) {
    return <></>;
  }
  return (
    <li>
      id: {resource.id}
      <br />
      status:
      {resource.status}
      {getButton()}
    </li>
  );
}
