import footerContent from 'platform/forms/components/FormFooter';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import preparerIdentification from '../pages/preparerIdentification';
import veteranBenefitSelection from '../pages/veteranBenefitSelection';
import preparerPersonalInformation from '../pages/preparerPersonalInformation';
import preparerIdentificationInformation from '../pages/preparerIdentificationInformation';
import mailingAddress from '../pages/mailingAddress';
import phoneAndEmailAddress from '../pages/phoneAndEmailAddress';
import {
  preparerIsVeteran,
  preparerIsSurvivingDependant,
  preparerIsThirdParty,
  preparerIsThirdPartyToTheVeteran,
  preparerIsThirdPartyToASurvivingDependant,
  benefitSelectionStepperTitle,
  personalInformationStepperTitle,
  contactInformationStepperTitle,
} from './helpers';
import survivingDependantBenefitSelection from '../pages/survivingDependantBenefitSelection';
import veteranPersonalInformation from '../pages/veteranPersonalInformation';
import veteranIdentificationInformation from '../pages/veteranIdentificationInformation';
import preparerName from '../pages/preparerName';

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/minimal-test.json';
import relationshipToTheVeteran from '../pages/relationshipToTheVeteran';

const mockData = testData;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21-0966-intent-to-file-a-claim-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
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
    preparerIdentityChapter: {
      title: 'Your identity',
      pages: {
        preparerIdentity: {
          path: 'preparer-identification',
          title: 'Your identity',
          initialData:
            !!mockData && environment.isLocalhost() && !window.Cypress
              ? mockData
              : undefined,
          uiSchema: preparerIdentification.uiSchema,
          schema: preparerIdentification.schema,
        },
        name: {
          path: 'preparer-name',
          // display only if preparer is a third-party
          depends: formData => preparerIsThirdParty({ formData }),
          title: 'Your name',
          uiSchema: preparerName.uiSchema,
          schema: preparerName.schema,
        },
      },
    },
    benefitSelectionChapter: {
      title: ({ formData }) => benefitSelectionStepperTitle({ formData }),
      pages: {
        veteranBenefitSelection: {
          path: 'benefit-selection-1',
          // display only if preparer is the veteran or a third-party to the veteran
          depends: formData =>
            preparerIsVeteran({ formData }) ||
            preparerIsThirdPartyToTheVeteran({ formData }),
          title: formData => benefitSelectionStepperTitle({ formData }),
          uiSchema: veteranBenefitSelection.uiSchema,
          schema: veteranBenefitSelection.schema,
        },
        survivingDependantBenefitSelection: {
          path: 'benefit-selection-2',
          // display only if preparer is a surviving dependant of the veteran or a third-party to a surviving dependant
          depends: formData =>
            preparerIsSurvivingDependant({ formData }) ||
            preparerIsThirdPartyToASurvivingDependant({ formData }),
          title: formData => benefitSelectionStepperTitle({ formData }),
          uiSchema: survivingDependantBenefitSelection.uiSchema,
          schema: survivingDependantBenefitSelection.schema,
        },
      },
    },
    personalInformationChapter: {
      title: ({ formData }) => personalInformationStepperTitle({ formData }),
      pages: {
        personalInformation: {
          path: 'personal-information',
          title: formData => personalInformationStepperTitle({ formData }),
          uiSchema: preparerPersonalInformation.uiSchema,
          schema: preparerPersonalInformation.schema,
        },
        identificationInformation: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: preparerIdentificationInformation.uiSchema,
          schema: preparerIdentificationInformation.schema,
        },
      },
    },
    contactInformationChapter: {
      title: ({ formData }) => contactInformationStepperTitle({ formData }),
      pages: {
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
    veteranPersonalInformationChapter: {
      title: 'Veteran’s personal information',
      pages: {
        veteranPersonalInformation: {
          path: 'veteran-personal-information',
          // display only if preparer is not the veteran
          depends: formData => !preparerIsVeteran({ formData }),
          title: 'Name and date of birth',
          uiSchema: veteranPersonalInformation.uiSchema,
          schema: veteranPersonalInformation.schema,
        },
        veteranIdentificationInformation: {
          path: 'veteran-identification-information',
          // display only if preparer is not the veteran
          depends: formData => !preparerIsVeteran({ formData }),
          title: 'Identification information',
          uiSchema: veteranIdentificationInformation.uiSchema,
          schema: veteranIdentificationInformation.schema,
        },
        relationshipToVeteran: {
          path: 'relationship-to-veteran',
          // display only if preparer is third-party to a surviving dependant
          depends: formData =>
            preparerIsThirdPartyToASurvivingDependant({ formData }),
          title: '',
          uiSchema: relationshipToTheVeteran.uiSchema,
          schema: relationshipToTheVeteran.schema,
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
