import commonDefinitions from 'vets-json-schema/dist/definitions.json';
// import path from 'path-browserify';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// pages
import directDeposit from '../pages/directDeposit';

import {
  certifyingOfficials,
  aboutYourInstitution,
  institutionDetails,
  allProprietarySchools,
  allProprietarySchoolsEmployeeInfo,
  allProprietarySchoolsSummary,
  proprietaryProfit,
} from '../pages';
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
      },
    },
    // additionalInformationChapter: {
    //   title: 'Additional Information',
    //   pages: {
    //     contactInformation: {
    //       path: 'contact-information',
    //       title: 'Contact Information',
    //       uiSchema: {
    //         address: address.uiSchema('Mailing address'),
    //         email: {
    //           'ui:title': 'Primary email',
    //         },
    //         altEmail: {
    //           'ui:title': 'Secondary email',
    //         },
    //         phoneNumber: phoneUI('Daytime phone'),
    //       },
    //       schema: {
    //         type: 'object',
    //         properties: {
    //           address: address.schema(fullSchema, true),
    //           email: {
    //             type: 'string',
    //             format: 'email',
    //           },
    //           altEmail: {
    //             type: 'string',
    //             format: 'email',
    //           },
    //           phoneNumber: usaPhone,
    //         },
    //       },
    //     },
    //   },
    // },
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
                goPath('/all-proprietary-schools/0?add=true');
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
          }),
        })),
      },
    },
    directDepositChapter: {
      title: 'Directt deposit',
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
