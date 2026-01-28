import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { TITLE, SUBTITLE } from '../constants';

import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import authorizingOfficialName from '../pages/authorizingOfficialName';
import whatToExpect from '../pages/whatToExpect';
import acknowledgement1 from '../pages/acknowledgement1';
import acknowledgement2 from '../pages/acknowledgement2';
import acknowledgement3 from '../pages/acknowledgement3';
import acknowledgement4 from '../pages/acknowledgement4';
import acknowledgement5 from '../pages/acknowledgement5';
import hasVaFacilityCode from '../pages/hasVaFacilityCode';
import primaryInstitutionDetails from '../pages/primaryInstitutionDetails';
import primaryInstitutionType from '../pages/primaryInstitutionType';
import primaryInstitutionNameAndMailingAddress from '../pages/primaryInstitutionNameAndMailingAddress';
import primaryInstitutionPhysicalAddress from '../pages/primaryInstitutionPhysicalAddress';
import primaryInstitutionReview from '../pages/primaryInstitutionReview';
import additionalInstitutionsSummaryWithCode from '../pages/additionalInstitutionsSummaryWithCode';
import additionalInstitutionsItemWithCode from '../pages/additionalInstitutionsItemWithCode';
import additionalInstitutionsSummaryWithoutCode from '../pages/additionalInstitutionsSummaryWithoutCode';
import additionalInstitutionsItemWithoutCode from '../pages/additionalInstitutionsItemWithoutCode';
import primaryInstitutionWebsite from '../pages/primaryInstitutionWebsite';
import submissionReasons from '../pages/submissionReasons';
import submissionReasonUpdateInformationText from '../pages/submissionReasonUpdateInformationText';
import submissionReasonOtherText from '../pages/submissionReasonOtherText';
import primaryInstitutionIHL from '../pages/primaryInstitutionIHL';
import primaryInstitutionTitle4 from '../pages/primaryInstitutionTitle4';

import programInformationIntro from '../pages/programInformationIntro';
import programInformationSummary from '../pages/programInformationSummary';
import programInformationDetails from '../pages/programInformationDetails';

import isMedicalSchool from '../pages/isMedicalSchool';
import medicalAuthorityName from '../pages/medicalAuthorityName';
import medical32MonthProgram from '../pages/medical32MonthProgram';
import medicalHasGraduatingClass from '../pages/medicalHasGraduatingClass';
import medicalGraduatingClassDetails from '../pages/medicalGraduatingClassDetails';

import institutionContactsInstructions from '../pages/institutionContactsInstructions';
import institutionFinancialRepresentative from '../pages/institutionFinancialRepresentative';
import institutionCertifyingOfficial from '../pages/institutionCertifyingOfficial';

