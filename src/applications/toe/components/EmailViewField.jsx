import React from 'react';

export default function EmailViewField({ formData }) {
  if (!formData) {
    return '';
  }

  return <>{formData.email}</>;
}
