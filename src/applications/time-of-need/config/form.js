// Platform imports
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

// Manifest, constants, containers, helpers
import manifest from '../manifest.json';
import { TITLE, SUBTITLE } from '../constants';
import GetFormHelp from '../components/GetFormHelp';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Applicant chapter
import applicantDetails from './pages/applicantChapter/applicantDetails';
import applicantContact from './pages/applicantChapter/applicantContact';
import applicantAddress from './pages/applicantChapter/applicantAddress';
import applicantWhoIsDeceased from './pages/applicantChapter/applicantWhoIsDeceased';
import applicantPreneedDecisionLetter from './pages/applicantChapter/applicantPreneedDecisionLetter';
import applicantRelationshipToVeteran from './pages/applicantChapter/applicantRelationshipToVeteran';

// Deceased information chapter
import deceasedInformation from './pages/deceasedInformationChapter/deceasedInformation';
import deceasedInfo2 from './pages/deceasedInformationChapter/deceasedInfo2';
import demographicsInfo from './pages/deceasedInformationChapter/demographicsInfo';
import demographicsInfo2 from './pages/deceasedInformationChapter/demographicsInfo2';
import { deceasedServicePeriodsPages } from './pages/deceasedInformationChapter/deceasedServicePeriodsPages.jsx';

// Marital information chapter
import maritalStatus from './pages/maritalInformation/maritalStatus';
import spouseInformation from './pages/maritalInformation/spouseInformation';
import veteranStatus from './pages/maritalInformation/veteranStatus';
import veteranInformation from './pages/maritalInformation/veteranInformation';
import dependentChild from './pages/maritalInformation/dependentChild';

// Interment chapter
import currentlyBuried from './pages/interment/currentlyBuried';
import { burialBenefitsPagesVeteran } from './pages/interment/burialBenefitsPages.jsx';
import desiredCemetery from './pages/interment/desiredCemetery';
import intermentDetails from './pages/interment/intermentDetails';
import burialLocation from './pages/interment/burialLocation';
import greenBurialContainerType from './pages/interment/greenBurialContainerType';
import emblemOfBelief from './pages/interment/emblemOfBelief';
import emblemSelection from './pages/interment/emblemSelection';

// Funeral home chapter
import funeralHomeDetails from './pages/funeralHome/funeralHomeDetails.js';
import funeralHomeAddress from './pages/funeralHome/funeralHomeAddress.js';
import funeralHomeContact from './pages/funeralHome/funeralHomeContact.js';

// Federal law chapter
import federalLawDetails from './pages/federalLaw/federalLawDetails';

// Scheduling chapter
import schedulingInformation from './pages/scheduling/schedulingInformation';

// Supporting documents chapter
import supportingDocumentsInfo from './pages/supportingDocuments/supportingDocumentsInfo';
import {
  SupportingFilesDescription,
  fileUploadUi,
  timeOfNeedAttachments,
} from './pages/supportingDocuments/supportingDocuments';

