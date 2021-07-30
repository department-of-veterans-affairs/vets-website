import React from 'react';

export default function EmailViewField({ formData }) {
  if (!formData) return 'not working';
  const { email } = formData;

  return <>Email {email}</>;
}
