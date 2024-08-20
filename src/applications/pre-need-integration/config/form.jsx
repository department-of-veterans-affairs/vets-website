import React from 'react';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import environment from 'platform/utilities/environment';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { fileUploadUi } from '../utils/upload';
// import * as applicantMilitaryHistorySelf from './pages/applicantMilitaryHistorySelf';
// import * as applicantMilitaryHistoryPreparer from './pages/applicantMilitaryHistoryPreparer';
// import * as applicantMilitaryName from './pages/applicantMilitaryName';
// import * as applicantMilitaryNameInformation from './pages/applicantMilitaryNameInformation';
// import * as applicantMilitaryNameInformationPreparer from './pages/applicantMilitaryNameInformationPreparer';
// import * as sponsorMilitaryHistory from './pages/sponsorMilitaryHistory';
// import * as sponsorMilitaryName from './pages/sponsorMilitaryName';
// import * as sponsorMilitaryNameInformation from './pages/sponsorMilitaryNameInformation';
import * as burialBenefits from './pages/burialBenefits';
import * as isSponsor from './pages/isSponsor';
import * as sponsorDetails from './pages/sponsorDetails';
import * as sponsorContactInformation from './pages/sponsorContactInformation';
import * as sponsorDemographics from './pages/sponsorDemographics';
import * as sponsorDeceased from './pages/sponsorDeceased';
import * as sponsorDateOfDeath from './pages/sponsorDateOfDeath';
import * as sponsorRace from './pages/sponsorRace';
// import * as sponsorMilitaryDetailsSelf from './pages/sponsorMilitaryDetailsSelf';
// import * as sponsorMilitaryDetailsPreparer from './pages/sponsorMilitaryDetailsPreparer';
import * as applicantRelationshipToVet from './pages/applicantRelationshipToVet';
import * as veteranApplicantDetails from './pages/veteranApplicantDetails';
import * as veteranApplicantDetailsPreparer from './pages/veteranApplicantDetailsPreparer';
import * as nonVeteranApplicantDetails from './pages/nonVeteranApplicantDetails';
import * as nonVeteranApplicantDetailsPreparer from './pages/nonVeteranApplicantDetailsPreparer';
import * as applicantContactInformation from './pages/applicantContactInformation';
import * as preparer from './pages/preparer';
import * as preparerDetails from './pages/preparerDetails';
import * as preparerContactDetails from './pages/preparerContactDetails';
import * as applicantDemographics from './pages/applicantDemographics';
import * as applicantDemographics2 from './pages/applicantDemographics2';
import * as applicantDemographics2Preparer from './pages/applicantDemographics2Preparer';
// import * as militaryDetailsSelf from './pages/militaryDetailsSelf';
// import * as militaryDetailsPreparer from './pages/militaryDetailsPreparer';
import * as currentlyBuriedPersons from './pages/currentlyBuriedPersons';
import * as burialCemetery from './pages/burialCemetery';
import { servicePeriodsPages } from './pages/servicePeriodsPages';

import Footer from '../components/Footer';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../components/GetFormHelp';
import ErrorText from '../components/ErrorText';
import SubmissionError from '../components/SubmissionError';

import manifest from '../manifest.json';

import {
  isVeteran,
  isAuthorizedAgent,
  transform,
  // isVeteranAndHasServiceName,
  // isNotVeteranAndHasServiceName,
  buriedWSponsorsEligibility,
  relationshipToVetTitle,
  relationshipToVetPreparerTitle,
  relationshipToVetDescription,
  relationshipToVetPreparerDescription,
  relationshipToVetOptions,
  relationshipToVetPreparerOptions,
  veteranApplicantDetailsSubHeader,
  veteranApplicantDetailsPreparerSubHeader,
  veteranApplicantDetailsPreparerDescription,
  nonPreparerFullMaidenNameUI,
  preparerFullMaidenNameUI,
  ssnDashesUI,
  preparerSsnDashesUI,
  nonPreparerDateOfBirthUI,
  preparerDateOfBirthUI,
  applicantContactInfoAddressTitle,
  applicantContactInfoPreparerAddressTitle,
  applicantContactInfoSubheader,
  applicantContactInfoPreparerSubheader,
  applicantContactInfoDescription,
  applicantContactInfoPreparerDescription,
  applicantDetailsCityTitle,
  applicantDetailsStateTitle,
  applicantDetailsPreparerCityTitle,
  applicantDetailsPreparerStateTitle,
  applicantDemographicsSubHeader,
  applicantDemographicsPreparerSubHeader,
  applicantDemographicsGenderTitle,
  applicantDemographicsMaritalStatusTitle,
  applicantDemographicsPreparerGenderTitle,
  applicantDemographicsPreparerMaritalStatusTitle,
  isSponsorDeceased,
  nonVeteranApplicantDetailsSubHeader,
  nonVeteranApplicantDetailsDescription,
  nonVeteranApplicantDetailsDescriptionPreparer,
  isApplicantTheSponsor,
} from '../utils/helpers';
import SupportingFilesDescription from '../components/SupportingFilesDescription';
import {
  ContactDetailsTitle,
  PreparerDetailsTitle,
} from '../components/PreparerHelpers';
import preparerContactDetailsCustom from './pages/preparerContactDetailsCustom';

