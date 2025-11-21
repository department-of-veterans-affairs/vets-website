import footerContent from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  witnessName,
  witnessAddress,
  witnessPhone,
  veteranName,
  veteranIdentification,
  spouseName,
  relationshipToVeteran,
  relationshipToSpouse,
  howLongKnownVeteran,
  howLongKnownSpouse,
  visitFrequencyVeteran,
  visitOccasionsVeteran,
  visitFrequencySpouse,
  visitOccasionsSpouse,
  generallyKnownAsMarried,
  everDeniedMarriage,
  witnessConsidersMarried,
  spouseFirstName,
  spouseLastName,
  heardReferToEachOther,
  referenceDateTime,
  referencePlace,
  cohabitation,
  livingPeriodsPages,
  continuousLiving,
  veteranPriorMarriages,
  veteranMarriagesListPages,
  spousePriorMarriages,
  spouseMarriagesListPages,
  remarks,
  signatureByMark,
  witnessSignaturesPages,
} from '../pages';
import transformForSubmit from './submit-transformer';
import prefillTransformer from './prefill-transformer';
import getHelp from '../../shared/components/GetFormHelp';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21P-4171',
  version: 0,
  trackingPrefix: '21p-4171-',
  transformForSubmit,
  prefillTransformer,
  footerContent,
  getHelp,
  v3SegmentedProgressBar: true,
  title: 'Supporting Statement Regarding Marriage (21P-4171)',
  subTitle: 'VA Form 21P-4171',
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I certify that the foregoing statements are true and correct to the best of my knowledge and belief. I understand that this statement will be considered in connection with an application for VA benefits based on a marital relationship between the veteran and the person named in Item 3.',
      messageAriaDescribedby:
        'I certify that the foregoing statements are true and correct to the best of my knowledge and belief.',
    },
  },
  chapters: {
    // Chapter 1: Basic Identification (Items 1-4)
    basicIdentificationChapter: {
      title: 'Basic identification',
      pages: {
        veteranName: {
          path: 'veteran-name',
          title: 'Veteran name',
          uiSchema: veteranName.uiSchema,
          schema: veteranName.schema,
        },
        veteranIdentification: {
          path: 'veteran-identification',
          title: 'Veteran identification',
          uiSchema: veteranIdentification.uiSchema,
          schema: veteranIdentification.schema,
        },
        spouseName: {
          path: 'spouse-name',
          title: 'Claimed spouse name',
          uiSchema: spouseName.uiSchema,
          schema: spouseName.schema,
        },
        witnessName: {
          path: 'your-name',
          title: 'Your name',
          uiSchema: witnessName.uiSchema,
          schema: witnessName.schema,
        },
        witnessAddress: {
          path: 'your-address',
          title: 'Your address',
          uiSchema: witnessAddress.uiSchema,
          schema: witnessAddress.schema,
        },
        witnessPhone: {
          path: 'your-phone',
          title: 'Your phone numbers',
          uiSchema: witnessPhone.uiSchema,
          schema: witnessPhone.schema,
        },
      },
    },

    // Chapter 2: Relationship Information (Items 5-6)
    relationshipInformationChapter: {
      title: 'Relationship information',
      pages: {
        relationshipToVeteran: {
          path: 'relationship-to-veteran',
          title: 'Relationship to Veteran',
          uiSchema: relationshipToVeteran.uiSchema,
          schema: relationshipToVeteran.schema,
        },
        relationshipToSpouse: {
          path: 'relationship-to-spouse',
          title: 'Relationship to spouse',
          uiSchema: relationshipToSpouse.uiSchema,
          schema: relationshipToSpouse.schema,
        },
        howLongKnownVeteran: {
          path: 'how-long-known-veteran',
          title: 'How long known Veteran',
          uiSchema: howLongKnownVeteran.uiSchema,
          schema: howLongKnownVeteran.schema,
        },
        howLongKnownSpouse: {
          path: 'how-long-known-spouse',
          title: 'How long known spouse',
          uiSchema: howLongKnownSpouse.uiSchema,
          schema: howLongKnownSpouse.schema,
        },
      },
    },

    // Chapter 3: Visitation and Knowledge (Items 7-9)
    visitationKnowledgeChapter: {
      title: 'Visitation and knowledge',
      pages: {
        visitFrequencyVeteran: {
          path: 'visit-frequency-veteran',
          title: 'Your visits to the Veteran',
          uiSchema: visitFrequencyVeteran.uiSchema,
          schema: visitFrequencyVeteran.schema,
        },
        visitOccasionsVeteran: {
          path: 'visit-occasions-veteran',
          title: 'Occasions you visited the Veteran',
          uiSchema: visitOccasionsVeteran.uiSchema,
          schema: visitOccasionsVeteran.schema,
        },
        visitFrequencySpouse: {
          path: 'visit-frequency-spouse',
          title: 'Your visits to the spouse',
          uiSchema: visitFrequencySpouse.uiSchema,
          schema: visitFrequencySpouse.schema,
        },
        visitOccasionsSpouse: {
          path: 'visit-occasions-spouse',
          title: 'Occasions you met the spouse',
          uiSchema: visitOccasionsSpouse.uiSchema,
          schema: visitOccasionsSpouse.schema,
        },
        generallyKnownAsMarried: {
          path: 'generally-known-as-married',
          title: 'Marriage recognition',
          uiSchema: generallyKnownAsMarried.uiSchema,
          schema: generallyKnownAsMarried.schema,
        },
        everDeniedMarriage: {
          path: 'ever-denied-marriage',
          title: 'Marriage denial',
          uiSchema: everDeniedMarriage.uiSchema,
          schema: everDeniedMarriage.schema,
        },
        witnessConsidersMarried: {
          path: 'witness-considers-married',
          title: 'Your belief about the marriage',
          uiSchema: witnessConsidersMarried.uiSchema,
          schema: witnessConsidersMarried.schema,
        },
      },
    },

    // Chapter 4: Marriage Belief and Evidence (Items 10-12)
    marriageBeliefChapter: {
      title: 'Marriage belief and evidence',
      pages: {
        spouseFirstName: {
          path: 'spouse-first-name',
          title: 'First name used by spouse',
          uiSchema: spouseFirstName.uiSchema,
          schema: spouseFirstName.schema,
        },
        spouseLastName: {
          path: 'spouse-last-name',
          title: 'Last name used by spouse',
          uiSchema: spouseLastName.uiSchema,
          schema: spouseLastName.schema,
        },
        heardReferToEachOther: {
          path: 'heard-refer-to-each-other',
          title: 'Heard refer to each other',
          uiSchema: heardReferToEachOther.uiSchema,
          schema: heardReferToEachOther.schema,
        },
        referenceDateTime: {
          path: 'reference-date',
          title: 'When did this occur',
          uiSchema: referenceDateTime.uiSchema,
          schema: referenceDateTime.schema,
          depends: referenceDateTime.depends,
        },
        referencePlace: {
          path: 'reference-place',
          title: 'Where did this occur',
          uiSchema: referencePlace.uiSchema,
          schema: referencePlace.schema,
          depends: referencePlace.depends,
        },
      },
    },

    // Chapter 5: Cohabitation History (Items 13-14)
    cohabitationHistoryChapter: {
      title: 'Cohabitation history',
      pages: {
        cohabitation: {
          path: 'cohabitation',
          title: 'Living together',
          uiSchema: cohabitation.uiSchema,
          schema: cohabitation.schema,
        },
        livingPeriodsSummary: {
          ...livingPeriodsPages.livingPeriodsSummary,
          depends: formData => formData?.living?.maintainedHome === false,
        },
        livingPeriodDates: {
          ...livingPeriodsPages.livingPeriodDates,
          depends: formData => formData?.living?.maintainedHome === false,
        },
        livingPeriodLocation: {
          ...livingPeriodsPages.livingPeriodLocation,
          depends: formData => formData?.living?.maintainedHome === false,
        },
        continuousLiving: {
          path: 'continuous-living',
          title: 'Continuous cohabitation',
          depends: formData => formData?.living?.maintainedHome === true,
          uiSchema: continuousLiving.uiSchema,
          schema: continuousLiving.schema,
        },
      },
    },

    // Chapter 6: Veteran Prior Marriages (Items 15A-15B)
    veteranPriorMarriagesChapter: {
      title: 'Prior marriages - Veteran',
      pages: {
        veteranPriorMarriages: {
          path: 'veteran-marriages',
          title: "Veteran's other marriages",
          uiSchema: veteranPriorMarriages.uiSchema,
          schema: veteranPriorMarriages.schema,
        },
        veteranMarriagesSummary: {
          ...veteranMarriagesListPages.veteranMarriagesSummary,
          depends: formData => formData?.veteran?.hadOtherMarriages === true,
        },
        veteranMarriageSpouseName: {
          ...veteranMarriagesListPages.veteranMarriageSpouseName,
          depends: formData => formData?.veteran?.hadOtherMarriages === true,
        },
        veteranMarriageType: {
          ...veteranMarriagesListPages.veteranMarriageType,
          depends: formData => formData?.veteran?.hadOtherMarriages === true,
        },
        veteranMarriageDate: {
          ...veteranMarriagesListPages.veteranMarriageDate,
          depends: formData => formData?.veteran?.hadOtherMarriages === true,
        },
        veteranMarriagePlace: {
          ...veteranMarriagesListPages.veteranMarriagePlace,
          depends: formData => formData?.veteran?.hadOtherMarriages === true,
        },
        veteranMarriageEndDate: {
          ...veteranMarriagesListPages.veteranMarriageEndDate,
          depends: formData => formData?.veteran?.hadOtherMarriages === true,
        },
        veteranMarriageEndPlace: {
          ...veteranMarriagesListPages.veteranMarriageEndPlace,
          depends: formData => formData?.veteran?.hadOtherMarriages === true,
        },
        veteranMarriageHowEnded: {
          ...veteranMarriagesListPages.veteranMarriageHowEnded,
          depends: formData => formData?.veteran?.hadOtherMarriages === true,
        },
      },
    },

    // Chapter 7: Spouse Prior Marriages (Items 16A-16B)
    spousePriorMarriagesChapter: {
      title: 'Prior marriages - Claimed spouse',
      pages: {
        spousePriorMarriages: {
          path: 'spouse-marriages',
          title: "Spouse's other marriages",
          uiSchema: spousePriorMarriages.uiSchema,
          schema: spousePriorMarriages.schema,
        },
        spouseMarriagesSummary: {
          ...spouseMarriagesListPages.spouseMarriagesSummary,
          depends: formData => formData?.spouse?.hadOtherMarriages === true,
        },
        spouseMarriageSpouseName: {
          ...spouseMarriagesListPages.spouseMarriageSpouseName,
          depends: formData => formData?.spouse?.hadOtherMarriages === true,
        },
        spouseMarriageType: {
          ...spouseMarriagesListPages.spouseMarriageType,
          depends: formData => formData?.spouse?.hadOtherMarriages === true,
        },
        spouseMarriageDate: {
          ...spouseMarriagesListPages.spouseMarriageDate,
          depends: formData => formData?.spouse?.hadOtherMarriages === true,
        },
        spouseMarriagePlace: {
          ...spouseMarriagesListPages.spouseMarriagePlace,
          depends: formData => formData?.spouse?.hadOtherMarriages === true,
        },
        spouseMarriageEndDate: {
          ...spouseMarriagesListPages.spouseMarriageEndDate,
          depends: formData => formData?.spouse?.hadOtherMarriages === true,
        },
        spouseMarriageEndPlace: {
          ...spouseMarriagesListPages.spouseMarriageEndPlace,
          depends: formData => formData?.spouse?.hadOtherMarriages === true,
        },
        spouseMarriageHowEnded: {
          ...spouseMarriagesListPages.spouseMarriageHowEnded,
          depends: formData => formData?.spouse?.hadOtherMarriages === true,
        },
      },
    },

    // Chapter 8: Additional Information (Item 17)
    additionalInfoChapter: {
      title: 'Additional information',
      pages: {
        remarks: {
          path: 'remarks',
          title: 'Remarks',
          uiSchema: remarks.uiSchema,
          schema: remarks.schema,
        },
      },
    },

    // Chapter 9: Certification and Signatures (Items 18-20)
    certificationChapter: {
      title: 'Certification and signature',
      pages: {
        signatureByMark: {
          path: 'signature-type',
          title: 'Signature type',
          uiSchema: signatureByMark.uiSchema,
          schema: signatureByMark.schema,
        },
        witnessSignaturesSummary: {
          ...witnessSignaturesPages.witnessSignaturesSummary,
          depends: formData => formData?.signatureByMark === true,
        },
        witnessSignatureName: {
          ...witnessSignaturesPages.witnessSignatureName,
          depends: formData => formData?.signatureByMark === true,
        },
        witnessSignatureAddress: {
          ...witnessSignaturesPages.witnessSignatureAddress,
          depends: formData => formData?.signatureByMark === true,
        },
      },
    },
  },
};

export default formConfig;
