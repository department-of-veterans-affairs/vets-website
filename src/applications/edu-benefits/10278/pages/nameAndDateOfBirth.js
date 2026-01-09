import React from 'react';
import { useSelector } from 'react-redux';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isLoggedIn } from 'platform/user/selectors';
import PersonalInformation from '../components/PersonalInformation';

const AuthWrapper = ({ formData }) => {
  const userLoggedIn = useSelector(isLoggedIn);

  if (!userLoggedIn) {
    return null;
  }

  return <PersonalInformation formData={formData} />;
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': AuthWrapper,

    fullName: {
      ...fullNameNoSuffixUI(),
      'ui:options': {
        hideIf: formData => formData.isLoggedIn === true,
      },
    },
    dateOfBirth: {
      ...dateOfBirthUI(),
      'ui:options': {
        hideIf: formData => formData.isLoggedIn === true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['fullName', 'dateOfBirth'],
  },
};
