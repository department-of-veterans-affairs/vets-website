import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from '~/platform/forms/components/FormFooter';
import manifest from '../manifest.json';
import ConfirmationPageITF from '../containers/ConfirmationPageITF';
import IntroductionPageITF from '../containers/IntroductionPageITF';
import { itfClaimantInformationPage } from '../pages/itfClaimantInformation';
import { itfVeteranInformationPage } from '../pages/itfVeteranInformation';
import { IsVeteranPage, isVeteranPage } from '../pages/isVeteranPage';
import { itfTransformForSubmit } from './submit-transformer';
import { getMockData, scrollAndFocusTarget, getFormContent } from '../helpers';
import { CustomTopContent } from '../pages/helpers';
import { getIntentsToFile } from '../helpers/intent-to-file-helper';
import ITFSubmissionError from './ITFSubmissionError';
import ITFStatusLoadingIndicatorPage from '../components/ITFStatusLoadingIndicatorPage';
import ITF403Error from '../components/ITF403Error';
import ITF500Error from '../components/ITF500Error';
import ITFExistingClaim from '../components/ITFExistingClaim';

const form210966 = (pathname = null) => {
  const { subTitle, formNumber } = getFormContent(pathname);
  const trackingPrefix = `form-${formNumber.toLowerCase()}-`;

  return {
    formId: '21-0966',
    rootUrl: manifest.rootUrl,
    urlPrefix: `/submit-va-form-${formNumber}/`,
    submitUrl: `${environment.API_URL}/accredited_representative_portal/v0/intent_to_file`,
    dev: {
      collapsibleNavLinks: true,
      showNavLinks: !window.Cypress,
      disableWindowUnloadInCI: true,
    },
    disableSave: true,
    trackingPrefix,
    introduction: IntroductionPageITF,
    confirmation: ConfirmationPageITF,
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
    submissionError: ITFSubmissionError,
    defaultDefinitions: {},
    additionalRoutes: [
      {
        path: 'get-itf-status',
        pageKey: 'get-itf-status',
        component: ITFStatusLoadingIndicatorPage,
        depends: () => false,
      },
      {
        path: 'intent-to-file-no-representation',
        pageKey: 'intent-to-file-no-representation',
        component: ITF403Error,
        depends: () => false,
      },
      {
        path: 'intent-to-file-unknown',
        pageKey: 'intent-to-file-unknown',
        component: ITF500Error,
        depends: () => false,
      },
      {
        path: 'existing-itf',
        pageKey: 'existing-itf',
        component: ITFExistingClaim,
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
        title: 'Claimant background ',
        pages: {
          isVeteranPage: {
            path: 'claimant-background',
            title: 'Claimant background',
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
        reviewDescription: () => (
          <h4 className="itf-review-heading">
            Claimant and Veteran information
          </h4>
        ),
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
            initialData: getMockData(true),
          },
        },
      },
    },
    footerContent,
  };
};

export default form210966;