const {
  preneedAttachments,
} = fullSchemaPreNeed.properties.application.properties;

const {
  fullName,
  ssn,
  date,
  dateRange,
  gender,
  email,
  phone,
  files,
  centralMailVaFile,
  race,
  ethnicity,
} = fullSchemaPreNeed.definitions;

/** @type {FormConfig} */
const formConfig = {
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/preneeds/burial_forms`,
  trackingPrefix: 'preneed-',
  transformForSubmit: transform,
  formId: VA_FORM_IDS.FORM_40_10007,
  saveInProgress: {
    messages: {
      inProgress:
        'Your pre-need determination of eligibility in a VA national cemetery application is in progress.',
      // TODO: Fix the expired message
      expired:
        'Your saved pre-need determination of eligibility in a VA national cemetery application has expired. If you want to apply for pre-need determination of eligibility in a VA national cemetery, please start a new application.',
      saved:
        'Your pre-need determination of eligibility in a VA national cemetery application has been saved.',
    },
  },
  prefillEnabled: true,
  verifyRequiredPrefill: false,
  version: 0,
  savedFormMessages: {
    notFound: 'Please start over to apply for pre-need eligibility.',
    noAuth:
      'Please sign in again to resume your application for pre-need eligibility.',
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  title: 'Apply for pre-need eligibility determination',
  subTitle: 'Form 40-10007',
  preSubmitInfo,
  footerContent: ({ currentLocation }) => (
    <Footer formConfig={formConfig} currentLocation={currentLocation} />
  ),
  getHelp: GetFormHelp,
  errorText: ErrorText,
  submissionError: SubmissionError,
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    gender,
    race,
    email,
    phone,
    files,
    centralMailVaFile,
    ethnicity,
  },
  chapters: {
    preparerInformation: {
      title: 'Preparer information',
      pages: {
        preparer: {
          path: 'preparer',
          uiSchema: preparer.uiSchema,
          schema: preparer.schema,
        },
        preparerDetails: {
          title: PreparerDetailsTitle,
          path: 'preparer-details',
          depends: formData => isAuthorizedAgent(formData),
          uiSchema: preparerDetails.uiSchema,
          schema: preparerDetails.schema,
        },
        preparerContactDetails: {
          title: ContactDetailsTitle,
          path: 'preparer-contact-details',
          depends: formData => isAuthorizedAgent(formData),
          uiSchema: preparerContactDetails.uiSchema,
          schema: preparerContactDetails.schema,
        },
        validatePreparerContactDetails: {
          title: 'Validate Address',
          path: 'validate-preparer-contact-details',
          depends: formData => isAuthorizedAgent(formData),
          uiSchema: {
            application: {
              applicant: {
                'view:validateAddress': {
                  'ui:title': 'Validate Address',
                  'ui:field': preparerContactDetailsCustom,
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                properties: {
                  applicant: {
                    type: 'object',
                    properties: {
                      'view:validateAddress': {
                        type: 'object',
                        properties: {},
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        applicantRelationshipToVet: {
          path: 'applicant-relationship-to-vet',
          depends: formData => !isAuthorizedAgent(formData),
          uiSchema: applicantRelationshipToVet.uiSchema(
            relationshipToVetDescription,
            relationshipToVetTitle,
            relationshipToVetOptions,
          ),
          schema: applicantRelationshipToVet.schema,
        },
        applicantRelationshipToVetPreparer: {
          path: 'applicant-relationship-to-vet-preparer',
          depends: formData => isAuthorizedAgent(formData),
          uiSchema: applicantRelationshipToVet.uiSchema(
            relationshipToVetPreparerDescription,
            relationshipToVetPreparerTitle,
            relationshipToVetPreparerOptions,
          ),
          schema: applicantRelationshipToVet.schema,
        },
        veteranApplicantDetails: {
          title: 'Your details',
          path: 'veteran-applicant-details',
          depends: formData =>
            !isAuthorizedAgent(formData) && isVeteran(formData),
          uiSchema: veteranApplicantDetails.uiSchema(
            veteranApplicantDetailsSubHeader,
            '',
            nonPreparerFullMaidenNameUI,
            ssnDashesUI,
            nonPreparerDateOfBirthUI,
            applicantDetailsCityTitle,
            applicantDetailsStateTitle,
          ),
          schema: veteranApplicantDetails.schema,
        },
        veteranApplicantDetailsPreparer: {
          title: 'Applicant details',
          path: 'veteran-applicant-details-preparer',
          depends: formData =>
            isAuthorizedAgent(formData) && isVeteran(formData),
          uiSchema: veteranApplicantDetailsPreparer.uiSchema(
            veteranApplicantDetailsPreparerSubHeader,
            veteranApplicantDetailsPreparerDescription,
            preparerFullMaidenNameUI,
            preparerSsnDashesUI,
            preparerDateOfBirthUI,
            applicantDetailsPreparerCityTitle,
            applicantDetailsPreparerStateTitle,
          ),
          schema: veteranApplicantDetailsPreparer.schema,
        },
        nonVeteranApplicantDetails: {
          title: 'Your details',
          path: 'nonVeteran-applicant-details',
          depends: formData =>
            !isAuthorizedAgent(formData) && !isVeteran(formData),
          uiSchema: nonVeteranApplicantDetails.uiSchema(
            nonVeteranApplicantDetailsSubHeader,
            nonVeteranApplicantDetailsDescription,
            nonPreparerFullMaidenNameUI,
            ssnDashesUI,
            nonPreparerDateOfBirthUI,
          ),
          schema: nonVeteranApplicantDetails.schema,
        },
        nonVeteranApplicantDetailsPreparer: {
          title: 'Applicant details',
          path: 'nonVeteran-applicant-details-preparer',
          depends: formData =>
            isAuthorizedAgent(formData) && !isVeteran(formData),
          uiSchema: nonVeteranApplicantDetailsPreparer.uiSchema(
            veteranApplicantDetailsPreparerSubHeader,
            nonVeteranApplicantDetailsDescriptionPreparer,
            preparerFullMaidenNameUI,
            preparerSsnDashesUI,
            preparerDateOfBirthUI,
          ),
          schema: nonVeteranApplicantDetailsPreparer.schema,
        },
        applicantContactInformation: {
          title: applicantContactInfoAddressTitle,
          path: 'applicant-contact-information',
          depends: formData => !isAuthorizedAgent(formData),
          uiSchema: applicantContactInformation.uiSchema(
            applicantContactInfoAddressTitle,
            applicantContactInfoSubheader,
            applicantContactInfoDescription,
          ),
          schema: applicantContactInformation.schema,
        },
        applicantContactInformationPreparer: {
          title: applicantContactInfoPreparerAddressTitle,
          path: 'applicant-contact-information-preparer',
          depends: formData => isAuthorizedAgent(formData),
          uiSchema: applicantContactInformation.uiSchema(
            applicantContactInfoPreparerAddressTitle,
            applicantContactInfoPreparerSubheader,
            applicantContactInfoPreparerDescription,
          ),
          schema: applicantContactInformation.schema,
        },
        applicantDemographics: {
          title: 'Your demographics',
          path: 'applicant-demographics',
          depends: formData =>
            !isAuthorizedAgent(formData) && isVeteran(formData),
          uiSchema: applicantDemographics.uiSchema(
            applicantDemographicsSubHeader,
            applicantDemographicsGenderTitle,
            applicantDemographicsMaritalStatusTitle,
          ),
          schema: applicantDemographics.schema,
        },
        applicantDemographicsPreparer: {
          title: 'Applicant demographics',
          path: 'applicant-demographics-preparer',
          depends: formData =>
            isAuthorizedAgent(formData) && isVeteran(formData),
          uiSchema: applicantDemographics.uiSchema(
            applicantDemographicsPreparerSubHeader,
            applicantDemographicsPreparerGenderTitle,
            applicantDemographicsPreparerMaritalStatusTitle,
          ),
          schema: applicantDemographics.schema,
        },
        applicantDemographics2: {
          path: 'applicant-demographics-2',
          depends: formData =>
            !isAuthorizedAgent(formData) && isVeteran(formData),
          uiSchema: applicantDemographics2.uiSchema,
          schema: applicantDemographics2.schema,
        },
        applicantDemographics2Preparer: {
          path: 'applicant-demographics-2-preparer',
          depends: formData =>
            isAuthorizedAgent(formData) && isVeteran(formData),
          uiSchema: applicantDemographics2Preparer.uiSchema,
          schema: applicantDemographics2Preparer.schema,
        },
      },
    },
    sponsorInformation: {
      title: 'Sponsor information',
      pages: {
        isSponsor: {
          path: 'is-sponsor',
          depends: formData =>
            isAuthorizedAgent(formData) && !isVeteran(formData),
          uiSchema: isSponsor.uiSchema,
          schema: isSponsor.schema,
        },
        sponsorDetails: {
          title: 'Sponsor details',
          path: 'sponsor-details',
          depends: formData => !isVeteran(formData),
          uiSchema: sponsorDetails.uiSchema,
          schema: sponsorDetails.schema,
        },
        sponsorDeceased: {
          path: 'sponsor-deceased',
          depends: formData =>
            !isVeteran(formData) && !isApplicantTheSponsor(formData),
          uiSchema: sponsorDeceased.uiSchema,
          schema: sponsorDeceased.schema,
        },
        sponsorDateOfDeath: {
          path: 'sponsor-date-of-death',
          depends: formData =>
            !isVeteran(formData) &&
            !isApplicantTheSponsor(formData) &&
            isSponsorDeceased(formData),
          uiSchema: sponsorDateOfDeath.uiSchema,
          schema: sponsorDateOfDeath.schema,
        },
        sponsorContactInformation: {
          title: 'Sponsor’s mailing address',
          path: 'sponsor-contact-information',
          depends: formData =>
            !isVeteran(formData) &&
            ((!isApplicantTheSponsor(formData) &&
              !isSponsorDeceased(formData)) ||
              isApplicantTheSponsor(formData)),
          uiSchema: sponsorContactInformation.uiSchema,
          schema: sponsorContactInformation.schema,
        },
        sponsorDemographics: {
          title: 'Sponsor demographics',
          path: 'sponsor-demographics',
          depends: formData => !isVeteran(formData),
          uiSchema: sponsorDemographics.uiSchema,
          schema: sponsorDemographics.schema,
        },
        sponsorRace: {
          path: 'sponsor-race',
          depends: formData => !isVeteran(formData),
          uiSchema: sponsorRace.uiSchema,
          schema: sponsorRace.schema,
        },
      },
    },
    militaryHistory: {
      title: formData =>
        isVeteran(formData)
          ? 'Applicant military history'
          : 'Sponsor military history',
      // pages: {
      //   militaryDetailsSelf: {
      //     path: 'military-details-self',
      //     title: 'Military details',
      //     depends: formData =>
      //       isVeteran(formData) && !isAuthorizedAgent(formData),
      //     uiSchema: militaryDetailsSelf.uiSchema,
      //     schema: militaryDetailsSelf.schema,
      //   },
      //   militaryDetailsPreparer: {
      //     path: 'military-details-preparer',
      //     title: 'Military details',
      //     depends: formData =>
      //       isVeteran(formData) && isAuthorizedAgent(formData),
      //     uiSchema: militaryDetailsPreparer.uiSchema,
      //     schema: militaryDetailsPreparer.schema,
      //   },
      //   // Two sets of military history pages dependent on
      //   // whether the applicant is the veteran or not.
      //   // If not, "Sponsor’s" precedes all the field labels.
      //   applicantMilitaryHistorySelf: {
      //     title: 'Your service period(s)',
      //     path: 'applicant-military-history',
      //     depends: formData =>
      //       isVeteran(formData) && !isAuthorizedAgent(formData),
      //     uiSchema: applicantMilitaryHistorySelf.uiSchema,
      //     schema: applicantMilitaryHistorySelf.schema,
      //   },
      //   applicantMilitaryHistoryPreparer: {
      //     title: "Applicant's service period(s)",
      //     path: 'applicant-military-history-preparer',
      //     depends: formData =>
      //       isVeteran(formData) && isAuthorizedAgent(formData),
      //     uiSchema: applicantMilitaryHistoryPreparer.uiSchema,
      //     schema: applicantMilitaryHistoryPreparer.schema,
      //   },
      //   applicantMilitaryNameSelf: {
      //     path: 'applicant-military-name',
      //     depends: formData =>
      //       isVeteran(formData) && !isAuthorizedAgent(formData),
      //     uiSchema: applicantMilitaryName.uiSchema(
      //       'Did you serve under another name?',
      //     ),
      //     schema: applicantMilitaryName.schema,
      //   },
      //   applicantMilitaryNamePreparer: {
      //     path: 'applicant-military-name-preparer',
      //     depends: formData =>
      //       isVeteran(formData) && isAuthorizedAgent(formData),
      //     uiSchema: applicantMilitaryName.uiSchema(
      //       'Did the applicant serve under another name?',
      //     ),
      //     schema: applicantMilitaryName.schema,
      //   },
      //   applicantMilitaryNameInformation: {
      //     title: 'Previous name',
      //     path: 'applicant-military-name-information',
      //     depends: formData =>
      //       isVeteranAndHasServiceName(formData) &&
      //       !isAuthorizedAgent(formData),
      //     uiSchema: applicantMilitaryNameInformation.uiSchema,
      //     schema: applicantMilitaryNameInformation.schema,
      //   },
      //   applicantMilitaryNameInformationPreparer: {
      //     title: 'Previous name',
      //     path: 'applicant-military-name-information-preparer',
      //     depends: formData =>
      //       isVeteranAndHasServiceName(formData) && isAuthorizedAgent(formData),
      //     uiSchema: applicantMilitaryNameInformationPreparer.uiSchema,
      //     schema: applicantMilitaryNameInformationPreparer.schema,
      //   },
      //   sponsorMilitaryDetailsSelf: {
      //     title: "Sponsor's military details",
      //     path: 'sponsor-military-details',
      //     depends: formData =>
      //       !isVeteran(formData) && !isAuthorizedAgent(formData),
      //     uiSchema: sponsorMilitaryDetailsSelf.uiSchema,
      //     schema: sponsorMilitaryDetailsSelf.schema,
      //   },
      //   sponsorMilitaryDetailsPreparer: {
      //     title: "Sponsor's military details",
      //     path: 'sponsor-military-details-preparer',
      //     depends: formData =>
      //       !isVeteran(formData) && isAuthorizedAgent(formData),
      //     uiSchema: sponsorMilitaryDetailsPreparer.uiSchema,
      //     schema: sponsorMilitaryDetailsPreparer.schema,
      //   },
      //   sponsorMilitaryHistory: {
      //     path: 'sponsor-military-history',
      //     title: 'Sponsor’s service period(s)',
      //     depends: formData => !isVeteran(formData),
      //     uiSchema: sponsorMilitaryHistory.uiSchema,
      //     schema: sponsorMilitaryHistory.schema,
      //   },
      //   sponsorMilitaryName: {
      //     path: 'sponsor-military-name',
      //     depends: formData =>
      //       !isVeteran(formData) && isAuthorizedAgent(formData),
      //     uiSchema: sponsorMilitaryName.uiSchema(
      //       'Did the sponsor serve under another name?',
      //     ),
      //     schema: sponsorMilitaryName.schema,
      //   },
      //   sponsorMilitaryNameSelf: {
      //     path: 'sponsor-military-name-self',
      //     depends: formData =>
      //       !isVeteran(formData) && !isAuthorizedAgent(formData),
      //     uiSchema: sponsorMilitaryName.uiSchema(
      //       'Did your sponsor serve under another name?',
      //     ),
      //     schema: sponsorMilitaryName.schema,
      //   },
      //   sponsorMilitaryNameInformation: {
      //     title: 'Sponsor’s previous name',
      //     path: 'sponsor-military-name-information',
      //     depends: formData => isNotVeteranAndHasServiceName(formData),
      //     uiSchema: sponsorMilitaryNameInformation.uiSchema,
      //     schema: sponsorMilitaryNameInformation.schema,
      //   },
      // },
      pages: servicePeriodsPages,
    },
    burialBenefits: {
      title: 'Burial benefits',
      pages: {
        burialBenefits: {
          path: 'burial-benefits',
          uiSchema: burialBenefits.uiSchema,
          schema: burialBenefits.schema,
        },
        currentlyBuriedPersons: {
          path: 'current-burial-benefits',
          depends: formData => buriedWSponsorsEligibility(formData),
          editModeOnReviewPage: true,
          uiSchema: currentlyBuriedPersons.uiSchema,
          schema: currentlyBuriedPersons.schema,
        },
        burialCemetery: {
          path: 'burial-cemetery',
          uiSchema: burialCemetery.uiSchema,
          schema: burialCemetery.schema,
        },
      },
    },
    supportingDocuments: {
      title: 'Supporting files',
      pages: {
        supportingDocuments: {
          title: 'Upload supporting files',
          path: 'supporting-documents',
          editModeOnReviewPage: false,
          uiSchema: {
            'ui:description': SupportingFilesDescription,
            application: {
              preneedAttachments: fileUploadUi({}),
            },
          },
          schema: {
            type: 'object',
            properties: {
              application: {
                type: 'object',
                properties: {
                  preneedAttachments,
                },
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
