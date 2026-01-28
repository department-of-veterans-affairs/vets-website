import footerContent from 'platform/forms/components/FormFooter';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { VA_FORM_IDS } from 'platform/forms/constants';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import { personalInformationPage } from 'platform/forms-system/src/js/components/PersonalInformation';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import { organizationRepresentativesArrayOptions } from '../helpers';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import thirdPartyOrganizationRepresentativesSummary from '../pages/thirdPartyOrganizationRepresentativesSummary ';
import thirdPartyOrganizationInformation from '../pages/thirdPartyOrganizationInformation';
import thirdPartyOrganizationRepresentativesIntro from '../pages/thirdPartyOrganizationRepresentativesIntro';
import thirdPartyOrganizationRepresentativeName from '../pages/thirdPartyOrganizationRepresentativesName';
import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
import identificationInformation from '../pages/identificationInformation';
import mailingAddress from '../pages/mailingAddress';
import phoneAndEmailAddress from '../pages/phoneAndEmailAddress';
import prefillTransform from './prefillTransform';

import {
  thirdPartyPersonName,
  thirdPartyPersonAddress,
  discloseInformation,
} from '../pages';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-10278-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_10278,
  useCustomScrollAndFocus: true,
  saveInProgress: {
    messages: {
      inProgress: 'Your form (22-10278) is in progress.',
      expired:
        'Your saved form (22-10278) has expired. Please start a new form.',
      saved: 'Your form has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer: prefillTransform,
  savedFormMessages: {
    notFound: 'Please start over.',
    noAuth: 'Please sign in again to continue your form.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  customText: {
    appType: 'application',
    continueAppButtonText: 'Continue your form',
    startNewAppButtonText: 'Start a new form',
    finishAppLaterMessage: 'Finish this form later',
    appSavedSuccessfullyMessage: 'We’ve saved your form.',
    submitButtonText: 'Continue',
  },
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        ...personalInformationPage({
          personalInfoConfig: {
            name: { show: true, required: true },
            ssn: { show: true, required: true },
            dateOfBirth: { show: true, required: true },
          },
          dataAdapter: {
            ssnPath: 'ssn',
          },
          depends: formData => formData?.userLoggedIn === true,
        }),
        nameAndDateOfBirth: {
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
          depends: formData => formData?.userLoggedIn !== true,
        },
        identificationInformation: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
          depends: formData => formData?.userLoggedIn !== true,
        },
        mailingAddress: {
          path: 'mailing-address',
          title: 'Mailing address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        phoneAndEmailAddress: {
          path: 'phone-and-email-address',
          title: 'Phone and email address',
          uiSchema: phoneAndEmailAddress.uiSchema,
          schema: phoneAndEmailAddress.schema,
        },
      },
    },
    disclosureChapter: {
      title: 'Type of third party',
      pages: {
        discloseInformation: {
          path: 'type-of-third-party',
          title: 'Disclose your personal information to a third party',
          uiSchema: discloseInformation.uiSchema,
          schema: discloseInformation.schema,
          onNavForward: ({ formData, goPath }) => {
            if (formData?.discloseInformation?.authorize === 'organization') {
              goPath('/organization-name-and-address');
              return;
            }
            goPath('/third-party-person-details');
          },
        },
      },
    },
    thirdPartyContactInformation: {
      title: 'Third party contact information',
      pages: {
        thirdPartyPersonName: {
          path: 'third-party-person-details',
          title: 'Name of person',
          uiSchema: thirdPartyPersonName.uiSchema,
          schema: thirdPartyPersonName.schema,
          depends: formData =>
            formData?.discloseInformation?.authorize === 'person',
        },
        thirdPartyPersonAddress: {
          path: 'third-party-person-details-1',
          title: 'Address of person',
          uiSchema: thirdPartyPersonAddress.uiSchema,
          schema: thirdPartyPersonAddress.schema,
          depends: formData =>
            formData?.discloseInformation?.authorize === 'person',
        },
      },
    },

    thirdPartyOrganizationsChapter: {
      title: 'Third party contact information',
      pages: {
        thirdPartyOrganizationInformation: {
          title: 'Organization name and address',
          path: 'organization-name-and-address',
          uiSchema: thirdPartyOrganizationInformation.uiSchema,
          schema: thirdPartyOrganizationInformation.schema,
          depends: formData =>
            formData?.discloseInformation?.authorize === 'organization',
        },
        ...arrayBuilderPages(
          organizationRepresentativesArrayOptions,
          pageBuilder => ({
            thirdPartyOrganizationRepresentativesIntro: pageBuilder.introPage({
              title: 'Name of organization’s representatives',
              path: 'organizations/representatives',
              uiSchema: thirdPartyOrganizationRepresentativesIntro.uiSchema,
              schema: thirdPartyOrganizationRepresentativesIntro.schema,
              depends: formData =>
                formData?.discloseInformation?.authorize === 'organization',
            }),
            thirdPartyOrganizationRepresentativesSummary: pageBuilder.summaryPage(
              {
                title: 'Review representatives',
                path: 'organizations/representatives-summary',
                uiSchema: thirdPartyOrganizationRepresentativesSummary.uiSchema,
                schema: thirdPartyOrganizationRepresentativesSummary.schema,
                depends: formData =>
                  formData?.discloseInformation?.authorize === 'organization',
              },
            ),
            thirdPartyOrganizationRepresentativeName: pageBuilder.itemPage({
              title: 'Name of organization’s representatives',
              path: 'organizations/representatives/:index',
              showPagePerItem: true,
              uiSchema: thirdPartyOrganizationRepresentativeName.uiSchema,
              schema: thirdPartyOrganizationRepresentativeName.schema,
              depends: formData =>
                formData?.discloseInformation?.authorize === 'organization',
            }),
          }),
        ),
      },
    },
  },
  footerContent,
};

export default formConfig;
