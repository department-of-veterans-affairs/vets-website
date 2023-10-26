import footerContent from 'platform/forms/components/FormFooter';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import manifest from '../manifest.json';

import transformForSubmit from '../../shared/config/submit-transformer';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import preparerIdentification from '../pages/preparerIdentification';
import veteranBenefitSelection from '../pages/veteranBenefitSelection';
import survivingDependentPersonalInformation from '../pages/survivingDependentPersonalInformation';
import survivingDependentIdentificationInformation from '../pages/survivingDependentIdentificationInformation';
import survivingDependentMailingAddress from '../pages/survivingDependentMailingAddress';
import survivingDependentPhoneAndEmailAddress from '../pages/survivingDependentPhoneAndEmailAddress';
import {
  preparerIsVeteran,
  preparerIsSurvivingDependent,
  preparerIsThirdPartyToTheVeteran,
  preparerIsThirdPartyToASurvivingDependent,
  benefitSelectionStepperTitle,
  personalInformationStepperTitle,
  contactInformationStepperTitle,
  initializeFormDataWithPreparerIdentification,
  statementOfTruthFullNamePath,
} from './helpers';
import survivingDependentBenefitSelection from '../pages/survivingDependentBenefitSelection';
import veteranPersonalInformation from '../pages/veteranPersonalInformation';
import veteranIdentificationInformation from '../pages/veteranIdentificationInformation';
import thirdPartyPreparerFullName from '../pages/thirdPartyPreparerFullName';
import veteranMailingAddress from '../pages/veteranMailingAddress';
import veteranPhoneAndEmailAddress from '../pages/veteranPhoneAndEmailAddress';

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/veteran-minimal-test.json';
import relationshipToVeteran from '../pages/relationshipToVeteran';

