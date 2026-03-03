// @ts-check
import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from '~/platform/utilities/environment';
import { personalInformationPage } from 'platform/forms-system/src/js/components/PersonalInformation';
import { profileContactInfoPages } from 'platform/forms-system/src/js/patterns/prefill/ContactInfo';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import schoolWasClosed from '../pages/schoolWasClosed';
import oldSchoolNameAndAddress from '../pages/oldSchoolNameAndAddress';
import eligibilityWarning from '../pages/eligibilityWarning';
import didCompleteProgramOfStudy from '../pages/didCompleteProgramOfStudy';
import didReceiveCredit from '../pages/didReceiveCredit';
import wasEnrolledWhenSchoolClosed from '../pages/wasEnrolledWhenSchoolClosed';
import wasOnApprovedLeave from '../pages/wasOnApprovedLeave';
import withdrewPriorToClosing from '../pages/withdrewPriorToClosing';
import withdrawDate from '../pages/withdrawDate';
import enrolledAtNewSchool from '../pages/enrolledAtNewSchool';
import newSchoolNameAndProgram from '../pages/newSchoolNameAndProgram';
import isUsingTeachoutAgreement from '../pages/isUsingTeachoutAgreement';
import newSchoolGrants12OrMoreCredits from '../pages/newSchoolGrants12OrMoreCredits';
import schoolDidTransferCredits from '../pages/schoolDidTransferCredits';
import lastDateOfAttendance from '../pages/lastDateOfAttendance';
import attestation from '../pages/attestation';

import remarks from '../pages/remarks';

import prefillTransform from './prefillTransform';

