// we're not using JSON schema for this form
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import getHelp from '../../shared/components/GetFormHelp';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import preparerTypePg from '../pages/preparerType';
import idInfoThirdPartyVetPg from '../pages/idInfoThirdPartyVeteran';
import idInfoThirdPartyNonVetPg from '../pages/idInfoThirdPartyNonVeteran';
import nameAndDobPg from '../pages/nameAndDateofBirth';
import idInfoPg from '../pages/idInfo';
import livingSituationPg from '../pages/livingSituation';
import livingSituationThirdPartyVetPg from '../pages/livingSituationThirdPartyVeteran';
import livingSituationThirdPartyNonVetPg from '../pages/livingSituationThirdPartyNonVeteran';
import otherHousingRisksPg from '../pages/otherHousingRisks';
import otherHousingRisksThirdPartyVeteran from '../pages/otherHousingRisksThirdPartyVeteran';
import otherHousingRisksThirdPartyNonVeteran from '../pages/otherHousingRisksThirdPartyNonVeteran';
import mailingAddressYesNo from '../pages/mailingAddressYesNo';
import mailingAddressPg from '../pages/mailingAddress';
import phoneAndEmailPg from '../pages/phoneAndEmail';
import otherReasonsPg from '../pages/otherReasons';
import otherReasonsHomelessPg from '../pages/otherReasonsHomeless';
import financialHardshipPg from '../pages/evidenceFinancialHardship';
import terminalIllnessPg from '../pages/evidenceTerminalIllness';
import alsPg from '../pages/evidenceALS';
import vsiPg from '../pages/evidenceVSI';
import powConfinementPg from '../pages/evidencePowConfinement';
import powConfinement2Pg from '../pages/evidencePowConfinement2';
import powDocsPg from '../pages/evidencePowDocuments';
import medalAwardPg from '../pages/evidenceMedalAward';
import { PREPARER_TYPES, SUBTITLE, TITLE } from './constants';
import {
  getMockData,
  getPersonalInformationChapterTitle,
  getLivingSituationChapterTitle,
} from '../helpers';

// export isLocalhost() to facilitate unit-testing
export function isLocalhost() {
  return environment.isLocalhost();
}

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/veteran.json';

