import commonDefinitions from 'vets-json-schema/dist/definitions.json';
// import path from 'path-browserify';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// pages
import directDeposit from '../pages/directDeposit';
import serviceHistory from '../pages/serviceHistory';
import {
  certifyingOfficials,
  aboutYourInstitution,
  institutionDetails,
  allProprietarySchools,
  allProprietarySchoolsEmployeeInfo,
  allProprietarySchoolsSummary,
} from '../pages';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'Edu-1919-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '22-1919',
  useCustomScrollAndFocus: true,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-1919) is in progress.',
    //   expired: 'Your saved education benefits application (22-1919) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: 'Conflicting interests certification for proprietary schools',
  subTitle: 'VA Form 22-1919',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    institutionDetailsChapter: {
      title: 'Institution details',
      pages: {
        certifyingOfficial: {
          path: 'applicant-information',
          title: 'Your name and role',
          uiSchema: certifyingOfficials.uiSchema,
          schema: certifyingOfficials.schema,
        },
        aboutYourInstitution: {
          path: 'about-your-institution',
          title: 'About your institution',
          uiSchema: aboutYourInstitution.uiSchema,
          schema: aboutYourInstitution.schema,
        },
        institutionDetails: {
          path: 'institution-information',
          title: 'Institution information',
          uiSchema: institutionDetails.uiSchema,
          schema: institutionDetails.schema,
          depends: formData => {
            return formData?.aboutYourInstitution === true;
          },
        },
      },
    },
    serviceHistoryChapter: {
      title: 'Service History',
      pages: {
        serviceHistory: {
          path: 'service-history',
          title: 'Service History',
          uiSchema: serviceHistory.uiSchema,
          schema: serviceHistory.schema,
        },
      },
    },
    allProprietarySchoolsChapter: {
      title: 'All proprietary schools',
      pages: {
        ...arrayBuilderPages(
          {
            arrayPath: 'all-proprietary-schools',
            nounSingular: 'individual',
            nounPlural: 'individuals',
            required: true,
          },
          pageBuilder => ({
            allProprietarySchoolsIntro: pageBuilder.introPage({
              path: 'all-proprietary-schools',
              title: 'All proprietary schools',
              uiSchema: allProprietarySchools.uiSchema,
              schema: allProprietarySchools.schema,
            }),
            'view:allProprietarySchools': pageBuilder.summaryPage({
              path: 'all-proprietary-schools-employee-info/summary',
              title: 'All proprietary schools employee information',
              uiSchema: allProprietarySchoolsSummary.uiSchema,
              schema: allProprietarySchoolsSummary.schema,
            }),
            allProprietarySchoolsEmployeeInfo: pageBuilder.itemPage({
              path: 'all-proprietary-schools-employee-info/:index',
              title: 'All proprietary schools employee information',
              showPagePerItem: true,
              uiSchema: allProprietarySchoolsEmployeeInfo.uiSchema,
              schema: allProprietarySchoolsEmployeeInfo.schema,
              depends: formData => {
                return formData?.allProprietarySchools === true;
              },
            }),
          }),
        ),
      },
      directDeposit: {
        path: 'direct-deposit',
        title: 'Direct Deposit',
        uiSchema: directDeposit.uiSchema,
        schema: directDeposit.schema,
      },
    },
  },
};

export default formConfig;
