import footerContent from 'platform/forms/components/FormFooter';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import manifest from '../manifest.json';

import ITFStatusLoadingIndicatorPage from '../components/ITFStatusLoadingIndicatorPage';

import transformForSubmit from './submit-transformer';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import preparerIdentification from '../pages/preparerIdentification';
import veteranBenefitSelection from '../pages/veteranBenefitSelection';
import veteranBenefitSelectionCompensation from '../pages/veteranBenefitSelectionCompensation';
import veteranBenefitSelectionPension from '../pages/veteranBenefitSelectionPension';
import thirdPartyVeteranBenefitSelection from '../pages/thirdPartyVeteranBenefitSelection';
import survivingDependentPersonalInformation from '../pages/survivingDependentPersonalInformation';
import survivingDependentIdentificationInformation from '../pages/survivingDependentIdentificationInformation';
import survivingDependentMailingAddress from '../pages/survivingDependentMailingAddress';
import survivingDependentPhoneAndEmailAddress from '../pages/survivingDependentPhoneAndEmailAddress';
import {
  preparerIsVeteran,
  preparerIsSurvivingDependent,
  preparerIsThirdPartyToTheVeteran,
  preparerIsThirdPartyToASurvivingDependent,
  hasActiveCompensationITF,
  hasActivePensionITF,
  noActiveITF,
  benefitSelectionChapterTitle,
  survivingDependentPersonalInformationChapterTitle,
  survivingDependentContactInformationChapterTitle,
  initializeFormDataWithPreparerIdentification,
  statementOfTruthFullNamePath,
  veteranPersonalInformationChapterTitle,
  veteranContactInformationChapterTitle,
} from './helpers';
import survivingDependentBenefitSelection from '../pages/survivingDependentBenefitSelection';
import thirdPartySurvivingDependentBenefitSelection from '../pages/thirdPartySurvivingDependentBenefitSelection';
import veteranPersonalInformation from '../pages/veteranPersonalInformation';
import veteranIdentificationInformation from '../pages/veteranIdentificationInformation';
import thirdPartyPreparerFullName from '../pages/thirdPartyPreparerFullName';
import thirdPartyPreparerRole from '../pages/thirdPartyPreparerRole';
import veteranMailingAddress from '../pages/veteranMailingAddress';
import veteranPhoneAndEmailAddress from '../pages/veteranPhoneAndEmailAddress';
import survivingDependentVeteranPersonalInformation from '../pages/survivingDependentVeteranPersonalInformation';
import thirdPartySurvivingDependentVeteranPersonalInformation from '../pages/thirdPartySurvivingDependentVeteranPersonalInformation';
import survivingDependentRelationshipToVeteran from '../pages/survivingDependentRelationshipToVeteran';
import thirdPartySurvivingDependentRelationshipToVeteran from '../pages/thirdPartySurvivingDependentRelationshipToVeteran';

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/veteran-minimal-test.json';