export const SUBMIT_URL = `${
  environment.API_URL
}/v0/education_benefits_claims/0989`;

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: SUBMIT_URL,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '0989-edu-benefits-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
  },
  formId: VA_FORM_IDS.FORM_22_0989,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your entitlement restoration application (22-0989) is in progress.',
    //   expired: 'Your saved entitlement restoration application (22-0989) has expired. If you want to apply for entitlement restoration, please start a new application.',
    //   saved: 'Your entitlement restoration application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer: prefillTransform,
  savedFormMessages: {
    notFound: 'Please start over to apply for entitlement restoration.',
    noAuth:
      'Please sign in again to continue your application for entitlement restoration.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  useCustomScrollAndFocus: true,
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        ...personalInformationPage({
          personalInfoConfig: {
            name: { show: true, required: true },
            ssn: { show: true, required: true },
            dateOfBirth: { show: true, required: false },
          },
          dataAdapter: {
            ssnPath: 'ssn',
          },
        }),
      },
    },
    contactInfoChapter: {
      title: 'Your contact information',
      pages: {
        ...profileContactInfoPages({
          contactInfoRequiredKeys: ['mailingAddress', 'email'],
          // disableMockContactInfo: true,
          // prefillPatternEnabled: true,
        }),
      },
    },
    entitlementDetailsChapter: {
      title: 'Entitlement restoration details',
      pages: {
        schoolWasClosed: {
          path: 'school-closing',
          title: 'School closures and program suspension',
          uiSchema: schoolWasClosed.uiSchema,
          schema: schoolWasClosed.schema,
        },
        oldSchoolNameAndAddress: {
          path: 'school-name-and-address',
          title: 'School name and mailing address',
          uiSchema: oldSchoolNameAndAddress.uiSchema,
          schema: oldSchoolNameAndAddress.schema,
          depends: formData => !!formData.schoolWasClosed,
        },
        eligibilityWarning: {
          path: 'eligibility-warning',
          title: 'Eligibility warning',
          uiSchema: eligibilityWarning.uiSchema,
          schema: eligibilityWarning.schema,
          depends: formData => !formData.schoolWasClosed,
        },
        didCompleteProgramOfStudy: {
          path: 'complete-program-of-study',
          title: 'Program information',
          uiSchema: didCompleteProgramOfStudy.uiSchema,
          schema: didCompleteProgramOfStudy.schema,
          depends: formData => !!formData.schoolWasClosed,
        },
        didReceiveCredit: {
          path: 'receive-credit',
          title: 'Enrollment and credit information',
          uiSchema: didReceiveCredit.uiSchema,
          schema: didReceiveCredit.schema,
          depends: formData => !!formData.schoolWasClosed,
        },
        wasEnrolledWhenSchoolClosed: {
          path: 'enrolled-when-school-closed',
          title: 'Enrollment and credit information',
          uiSchema: wasEnrolledWhenSchoolClosed.uiSchema,
          schema: wasEnrolledWhenSchoolClosed.schema,
          depends: formData => !!formData.schoolWasClosed,
        },
        wasOnApprovedLeave: {
          path: 'approved-leave',
          title: 'Leave of absence',
          uiSchema: wasOnApprovedLeave.uiSchema,
          schema: wasOnApprovedLeave.schema,
          depends: formData => !!formData.schoolWasClosed,
        },
        withdrewPriorToClosing: {
          path: 'withdrew-prior-to-closing',
          title: 'Withdrawal details',
          uiSchema: withdrewPriorToClosing.uiSchema,
          schema: withdrewPriorToClosing.schema,
          depends: formData => !!formData.schoolWasClosed,
        },
        withdrawDate: {
          path: 'withdraw-date',
          title: 'Provide the date of your withdrawal from the school',
          uiSchema: withdrawDate.uiSchema,
          schema: withdrawDate.schema,
          depends: formData =>
            !!formData.schoolWasClosed && !!formData.withdrewPriorToClosing,
        },
        enrolledAtNewSchool: {
          path: 'enrolled-at-new-school',
          title: 'New school enrollment',
          uiSchema: enrolledAtNewSchool.uiSchema,
          schema: enrolledAtNewSchool.schema,
          depends: formData => !!formData.schoolWasClosed,
        },
        newSchoolNameAndProgram: {
          path: 'new-school-name-and-program',
          title: 'Name of new school and program',
          uiSchema: newSchoolNameAndProgram.uiSchema,
          schema: newSchoolNameAndProgram.schema,
          depends: formData =>
            !!formData.schoolWasClosed && !!formData.enrolledAtNewSchool,
        },
        isUsingTeachoutAgreement: {
          path: 'teachout-agreement',
          title: 'Teach out program details',
          uiSchema: isUsingTeachoutAgreement.uiSchema,
          schema: isUsingTeachoutAgreement.schema,
          depends: formData =>
            !!formData.schoolWasClosed && !!formData.enrolledAtNewSchool,
        },
        newSchoolGrants12OrMoreCredits: {
          path: 'new-school-credits',
          title: 'New school credit approvals',
          uiSchema: newSchoolGrants12OrMoreCredits.uiSchema,
          schema: newSchoolGrants12OrMoreCredits.schema,
          depends: formData =>
            !!formData.schoolWasClosed && !!formData.enrolledAtNewSchool,
        },
        schoolDidTransferCredits: {
          path: 'school-credits-transfer',
          title: 'Transfer credits from NCD schools',
          uiSchema: schoolDidTransferCredits.uiSchema,
          schema: schoolDidTransferCredits.schema,
          depends: formData => !!formData.schoolWasClosed,
        },
        lastDateOfAttendance: {
          path: 'last-date-of-attendance',
          title: 'Last date of attendance',
          uiSchema: lastDateOfAttendance.uiSchema,
          schema: lastDateOfAttendance.schema,
          depends: formData => !!formData.schoolWasClosed,
        },
        attestation: {
          path: 'attestation',
          title: 'Attestation of Hours Transferred',
          uiSchema: attestation.uiSchema,
          schema: attestation.schema,
          depends: formData => !!formData.schoolWasClosed,
        },
      },
    },
    remarksChapter: {
      title: 'Remarks',
      pages: {
        remarks: {
          path: 'remarks',
          title: 'Remarks',
          uiSchema: remarks.uiSchema,
          schema: remarks.schema,
        },
      },
    },
  },
  footerContent,
};

export default formConfig;
