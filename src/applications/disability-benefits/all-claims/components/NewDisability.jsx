import React from 'react';
import { capitalizeEachWord } from '../utils';

export default function NewDisability({ formData }) {
  return <div>{typeof formData.condition === 'string' ? capitalizeEachWord(formData.condition) : 'Unknown Condition'}</div>;
}