const mockData = testData;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
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
    collapsibleNavLinks: true,
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
  additionalRoutes: [
    {
      path: 'get-itf-status',
      pageKey: 'get-itf-status',
      component: ITFStatusLoadingIndicatorPage,
      depends: () => false,
    },
  ],
  formOptions: {
    fullWidth: false,
  },
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
          onNavForward: ({ formData, goPath, goNextPath, setFormData }) => {
            if (preparerIsVeteran({ formData })) {
              goPath('get-itf-status');

              apiRequest(
                `${
                  environment.API_URL
                }/simple_forms_api/v1/simple_forms/get_intents_to_file`,
              )
                .then(({ compensationIntent, pensionIntent }) => {
                  const formDataToSet = {
                    ...formData,
                    'view:activeCompensationITF':
                      compensationIntent?.status === 'active'
                        ? compensationIntent
                        : {},
                    'view:activePensionITF':
                      pensionIntent?.status === 'active' ? pensionIntent : {},
                  };

                  setFormData(formDataToSet);

                  if (
                    hasActiveCompensationITF({ formData: formDataToSet }) &&
                    hasActivePensionITF({ formData: formDataToSet })
                  ) {
                    goPath('confirmation');
                  } else if (
                    hasActiveCompensationITF({ formData: formDataToSet })
                  ) {
                    goPath('veteran-benefit-selection-pension');
                  } else if (hasActivePensionITF({ formData: formDataToSet })) {
                    goPath('veteran-benefit-selection-compensation');
                  } else {
                    goNextPath();
                  }
                })
                .catch(() => goNextPath());
            } else {
              goNextPath();
            }
          },
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
        thirdPartyPreparerRole: {
          path: 'third-party-preparer-role',
          depends: formData =>
            preparerIsThirdPartyToTheVeteran({ formData }) ||
            preparerIsThirdPartyToASurvivingDependent({ formData }),
          title: 'Your role',
          uiSchema: thirdPartyPreparerRole.uiSchema,
          schema: thirdPartyPreparerRole.schema,
        },
      },
    },
    benefitSelectionChapter: {
      title: ({ formData }) => benefitSelectionChapterTitle({ formData }),
      pages: {
        veteranBenefitSelection: {
          path: 'veteran-benefit-selection',
          depends: formData =>
            preparerIsVeteran({ formData }) && noActiveITF({ formData }),
          title: formData => benefitSelectionChapterTitle({ formData }),
          uiSchema: veteranBenefitSelection.uiSchema,
          schema: veteranBenefitSelection.schema,
        },
        veteranBenefitSelectionCompensation: {
          path: 'veteran-benefit-selection-compensation',
          depends: formData =>
            preparerIsVeteran({ formData }) &&
            hasActivePensionITF({ formData }),
          title: formData => benefitSelectionChapterTitle({ formData }),
          uiSchema: veteranBenefitSelectionCompensation.uiSchema,
          schema: veteranBenefitSelectionCompensation.schema,
          onNavForward: ({ formData, goPath, goNextPath }) => {
            if (formData?.benefitSelectionCompensation) {
              goNextPath();
            } else {
              goPath('confirmation');
            }
          },
        },
        veteranBenefitSelectionPension: {
          path: 'veteran-benefit-selection-pension',
          depends: formData =>
            preparerIsVeteran({ formData }) &&
            hasActiveCompensationITF({ formData }),
          title: formData => benefitSelectionChapterTitle({ formData }),
          uiSchema: veteranBenefitSelectionPension.uiSchema,
          schema: veteranBenefitSelectionPension.schema,
          onNavForward: ({ formData, goPath, goNextPath }) => {
            if (formData?.benefitSelectionPension) {
              goNextPath();
            } else {
              goPath('confirmation');
            }
          },
        },
        thirdPartyVeteranBenefitSelection: {
          path: 'third-party-veteran-benefit-selection',
          depends: formData => preparerIsThirdPartyToTheVeteran({ formData }),
          title: formData => benefitSelectionChapterTitle({ formData }),
          uiSchema: thirdPartyVeteranBenefitSelection.uiSchema,
          schema: thirdPartyVeteranBenefitSelection.schema,
        },
        survivingDependentBenefitSelection: {
          path: 'surviving-dependent-benefit-selection',
          depends: formData => preparerIsSurvivingDependent({ formData }),
          title: formData => benefitSelectionChapterTitle({ formData }),
          uiSchema: survivingDependentBenefitSelection.uiSchema,
          schema: survivingDependentBenefitSelection.schema,
        },
        thirdPartySurvivingDependentBenefitSelection: {
          path: 'third-party-surviving-dependent-benefit-selection',
          depends: formData =>
            preparerIsThirdPartyToASurvivingDependent({ formData }),
          title: formData => benefitSelectionChapterTitle({ formData }),
          uiSchema: thirdPartySurvivingDependentBenefitSelection.uiSchema,
          schema: thirdPartySurvivingDependentBenefitSelection.schema,
        },
      },
    },
    survivingDependentPersonalInformationChapter: {
      title: ({ formData }) =>
        survivingDependentPersonalInformationChapterTitle({ formData }),
      pages: {
        survivingDependentPersonalInformation: {
          path: 'surviving-dependent-personal-information',
          depends: formData =>
            preparerIsSurvivingDependent({ formData }) ||
            preparerIsThirdPartyToASurvivingDependent({ formData }),
          title: formData =>
            survivingDependentPersonalInformationChapterTitle({ formData }),
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
      title: ({ formData }) =>
        survivingDependentContactInformationChapterTitle({ formData }),
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
      title: ({ formData }) =>
        veteranPersonalInformationChapterTitle({ formData }),
      pages: {
        veteranPersonalInformation: {
          path: 'veteran-personal-information',
          depends: formData =>
            (preparerIsVeteran({ formData }) && noActiveITF({ formData })) ||
            preparerIsThirdPartyToTheVeteran({ formData }),
          title: 'Name and date of birth',
          uiSchema: veteranPersonalInformation.uiSchema,
          schema: veteranPersonalInformation.schema,
        },
        survivingDependentVeteranPersonalInformation: {
          path: 'surviving-dependent-veteran-personal-information',
          depends: formData => preparerIsSurvivingDependent({ formData }),
          title: 'Veteran’s name and date of birth',
          uiSchema: survivingDependentVeteranPersonalInformation.uiSchema,
          schema: survivingDependentVeteranPersonalInformation.schema,
        },
        thirdPartySurvivingDependentVeteranPersonalInformation: {
          path: 'third-party-surviving-dependent-veteran-personal-information',
          depends: formData =>
            preparerIsThirdPartyToASurvivingDependent({ formData }),
          title: 'Veteran’s name and date of birth',
          uiSchema:
            thirdPartySurvivingDependentVeteranPersonalInformation.uiSchema,
          schema: thirdPartySurvivingDependentVeteranPersonalInformation.schema,
        },
        veteranIdentificationInformation: {
          path: 'veteran-identification-information',
          title: 'Identification information',
          depends: formData => noActiveITF({ formData }),
          uiSchema: veteranIdentificationInformation.uiSchema,
          schema: veteranIdentificationInformation.schema,
        },
        survivingDependentRelationshipToVeteran: {
          path: 'surviving-dependent-relationship-to-veteran',
          depends: formData => preparerIsSurvivingDependent({ formData }),
          title: '',
          uiSchema: survivingDependentRelationshipToVeteran.uiSchema,
          schema: survivingDependentRelationshipToVeteran.schema,
        },
        thirdPartySurvivingDependentRelationshipToVeteran: {
          path: 'third-party-surviving-dependent-relationship-to-veteran',
          depends: formData =>
            preparerIsThirdPartyToASurvivingDependent({ formData }),
          title: '',
          uiSchema: thirdPartySurvivingDependentRelationshipToVeteran.uiSchema,
          schema: thirdPartySurvivingDependentRelationshipToVeteran.schema,
        },
      },
    },
    veteranContactInformationChapter: {
      title: ({ formData }) =>
        veteranContactInformationChapterTitle({ formData }),
      pages: {
        veteranMailingAddress: {
          path: 'veteran-mailing-address',
          depends: formData =>
            (preparerIsVeteran({ formData }) && noActiveITF({ formData })) ||
            preparerIsThirdPartyToTheVeteran({ formData }),
          title: 'Mailing address',
          uiSchema: veteranMailingAddress.uiSchema,
          schema: veteranMailingAddress.schema,
        },
        veteranPhoneAndEmailAddress: {
          path: 'veteran-phone-and-email-address',
          depends: formData =>
            (preparerIsVeteran({ formData }) && noActiveITF({ formData })) ||
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
