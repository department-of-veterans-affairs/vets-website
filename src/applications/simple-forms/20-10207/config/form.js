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
// import nameAndDobPg from '../pages/nameAndDateofBirth';
// import idInfoPg from '../pages/idInfo';
import vetNameAndDobPg from '../pages/veteranNameAndDateofBirth';
import nonVetNameAndDobPg from '../pages/nonVeteranNameAndDateOfBirth';
import vetIdInfoPg from '../pages/veteranIdInfo';
import nonVetIdInfoPg from '../pages/nonVeteranIdInfo';
import livingSituationPg from '../pages/livingSituation';
import livingSituationThirdPartyVetPg from '../pages/livingSituationThirdPartyVeteran';
import livingSituationThirdPartyNonVetPg from '../pages/livingSituationThirdPartyNonVeteran';
import otherHousingRisksPg from '../pages/otherHousingRisks';
import otherHousingRisksThirdPartyVeteran from '../pages/otherHousingRisksThirdPartyVeteran';
import otherHousingRisksThirdPartyNonVeteran from '../pages/otherHousingRisksThirdPartyNonVeteran';
import mailingAddressYesNo from '../pages/mailingAddressYesNo';
import mailingAddressYesNo3rdPtyVetPg from '../pages/mailingAddressYesNoThirdPartyVeteran';
import mailingAddressYesNo3rdPtyNonVetPg from '../pages/mailingAddressYesNoThirdPartyNonVeteran';
import veteranMailingAddressPg from '../pages/veteranMailingAddress';
import nonVeteranMailingAddressPg from '../pages/nonVeteranMailingAddress';
import veteranMailingAddress3rdPtyVetPg from '../pages/veteranMailingAddressThirdPartyVeteran';
import nonVeteranMailingAddress3rdPtyNonVetPg from '../pages/nonVeteranMailingAddressThirdPartyNonVeteran';
import veteranPhoneAndEmailPg from '../pages/veteranPhoneAndEmail';
import nonVeteranPhoneAndEmailPg from '../pages/nonVeteranPhoneAndEmail';
import otherReasonsPg from '../pages/otherReasons';
import otherReasons3rdPtyVetPg from '../pages/otherReasonsThirdPartyVeteran';
import otherReasons3rdPtyNonVetPg from '../pages/otherReasonsThirdPartyNonVeteran';
import otherReasonsHomelessPg from '../pages/otherReasonsHomeless';
import otherReasonsHomeless3rdPtyVetPg from '../pages/otherReasonsHomelessThirdPartyVeteran';
import otherReasonsHomeless3rdPtyNonVetPg from '../pages/otherReasonsHomelessThirdPartyNonVeteran';
import financialHardshipPg from '../pages/evidenceFinancialHardship';
import terminalIllnessPg from '../pages/evidenceTerminalIllness';
import alsPg from '../pages/evidenceALS';
import vsiPg from '../pages/evidenceVSI';
import powConfinementPg from '../pages/evidenceConfinement';
import powConfinement2Pg from '../pages/evidenceConfinement2';
import powDocsPg from '../pages/evidencePowDocuments';
import medalAwardPg from '../pages/evidenceMedalAward';
import medTreatmentPg from '../pages/medicalTreatment';
import medTreatment3rdPtyVetPg from '../pages/medicalTreatmentThirdPartyVeteran';
import medTreatment3rdPtyNonVetPg from '../pages/medicalTreatmentThirdPartyNonVeteran';
import { PREPARER_TYPES, SUBTITLE, TITLE } from './constants';
import {
  getMockData,
  getPersonalInformationChapterTitle,
  getLivingSituationChapterTitle,
  getContactInfoChapterTitle,
  statementOfTruthFullNamePath,
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
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
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
        // TODO: Refactor for non-veteran story
        // nameAndDateOfBirthPage: {
        //   path: 'name-and-date-of-birth',
        //   title: 'Name and date of birth',
        //   uiSchema: nameAndDobPg.uiSchema,
        //   schema: nameAndDobPg.schema,
        //   pageClass: 'name-and-date-of-birth',
        // },
        // identificationInformationPage: {
        //   path: 'identification-information',
        //   title: 'Identification information',
        //   uiSchema: idInfoPg.uiSchema,
        //   schema: idInfoPg.schema,
        //   pageClass: 'identification-information',
        // },
        veteranNameAndDateOfBirthPageA: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
          path: 'veteran-name-and-date-of-birth-a',
          title: 'Name and date of birth',
          uiSchema: vetNameAndDobPg.uiSchema,
          schema: vetNameAndDobPg.schema,
          pageClass: 'veteran-name-and-date-of-birth',
        },
        nonVeteranNameAndDateOfBirthPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.NON_VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'non-veteran-name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nonVetNameAndDobPg.uiSchema,
          schema: nonVetNameAndDobPg.schema,
          pageClass: 'non-veteran-name-and-date-of-birth',
        },
        veteranIdentificationInformationPageA: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
          path: 'veteran-identification-information-a',
          title: 'Identification information',
          uiSchema: vetIdInfoPg.uiSchema,
          schema: vetIdInfoPg.schema,
          pageClass: 'veteran-identification-information',
        },
        nonVeteranIdentificationInformationPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.NON_VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'non-veteran-identification-information',
          title: 'Identification information',
          uiSchema: nonVetIdInfoPg.uiSchema,
          schema: nonVetIdInfoPg.schema,
          pageClass: 'non-veteran-identification-information',
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
      title: ({ formData }) => getContactInfoChapterTitle(formData),
      pages: {
        mailingAddressYesNoPage: {
          depends: formData =>
            (formData.preparerType === PREPARER_TYPES.VETERAN ||
              formData.preparerType === PREPARER_TYPES.NON_VETERAN) &&
            formData.livingSituation.NONE,
          path: 'mailing-address-yes-no',
          title: 'Mailing address yes/no',
          uiSchema: mailingAddressYesNo.uiSchema,
          schema: mailingAddressYesNo.schema,
          pageClass: 'mailing-address-yes-no',
        },
        mailingAddressYesNoThirdPartyVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN &&
            formData.livingSituation.NONE,
          path: 'mailing-address-yes-no-third-party-veteran',
          title: 'Mailing address yes/no',
          uiSchema: mailingAddressYesNo3rdPtyVetPg.uiSchema,
          schema: mailingAddressYesNo3rdPtyVetPg.schema,
          pageClass: 'mailing-address-yes-no-third-party-veteran',
        },
        mailingAddressYesNoThirdPartyNonVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN &&
            formData.livingSituation.NONE,
          path: 'mailing-address-yes-no-third-party-non-veteran',
          title: 'Mailing address yes/no',
          uiSchema: mailingAddressYesNo3rdPtyNonVetPg.uiSchema,
          schema: mailingAddressYesNo3rdPtyNonVetPg.schema,
          pageClass: 'mailing-address-yes-no-third-party-non-veteran',
        },
        veteranMailingAddressPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.VETERAN &&
            formData.livingSituation.NONE &&
            formData.mailingAddressYesNo,
          path: 'veteran-mailing-address',
          title: 'Mailing address',
          uiSchema: veteranMailingAddressPg.uiSchema,
          schema: veteranMailingAddressPg.schema,
          pageClass: 'veteran-mailing-address',
        },
        nonVeteranMailingAddressPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.NON_VETERAN &&
            formData.livingSituation.NONE &&
            formData.mailingAddressYesNo,
          path: 'non-veteran-mailing-address',
          title: 'Mailing address',
          uiSchema: nonVeteranMailingAddressPg.uiSchema,
          schema: nonVeteranMailingAddressPg.schema,
          pageClass: 'non-veteran-mailing-address',
        },
        veteranMailingAddressThirdPartyVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN &&
            formData.livingSituation.NONE &&
            formData.mailingAddressYesNo,
          path: 'veteran-mailing-address-third-party-veteran',
          title: 'Mailing address',
          uiSchema: veteranMailingAddress3rdPtyVetPg.uiSchema,
          schema: veteranMailingAddress3rdPtyVetPg.schema,
          pageClass: 'veteran-mailing-address-third-party-veteran',
        },
        nonVeteranMailingAddressThirdPartyNonVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN &&
            formData.livingSituation.NONE &&
            formData.mailingAddressYesNo,
          path: 'non-veteran-mailing-address-third-party-non-veteran',
          title: 'Mailing address',
          uiSchema: nonVeteranMailingAddress3rdPtyNonVetPg.uiSchema,
          schema: nonVeteranMailingAddress3rdPtyNonVetPg.schema,
          pageClass: 'non-veteran-mailing-address-third-party-non-veteran',
        },
        veteranPhoneAndEmailPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
          path: 'veteran-phone-and-email',
          title: 'Phone and email address',
          uiSchema: veteranPhoneAndEmailPg.uiSchema,
          schema: veteranPhoneAndEmailPg.schema,
          pageClass: 'veteran-phone-and-email',
        },
        nonVeteranPhoneAndEmailPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.NON_VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'non-veteran-phone-and-email',
          title: 'Phone and email address',
          uiSchema: nonVeteranPhoneAndEmailPg.uiSchema,
          schema: nonVeteranPhoneAndEmailPg.schema,
          pageClass: 'non-veteran-phone-and-email',
        },
      },
    },
    veteranPersonalInformationChapter: {
      title: 'Veteran’s personal information',
      pages: {
        veteranNameAndDateOfBirthPageB: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.NON_VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'veteran-name-and-date-of-birth-b',
          title: 'Veteran’s name and date of birth',
          uiSchema: vetNameAndDobPg.uiSchema,
          schema: vetNameAndDobPg.schema,
          pageClass: 'veteran-name-and-date-of-birth',
        },
        veteranIdentificationInformationPageB: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.NON_VETERAN ||
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          path: 'veteran-identification-information-b',
          title: 'Veteran’s identification information',
          uiSchema: vetIdInfoPg.uiSchema,
          schema: vetIdInfoPg.schema,
          pageClass: 'veteran-identification-information',
        },
      },
    },
    otherReasonsChapter: {
      title: 'Other reasons for request',
      pages: {
        otherReasonsPage: {
          depends: formData =>
            (formData.preparerType === PREPARER_TYPES.VETERAN ||
              formData.preparerType === PREPARER_TYPES.NON_VETERAN) &&
            formData.livingSituation.NONE,
          path: 'other-reasons',
          title: 'Other reasons for request',
          uiSchema: otherReasonsPg.uiSchema,
          schema: otherReasonsPg.schema,
          pageClass: 'other-reasons',
        },
        otherReasonsThirdPartyVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN &&
            formData.livingSituation.NONE,
          path: 'other-reasons-third-party-veteran',
          title: 'Other reasons for request',
          uiSchema: otherReasons3rdPtyVetPg.uiSchema,
          schema: otherReasons3rdPtyVetPg.schema,
          pageClass: 'other-reasons-third-party-veteran',
        },
        otherReasonsThirdPartyNonVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN &&
            formData.livingSituation.NONE,
          path: 'other-reasons-third-party-non-veteran',
          title: 'Other reasons for request',
          uiSchema: otherReasons3rdPtyNonVetPg.uiSchema,
          schema: otherReasons3rdPtyNonVetPg.schema,
          pageClass: 'other-reasons-third-party-non-veteran',
        },
        otherReasonsHomelessPage: {
          depends: formData =>
            (formData.preparerType === PREPARER_TYPES.VETERAN ||
              formData.preparerType === PREPARER_TYPES.NON_VETERAN) &&
            !formData.livingSituation.NONE,
          path: 'other-reasons-homeless',
          title: 'Other reasons for request',
          uiSchema: otherReasonsHomelessPg.uiSchema,
          schema: otherReasonsHomelessPg.schema,
          pageClass: 'other-reasons-homeless',
        },
        otherReasonsHomelessThirdPartyVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN &&
            !formData.livingSituation.NONE,
          path: 'other-reasons-homeless-third-party-veteran',
          title: 'Other reasons for request',
          uiSchema: otherReasonsHomeless3rdPtyVetPg.uiSchema,
          schema: otherReasonsHomeless3rdPtyVetPg.schema,
          pageClass: 'other-reasons-homeless-third-party-veteran',
        },
        otherReasonsHomelessThirdPartyNonVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN &&
            !formData.livingSituation.NONE,
          path: 'other-reasons-homeless-third-party-non-veteran',
          title: 'Other reasons for request',
          uiSchema: otherReasonsHomeless3rdPtyNonVetPg.uiSchema,
          schema: otherReasonsHomeless3rdPtyNonVetPg.schema,
          pageClass: 'other-reasons-homeless-third-party-non-veteran',
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
      title: 'Medical treatment',
      pages: {
        medicalTreatmentPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.VETERAN ||
            formData.preparerType === PREPARER_TYPES.NON_VETERAN,
          title: 'Where did you receive medical treatment?', // for review page (has to be more than one word)
          path: 'medical-treatment',
          uiSchema: medTreatmentPg.uiSchema,
          schema: medTreatmentPg.schema,
          pageClass: 'medical-treatment',
        },
        medicalTreatmentThirdPartyVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_VETERAN,
          title: 'Where did the veteran receive medical treatment?',
          path: 'medical-treatment-third-party-veteran',
          uiSchema: medTreatment3rdPtyVetPg.uiSchema,
          schema: medTreatment3rdPtyVetPg.schema,
          pageClass: 'medical-treatment-third-party-veteran',
        },
        medicalTreatmentThirdPartyNonVeteranPage: {
          depends: formData =>
            formData.preparerType === PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
          title: 'Where did the claimant receive medical treatment?',
          path: 'medical-treatment-third-party-non-veteran',
          uiSchema: medTreatment3rdPtyNonVetPg.uiSchema,
          schema: medTreatment3rdPtyNonVetPg.schema,
          pageClass: 'medical-treatment-third-party-non-veteran',
        },
      },
    },
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: formData => statementOfTruthFullNamePath({ formData }),
      checkboxLabel:
        'I confirm that the information above is correct and true to the best of my knowledge and belief.',
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;
