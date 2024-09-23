import React from 'react';
import FormElementTitle from '../../../components/FormElementTitle';
import YourSchool from '../../../components/FormFields/YourSchool';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_3, schoolInYourProfileOptions } from '../../../constants';
import { radioSchema, radioUI } from '../../schema-helpers/radioHelper';

const schoolInYourProfilePage = {
  uiSchema: {
    'ui:title': FormElementTitle({ title: CHAPTER_3.USE_THIS_SCHOOL.TITLE }),
    'ui:description': YourSchool,
    'ui:objectViewField': PageFieldSummary,
    useSchoolInProfile: radioUI({
      title: <strong>{CHAPTER_3.USE_THIS_SCHOOL.QUESTION_1}</strong>,
      labels: schoolInYourProfileOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['useSchoolInProfile'],
    properties: {
      useSchoolInProfile: radioSchema(
        Object.values(schoolInYourProfileOptions),
      ),
    },
  },
};

export default schoolInYourProfilePage;
