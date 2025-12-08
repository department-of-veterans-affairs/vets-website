import React from 'react';
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { personalInformationPage } from 'platform/forms-system/src/js/components/PersonalInformation';
import get from 'platform/utilities/data/get';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../containers/GetFormHelp';

import veteranName from '../pages/veteranName';
import veteranInfo1 from '../pages/veteranInfo1';
import veteranInfo2 from '../pages/veteranInfo2';
import applicantName from '../pages/applicantName';
import veteranDemographics1 from '../pages/veteranDemographics1';
import veteranDemographics2 from '../pages/veteranDemographics2';
import phoneAndEmailAddress from '../pages/phoneAndEmailAddress';
import applicantRelationToVet from '../pages/applicantRelationToVet';
import applicantRelationToVetOrg from '../pages/applicantRelationToVetOrg';
import applicantRelationToVetOrg2 from '../pages/applicantRelationToVetOrg2';
import applicantContactInfo from '../pages/applicantContactInfo';
import applicantContactInfo2 from '../pages/applicantContactInfo2';
import applicantMailingAddress from '../pages/applicantMailingAddress';
import applicantMailingAddress2 from '../pages/applicantMailingAddress2';
import supportingDocuments from '../pages/supportingDocuments';
import supportingDocumentsUpload from '../pages/supportingDocumentsUpload';
import typeOfRequest from '../pages/typeOfRequest';
import replacementMedallionReason from '../pages/replacementMedallionReason';
import typeOfMedallion from '../pages/typeOfMedallion.jsx';
import medallionSizeBronze from '../pages/medallionSizeBronze.jsx';
import medallionSizeMOH from '../pages/medallionSizeMOH.jsx';
import {
  ApplicantNameHeader,
  ApplicantNameNote,
  isUserSignedIn,
} from '../utils/helpers';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'memorials-1330m',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_1330M,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your Memorials benefits application (1330M) is in progress.',
    //   expired: 'Your saved Memorials benefits application (1330M) has expired. If you want to apply for Memorials benefits, please start a new application.',
    //   saved: 'Your Memorials benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for Memorials benefits.',
    noAuth:
      'Please sign in again to continue your application for Memorials benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  getHelp: GetFormHelp,
  defaultDefinitions: {},
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        ...personalInformationPage({
          key: 'applicantNameView',
          title: 'Personal information',
          path: 'applicant-name-view',
          personalInfoConfig: {
            ssn: { show: false, required: false },
            vaFileNumber: { show: false, required: false },
            dateOfBirth: { show: false, required: false },
            gender: { show: false, required: false },
            name: { show: true, required: false },
          },
          header: <ApplicantNameHeader />,
          note: <ApplicantNameNote />,
          depends: formData => isUserSignedIn(formData),
        }),
        applicantName: {
          path: 'applicant-name',
          title: 'Your name',
          uiSchema: applicantName.uiSchema,
          schema: applicantName.schema,
          depends: formData => !isUserSignedIn(formData),
        },
        applicantRelationToVet: {
          path: 'applicant-relation-to-vet',
          title: 'Your relationship to the Veteran',
          uiSchema: applicantRelationToVet.uiSchema,
          schema: applicantRelationToVet.schema,
        },
        applicantRelationToVetOrg: {
          path: 'applicant-relation-to-vet-org',
          title: 'Your organization',
          uiSchema: applicantRelationToVetOrg.uiSchema,
          schema: applicantRelationToVetOrg.schema,
          depends: formData =>
            ['repOfCemetery', 'repOfFuneralHome'].includes(
              formData.relationToVetRadio,
            ),
        },
        applicantRelationToVetOrg2: {
          path: 'applicant-relation-to-vet-org-2',
          title: 'Your organization',
          uiSchema: applicantRelationToVetOrg2.uiSchema,
          schema: applicantRelationToVetOrg2.schema,
          depends: formData => formData.relationToVetRadio === 'repOfVSO',
        },
        applicantContactInfo: {
          path: 'applicant-contact-info',
          title: 'Your contact information',
          uiSchema: applicantContactInfo.uiSchema,
          schema: applicantContactInfo.schema,
          depends: formData =>
            ['familyMember', 'personalRep', 'other'].includes(
              formData.relationToVetRadio,
            ),
        },
        applicantContactInfo2: {
          path: 'applicant-contact-info-2',
          title: 'Your organization’s contact information',
          uiSchema: applicantContactInfo2.uiSchema,
          schema: applicantContactInfo2.schema,
          depends: formData =>
            ['repOfVSO', 'repOfCemetery', 'repOfFuneralHome'].includes(
              formData.relationToVetRadio,
            ),
        },
        applicantMailingAddress: {
          path: 'applicant-mailing-address',
          title: 'Your mailing address',
          uiSchema: applicantMailingAddress.uiSchema,
          schema: applicantMailingAddress.schema,
          depends: formData =>
            ['familyMember', 'personalRep', 'other'].includes(
              formData.relationToVetRadio,
            ),
        },
        applicantMailingAddress2: {
          path: 'applicant-mailing-address-2',
          title: 'Your organization’s mailing address ',
          uiSchema: applicantMailingAddress2.uiSchema,
          schema: applicantMailingAddress2.schema,
          depends: formData =>
            ['repOfVSO', 'repOfCemetery', 'repOfFuneralHome'].includes(
              formData.relationToVetRadio,
            ),
        },
      },
    },
    veteranInformation: {
      title: 'Veteran information',
      pages: {
        veteranName: {
          path: 'veteran-name',
          title: 'Veteran name',
          uiSchema: veteranName.uiSchema,
          schema: veteranName.schema,
        },
        veteranInfo1: {
          path: 'veteran-personal-information-1',
          title: 'Veteran personal information',
          uiSchema: veteranInfo1.uiSchema,
          schema: veteranInfo1.schema,
        },
        veteranInfo2: {
          path: 'veteran-personal-information-2',
          title: 'Veteran personal information',
          uiSchema: veteranInfo2.uiSchema,
          schema: veteranInfo2.schema,
        },
        veteranDemographics1: {
          path: 'veteran-demographics-1',
          title: 'Veteran demographics',
          uiSchema: veteranDemographics1.uiSchema,
          schema: veteranDemographics1.schema,
        },
        veteranDemographics2: {
          path: 'veteran-demographics-2',
          title: 'Veteran demographics',
          uiSchema: veteranDemographics2.uiSchema,
          schema: veteranDemographics2.schema,
          depends: formData => get('veteranDemoYesNo', formData),
        },
      },
    },
    veteranServicePeriods: {
      title: 'Veteran service periods',
      pages: {
        phoneAndEmailAddress: {
          path: 'phone-and-email-address',
          title: 'Phone and email address',
          uiSchema: phoneAndEmailAddress.uiSchema,
          schema: phoneAndEmailAddress.schema,
        },
      },
    },
    burialInformation: {
      title: 'Burial information',
      pages: {
        phoneAndEmailAddress: {
          path: 'phone-and-email-address-2',
          title: 'Phone and email address',
          uiSchema: phoneAndEmailAddress.uiSchema,
          schema: phoneAndEmailAddress.schema,
        },
      },
    },
    typeOfRequest: {
      title: 'Memorial items',
      pages: {
        typeOfRequest: {
          path: 'type-of-request',
          title: 'Type of request',
          uiSchema: typeOfRequest.uiSchema,
          schema: typeOfRequest.schema,
        },
        replacementMedallionReason: {
          path: 'replacement-medallion-reason',
          title: 'Replacement medallion',
          uiSchema: replacementMedallionReason.uiSchema,
          schema: replacementMedallionReason.schema,
          depends: formData => formData.typeOfRequestRadio === 'replacement',
        },
        typeOfMedallion: {
          path: 'type-of-medallion',
          title: 'Type of medallion',
          uiSchema: typeOfMedallion.uiSchema,
          schema: typeOfMedallion.schema,
          depends: formData => formData.typeOfRequestRadio === 'new',
        },
        medallionSizeBronze: {
          path: 'medallion-size-bronze',
          title: 'Size of medallion',
          uiSchema: medallionSizeBronze.uiSchema,
          schema: medallionSizeBronze.schema,
          depends: formData =>
            formData.typeOfRequestRadio === 'new' &&
            formData.typeOfMedallionRadio === 'bronze',
        },
        medallionSizeMOH: {
          path: 'medallion-size-moh',
          title: 'Size of medallion',
          uiSchema: medallionSizeMOH.uiSchema,
          schema: medallionSizeMOH.schema,
          depends: formData =>
            formData.typeOfRequestRadio === 'new' &&
            formData.typeOfMedallionRadio === 'medalOfHonor',
        },
      },
    },
    supportingDocuments: {
      title: 'Supporting documents',
      pages: {
        supportingDocuments: {
          path: 'supporting-documents',
          title: 'Supporting documents',
          uiSchema: supportingDocuments.uiSchema,
          schema: supportingDocuments.schema,
        },
        supportingDocumentsUpload: {
          path: 'supporting-documents-upload',
          title: 'Supporting Documents',
          uiSchema: supportingDocumentsUpload.uiSchema,
          schema: supportingDocumentsUpload.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
