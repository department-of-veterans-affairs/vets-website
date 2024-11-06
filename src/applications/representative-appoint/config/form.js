import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
import configService from '../utilities/configService';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { pdfTransform } from '../utilities/pdfTransform';
import { generatePDF } from '../api/generatePDF';
import NextStepsPage from '../containers/NextStepsPage';
import PreSubmitInfo from '../containers/PreSubmitInfo';
import {
  isAttorneyOrClaimsAgent,
  preparerIsVeteran,
} from '../utilities/helpers';

import {
  authorizeMedical,
  // authorizeMedicalSelect,
  authorizeAddress,
  authorizeInsideVA,
  authorizeOutsideVA,
  authorizeOutsideVANames,
  claimantRelationship,
  claimantPersonalInformation,
  // confirmClaimantPersonalInformation,
  claimantContactPhoneEmail,
  claimantContactMailing,
  veteranPersonalInformation,
  veteranContactPhoneEmail,
  veteranContactPhoneEmailForNonVeteran,
  veteranContactMailing,
  veteranContactMailingClaimant,
  veteranIdentification,
  veteranServiceInformation,
  selectAccreditedRepresentative,
  replaceAccreditedRepresentative,
  selectedAccreditedOrganizationId,
  contactAccreditedRepresentative,
} from '../pages';

import { prefillTransformer } from '../prefill-transformer';

import initialData from '../tests/fixtures/data/test-data.json';
import ClaimantType from '../components/ClaimantType';
import SelectAccreditedRepresentative from '../components/SelectAccreditedRepresentative';
import SelectedAccreditedRepresentativeReview from '../components/SelectAccreditedRepresentativeReview';
import ContactAccreditedRepresentative from '../components/ContactAccreditedRepresentative';
import SelectOrganization from '../components/SelectOrganization';

import SubmissionError from '../components/SubmissionError';

// import { prefillTransformer } from '../prefill-transformer';
// import ClaimantType from '../components/ClaimantType';

