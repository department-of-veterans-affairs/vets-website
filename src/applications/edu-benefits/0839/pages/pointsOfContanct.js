import React from 'react';
import {
  titleUI,
  firstNameLastNameNoSuffixUI,
  firstNameLastNameNoSuffixSchema,
  internationalPhoneUI,
  internationalPhoneSchema,
  emailUI,
  emailSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const pageDescription = (
  <>
    <p className="vads-u-margin-top--2">
      <strong>Note:</strong> These contacts can be the same person.
    </p>
    <va-link
      text="Review additional instructions for the Yellow Ribbon Program Agreement"
      href="/school-administrators/submit-yellow-ribbon-program-agreement-form-22-0839/yellow-ribbon-instructions"
      external
    />
  </>
);

export const uiSchema = {
  pointsOfContact: {
    ...titleUI({
      title:
        "Provide contact information for the school's financial representative or Yellow Ribbon Program point of contact and school certifying official",
      description: pageDescription,
    }),
    fullName: firstNameLastNameNoSuffixUI(),
    phoneNumber: internationalPhoneUI('Phone number'),
    email: emailUI('Email'),
    roles: checkboxGroupUI({
      title: "What is this person's role?",
      hint: 'Select all that apply',
      required: true,
      labels: {
        isYellowRibbonProgramPointOfContact:
          'Yellow Ribbon Program point of contact',
        isSchoolFinancialRepresentative: 'School financial representative',
        isSchoolCertifyingOfficial: 'School certifying official',
      },
      errorMessages: {
        required: 'Please make a selection',
      },
    }),
  },
};

export const schema = {
  type: 'object',
  properties: {
    pointsOfContact: {
      type: 'object',
      properties: {
        fullName: firstNameLastNameNoSuffixSchema,
        phoneNumber: internationalPhoneSchema(),
        email: emailSchema,
        roles: checkboxGroupSchema([
          'isYellowRibbonProgramPointOfContact',
          'isSchoolFinancialRepresentative',
          'isSchoolCertifyingOfficial',
        ]),
      },
      required: ['fullName', 'phoneNumber', 'email', 'roles'],
    },
  },
  required: ['pointsOfContact'],
};