const mockData = testData;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  // submit: () =>
  //   Promise.resolve({
  //     // confirmationNumber: '123123123',
  //     // veteranStatus: 'confirmed',
  //     // expirationDate: '2024-09-22T19:15:20.000-05:00',
  //     // compensationIntent: {
  //     //   creationDate: '2023-09-22T19:15:21.000-05:00',
  //     //   expirationDate: '2024-09-22T19:15:20.000-05:00',
  //     //   type: 'compensation',
  //     //   status: 'active',
  //     // },
  //     // pensionIntent: {
  //     //   creationDate: '2021-03-16T19:15:21.000-05:00',
  //     //   expirationDate: '2022-03-16T19:15:20.000-05:00',
  //     //   type: 'pension',
  //     //   status: 'active',
  //     // },
  //     // survivorIntent: {
  //     //   creationDate: '2021-03-16T19:15:21.000-05:00',
  //     //   expirationDate: '2022-03-16T19:15:20.000-05:00',
  //     //   type: 'survivor',
  //     //   status: 'active',
  //     // },
  //   }),
  transformForSubmit,
  trackingPrefix: '21-0966-intent-to-file-a-claim-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: formData => statementOfTruthFullNamePath({ formData }),
    },
  },
  formId: '21-0966',
  dev: {
    showNavLinks: true,
  },
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your benefits claims application (21-0966) is in progress.',
    //   expired: 'Your saved benefits claims application (21-0966) has expired. If you want to apply for benefits claims, please start a new application.',
    //   saved: 'Your benefits claims application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  v3SegmentedProgressBar: true,
  subTitle:
    'Intent to File a Claim for Compensation and/or Pension, or Survivors Pension and/or DIC (VA Form 21-0966)',
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits claims.',
    noAuth:
      'Please sign in again to continue your application for benefits claims.',
  },
  title: 'Submit an intent to file',
  defaultDefinitions: {},
  chapters: {
    preparerIdentificationChapter: {
      title: 'Your identity',
      pages: {
        preparerIdentification: {
          path: 'preparer-identification',
          title: 'Your identity',
          initialData:
            !!mockData && environment.isLocalhost() && !window.Cypress
              ? mockData
              : undefined,
          uiSchema: preparerIdentification.uiSchema,
          schema: preparerIdentification.schema,
          updateFormData: (oldFormData, newFormData) =>
            initializeFormDataWithPreparerIdentification(
              newFormData.preparerIdentification,
            ),
        },
        thirdPartyPreparerFullName: {
          path: 'third-party-preparer-name',
          depends: formData =>
            preparerIsThirdPartyToTheVeteran({ formData }) ||
            preparerIsThirdPartyToASurvivingDependent({ formData }),
          title: 'Your name',
          uiSchema: thirdPartyPreparerFullName.uiSchema,
          schema: thirdPartyPreparerFullName.schema,
        },
      },
    },
    benefitSelectionChapter: {
      title: ({ formData }) => benefitSelectionStepperTitle({ formData }),
      pages: {
        veteranBenefitSelection: {
          path: 'veteran-benefit-selection',
          depends: formData =>
            preparerIsVeteran({ formData }) ||
            preparerIsThirdPartyToTheVeteran({ formData }),
          title: formData => benefitSelectionStepperTitle({ formData }),
          uiSchema: veteranBenefitSelection.uiSchema,
          schema: veteranBenefitSelection.schema,
        },
        survivingDependentBenefitSelection: {
          path: 'surviving-dependent-benefit-selection',
          depends: formData =>
            preparerIsSurvivingDependent({ formData }) ||
            preparerIsThirdPartyToASurvivingDependent({ formData }),
          title: formData => benefitSelectionStepperTitle({ formData }),
          uiSchema: survivingDependentBenefitSelection.uiSchema,
          schema: survivingDependentBenefitSelection.schema,
        },
      },
    },
    survivingDependentPersonalInformationChapter: {
      title: ({ formData }) => personalInformationStepperTitle({ formData }),
      pages: {
        survivingDependentPersonalInformation: {
          path: 'surviving-dependent-personal-information',
          depends: formData =>
            preparerIsSurvivingDependent({ formData }) ||
            preparerIsThirdPartyToASurvivingDependent({ formData }),
          title: formData => personalInformationStepperTitle({ formData }),
          uiSchema: survivingDependentPersonalInformation.uiSchema,
          schema: survivingDependentPersonalInformation.schema,
        },
        survivingDependentIdentificationInformation: {
          path: 'surviving-dependent-identification-information',
          depends: formData =>
            preparerIsSurvivingDependent({ formData }) ||
            preparerIsThirdPartyToASurvivingDependent({ formData }),
          title: 'Identification information',
          uiSchema: survivingDependentIdentificationInformation.uiSchema,
          schema: survivingDependentIdentificationInformation.schema,
        },
      },
    },
    survivingDependentContactInformationChapter: {
      title: ({ formData }) => contactInformationStepperTitle({ formData }),
      pages: {
        survivingDependentMailingAddress: {
          path: 'surviving-dependent-mailing-address',
          depends: formData =>
            preparerIsSurvivingDependent({ formData }) ||
            preparerIsThirdPartyToASurvivingDependent({ formData }),
          title: 'Mailing address',
          uiSchema: survivingDependentMailingAddress.uiSchema,
          schema: survivingDependentMailingAddress.schema,
        },
        survivingDependentPhoneAndEmailAddress: {
          path: 'surviving-dependent-phone-and-email-address',
          depends: formData =>
            preparerIsSurvivingDependent({ formData }) ||
            preparerIsThirdPartyToASurvivingDependent({ formData }),
          title: 'Phone and email address',
          uiSchema: survivingDependentPhoneAndEmailAddress.uiSchema,
          schema: survivingDependentPhoneAndEmailAddress.schema,
        },
      },
    },
    veteranPersonalInformationChapter: {
      title: 'Veteran’s personal information',
      pages: {
        veteranPersonalInformation: {
          path: 'veteran-personal-information',
          title: 'Name and date of birth',
          uiSchema: veteranPersonalInformation.uiSchema,
          schema: veteranPersonalInformation.schema,
        },
        veteranIdentificationInformation: {
          path: 'veteran-identification-information',
          title: 'Identification information',
          uiSchema: veteranIdentificationInformation.uiSchema,
          schema: veteranIdentificationInformation.schema,
        },
        relationshipToVeteran: {
          path: 'relationship-to-veteran',
          depends: formData =>
            preparerIsSurvivingDependent({ formData }) ||
            preparerIsThirdPartyToASurvivingDependent({ formData }),
          title: '',
          uiSchema: relationshipToVeteran.uiSchema,
          schema: relationshipToVeteran.schema,
        },
      },
    },
    veteranContactInformationChapter: {
      title: 'Your contact information',
      pages: {
        veteranMailingAddress: {
          path: 'veteran-mailing-address',
          depends: formData =>
            preparerIsVeteran({ formData }) ||
            preparerIsThirdPartyToTheVeteran({ formData }),
          title: 'Mailing address',
          uiSchema: veteranMailingAddress.uiSchema,
          schema: veteranMailingAddress.schema,
        },
        veteranPhoneAndEmailAddress: {
          path: 'veteran-phone-and-email-address',
          depends: formData =>
            preparerIsVeteran({ formData }) ||
            preparerIsThirdPartyToTheVeteran({ formData }),
          title: 'Phone and email address',
          uiSchema: veteranPhoneAndEmailAddress.uiSchema,
          schema: veteranPhoneAndEmailAddress.schema,
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
