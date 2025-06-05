import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// pages
import {
  certifyingOfficials,
  aboutYourInstitution,
  institutionDetails,
  proprietaryProfit,
  potentialConflictOfInterest,
  affiliatedIndividuals,
  allProprietarySchools,
  allProprietarySchoolsEmployeeInfo,
  allProprietarySchoolsSummary,
} from '../pages';
import directDeposit from '../pages/directDeposit';
import { arrayBuilderOptions } from '../helpers';

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
    proprietaryProfitChapter: {
      title: 'Proprietary profit schools only',
      pages: {
        proprietaryProfit: {
          path: 'proprietary-profit',
          title: "Confirm your institution's classification",
          uiSchema: proprietaryProfit.uiSchema,
          schema: proprietaryProfit.schema,
        },
        potentialConflictOfInterest: {
          path: 'proprietary-profit-1',
          title: 'Individuals with a potential conflict of interest',
          uiSchema: potentialConflictOfInterest.uiSchema,
          schema: potentialConflictOfInterest.schema,
          onNavForward: ({ formData, goPath }) => {
            if (formData?.hasConflictOfInterest) {
              goPath('/proprietary-profit-2');
            } else {
              // TODO: To be replaced with 'Step 3' Conflict of Interest chapter
              goPath('/all-proprietary-schools');
            }
          },
        },
        affiliatedIndividuals: {
          path: 'proprietary-profit-2',
          title:
            'Individuals affiliated with both your institution and VA or SAA',
          uiSchema: affiliatedIndividuals.uiSchema,
          schema: affiliatedIndividuals.schema,
        },
      },
    },
    allProprietarySchoolsChapter: {
      title: 'All proprietary schools',
      pages: {
        ...arrayBuilderPages(arrayBuilderOptions, pageBuilder => ({
          allProprietarySchoolsIntro: pageBuilder.introPage({
            path: 'all-proprietary-schools',
            title: 'All proprietary schools',
            uiSchema: allProprietarySchools.uiSchema,
            schema: allProprietarySchools.schema,
            onNavForward: ({ formData, goPath }) => {
              if (formData?.allProprietarySchools === false) {
                goPath(
                  formConfig.chapters.directDepositChapter.pages.directDeposit
                    .path,
                );
              } else {
                const allProprietarySchoolsEmployeeInfoIndex =
                  localStorage.getItem(
                    'allProprietarySchoolsEmployeeInfoIndex',
                  ) || '0';
                goPath(
                  `/all-proprietary-schools/${allProprietarySchoolsEmployeeInfoIndex}?add=true`,
                );
              }
            },
          }),
          'view:allProprietarySchools': pageBuilder.summaryPage({
            path: 'all-proprietary-schools-employee-info/summary',
            title: 'All proprietary schools employee information',
            uiSchema: allProprietarySchoolsSummary.uiSchema,
            schema: allProprietarySchoolsSummary.schema,
            onNavBack: ({ _, goPath }) => {
              const allProprietarySchoolsEmployeeInfoIndex = localStorage.getItem(
                'allProprietarySchoolsEmployeeInfoIndex',
              );
              goPath(
                `/all-proprietary-schools/${allProprietarySchoolsEmployeeInfoIndex}?add=true`,
              );
            },
          }),
          allProprietarySchoolsEmployeeInfo: pageBuilder.itemPage({
            path: 'all-proprietary-schools/:index',
            title: 'All proprietary schools employee information',
            showPagePerItem: true,
            uiSchema: allProprietarySchoolsEmployeeInfo.uiSchema,
            schema: allProprietarySchoolsEmployeeInfo.schema,
            onNavForward: ({ _, goPath }) => {
              const url = new URL(window.location.href);
              const pathSegments = url.pathname.split('/');
              const index = pathSegments[pathSegments.length - 1];
              localStorage.setItem(
                'allProprietarySchoolsEmployeeInfoIndex',
                index,
              );
              goPath('/all-proprietary-schools-employee-info/summary');
            },
            onNavBack: ({ _, goPath }) => {
              goPath('/all-proprietary-schools');
            },
          }),
        })),
      },
    },
    directDepositChapter: {
      title: 'Direct deposit',
      pages: {
        directDeposit: {
          path: 'direct-deposit',
          title: 'Direct deposit',
          uiSchema: directDeposit.uiSchema,
          schema: directDeposit.schema,
          onNavBack: ({ formData, goPath }) => {
            if (formData?.allProprietarySchools === false) {
              goPath(
                formConfig.chapters.allProprietarySchoolsChapter.pages
                  .allProprietarySchoolsIntro.path,
              );
            } else {
              goPath('/all-proprietary-schools-employee-info/summary');
            }
          },
        },
      },
    },
  },
};

export default formConfig;
