import React from 'react';
import { getDisabilityName } from '../utils';

export default function NewDisability({ formData }) {
  return <div>{getDisabilityName(formData.condition)}</div>;
}
