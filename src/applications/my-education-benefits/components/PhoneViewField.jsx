import React from 'react';

export default function PhoneViewField({ formData }) {
  let phone;
  try {
    phone = formData.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  } catch (err) {
    phone = formData.phone;
  }
  return <>{phone}</>;
}
