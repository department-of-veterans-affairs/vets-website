import { getAppUrl } from '../utilities/registry-helpers';

export const VA_FORM_IDS = Object.freeze({
  FEEDBACK_TOOL: 'FEEDBACK-TOOL',
  FORM_0873: '0873',
  FORM_10_10CG: '10-10CG',
  FORM_10_10D: '10-10D',
  FORM_10_10EZ: '1010ez',
  FORM_10_10EZR: '10-10EZR',
  FORM_10_3542: '10-3542',
  FORM_10_7959A: '10-7959A',
  FORM_10_7959C: '10-7959C',
  FORM_10_7959F_1: '10-7959F-1',
  FORM_10_7959F_2: '10-7959F-2',
  FORM_10182: '10182',
  FORM_1330M: '1330M',
  FORM_1330M2: '1330M2',
  FORM_1919: '22-1919',
  FORM_20_0995: '20-0995',
  FORM_20_0996: '20-0996',
  FORM_20_10206: '20-10206',
  FORM_20_10207: '20-10207',
  FORM_21_0779_UPLOAD: '21-0779-UPLOAD',
  FORM_21_0845: '21-0845',
  FORM_21_0966: '21-0966',
  FORM_21_0972: '21-0972',
  FORM_21_10210: '21-10210',
  FORM_21_22: '21-22',
  FORM_21_22A: '21-22a',
  FORM_21_4138: '21-4138',
  FORM_21_4140: '21-4140',
  FORM_21_4142: '21-4142',
  FORM_21_4192_UPLOAD: '21-4192-UPLOAD',
  FORM_21_509_UPLOAD: '21-509-UPLOAD',
  FORM_21_526EZ: '21-526EZ',
  FORM_21_686C: '686C-674',
  FORM_21_686C_UPLOAD: '21-686C-UPLOAD',
  FORM_21_686CV2: '686C-674-V2',
  FORM_21_8940_UPLOAD: '21-8940-UPLOAD',
  FORM_21A: '21a',
  FORM_21P_0516_1_UPLOAD: '21P-0516-1-UPLOAD',
  FORM_21P_0518_1_UPLOAD: '21P-0518-1-UPLOAD',
  FORM_21P_0847: '21P-0847',
  FORM_21P_0969: '21P-0969',
  FORM_21P_527EZ: '21P-527EZ',
  FORM_21P_530: '21P-530',
  FORM_21P_530A_UPLOAD: '21P-530a-UPLOAD',
  FORM_21P_530EZ: '21P-530EZ',
  FORM_21P_8049_UPLOAD: '21P-8049-UPLOAD',
  FORM_22_0994: '22-0994',
  FORM_22_10203: '22-10203',
  FORM_22_10215: '22-10215',
  FORM_22_10216: '22-10216',
  FORM_22_10282: '22-10282',
  FORM_22_1990: '22-1990',
  FORM_22_1990EMEB: '22-1990EMEB',
  FORM_22_1990EZ: '22-1990EZ',
  FORM_22_1995: '22-1995',
  FORM_22_1995S: '22-1995S',
  FORM_22_5490E: '22-5490E',
  FORM_22_8794: '22-8794',
  FORM_26_1880: '26-1880',
  FORM_26_4555: '26-4555',
  FORM_28_1900: '28-1900',
  FORM_28_8832: '28-8832',
  FORM_40_0247: '40-0247',
  FORM_40_10007: '40-10007',
  FORM_5655: '5655',
  FORM_COVID_VACCINATION_EXPANSION: 'COVID-VACCINATION-EXPANSION',
  FORM_COVID_VACCINE_TRIAL_UPDATE: 'COVID-VACCINE-TRIAL-UPDATE',
  FORM_COVID_VACCINE_TRIAL: 'COVID-VACCINE-TRIAL',
  FORM_DISPUTE_DEBT: 'DISPUTE-DEBT',
  FORM_HC_QSTNR: 'HC-QSTNR',
  FORM_MOCK_AE_DESIGN_PATTERNS: 'FORM-MOCK-AE-DESIGN-PATTERNS',
  FORM_MOCK_ALT_HEADER: 'FORM_MOCK_ALT_HEADER',
  FORM_MOCK_APPEALS: 'FORM_MOCK_APPEALS',
  FORM_MOCK_HLR: 'FORM_MOCK_HLR',
  FORM_MOCK_MINIMAL_HEADER: 'FORM-MOCK-MINIMAL-HEADER',
  FORM_MOCK_PATTERNS_V3: 'FORM_MOCK_PATTERNS_V3',
  FORM_MOCK_SF_PATTERNS: 'FORM_MOCK_SF_PATTERNS',
  FORM_MOCK: '00-1234',
  FORM_T_QSTNR: 'T-QSTNR',
  FORM_VA_2346A: 'MDOT',
  FORM_WELCOME_VA_SETUP_REVIEW_INFORMATION:
    'WELCOME_VA_SETUP_REVIEW_INFORMATION',
  FORM_XX_123: 'XX-123',
});

