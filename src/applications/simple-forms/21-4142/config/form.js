import environment from 'platform/utilities/environment';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import footerContent from 'platform/forms/components/FormFooter';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import transformForSubmit from '../../shared/config/submit-transformer';

// pages
import personalInformation1 from '../pages/personalInformation1';
import personalInformation2 from '../pages/personalInformation2';
import contactInformation1 from '../pages/contactInformation1';
import contactInformation2 from '../pages/contactInformation2';
import patientIdentification1 from '../pages/patientIdentification1';
import patientIdentification2 from '../pages/patientIdentification2';
import authorization from '../pages/authorization';
import recordsRequested from '../pages/recordsRequested';
import limitations from '../pages/limitations';
import preparerIdentification from '../pages/preparerIdentification';
import preparerPersonalInformation from '../pages/preparerPersonalInformation';
import preparerAddress1 from '../pages/preparerAddress1';
import preparerAddress2 from '../pages/preparerAddress2';
import {
  patientIdentificationFields,
  preparerIdentificationFields,
  veteranDirectRelative,
  veteranIsSelfText,
} from '../definitions/constants';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  trackingPrefix: 'medical-release-4142-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: formData =>
        formData[preparerIdentificationFields.parentObject][
          preparerIdentificationFields.relationshipToVeteran
        ] === veteranIsSelfText
          ? 'veteran.fullName'
          : 'preparerIdentification.preparerFullName',
    },
  },
  formId: '21-4142',
  saveInProgress: {
    messages: {
      inProgress:
        'Your authorization to release non-VA medical information to VA (21-4142) is in progress.',
      expired:
        'Your saved authorization to release non-VA medical information to VA (21-4142) has expired. If you want to authorize release of non-VA medical information to VA, please start a new authorization.',
      saved:
        'Your authorization to release of non-VA medical information to VA has been saved.',
    },
  },
  version: 0,
  // Note: this is enabled for Save In Progress functionality. We are not using prefill and thus do not have a prefill transformer
  prefillEnabled: true,
  transformForSubmit,
  savedFormMessages: {
    notFound:
      'Please start over to authorize the release of non-VA medical information to VA.',
    noAuth:
      'Please sign in again to continue your authorization to release non-VA medical information to VA.',
  },
  hideUnauthedStartLink: true,
  title: 'Authorize the release of non-VA medical information to VA',
  subTitle:
    'Authorization to disclose information to the Department of Veterans Affairs (VA) (VA Forms 21-4142 and 21-4142a)',
  customText: {
    appType: 'medical release authorization',
  },
  defaultDefinitions: fullSchema.definitions,
  chapters: {
    personalInformation1Chapter: {
      title: "Veteran's personal information",
      pages: {
        personalInformation1: {
          path: 'personal-information-1',
          title: 'Personal Information',
          uiSchema: personalInformation1.uiSchema,
          schema: personalInformation1.schema,
        },
      },
    },
    personalInformation2Chapter: {
      title: "Veteran's identification information",
      pages: {
        personalInformation2: {
          path: 'personal-information-2',
          title: "Personal Information (cont'd)",
          uiSchema: personalInformation2.uiSchema,
          schema: personalInformation2.schema,
        },
      },
    },
    contactInformation1Chapter: {
      title: "Veteran's mailing address",
      pages: {
        contactInformation1: {
          path: 'contact-information-1',
          title: 'Contact Information',
          uiSchema: contactInformation1.uiSchema,
          schema: contactInformation1.schema,
        },
      },
    },
    contactInformation2Chapter: {
      title: "Veteran's contact information",
      pages: {
        contactInformation2: {
          path: 'contact-information-2',
          title: 'Additional contact information',
          uiSchema: contactInformation2.uiSchema,
          schema: contactInformation2.schema,
        },
      },
    },
    patientIdentificationChapter: {
      title: 'Patient identification',
      pages: {
        patientIdentification1: {
          path: 'patient-identification-1',
          title: 'Are you requesting your own medical records?',
          uiSchema: patientIdentification1.uiSchema,
          schema: patientIdentification1.schema,
        },
        patientIdentification2: {
          path: 'patient-identification-2',
          title: 'Whose records are you granting authorization to release?',
          depends: formData =>
            !formData[patientIdentificationFields.parentObject][
              [patientIdentificationFields.isRequestingOwnMedicalRecords]
            ],
          uiSchema: patientIdentification2.uiSchema,
          schema: patientIdentification2.schema,
        },
      },
    },
    authorizationChapter: {
      title: 'Authorization',
      pages: {
        authorization: {
          path: 'authorization',
          title: 'Authorization',
          uiSchema: authorization.uiSchema,
          schema: authorization.schema,
        },
      },
    },
    recordsRequested: {
      title: 'Treatment records',
      pages: {
        recordsRequested: {
          path: 'records-requested',
          title: 'Records requested',
          uiSchema: recordsRequested.uiSchema,
          schema: recordsRequested.schema,
        },
      },
    },
    limitations: {
      title: 'Limitations',
      pages: {
        limitations: {
          path: 'limitations',
          title: 'Do you want to limit the information we can request?',
          uiSchema: limitations.uiSchema,
          schema: limitations.schema,
        },
      },
    },
    preparerIdentification: {
      title: 'Preparer identification',
      pages: {
        preparerIdentification: {
          path: 'preparer-identification',
          title: 'Preparer identification',
          uiSchema: preparerIdentification.uiSchema,
          schema: preparerIdentification.schema,
        },
      },
    },
    preparerPersonalInformation: {
      title: 'Preparer personal information',
      pages: {
        preparerPersonalInformation: {
          path: 'preparer-personal-information',
          title: 'Preparer personal information',
          depends: formData =>
            formData[preparerIdentificationFields.parentObject][
              [preparerIdentificationFields.relationshipToVeteran]
            ] !== veteranIsSelfText,
          uiSchema: preparerPersonalInformation.uiSchema,
          schema: preparerPersonalInformation.schema,
        },
      },
    },
    preparerAddress: {
      title: 'Preparer address',
      pages: {
        preparerAddress1: {
          path: 'preparer-address-1',
          title: 'Preparer address 1',
          depends: formData =>
            veteranDirectRelative.includes(
              formData[preparerIdentificationFields.parentObject][
                [preparerIdentificationFields.relationshipToVeteran]
              ],
            ),
          uiSchema: preparerAddress1.uiSchema,
          schema: preparerAddress1.schema,
        },
        preparerAddress2: {
          path: 'preparer-address-2',
          title: 'Preparer address 2',
          depends: formData =>
            (!formData[preparerIdentificationFields.parentObject][
              [preparerIdentificationFields.preparerHasSameAddressAsVeteran]
            ] ||
              !veteranDirectRelative.includes(
                formData[preparerIdentificationFields.parentObject][
                  [preparerIdentificationFields.relationshipToVeteran]
                ],
              )) &&
            formData[preparerIdentificationFields.parentObject][
              [preparerIdentificationFields.relationshipToVeteran]
            ] !== veteranIsSelfText,
          uiSchema: preparerAddress2.uiSchema,
          schema: preparerAddress2.schema,
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