import {
  additionalInstitutionsWithCodeArrayOptions,
  additionalInstitutionsWithoutCodeArrayOptions,
  programInformationArrayOptions,
} from '../helpers';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-0976-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  formId: '22-0976',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your Approval of a Program in a Foreign Country application (22-0976) is in progress.',
    //   expired: 'Your saved Approval of a Program in a Foreign Country application (22-0976) has expired. If you want to apply for Approval of a Program in a Foreign Country, please start a new application.',
    //   saved: 'Your Approval of a Program in a Foreign Country application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for Approval of a Program in a Foreign Country.',
    noAuth:
      'Please sign in again to continue your application for Approval of a Program in a Foreign Country.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  useCustomScrollAndFocus: true,
  chapters: {
    authorizingOfficialAndAcknowledgements: {
      title: 'Authorizing official details and acknowledgements',
      pages: {
        authorizingOfficialName: {
          path: 'authorizing-official-name',
          title: 'Authorizing official name',
          uiSchema: authorizingOfficialName.uiSchema,
          schema: authorizingOfficialName.schema,
        },
        whatToExpect: {
          path: 'what-to-expect',
          title: 'What to expect',
          uiSchema: whatToExpect.uiSchema,
          schema: whatToExpect.schema,
        },
        acknowledgement1: {
          path: 'acknowledgement-1',
          title: 'Acknowledgement 1',
          uiSchema: acknowledgement1.uiSchema,
          schema: acknowledgement1.schema,
        },
        acknowledgement2: {
          path: 'acknowledgement-2',
          title: 'Acknowledgement 2',
          uiSchema: acknowledgement2.uiSchema,
          schema: acknowledgement2.schema,
        },
        acknowledgement3: {
          path: 'acknowledgement-3',
          title: 'Acknowledgement 3',
          uiSchema: acknowledgement3.uiSchema,
          schema: acknowledgement3.schema,
        },
        acknowledgement4: {
          path: 'acknowledgement-4',
          title: 'Acknowledgement 4',
          uiSchema: acknowledgement4.uiSchema,
          schema: acknowledgement4.schema,
        },
        acknowledgement5: {
          path: 'acknowledgement-5',
          title: 'Acknowledgement 5',
          uiSchema: acknowledgement5.uiSchema,
          schema: acknowledgement5.schema,
        },
      },
    },
    institutionDetails: {
      title: 'Institution details',
      pages: {
        hasVaFacilityCode: {
          path: 'primary-institution-details',
          title: 'Has VA facility code',
          uiSchema: hasVaFacilityCode.uiSchema,
          schema: hasVaFacilityCode.schema,
        },
        primaryInstitutionDetails: {
          path: 'primary-institution-details-1',
          title: 'Primary institution details',
          uiSchema: primaryInstitutionDetails.uiSchema,
          schema: primaryInstitutionDetails.schema,
          depends: formData => !!formData?.hasVaFacilityCode,
        },
        primaryInstitutionType: {
          path: 'primary-institution-details-2',
          title: 'Primary institution type',
          uiSchema: primaryInstitutionType.uiSchema,
          schema: primaryInstitutionType.schema,
          depends: formData => !formData?.hasVaFacilityCode,
        },
        primaryInstitutionNameAndMailingAddress: {
          path: 'primary-institution-details-3',
          title: 'Primary institution name and mailing address',
          uiSchema: primaryInstitutionNameAndMailingAddress.uiSchema,
          schema: primaryInstitutionNameAndMailingAddress.schema,
          depends: formData => !formData?.hasVaFacilityCode,
        },
        primaryInstitutionPhysicalAddress: {
          path: 'primary-institution-details-4',
          title: 'Primary institution physical address',
          uiSchema: primaryInstitutionPhysicalAddress.uiSchema,
          schema: primaryInstitutionPhysicalAddress.schema,
          depends: formData =>
            !formData?.hasVaFacilityCode &&
            !!formData?.primaryInstitutionDetails?.differentPhysicalAddress,
        },
        primaryInstitutionReview: {
          path: 'primary-institution-details-5',
          title: 'Primary institution review',
          uiSchema: primaryInstitutionReview.uiSchema,
          schema: primaryInstitutionReview.schema,
          depends: formData => !formData?.hasVaFacilityCode,
        },
        ...arrayBuilderPages(
          additionalInstitutionsWithCodeArrayOptions,
          pageBuilder => ({
            additionalInstitutionsSummaryWithCode: pageBuilder.summaryPage({
              path: 'additional-institutions-facility-code',
              title: 'Additional institution details',
              uiSchema: additionalInstitutionsSummaryWithCode.uiSchema,
              schema: additionalInstitutionsSummaryWithCode.schema,
              depends: formData => !!formData?.hasVaFacilityCode,
            }),
            additionalInstitutionsItemWithCode: pageBuilder.itemPage({
              path: 'additional-institution-facility-code/:index',
              title:
                "Enter the VA facility code for the additional location you'd like to add",
              showPagePerItem: true,
              uiSchema: additionalInstitutionsItemWithCode.uiSchema,
              schema: additionalInstitutionsItemWithCode.schema,
              initialData: { additionalInstitutions: [] },
              depends: formData => !!formData?.hasVaFacilityCode,
            }),
          }),
        ),
        ...arrayBuilderPages(
          additionalInstitutionsWithoutCodeArrayOptions,
          pageBuilder => ({
            additionalInstitutionsSummaryWithoutCode: pageBuilder.summaryPage({
              path: 'additional-institutions-without-code',
              title: 'Additional institution details',
              uiSchema: additionalInstitutionsSummaryWithoutCode.uiSchema,
              schema: additionalInstitutionsSummaryWithoutCode.schema,
              depends: formData => !formData?.hasVaFacilityCode,
            }),
            additionalInstitutionsItemWithoutCode: pageBuilder.itemPage({
              path: 'additional-institution-without-code/:index',
              title:
                "Enter the VA facility code for the additional location you'd like to add",
              showPagePerItem: true,
              uiSchema: additionalInstitutionsItemWithoutCode.uiSchema,
              schema: additionalInstitutionsItemWithoutCode.schema,
              initialData: { additionalInstitutions: [] },
              depends: formData => !formData?.hasVaFacilityCode,
            }),
          }),
        ),
        primaryInstitutionWebsite: {
          path: 'primary-institution-website',
          title: 'Primary institution website',
          uiSchema: primaryInstitutionWebsite.uiSchema,
          schema: primaryInstitutionWebsite.schema,
        },
        submissionReasons: {
          path: 'submission-reasons',
          title: 'Submission reasons',
          uiSchema: submissionReasons.uiSchema,
          schema: submissionReasons.schema,
        },
        submissionReasonUpdateInformationText: {
          path: 'submission-reason-update-text',
          title: 'Submission reason update text',
          uiSchema: submissionReasonUpdateInformationText.uiSchema,
          schema: submissionReasonUpdateInformationText.schema,
          depends: formData =>
            formData?.submissionReasons?.updateInformation === true,
        },
        submissionReasonOtherText: {
          path: 'submission-reasons-other text',
          title: 'Submission reason other text',
          uiSchema: submissionReasonOtherText.uiSchema,
          schema: submissionReasonOtherText.schema,
          depends: formData => formData?.submissionReasons?.other === true,
        },
        primaryInstitutionIHL: {
          path: 'primary-institution-ihl',
          title: 'Primary institution IHL',
          uiSchema: primaryInstitutionIHL.uiSchema,
          schema: primaryInstitutionIHL.schema,
        },
        primaryInstitutionTitle4: {
          path: 'primary-institution-title-4',
          title: 'Primary institution title 4',
          uiSchema: primaryInstitutionTitle4.uiSchema,
          schema: primaryInstitutionTitle4.schema,
        },
      },
    },
    programInformation: {
      title: 'Program Information',
      pages: {
        ...arrayBuilderPages(programInformationArrayOptions, pageBuilder => ({
          programInformationIntro: pageBuilder.introPage({
            path: 'program-information',
            title: 'Program information',
            uiSchema: programInformationIntro.uiSchema,
            schema: programInformationIntro.schema,
          }),
          programInformationSummary: pageBuilder.summaryPage({
            path: 'program-information-summary',
            title: 'Program information summary',
            uiSchema: programInformationSummary.uiSchema,
            schema: programInformationSummary.schema,
          }),
          programInformationDetails: pageBuilder.itemPage({
            path: 'program-information-details/:index',
            title: 'Program information details',
            showPagePerItem: true,
            uiSchema: programInformationDetails.uiSchema,
            schema: programInformationDetails.schema,
          }),
        })),
        isMedicalSchool: {
          path: 'is-medical-school',
          title: 'Medical school information',
          uiSchema: isMedicalSchool.uiSchema,
          schema: isMedicalSchool.schema,
        },
        medicalAuthorityName: {
          path: 'medical-authority-name',
          title: 'Medical authority name',
          uiSchema: medicalAuthorityName.uiSchema,
          schema: medicalAuthorityName.schema,
          depends: formData => formData?.isMedicalSchool === true,
        },
        medical32MonthProgram: {
          path: 'medical-32-month-program',
          title: 'Medical 32 month program',
          uiSchema: medical32MonthProgram.uiSchema,
          schema: medical32MonthProgram.schema,
          depends: formData => formData?.isMedicalSchool === true,
        },
        medicalHasGraduatingClass: {
          path: 'medical-graduating-class',
          title: 'Medical graduation class',
          uiSchema: medicalHasGraduatingClass.uiSchema,
          schema: medicalHasGraduatingClass.schema,
          depends: formData => formData?.isMedicalSchool === true,
        },
        medicalGraduatingClassDetails: {
          path: 'medical-graduating-class-details',
          title: 'Medical graduation class details',
          uiSchema: medicalGraduatingClassDetails.uiSchema,
          schema: medicalGraduatingClassDetails.schema,
          depends: formData =>
            formData?.isMedicalSchool === true &&
            formData?.graduatedLast12Months === true,
        },
      },
    },
    institutionContacts: {
      title: 'Institution contacts and faculty details',
      pages: {
        contactsInstructions: {
          path: 'contacts-instructions',
          title: 'Institution contacts instructions',
          uiSchema: institutionContactsInstructions.uiSchema,
          schema: institutionContactsInstructions.schema,
        },
        institutionFinancialRepresentative: {
          path: 'financial-representative',
          title: 'Financial representative',
          uiSchema: institutionFinancialRepresentative.uiSchema,
          schema: institutionFinancialRepresentative.schema,
        },
        institutionCertifyingOfficial: {
          path: 'certifying-official',
          title: 'Certifying official',
          uiSchema: institutionCertifyingOfficial.uiSchema,
          schema: institutionCertifyingOfficial.schema,
        },
      },
    },
  },
};

export default formConfig;
