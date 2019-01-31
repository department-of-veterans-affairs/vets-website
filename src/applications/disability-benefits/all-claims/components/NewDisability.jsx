import React from 'react';
import { capitalizeEachWord } from '../utils';

export default function NewDisability({ formData }) {
  return <div>{capitalizeEachWord(formData.condition)}</div>;
}
