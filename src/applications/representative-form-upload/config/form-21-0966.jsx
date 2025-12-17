import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from '~/platform/forms/components/FormFooter';
import manifest from '../manifest.json';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPageITF from '../containers/IntroductionPageITF';
import { itfClaimantInformationPage } from '../pages/itfClaimantInformation';
import { itfVeteranInformationPage } from '../pages/itfVeteranInformation';
import { IsVeteranPage, isVeteranPage } from '../pages/isVeteranPage';
import { itfTransformForSubmit } from './submit-transformer';
import { getMockData, scrollAndFocusTarget, getFormContent } from '../helpers';
import { CustomTopContent } from '../pages/helpers';
import { getIntentsToFile } from '../helpers/intent-to-file-helper';
import submissionError from './submissionError';
import ITFStatusLoadingIndicatorPage from '../components/ITFStatusLoadingIndicatorPage';
import PermissionError from '../components/PermissionError';
import ExistingItf from '../components/ExistingItf';

const form210966 = (pathname = null) => {
  const { subTitle, formNumber } = getFormContent(pathname);
  const trackingPrefix = `form-${formNumber.toLowerCase()}-`;

  return {
    formId: formNumber,
    rootUrl: manifest.rootUrl,
    urlPrefix: `/submit-va-form-${formNumber}/`,
    submitUrl: `${
      environment.API_URL
    }/accredited_representative_portal/v0/intent_to_file`,
    dev: { collapsibleNavLinks: true, showNavLinks: !window.Cypress },
    disableSave: true,
    trackingPrefix,
    introduction: IntroductionPageITF,
    confirmation: ConfirmationPage,
    CustomTopContent,
    customText: {
      appType: 'form',
      finishAppLaterMessage: ' ',
      reviewPageTitle: 'Review and submit',
    },
    hideReviewChapters: true,
    version: 0,
    prefillEnabled: false,
    transformForSubmit: itfTransformForSubmit,
    submissionError,
    defaultDefinitions: {},
    additionalRoutes: [
      {
        path: 'get-itf-status',
        pageKey: 'get-itf-status',
        component: ITFStatusLoadingIndicatorPage,
        depends: () => false,
      },
      {
        path: 'permission-error',
        pageKey: 'permission-error',
        component: PermissionError,
        depends: () => false,
      },
      {
        path: 'existing-itf',
        pageKey: 'existing-itf',
        component: ExistingItf,
        depends: () => false,
      },
    ],
    title: `Submit VA Form ${formNumber}`,
    subTitle,
    v3SegmentedProgressBar: { useDiv: false },
    formOptions: {
      useWebComponentForNavigation: true,
    },
    chapters: {
      isVeteranChapter: {
        title: 'Claimant background',
        pages: {
          isVeteranPage: {
            path: 'claimant-background',
            title: "Claimant's background",
            uiSchema: isVeteranPage.uiSchema,
            schema: isVeteranPage.schema,
            CustomPage: IsVeteranPage,
            scrollAndFocusTarget,
          },
        },
      },
      veteranInformationChapter: {
        title: 'Claimant information',
        pages: {
          veteranInformationPage: {
            path: 'veteran-information',
            title: 'Claimant information',
            uiSchema: itfVeteranInformationPage.uiSchema,
            depends: formData => {
              return formData.isVeteran === 'yes';
            },
            onNavForward: ({ formData, goPath, goNextPath, setFormData }) =>
              getIntentsToFile({
                formData,
                goPath,
                goNextPath,
                setFormData,
                urlPrefix: `submit-va-form-${formNumber}/`,
              }),
            schema: itfVeteranInformationPage.schema,
            scrollAndFocusTarget,
            // we want req'd fields prefilled for LOCAL testing/previewing
            // one single initialData prop here will suffice for entire form
            initialData: getMockData(),
          },
        },
      },
      claimantInformationChapter: {
        title: 'Claimant and Veteran information',
        pages: {
          claimantInformation: {
            path: 'claimant-information',
            title: 'Claimant and Veteran information',
            uiSchema: itfClaimantInformationPage.uiSchema,
            depends: formData => {
              return (
                formData.isVeteran === undefined || formData.isVeteran === 'no'
              );
            },
            onNavForward: ({ formData, goPath, goNextPath, setFormData }) => {
              const survivorFormData = setFormData({
                ...formData,
                benefitType: 'survivor',
              });
              getIntentsToFile({
                formData: survivorFormData.data,
                goPath,
                goNextPath,
                setFormData,
                urlPrefix: `submit-va-form-${formNumber}/`,
              });
            },
            schema: itfClaimantInformationPage.schema,
            scrollAndFocusTarget,
            // we want req'd fields prefilled for LOCAL testing/previewing
            // one single initialData prop here will suffice for entire form
            initialData: getMockData(),
          },
        },
      },
    },
    footerContent,
  };
};

export default form210966;