const mockData = initialData;

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfigFromService = configService.getFormConfig();

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  customText: {
    appType: 'form',
    submitButtonText: 'Continue',
  },
  submit: async form => {
    const is2122a = isAttorneyOrClaimsAgent(form.data);
    const transformedFormData = pdfTransform(form.data);
    const pdfResponse = await generatePDF(transformedFormData, is2122a);
    localStorage.setItem('formPdf', pdfResponse);

    return Promise.resolve({ attributes: { confirmationNumber: '123123123' } });
  },
  trackingPrefix: 'appoint-a-rep-21-22-and-21-22A',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-22',
  preSubmitInfo: {
    CustomComponent: PreSubmitInfo,
    required: true,
  },
  submissionError: SubmissionError,
  saveInProgress: {
    messages: {
      inProgress:
        'Your VA accredited representative appointment application (21-22-AND-21-22A) is in progress.',
      expired:
        'Your saved VA accredited representative appointment application (21-22-AND-21-22A) has expired. If you want to apply for VA accredited representative appointment, please start a new application.',
      saved:
        'Your VA accredited representative appointment application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  v3SegmentedProgressBar: true,
  additionalRoutes: [
    {
      path: 'claimant-type',
      component: ClaimantType,
      pageKey: 'claimant-type',
      depends: () => true,
    },
    {
      path: 'next-steps',
      component: NextStepsPage,
      pageKey: 'next-steps',
      depends: () => false,
      hideFormNavProgress: true,
    },
  ],
  savedFormMessages: {
    notFound:
      'Please start over to apply for VA accredited representative appointment.',
    noAuth:
      'Please sign in again to continue your application for VA accredited representative appointment.',
  },
  title: 'Request help from a VA accredited representative or VSO',
  subTitle: formConfigFromService.subTitle || 'VA Forms 21-22 and 21-22a',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    accreditedRepresentativeInformation: {
      title: 'Accredited representative information',
      pages: {
        selectAccreditedRepresentative: {
          title: 'Representative Select',
          path: 'representative-select',
          CustomPage: SelectAccreditedRepresentative,
          CustomPageReview: SelectedAccreditedRepresentativeReview,
          uiSchema: selectAccreditedRepresentative.uiSchema,
          schema: selectAccreditedRepresentative.schema,
        },
        contactAccreditedRepresentative: {
          title: 'Representative Contact',
          path: 'representative-contact',
          CustomPage: ContactAccreditedRepresentative,
          hideOnReview: true,
          uiSchema: contactAccreditedRepresentative.uiSchema,
          schema: contactAccreditedRepresentative.schema,
        },
        selectAccreditedOrganization: {
          path: 'representative-organization',
          title: 'Organization Select',
          hideOnReview: true,
          CustomPage: SelectOrganization,
          depends: formData =>
            !!formData['view:selectedRepresentative'] &&
            ['representative', 'veteran_service_officer'].includes(
              formData['view:selectedRepresentative'].attributes
                ?.individualType,
            ) &&
            formData['view:selectedRepresentative'].attributes
              ?.accreditedOrganizations?.data?.length > 1,
          uiSchema: selectedAccreditedOrganizationId.uiSchema,
          schema: {
            type: 'object',
            properties: {
              selectedAccreditedOrganizationId: {
                type: 'string',
              },
            },
          },
        },
        replaceAccreditedRepresentative: {
          title: 'Representative Replace',
          path: 'representative-replace',
          hideOnReview: true,
          depends: formData =>
            !!formData['view:representativeStatus']?.id &&
            !!formData['view:selectedRepresentative'],
          uiSchema: replaceAccreditedRepresentative.uiSchema,
          schema: replaceAccreditedRepresentative.schema,
        },
      },
    },
    claimantInfo: {
      title: 'Your information',
      pages: {
        claimantRelationship: {
          depends: formData => !preparerIsVeteran({ formData }),
          path: 'claimant-relationship',
          title: 'Tell us how you’re connected to the veteran',
          uiSchema: claimantRelationship.uiSchema,
          schema: claimantRelationship.schema,
        },
        claimantPersonalInformation: {
          path: 'claimant-personal-information',
          depends: formData => !preparerIsVeteran({ formData }),
          initialData:
            /* istanbul ignore next */
            !!mockData && environment.isLocalhost() && !window.Cypress
              ? mockData
              : undefined,
          title: 'Your Personal Information',
          uiSchema: claimantPersonalInformation.uiSchema,
          schema: claimantPersonalInformation.schema,
        },
        // confirmClaimantPersonalInformation: {
        //   path: 'confirm-claimant-personal-information',
        //   depends: formData => !preparerIsVeteran({ formData }),
        //   title: 'Your Personal Information',
        //   uiSchema: confirmClaimantPersonalInformation.uiSchema,
        //   schema: confirmClaimantPersonalInformation.schema,
        // },
        claimantContactPhoneEmail: {
          path: 'claimant-contact-phone-email',
          depends: formData => !preparerIsVeteran({ formData }),
          title: 'Your phone number and email address',
          uiSchema: claimantContactPhoneEmail.uiSchema,
          schema: claimantContactPhoneEmail.schema,
        },
        ...profileContactInfo({
          contactInfoPageKey: 'confirmContactInfo',
          contactPath: 'claimant-contact',
          contactInfoRequiredKeys: [
            'mailingAddress',
            'email',
            'homePhone',
            'mobilePhone',
          ],
          included: ['homePhone', 'mobilePhone', 'mailingAddress', 'email'],
          depends: formData => {
            const isLoggedIn = formData?.['view:isLoggedIn'] ?? false;
            const isNotVeteran = !preparerIsVeteran({ formData });
            return isLoggedIn && isNotVeteran;
          },
        }),
        claimantContactMailing: {
          path: 'claimant-contact-mailing',
          depends: formData => !preparerIsVeteran({ formData }),
          title: 'Your mailing address',
          uiSchema: claimantContactMailing.uiSchema,
          schema: claimantContactMailing.schema,
        },
        veteranPersonalInformation: {
          title: `Your name and date of birth`,
          path: 'veteran-personal-information',
          depends: formData => preparerIsVeteran({ formData }),
          uiSchema: veteranPersonalInformation.uiSchema,
          schema: veteranPersonalInformation.schema,
        },
        veteranContactMailing: {
          path: 'veteran-contact-mailing',
          title: `Your mailing address`,
          depends: formData => preparerIsVeteran({ formData }),
          uiSchema: veteranContactMailing.uiSchema,
          schema: veteranContactMailing.schema,
        },
        veteranContactPhoneEmail: {
          path: 'veteran-contact-phone-email',
          title: `Your phone number and email address`,
          depends: formData => preparerIsVeteran({ formData }),
          uiSchema: veteranContactPhoneEmail.uiSchema,
          schema: veteranContactPhoneEmail.schema,
        },
        veteranContactPhoneEmailForNonVeteran: {
          path: 'veteran-contact-phone-email-for-non-veteran',
          title: `Veteran’s phone number and email address`,
          depends: formData => !preparerIsVeteran({ formData }),
          uiSchema: veteranContactPhoneEmailForNonVeteran.uiSchema,
          schema: veteranContactPhoneEmailForNonVeteran.schema,
        },
        veteranIdentification: {
          path: 'veteran-identification',
          title: `Your identification information`,
          depends: formData => preparerIsVeteran({ formData }),
          uiSchema: veteranIdentification.uiSchema,
          schema: veteranIdentification.schema,
        },
        veteranServiceInformation: {
          path: 'veteran-service-information',
          title: `Your service information`,
          depends: formData => preparerIsVeteran({ formData }),
          uiSchema: veteranServiceInformation.uiSchema,
          schema: veteranServiceInformation.schema,
        },
      },
    },
    veteranInfo: {
      title: 'Veteran information',
      depends: formData => !preparerIsVeteran({ formData }),
      pages: {
        veteranPersonalInformation: {
          title: `Veteran's name and date of birth`,
          path: 'veteran-personal-information',
          depends: formData => !preparerIsVeteran({ formData }),
          uiSchema: veteranPersonalInformation.uiSchema,
          schema: veteranPersonalInformation.schema,
        },
        veteranContactMailingClaimant: {
          path: 'veteran-contact-mailing-address',
          title: `The Veteran's mailing address`,
          depends: formData => !preparerIsVeteran({ formData }),
          uiSchema: veteranContactMailingClaimant.uiSchema,
          schema: veteranContactMailingClaimant.schema,
        },
        veteranContactPhoneEmail: {
          path: 'veteran-contact-phone-email',
          title: `Veteran's phone number and email address`,
          depends: formData => !preparerIsVeteran({ formData }),
          uiSchema: veteranContactPhoneEmail.uiSchema,
          schema: veteranContactPhoneEmail.schema,
        },
        veteranIdentification: {
          path: 'veteran-identification',
          title: `Veteran's identification information`,
          depends: formData => !preparerIsVeteran({ formData }),
          uiSchema: veteranIdentification.uiSchema,
          schema: veteranIdentification.schema,
        },
        veteranServiceInformation: {
          path: 'veteran-service-information',
          title: `Veteran's service information`,
          depends: formData => !preparerIsVeteran({ formData }),
          uiSchema: veteranServiceInformation.uiSchema,
          schema: veteranServiceInformation.schema,
        },
      },
    },
    authorization: {
      title: 'Accredited representative authorizations',
      pages: {
        authorizeMedical: {
          path: 'authorize-medical',
          title: 'Authorization for Certain Medical Records',
          uiSchema: authorizeMedical.uiSchema,
          schema: authorizeMedical.schema,
        },
        // authorizeMedicalSelect: {
        //   path: 'authorize-medical/select',
        //   depends: formData => {
        //     return (
        //       formData?.authorizationRadio ===
        //       'Yes, but they can only access some of these types of records'
        //     );
        //   },
        //   title: 'Authorization for Certain Medical Records - Select',
        //   uiSchema: authorizeMedicalSelect.uiSchema,
        //   schema: authorizeMedicalSelect.schema,
        // },
        authorizeAddress: {
          path: 'authorize-address',
          title: 'Authorization to change your address',
          uiSchema: authorizeAddress.uiSchema,
          schema: authorizeAddress.schema,
        },
        authorizeInsideVA: {
          path: 'authorize-inside-va',
          depends: formData => {
            return formData?.repTypeRadio === ('Attorney' || 'Claims Agent');
          },
          title: 'Authorization for Access Inside VA Systems',
          uiSchema: authorizeInsideVA.uiSchema,
          schema: authorizeInsideVA.schema,
        },
        authorizeOutsideVA: {
          path: 'authorize-outside-va',
          depends: formData => {
            return formData?.repTypeRadio === ('Attorney' || 'Claims Agent');
          },
          title: 'Authorization for Access Outside VA Systems',
          uiSchema: authorizeOutsideVA.uiSchema,
          schema: authorizeOutsideVA.schema,
        },
        authorizeOutsideVANames: {
          path: 'authorize-outside-va/names',
          depends: formData => {
            return formData?.repTypeRadio === ('Attorney' || 'Claims Agent');
          },
          title: 'Authorization for Access Outside of VA Systems',
          uiSchema: authorizeOutsideVANames.uiSchema,
          schema: authorizeOutsideVANames.schema,
        },
      },
    },
  },
};

configService.setFormConfig(formConfig);

export default formConfig;