const mockData = testData.data;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  dev: {
    showNavLinks: !window.Cypress,
  },
  trackingPrefix: 'pp-10207-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '20-10207',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your priority processing request application (20-10207) is in progress.',
    //   expired: 'Your saved priority processing request application (20-10207) has expired. If you want to apply for priority processing request, please start a new application.',
    //   saved: 'Your priority processing request application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for priority processing request.',
    noAuth:
      'Please sign in again to continue your application for priority processing request.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  v3SegmentedProgressBar: true,
  chapters: {
    preparerTypeChapter: {
      title: 'Your identity',
      pages: {
        preparerTypePage: {
          path: 'preparer-type',
          title: 'Which of these best describes you?',
          uiSchema: preparerTypePg.uiSchema,
          schema: preparerTypePg.schema,
          pageClass: 'preparer-type',
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData: getMockData(mockData, isLocalhost),
        },
        thirdPartyVeteranIdentityPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
          path: 'third-party-veteran-identity',
          title: 'Name and third-party type',
          uiSchema: idInfoThirdPartyVetPg.uiSchema,
          schema: idInfoThirdPartyVetPg.schema,
          pageClass: 'third-party-veteran-identity',
        },
        thirdPartyNonVeteranIdentityPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'third-party-non-veteran-identity',
          title: 'Name and third-party type',
          uiSchema: idInfoThirdPartyNonVetPg.uiSchema,
          schema: idInfoThirdPartyNonVetPg.schema,
          pageClass: 'third-party-non-veteran-identity',
        },
      },
    },
    personalInformationChapter: {
      title: ({ formData }) => getPersonalInformationChapterTitle(formData),
      pages: {
        nameAndDateOfBirthPage: {
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDobPg.uiSchema,
          schema: nameAndDobPg.schema,
          pageClass: 'name-and-date-of-birth',
        },
        identificationInformationPage: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: idInfoPg.uiSchema,
          schema: idInfoPg.schema,
          pageClass: 'identification-information',
        },
      },
    },
    livingSituationChapter: {
      title: ({ formData }) => getLivingSituationChapterTitle(formData),
      pages: {
        livingSituationPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.VETERAN ||
            formData.preparerType === PREPARER_TYPES.NON_VETERAN,
          path: 'living-situation',
          title: 'Your living situation',
          uiSchema: livingSituationPg.uiSchema,
          schema: livingSituationPg.schema,
          pageClass: 'living-situation',
        },
        livingSituationThirdPartyVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
          path: 'living-situation-third-party-veteran',
          title: 'Veteran’s living situation',
          uiSchema: livingSituationThirdPartyVetPg.uiSchema,
          schema: livingSituationThirdPartyVetPg.schema,
          pageClass: 'living-situation-third-party-veteran',
        },
        livingSituationThirdPartyNonVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'living-situation-third-party-non-veteran',
          title: 'Claimant’s living situation',
          uiSchema: livingSituationThirdPartyNonVetPg.uiSchema,
          schema: livingSituationThirdPartyNonVetPg.schema,
          pageClass: 'living-situation-third-party-non-veteran',
        },
        otherHousingRiskPage: {
          depends: formData =>
            formData.livingSituation.OTHER_RISK &&
            (formData.preparerType === PREPARER_TYPES.VETERAN ||
              formData.preparerType === PREPARER_TYPES.NON_VETERAN),
          path: 'other-housing-risks',
          title: 'Other housing risks',
          uiSchema: otherHousingRisksPg.uiSchema,
          schema: otherHousingRisksPg.schema,
          pageClass: 'other-housing-risks',
        },
        otherHousingRiskThirdPartyVeteranPage: {
          depends: formData =>
            formData.livingSituation.OTHER_RISK &&
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
          path: 'other-housing-risks-third-party-veteran',
          title: 'Other housing risks',
          uiSchema: otherHousingRisksThirdPartyVeteran.uiSchema,
          schema: otherHousingRisksThirdPartyVeteran.schema,
          pageClass: 'other-housing-risks-third-party-veteran',
        },
        otherHousingRiskThirdPartyNonVeteranPage: {
          depends: formData =>
            formData.livingSituation.OTHER_RISK &&
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'other-housing-risks-third-party-non-veteran',
          title: 'Other housing risks',
          uiSchema: otherHousingRisksThirdPartyNonVeteran.uiSchema,
          schema: otherHousingRisksThirdPartyNonVeteran.schema,
          pageClass: 'other-housing-risks-third-party-non-veteran',
        },
      },
    },
    contactInformationChapter: {
      title: 'Your contact information',
      pages: {
        mailingAddressYesNoPage: {
          depends: formData => formData.livingSituation.NONE,
          path: 'mailing-address-yes-no',
          title: 'Mailing address yes/no',
          uiSchema: mailingAddressYesNo.uiSchema,
          schema: mailingAddressYesNo.schema,
          pageClass: 'contact-information',
        },
        mailingAddressPage: {
          depends: formData =>
            formData.livingSituation.NONE && formData.mailingAddressYesNo,
          path: 'mailing-address',
          title: 'Your mailing address',
          uiSchema: mailingAddressPg.uiSchema,
          schema: mailingAddressPg.schema,
          pageClass: 'mailing-address',
        },
        phoneAndEmailPage: {
          path: 'phone-and-email',
          title: 'Your phone and email address',
          uiSchema: phoneAndEmailPg.uiSchema,
          schema: phoneAndEmailPg.schema,
          pageClass: 'phone-and-email',
        },
      },
    },
    otherReasonsChapter: {
      title: 'Other reasons for request',
      pages: {
        otherReasonsPage: {
          depends: formData => formData.livingSituation.NONE,
          path: 'other-reasons',
          title: 'Other reasons for request',
          uiSchema: otherReasonsPg.uiSchema,
          schema: otherReasonsPg.schema,
          pageClass: 'other-reasons',
        },
        otherReasonsHomelessPage: {
          depends: formData => !formData.livingSituation.NONE,
          path: 'other-reasons-homeless',
          title: 'Other reasons for request',
          uiSchema: otherReasonsHomelessPg.uiSchema,
          schema: otherReasonsHomelessPg.schema,
          pageClass: 'other-reasons-homeless',
        },
      },
    },
    evidenceChapter: {
      title: 'Evidence',
      pages: {
        financialHardshipPage: {
          depends: formData => formData.otherReasons.FINANCIAL_HARDSHIP,
          path: 'evidence-financial-hardship',
          title: 'Upload evidence for extreme financial hardship',
          uiSchema: financialHardshipPg.uiSchema,
          schema: financialHardshipPg.schema,
          pageClass: 'evidence-financial-hardship',
        },
        terminalIllnessPage: {
          depends: formData => formData.otherReasons.TERMINAL_ILLNESS,
          path: 'evidence-terminal-illness',
          title: 'Upload evidence for terminal illness',
          uiSchema: terminalIllnessPg.uiSchema,
          schema: terminalIllnessPg.schema,
          pageClass: 'evidence-terminal-illness',
        },
        alsPage: {
          depends: formData => formData.otherReasons.ALS,
          path: 'evidence-als',
          title:
            'Upload evidence for diagnosis of ALS (amyotrophic lateral sclerosis)',
          uiSchema: alsPg.uiSchema,
          schema: alsPg.schema,
          pageClass: 'evidence-als',
        },
        vsiPage: {
          depends: formData => formData.otherReasons.VSI_SI,
          path: 'evidence-vsi',
          title:
            'Upload evidence for Seriously or Very Seriously Injured or Ill during military operations',
          uiSchema: vsiPg.uiSchema,
          schema: vsiPg.schema,
          pageClass: 'evidence-vsi',
        },
        powConfinementPage: {
          // TODO: Verify which stories this should be shown for.
          // Not sure about non-veteran & third-party-non-veteran stories.
          depends: formData => formData.otherReasons.FORMER_POW,
          path: 'evidence-pow-confinement',
          title: 'Former prisoner of war',
          uiSchema: powConfinementPg.uiSchema,
          schema: powConfinementPg.schema,
          pageClass: 'evidence-pow-confinement',
        },
        powConfinement2Page: {
          depends: formData =>
            formData.otherReasons.FORMER_POW &&
            formData.powMultipleConfinements,
          path: 'evidence-pow-confinement-2',
          title: 'Former prisoner of war',
          uiSchema: powConfinement2Pg.uiSchema,
          schema: powConfinement2Pg.schema,
          pageClass: 'evidence-pow-confinement-2',
        },
        powDocumentsPage: {
          depends: formData => formData.otherReasons.FORMER_POW,
          path: 'evidence-pow-documents',
          title: 'Upload evidence for prisoner of war status',
          uiSchema: powDocsPg.uiSchema,
          schema: powDocsPg.schema,
          pageClass: 'evidence-pow-documents',
        },
        medalAwardPage: {
          depends: formData => formData.otherReasons.MEDAL_AWARD,
          path: 'evidence-medal-award',
          title:
            'Upload evidence for Medal of Honor or Purple Heart award recipient',
          uiSchema: medalAwardPg.uiSchema,
          schema: medalAwardPg.schema,
          pageClass: 'evidence-medal-award',
        },
      },
    },
    medicalTreatmentChapter: {
      title: '[WIP] Medical treatment',
      pages: {
        page1: {
          path: 'medical-treatment-start',
          title: '[WIP] Where did you receive medical treatment?',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {
              wipField: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