export const VA_FORM_IDS_SKIP_INFLECTION = Object.freeze([
  VA_FORM_IDS.FORM_21_526EZ,
]);

export const VA_FORM_IDS_IN_PROGRESS_FORMS_API = Object.freeze({
  // 526 save-in-progress endpoint that adds an `updatedRatedDisabilities` array
  // to the saved form data from /v0/disability_compensation_in_progress_forms/
  [VA_FORM_IDS.FORM_21_526EZ]: '/v0/disability_compensation_in_progress_forms/',
  [VA_FORM_IDS.FORM_21A]:
    '/accredited_representative_portal/v0/in_progress_forms/',
  '21-686C-UPLOAD': '/accredited_representative_portal/v0/in_progress_forms/',
});

// Entries previously added to FORM_LINKS go in here:
export const getAllFormLinks = getAppUrlImpl => {
  if (!getAppUrlImpl) {
    throw new Error(
      'getAppUrlImpl is required as an argument of getAllFormLinks()',
    );
  }

  const tryGetAppUrl = formId => {
    try {
      return getAppUrlImpl(formId);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      return null;
    }
  };

  return {
    [VA_FORM_IDS.FEEDBACK_TOOL]: `${tryGetAppUrl('feedback-tool')}/`,
    [VA_FORM_IDS.FORM_10_10D]: `${tryGetAppUrl('10-10D')}/`,
    [VA_FORM_IDS.FORM_10_10EZ]: `${tryGetAppUrl('hca')}/`,
    [VA_FORM_IDS.FORM_10_7959A]: `${tryGetAppUrl('10-7959a')}/`,
    [VA_FORM_IDS.FORM_10_7959C]: `${tryGetAppUrl('10-7959C')}/`,
    [VA_FORM_IDS.FORM_10_7959F_1]: `${tryGetAppUrl('10-7959f-1-FMP')}/`,
    [VA_FORM_IDS.FORM_10_7959F_2]: `${tryGetAppUrl('fmp-cover-sheet')}/`,
    [VA_FORM_IDS.FORM_10182]: `${tryGetAppUrl('10182-board-appeal')}/`,
    [VA_FORM_IDS.FORM_20_0995]: `${tryGetAppUrl('995-supplemental-claim')}/`,
    [VA_FORM_IDS.FORM_20_0996]: `${tryGetAppUrl('0996-higher-level-review')}/`,
    [VA_FORM_IDS.FORM_20_10206]: `${tryGetAppUrl('10206-pa')}/`,
    [VA_FORM_IDS.FORM_20_10207]: `${tryGetAppUrl('10207-pp')}/`,
    [VA_FORM_IDS.FORM_21_0845]: `${tryGetAppUrl('0845-auth-disclose')}/`,
    [VA_FORM_IDS.FORM_21_0966]: `${tryGetAppUrl(
      '21-0966-intent-to-file-a-claim',
    )}/`,
    [VA_FORM_IDS.FORM_21_0972]: `${tryGetAppUrl('21-0972-alternate-signer')}/`,
    [VA_FORM_IDS.FORM_21_10210]: `${tryGetAppUrl(
      '10210-lay-witness-statement',
    )}/`,
    [VA_FORM_IDS.FORM_21_22]: `${tryGetAppUrl('appoint-a-representative')}/`,
    [VA_FORM_IDS.FORM_21_22A]: `${tryGetAppUrl('appoint-a-representative')}/`,
    [VA_FORM_IDS.FORM_21_4142]: `${tryGetAppUrl('21-4142-medical-release')}/`,
    [VA_FORM_IDS.FORM_21_526EZ]: `${tryGetAppUrl('526EZ-all-claims')}/`,
    [VA_FORM_IDS.FORM_21_686C]: `${tryGetAppUrl('686C-674')}/`,
    [VA_FORM_IDS.FORM_21P_0847]: `${tryGetAppUrl(
      '21P-0847-substitute-claimant',
    )}/`,
    [VA_FORM_IDS.FORM_21P_527EZ]: `${tryGetAppUrl('pensions')}/`,
    [VA_FORM_IDS.FORM_21P_530EZ]: `${tryGetAppUrl('burials-ez')}/`,
    [VA_FORM_IDS.FORM_22_0994]: `${tryGetAppUrl('0994-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_22_10203]: `${tryGetAppUrl('10203-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_22_10215]: `${tryGetAppUrl('10215-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_22_10282]: `${tryGetAppUrl('10282-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_22_1990EZ]: `${tryGetAppUrl('1990ez-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_22_1995]: `${tryGetAppUrl('1995-edu-benefits')}/`,
    [VA_FORM_IDS.FORM_26_1880]: `${tryGetAppUrl('coe')}/`,
    [VA_FORM_IDS.FORM_26_4555]: `${tryGetAppUrl('4555-adapted-housing')}/`,
    [VA_FORM_IDS.FORM_28_1900]: `${tryGetAppUrl('28-1900-chapter-31')}/`,
    [VA_FORM_IDS.FORM_28_8832]: `${tryGetAppUrl(
      '25-8832-planning-and-career-guidance',
    )}/`,
    [VA_FORM_IDS.FORM_40_0247]: `${tryGetAppUrl('0247-pmc')}/`,
    [VA_FORM_IDS.FORM_40_10007]: `${tryGetAppUrl('pre-need')}/`,
    [VA_FORM_IDS.FORM_5655]: `${tryGetAppUrl('request-debt-help-form-5655')}/`,
    [VA_FORM_IDS.FORM_VA_2346A]: `${tryGetAppUrl('order-form-2346')}/`,
    [VA_FORM_IDS.FORM_WELCOME_VA_SETUP_REVIEW_INFORMATION]: `${tryGetAppUrl(
      'welcome-va-setup-review-information',
    )}/`,
    [VA_FORM_IDS.FORM_DISPUTE_DEBT]: `${tryGetAppUrl('DISPUTE-DEBT')}/`,
    [VA_FORM_IDS.FORM_1330M2]: `${tryGetAppUrl('1330M2')}/`,
    [VA_FORM_IDS.FORM_1330M]: `${tryGetAppUrl('1330M')}/`,
    [VA_FORM_IDS.FORM_22_10216]: `${tryGetAppUrl('10216-edu-benefits')}/`,
    // [VA_FORM_IDS.FORM_28_1900]: `${tryGetAppUrl('28-1900')}/`,
  };
};

// memoizing so that we don't have to recompute the form links every time
// returns a function that takes a formId and returns a link
export const memoizedGetFormLink = (getAppUrlImpl = getAppUrl) => {
  let cache = {};
  return formId => {
    if (!(formId in cache)) {
      cache = getAllFormLinks(getAppUrlImpl);
    }

    return cache?.[formId] || null;
  };
};

/**
 * The following MY_VA_SIP_FORMS array is a work-in-progress, maintained by the Authenticated Experience team.
 * Platform documentation have been updated to reflect this change
 *
 * https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-how-to-set-up-save-in-progress-si
 */

export const MY_VA_SIP_FORMS = [
  {
    id: VA_FORM_IDS.FEEDBACK_TOOL,
    benefit: 'feedback',
    title: 'feedback (GI Bill School Feedback Tool)',
    description: 'feedback application (FEEDBACK-TOOL)',
    trackingPrefix: 'gi_bill_feedback',
  },
  {
    id: VA_FORM_IDS.FORM_10_10D,
    benefit: 'application for champva benefits',
    title: 'application for champva benefits (10-10D)',
    description: 'application for champva benefits application (10-10D)',
    trackingPrefix: '10-10D-',
  },
  {
    id: VA_FORM_IDS.FORM_10_10EZ,
    benefit: 'health care benefits',
    title: 'health care benefits (10-10EZ)',
    description: 'health care benefits application (10-10EZ)',
    trackingPrefix: 'hca-',
  },
  {
    id: VA_FORM_IDS.FORM_10_7959A,
    benefit: `CHAMPVA claim form`,
    title: `CHAMPVA claim form (10-7959a)`,
    description: '',
    trackingPrefix: '10-7959a-',
  },
  {
    id: VA_FORM_IDS.FORM_10_7959C,
    benefit: `other health insurance certification`,
    title: `other health insurance certification (10-7959C)`,
    description: '',
    trackingPrefix: '10-7959C-',
  },
  {
    id: VA_FORM_IDS.FORM_10_7959F_1,
    benefit: `Foreign Medical Program (FMP) Registration Form`,
    title: `Foreign Medical Program (FMP) Registration Form (10-7959f-1)`,
    description: '',
    trackingPrefix: '10-7959f-1-FMP-',
  },
  {
    id: VA_FORM_IDS.FORM_10_7959F_2,
    benefit: `Foreign Medical Program (FMP) cover sheet`,
    title: `Foreign Medical Program (FMP) cover sheet (10-7959f-2)`,
    description: '',
    trackingPrefix: 'fmp-cover-sheet-',
  },
  {
    id: VA_FORM_IDS.FORM_10182,
    benefit: 'Board Appeal',
    title: 'Board Appeal (10182)',
    description: 'Board Appeal application (10182)',
    trackingPrefix: '10182-board-appeal-',
  },
  {
    id: VA_FORM_IDS.FORM_1330M,
    benefit: 'Memorials benefits',
    title: '1330M Apply for a medallion in a private cemetery',
    description: 'Memorials benefits',
    trackingPrefix: 'memorials-1330m',
  },
  {
    id: VA_FORM_IDS.FORM_1330M2,
    benefit: 'Memorials benefits',
    title: '1330M2 Apply for a medallion in a private cemetery',
    description: 'Memorials benefits',
    trackingPrefix: 'memorials-1330m2',
  },
  {
    id: VA_FORM_IDS.FORM_20_0995,
    benefit: 'Supplemental Claim',
    title: 'Supplemental Claim (20-0995)',
    description: 'Supplemental Claim application (20-0995)',
    trackingPrefix: '995-supplemental-claim-',
  },
  {
    id: VA_FORM_IDS.FORM_20_0996,
    benefit: 'Higher-Level Review',
    title: 'Higher-Level Review (20-0996)',
    description: 'Higher-Level Review application (20-0996)',
    trackingPrefix: 'decision-reviews-va20-0996-',
  },
  {
    id: VA_FORM_IDS.FORM_20_10206,
    benefit: 'personal records request',
    title: 'personal records request (20-10206)',
    description: 'personal records request application (20-10206)',
    trackingPrefix: 'pa-10206-',
  },
  {
    id: VA_FORM_IDS.FORM_20_10207,
    benefit: 'priority processing',
    title: 'priority processing (20-10207)',
    description: 'priority processing application (20-10207)',
    trackingPrefix: 'pp-10207-',
  },
  {
    id: VA_FORM_IDS.FORM_21_0779_UPLOAD,
    benefit: `form 21-0779 upload`,
    title: `form 21-0779 upload`,
    description: 'uploaded file for form 21-0779',
    trackingPrefix: 'form-21-0779-upload-',
  },
  {
    id: VA_FORM_IDS.FORM_21_0845,
    benefit: 'authorization for personal information to third party',
    title: 'authorization for personal information to third party (21-0845)',
    description:
      'authorization for personal information to third party application (21-0845)',
    trackingPrefix: 'auth-disclose-0845-',
  },
  {
    id: VA_FORM_IDS.FORM_21_0966,
    benefit: 'intent to file',
    title: 'intent to file (21-0966)',
    description: 'intent to file application (21-0966)',
    trackingPrefix: '21-0966-intent-to-file-a-claim-',
  },
  {
    id: VA_FORM_IDS.FORM_21_0972,
    benefit: 'alternate signer',
    title: 'alternate signer (21-0972)',
    description: 'alternate signer application (21-0972)',
    trackingPrefix: '21-0972-alternate-signer-',
  },
  {
    id: VA_FORM_IDS.FORM_21_10210,
    benefit: 'lay/witness statement',
    title: 'lay/witness statement (21-10210)',
    description: 'lay/witness statement application (21-10210)',
    trackingPrefix: 'lay-witness-10210-',
  },
  {
    id: VA_FORM_IDS.FORM_21_22,
    benefit: `Appointment of Veterans Service Organization as Claimant's Representative`,
    title: `Appointment of Veterans Service Organization as Claimant's Representative (21-22)`,
    description: 'VSO representative appointment application',
    trackingPrefix: 'appoint-a-rep-21-22',
  },
  {
    id: VA_FORM_IDS.FORM_21_22A,
    benefit: `Appointment of Individual as Claimant's Representative`,
    title: `Appointment of Individual as Claimant's Representative (21-22a)`,
    description: 'Individual representative appointment application',
    trackingPrefix: 'appoint-a-rep-21-22',
  },
  {
    id: VA_FORM_IDS.FORM_21_4142,
    benefit: 'authorization to release medical information',
    title: 'authorization to release medical information (21-4142)',
    description:
      'authorization to release medical information application (21-4142)',
    trackingPrefix: 'medical-release-4142-',
  },
  {
    id: VA_FORM_IDS.FORM_21_4192_UPLOAD,
    benefit: `form 21-4192 upload`,
    title: `form 21-4192 upload`,
    description: 'uploaded file for form 21-4192',
    trackingPrefix: 'form-21-4192-upload-',
  },
  {
    id: VA_FORM_IDS.FORM_21_509_UPLOAD,
    benefit: `form 21-509 upload`,
    title: `form 21-509 upload`,
    description: 'uploaded file for form 21-509',
    trackingPrefix: 'form-21-509-upload-',
  },
  {
    id: VA_FORM_IDS.FORM_21_686C_UPLOAD,
    benefit: `form 21-6868 upload`,
    title: `form 21-6868 upload`,
    description: 'uploaded file for form 21-6868',
    trackingPrefix: 'form-21-6868-upload-',
  },
  {
    id: VA_FORM_IDS.FORM_21_526EZ,
    benefit: 'disability compensation',
    title: 'disability compensation (21-526EZ)',
    description: 'disability compensation application (21-526EZ)',
    trackingPrefix: 'disability-526EZ-',
  },
  {
    id: VA_FORM_IDS.FORM_21_686C,
    benefit: 'dependent status',
    title: 'dependent status (686C-674)',
    description: 'dependent status application (686C-674)',
    trackingPrefix: '686-',
  },
  {
    id: VA_FORM_IDS.FORM_21_8940_UPLOAD,
    benefit: `form 21-8940 upload`,
    title: `form 21-8940 upload`,
    description: 'uploaded file for form 21-8940',
    trackingPrefix: 'form-21-8940-upload-',
  },
  {
    id: VA_FORM_IDS.FORM_21P_0516_1_UPLOAD,
    benefit: `form 21P-0516-1 upload`,
    title: `form 21P-0516-1 upload`,
    description: 'uploaded file for form 21P-0516-1',
    trackingPrefix: 'form-21p-0516-1-upload-',
  },
  {
    id: VA_FORM_IDS.FORM_21P_0518_1_UPLOAD,
    benefit: `form 21P-0518-1 upload`,
    title: `form 21P-0518-1 upload`,
    description: 'uploaded file for form 21P-0518-1',
    trackingPrefix: 'form-21p-0518-1-upload-',
  },
  {
    id: VA_FORM_IDS.FORM_21P_0847,
    benefit: 'substitute claimant',
    title: 'substitute claimant (21P-0847)',
    description: 'substitute claimant application (21P-0847)',
    trackingPrefix: '21P-0847-substitute-claimant-',
  },
  {
    id: VA_FORM_IDS.FORM_21P_527EZ,
    benefit: 'Veterans pension benefits',
    title: 'Veterans pension benefits (21P-527EZ)',
    description: 'Veterans pension benefits application (21P-527EZ)',
    trackingPrefix: 'pensions-527EZ-',
  },
  {
    id: VA_FORM_IDS.FORM_21P_530A_UPLOAD,
    benefit: `form 21P-530a upload`,
    title: `form 21P-530a upload`,
    description: 'uploaded file for form 21P-530a',
    trackingPrefix: 'form-21p-530a-upload-',
  },
  {
    id: VA_FORM_IDS.FORM_21P_530EZ,
    benefit: 'burial benefits',
    title: 'burial benefits (21P-530EZ)',
    description: 'burial benefits application (21P-530EZ)',
    trackingPrefix: 'burials-530-',
  },
  {
    id: VA_FORM_IDS.FORM_21P_8049_UPLOAD,
    benefit: `form 21P-8049 upload`,
    title: `form 21P-8049 upload`,
    description: 'uploaded file for form 21P-8049',
    trackingPrefix: 'form-21p-8049-upload-',
  },
  {
    id: VA_FORM_IDS.FORM_22_0994,
    benefit: 'VET TEC',
    title: 'VET TEC (22-0994)',
    description: 'VET TEC application (22-0994)',
    trackingPrefix: 'edu-0994-',
  },
  {
    id: VA_FORM_IDS.FORM_22_10203,
    benefit: 'Rogers STEM Scholarship',
    title: 'Rogers STEM Scholarship (22-10203)',
    description: 'Rogers STEM Scholarship application (22-10203)',
    trackingPrefix: 'edu-10203-',
  },
  {
    id: VA_FORM_IDS.FORM_22_10215,
    benefit: 'Statement of Assurance of Compliance with 85% Enrollment Ratios',
    title:
      'Statement of Assurance of Compliance with 85% Enrollment Ratios (22-10215)',
    description:
      'Statement of Assurance of Compliance with 85% Enrollment Ratios (22-10215)',
    trackingPrefix: 'edu-10215-',
  },
  {
    id: VA_FORM_IDS.FORM_22_10282,
    benefit: 'IBM SkillsBuild Training Program Intake Application',
    title: 'IBM SkillsBuild Training Program Intake Application (22-10282)',
    description: 'IBM SkillsBuild Training Program Intake (22-10282)',
    trackingPrefix: 'edu-10282-',
  },
  {
    id: VA_FORM_IDS.FORM_22_1990,
    benefit: 'education benefits',
    title: 'education benefits (22-1990)',
    description: 'education benefits application (22-1990)',
    trackingPrefix: 'edu-',
  },
  {
    id: VA_FORM_IDS.FORM_22_1990EZ,
    benefit: 'education benefits',
    title: 'education benefits (22-1990EZ)',
    description: 'education benefits application (22-1990EZ)',
    trackingPrefix: 'edu-1990ez-',
  },
  {
    id: VA_FORM_IDS.FORM_22_1995,
    benefit: 'education benefits',
    title: 'education benefits (22-1995)',
    description: 'education benefits application (22-1995)',
    trackingPrefix: 'edu-1995-',
  },
  {
    id: VA_FORM_IDS.FORM_26_1880,
    benefit: 'VA home loan certification of eligibility',
    title: 'VA home loan certification of eligibility (26-1880)',
    description:
      'VA home loan certification of eligibility application (26-1880)',
    trackingPrefix: '26-1880-',
  },
  {
    id: VA_FORM_IDS.FORM_26_4555,
    benefit: 'specially adapted housing grant',
    title: 'specially adapted housing grant (26-4555)',
    description: 'specially adapted housing grant application (26-4555)',
    trackingPrefix: 'adapted-housing-4555-',
  },
  {
    id: VA_FORM_IDS.FORM_28_1900,
    benefit: 'Veteran Readiness and Employment Benefits',
    title: 'Veteran Readiness and Employment Benefits (28-1900)',
    description:
      'Veteran Readiness and Employment Benefits application (28-1900)',
    trackingPrefix: '28-1900-',
  },
  {
    id: VA_FORM_IDS.FORM_28_8832,
    benefit: 'personalized career planning and guidance',
    title: 'personalized career planning and guidance (28-8832)',
    description:
      'personalized career planning and guidance application (28-8832)',
    trackingPrefix: '28-8832-',
  },
  {
    id: VA_FORM_IDS.FORM_40_0247,
    benefit: `presidential memorial certificate`,
    title: `presidential memorial certificate (0247-pmc)`,
    description: '',
    trackingPrefix: '0247-pmc-',
  },
  {
    id: VA_FORM_IDS.FORM_40_10007,
    benefit: 'pre-need determination of eligibility in a VA national cemetery',
    title: 'pre-need determination of eligibility in a VA national cemetery',
    description:
      'pre-need determination of eligibility in a VA national cemetery application ',
    trackingPrefix: 'preneed-',
  },
  {
    id: VA_FORM_IDS.FORM_5655,
    benefit: 'financial status report',
    title: 'financial status report (5655)',
    description: 'financial status report application (5655)',
    trackingPrefix: 'fsr-5655-',
  },
  {
    id: VA_FORM_IDS.FORM_DISPUTE_DEBT,
    benefit: 'digital dispute for debts',
    title: 'Dispute your VA debt',
    description: 'digital dispute for debts',
    trackingPrefix: 'dispute-debt',
  },
  {
    id: VA_FORM_IDS.FORM_VA_2346A,
    benefit: 'hearing aid batteries and accessories',
    title: 'hearing aid batteries and accessories (MDOT)',
    description: 'hearing aid batteries and accessories (MDOT)',
    trackingPrefix: 'bam-2346a-',
  },
  {
    id: VA_FORM_IDS.FORM_22_10216,
    benefit: 'Request exemption from the 85/15 Rule reporting requirements',
    title:
      'Request exemption from the 85/15 Rule reporting requirements (22-10216)',
    description:
      '35% Exemption Request from 85/15 Reporting Requirement (VA Form 22-10216)',
    trackingPrefix: 'edu-10216-',
  },
  // {
  //   id: VA_FORM_IDS.FORM_28_1900,
  //   benefit: 'VR&E Chapter 31 benefits application',
  //   title: '28-1900 Veteran Readiness',
  //   description: 'VR&E Chapter 31 benefits application',
  //   trackingPrefix: 'new-careers-employment-28-1900-',
  // },
];

export const FORM_BENEFITS = MY_VA_SIP_FORMS.reduce((acc, form) => {
  acc[form.id] = form.benefit;
  return acc;
}, {});

export const FORM_DESCRIPTIONS = Object.keys(FORM_BENEFITS).reduce(
  (descriptions, key) => {
    let formNumber;
    if (key === VA_FORM_IDS.FORM_40_10007) {
      formNumber = '';
    } else if (key === VA_FORM_IDS.FORM_10_10EZ) {
      formNumber = '(10-10EZ)';
    } else {
      formNumber = `(${key})`;
    }
    let formDescription = `${FORM_BENEFITS[key]} application ${formNumber}`;
    if (key === VA_FORM_IDS.FORM_VA_2346A) {
      formDescription = `${FORM_BENEFITS[key]} ${formNumber}`;
    }
    return { ...descriptions, [key]: formDescription };
  },
  {},
);

export const FORM_TITLES = Object.keys(FORM_BENEFITS).reduce((titles, key) => {
  let formNumber;
  if (key === VA_FORM_IDS.FORM_40_10007) {
    formNumber = '';
  } else if (key === VA_FORM_IDS.FORM_10_10EZ) {
    formNumber = ' (10-10EZ)';
  } else if (key === VA_FORM_IDS.FEEDBACK_TOOL) {
    formNumber = ' (GI Bill School Feedback Tool)';
  } else {
    formNumber = ` (${key})`;
  }
  const formTitle = `${FORM_BENEFITS[key]}${formNumber}`;
  titles[key] = formTitle; // eslint-disable-line no-param-reassign
  return titles;
}, {});

export const TRACKING_PREFIXES = MY_VA_SIP_FORMS.reduce((acc, form) => {
  acc[form.id] = form.trackingPrefix;
  return acc;
}, {});
