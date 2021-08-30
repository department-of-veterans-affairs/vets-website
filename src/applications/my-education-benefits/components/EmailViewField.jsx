import React from 'react';

export default function EmailViewField({ formData }) {
  try {
    return <>{formData.email}</>;
  } catch (err) {
    return '';
  }
}
