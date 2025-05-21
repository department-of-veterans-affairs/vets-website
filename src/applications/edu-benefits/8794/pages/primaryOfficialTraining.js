import React from 'react';
import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import PrimaryOfficialExemptInfo from '../components/primaryOfficialExemptInfo';

const titleLabel = formData => {
  // console.log('formdata', formData);
  if (formData?.primaryOfficial) {
    return `${formData.primaryOfficial?.first} ${
      formData.primaryOfficial?.last
    }'s Section 305 training`;
  }
  return 'Section 305 training';
};

const uiSchema = {
  primaryOfficialTraining: {
    ...titleUI(titleLabel),
    'ui:description': (
      <>
        <p className="vads-u-margin-top--2">
          <strong>New School Certifying Officials:</strong> All newly designated
          certifying officials must complete required online training for new
          certifying officials based on their type of facility and provide a
          copy of their training certificate when submitting this form. Enter
          the date the new certifying official training was completed.
        </p>
        <p className="vads-u-margin-top--2">
          <strong>Existing School Certifying Officials:</strong> Existing SCOs
          at covered educational institutions must complete a certain number of
          training modules/training events based on their facility or program
          type, annually, to maintain their access to certifying enrollments to
          VA.
          <va-link
            href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/online_sco_training.asp#existing"
            text="Go to this page to find out what's required"
            external
          />
        </p>
      </>
    ),
    trainingDate: {
      ...currentOrPastDateUI({
        title:
          'Enter the date the required annual Section 305 training was completed',
        hint: 'If exempt, see information below',
        errorMessages: {
          required: 'Please select a date',
        },
      }),
    },
    'view:trainingExempt': {
      ...descriptionUI(PrimaryOfficialExemptInfo),
      'ui:webComponentField': VaCheckboxField,
    },

    // 'ui:options': {
    //   updateSchema: (formData, formSchema) => {
    //     console.log('formdata in update', formData);
    //     // if (formData.primaryOfficial?.phoneType === 'us') {
    //     //   return {
    //     //     ...formSchema,
    //     //     required: ['title', 'phoneType', 'phoneNumber', 'emailAddress'],
    //     //   };
    //     // }
    //     // if (formData.primaryOfficial?.phoneType === 'intl') {
    //     //   return {
    //     //     ...formSchema,
    //     //     required: [
    //     //       'title',
    //     //       'phoneType',
    //     //       'internationalPhoneNumber',
    //     //       'emailAddress',
    //     //     ],
    //     //   };
    //     // }

    //     return { ...formSchema };
    //   },
    // },
  },
};

const schema = {
  type: 'object',
  properties: {
    primaryOfficialTraining: {
      type: 'object',
      properties: {
        trainingDate: currentOrPastDateSchema,
        'view:trainingExempt': {
          type: 'object',
          required: [],
          properties: {},
        },
      },
      required: ['trainingDate'],
    },
  },
};

export { uiSchema, schema };
