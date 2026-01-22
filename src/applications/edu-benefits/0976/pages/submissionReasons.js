// @ts-check
import {
  checkboxGroupSchema,
  checkboxGroupUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const Options = {
  initialApplication: {
    title: 'Initial application',
    description:
      'This is a request for an initial approval to be designated as an institution with programs eligible for participation in a VA GA Bill benefit.',
  },
  approvalOfNewPrograms: {
    title: 'Approval of new programs',
    description:
      'This is a request for additional programs to be approved and added to a current, active GI Bill Approval.',
  },
  reapproval: {
    title: 'Reapprovals',
    description:
      'This is a request for a full reapproval of currently approved GI Bill program. Program reapprovals are required every 24 months.',
  },
  updateInformation: {
    title: 'Update information',
    description:
      'The purpose of this application is to update information about the institution. If “update information” is checked, please identify at least one purpose below.',
  },
  other: {
    title: 'Other',
    description: 'Specify why you are submitting this form',
  },
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Application information'),
    submissionReasons: checkboxGroupUI({
      title: 'Why are you submitting this application?',
      hint: 'You can select more than one answer.',
      required: true,
      labels: Options,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      submissionReasons: checkboxGroupSchema(Object.keys(Options)),
    },
  },
};
