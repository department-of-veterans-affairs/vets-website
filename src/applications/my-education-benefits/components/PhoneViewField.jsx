import React from 'react';

export default function PhoneViewField({ formData }) {
  const phone = formData.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  return <>{phone}</>;
}
