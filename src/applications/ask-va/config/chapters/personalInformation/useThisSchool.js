import React from 'react';
import FormElementTitle from '../../../components/FormElementTitle';
import SelectedSchool from '../../../components/FormFields/SelectedSchool';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_3, useThisSchoolOptions } from '../../../constants';
import { radioSchema, radioUI } from '../../schema-helpers/radioHelper';

const useThisSchoolPage = {
  uiSchema: {
    'ui:title': FormElementTitle({ title: CHAPTER_3.USE_THIS_SCHOOL.TITLE }),
    'ui:description': SelectedSchool,
    'ui:objectViewField': PageFieldSummary,
    useSchool: radioUI({
      title: <strong>{CHAPTER_3.USE_THIS_SCHOOL.QUESTION_1}</strong>,
      labels: useThisSchoolOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['useSchool'],
    properties: {
      useSchool: radioSchema(Object.values(useThisSchoolOptions)),
    },
  },
};

export default useThisSchoolPage;
