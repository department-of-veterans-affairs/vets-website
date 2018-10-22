import React from 'react';
import { PtsdNameTitle } from '../content/ptsdClassification';
import {
  schema as schema781,
  uiSchema as uiSchema781,
} from './uploadPtsdDocuments';

export const uiSchema = {
  ...uiSchema781,
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
};

export const schema = { ...schema781 };
