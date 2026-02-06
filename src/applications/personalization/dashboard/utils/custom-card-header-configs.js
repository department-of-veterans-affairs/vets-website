/**
 * Define custom configuration for headers for form cards
 * formId is required
 *
 * PICK ONE:
 * Define formIdLabel to make this header: `VA Form ${formIdLabel}`
 * Define formTitle to make a fully custom header
 *
 * OPTIONALLY:
 * Define presentableFormId to make this subheader: `VA ${presentableFormId}`
 * @param {Object} formMeta - metadata defined in platform/forms/constants/MY_VA_SIP_FORMS
 */
export const getCustomCardHeaderConfigs = formMeta => [
  {
    formId: 'form0995_form4142',
    formTitle: 'Authorization to release medical information',
    presentableFormId:
      'Form 21-4142 submitted with Supplemental Claim VA Form 20-0995',
  },
  {
    formId: 'form526_form4142',
    formIdLabel: '21-4142 submitted with VA Form 21-526EZ',
  },
  {
    formId: '21-4142',
    formTitle: formMeta?.benefit,
  },
];