// Add constant for green burial types
const GREEN_BURIAL_TYPES = ['intactGreen', 'cremainsGreen'];

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '40-xxxx-ToN-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_40_XXXX,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your burial benefits application (40-xxxx) is in progress.',
    //   expired: 'Your saved burial benefits application (40-xxxx) has expired. If you want to apply for burial benefits, please start a new application.',
    //   saved: 'Your burial benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  preSubmitInfo: {
    statementOfTruth: {
      // Using prefilled preparerName above so the name displays
      body:
        'I confirm, to the best of my knowledge, that the deceased has never committed a serious crime, such as murder or other offense that could have resulted in imprisonment for life, has never been convicted of a serious crime, and has never been convicted of a sexual offense for which the deceased was sentenced to a minimum of life imprisonment.',
      messageAriaDescribedby:
        'I confirm, to the best of my knowledge, that the deceased has never committed a serious crime, such as murder or other offense that could have resulted in imprisonment for life, has never been convicted of a serious crime, and has never been convicted of a sexual offense for which the deceased was sentenced to a minimum of life imprisonment.',
      fullNamePath: 'applicantName',
      checkboxLabel:
        'I confirm that the information above is correct and true to the best of my knowledge and belief',
    },
  },
  savedFormMessages: {
    notFound: 'Please start over to apply for burial benefits.',
    noAuth:
      'Please sign in again to continue your application for burial benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  getHelp: GetFormHelp,
  prefillTransformer: (formData /* , formConfig, user */) => {
    return {
      ...formData,
      // Ensure array exists for arrayBuilder
      currentlyBuriedPersons: formData.currentlyBuriedPersons || [],
    };
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        applicantDetails: {
          path: 'applicant-details',
          title: 'Your details',
          uiSchema: applicantDetails.uiSchema,
          schema: applicantDetails.schema,
        },
        applicantContact: {
          path: 'applicant-contact',
          title: 'Applicant’s contact information',
          uiSchema: applicantContact.uiSchema,
          schema: applicantContact.schema,
        },
        applicantAddress: {
          path: 'applicant-mailing-address',
          title: 'Your mailing address',
          uiSchema: applicantAddress.uiSchema,
          schema: applicantAddress.schema,
        },
        applicantWhoIsDeceased: {
          path: 'who-is-deceased',
          title: 'Who is the deceased?',
          uiSchema: applicantWhoIsDeceased.uiSchema,
          schema: applicantWhoIsDeceased.schema,
        },
        applicantPreneedDecisionLetter: {
          path: 'preneed-decision-letter',
          title: 'Pre-Need decision letter',
          uiSchema: applicantPreneedDecisionLetter.uiSchema,
          schema: applicantPreneedDecisionLetter.schema,
        },
        applicantRelationshipToVeteran: {
          path: 'relationship-to-veteran',
          title: 'Relationship to Veteran',
          uiSchema: applicantRelationshipToVeteran.uiSchema,
          schema: applicantRelationshipToVeteran.schema,
        },
      },
    },
    deceasedInformationChapter: {
      title: 'Deceased information',
      pages: {
        deceasedInformation: {
          path: 'deceased-information',
          title: 'Deceased information',
          uiSchema: deceasedInformation.uiSchema,
          schema: deceasedInformation.schema,
        },
        deceasedInfo2: {
          path: 'deceased-info-2',
          title: 'Deceased details',
          uiSchema: deceasedInfo2.uiSchema,
          schema: deceasedInfo2.schema,
        },
        demographicsInfo: {
          path: 'demographics-info',
          title: 'Demographics',
          uiSchema: demographicsInfo.uiSchema,
          schema: demographicsInfo.schema,
        },
        demographicsInfo2: {
          path: 'demographics-info-2',
          title: 'Demographics (continued)',
          uiSchema: demographicsInfo2.uiSchema,
          schema: demographicsInfo2.schema,
        },
        ...deceasedServicePeriodsPages,
        // mailingAddress: {
        //   path: 'mailing-address',
        //   title: 'Mailing address',
        //   uiSchema: mailingAddress.uiSchema,
        //   schema: mailingAddress.schema,
        // },
      },
    },
    // militaryHistory: {
    //   title: 'Military history',
    //   pages: {
    //     // deceasedMilitaryDetails: {
    //     //   path: 'deceased-military-details',
    //     //   title: 'Deceased’s military details',
    //     //   uiSchema: deceasedMilitaryDetails.uiSchema,
    //     //   schema: deceasedMilitaryDetails.schema,
    //     // },
    //     // Removed legacy deceasedServicePeriods single page
    //     // Spread new array builder pages:
    //     // ...deceasedServicePeriodsPages,
    //     deceasedName: {
    //       path: 'deceased-name',
    //       title: 'Deceased’s name',
    //       uiSchema: deceasedName.uiSchema,
    //       schema: deceasedName.schema,
    //     },
    //     deceasedPreviousName: {
    //       path: 'deceased-previous-name',
    //       title: 'Deceased’s previous name',
    //       uiSchema: deceasedPreviousName.uiSchema,
    //       schema: deceasedPreviousName.schema,
    //       depends: { servedUnderAnotherName: true },
    //     },
    //   },
    // },
    maritalInformation: {
      title: 'Marital information',
      pages: {
        maritalStatus: {
          path: 'marital-status',
          title: 'Marital status',
          uiSchema: maritalStatus.uiSchema,
          schema: maritalStatus.schema,
        },
        spouseInformation: {
          depends: formData => formData.isSpouseOfDeceased === 'yes',
          path: 'spouse',
          title: 'Your spouse information',
          uiSchema: spouseInformation.uiSchema,
          schema: spouseInformation.schema,
        },
        veteranStatus: {
          path: 'veteran-status',
          title: 'Your Veteran status',
          uiSchema: veteranStatus.uiSchema,
          schema: veteranStatus.schema,
        },
        veteranInformation: {
          depends: formData => formData.isVeteran === 'yes',
          path: 'veteran-information',
          title: 'Your veteran information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        dependentChild: {
          path: 'dependent-child',
          title: 'Dependent child',
          uiSchema: dependentChild.uiSchema,
          schema: dependentChild.schema,
        },
      },
    },
    interment: {
      title: 'Interment information',
      pages: {
        burialBenefitsInfo: {
          path: 'currently-buried',
          title: 'Currently buried',
          uiSchema: currentlyBuried.uiSchema,
          schema: currentlyBuried.schema,
        },
        // Stand-alone array builder pages (no conditional dependency)
        ...burialBenefitsPagesVeteran,
        desiredCemetery: {
          path: 'desired-cemetery',
          title: 'Desired cemetery for burial of deceased',
          uiSchema: desiredCemetery.uiSchema,
          schema: desiredCemetery.schema,
        },
        intermentDetails: {
          path: 'interment-details',
          title: 'Interment details',
          uiSchema: intermentDetails.uiSchema,
          schema: intermentDetails.schema,
        },
        burialLocation: {
          path: 'burial-location',
          title: 'Burial location',
          depends: formData =>
            formData?.burialType &&
            !GREEN_BURIAL_TYPES.includes(formData.burialType),
          uiSchema: burialLocation.uiSchema,
          schema: burialLocation.schema,
        },
        greenBurialContainerType: {
          path: 'green-burial-container-type',
          title: 'Interment details',
          depends: formData =>
            formData?.burialType &&
            GREEN_BURIAL_TYPES.includes(formData.burialType),
          uiSchema: greenBurialContainerType.uiSchema,
          schema: greenBurialContainerType.schema,
        },
        emblemOfBelief: {
          path: 'emblem-of-belief',
          title: 'Emblem of belief',
          uiSchema: emblemOfBelief.uiSchema,
          schema: emblemOfBelief.schema,
        },
        emblemSelection: {
          path: 'emblem-selection',
          title: 'Select emblem of belief',
          depends: formData => formData?.requestEmblemOfBelief === 'yes',
          uiSchema: emblemSelection.uiSchema,
          schema: emblemSelection.schema,
        },
      },
    },
    funeralHome: {
      title: 'Funeral home information',
      pages: {
        funeralHomeDetails: {
          path: 'funeral-home-details',
          title: 'Funeral home details',
          uiSchema: funeralHomeDetails.uiSchema,
          schema: funeralHomeDetails.schema,
        },
        funeralHomeAddress: {
          path: 'funeral-home-address',
          title: 'Funeral home address',
          uiSchema: funeralHomeAddress.uiSchema,
          schema: funeralHomeAddress.schema,
        },
        funeralHomeContact: {
          path: 'funeral-home-contact',
          title: 'Funeral home contact information',
          uiSchema: funeralHomeContact.uiSchema,
          schema: funeralHomeContact.schema,
        },
      },
    },
    federalLaw: {
      title: 'Federal law',
      pages: {
        federalLawDetails: {
          path: 'federal-law-details',
          title: 'Federal law details',
          uiSchema: federalLawDetails.uiSchema,
          schema: federalLawDetails.schema,
        },
      },
    },
    scheduling: {
      title: 'Scheduling',
      pages: {
        schedulingInformation: {
          path: 'scheduling-information',
          title: 'Scheduling information',
          uiSchema: schedulingInformation.uiSchema,
          schema: schedulingInformation.schema,
        },
      },
    },
    supportingDocuments: {
      title: 'Supporting documents',
      pages: {
        supportingDocumentsInfo: {
          path: 'supporting-documents-info',
          title: 'Supporting documents',
          uiSchema: supportingDocumentsInfo.uiSchema,
          schema: supportingDocumentsInfo.schema,
        },
        supportingDocuments: {
          path: 'supporting-documents',
          title: 'Supporting documents',
          uiSchema: {
            'ui:description': SupportingFilesDescription,
            attachments: fileUploadUi(),
          },
          schema: {
            type: 'object',
            properties: {
              attachments: timeOfNeedAttachments,
            },
          },
        },
      },
    },
    // preparerInformation: {
    //   title: 'Preparer information',
    //   pages: {
    //     preparerName: {
    //       path: 'preparer-name',
    //       title: 'Preparer’s name',
    //       uiSchema: preparerName.uiSchema,
    //       schema: preparerName.schema,
    //     },
    //     preparerContact: {
    //       path: 'preparer-contact',
    //       title: 'Preparer’s contact information',
    //       uiSchema: preparerContact.uiSchema,
    //       schema: preparerContact.schema,
    //     },
    //   },
    // },
  },
  transformForSubmit: form => {
    const data = { ...form.data };
    if (!data.preparerName && data.firstName && data.lastName) {
      data.preparerName = { first: data.firstName, last: data.lastName };
    }
    if (
      data.containerType &&
      (!data.burialType ||
        !['intactGreen', 'cremainsGreen'].includes(data.burialType))
    ) {
      delete data.containerType;
    }
    return JSON.stringify({
      formId: form.formId,
      metadata: form.metadata,
      data,
    });
  },
  footerContent,
};

export default formConfig;
