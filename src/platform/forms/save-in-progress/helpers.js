import React from 'react';
import {
  createPageList,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import { createRoutes } from 'platform/forms-system/src/js/routing';
import RoutedSavablePage from './RoutedSavablePage';
import RoutedSavableReviewPage from './RoutedSavableReviewPage';
import FormSaved from './FormSaved';
import SaveInProgressErrorPage from './SaveInProgressErrorPage';

/**
 * Change the heading level that is rendered inside the saveInProgressIntro.
 * This is used inside the SaveInProgressIntro component
 * @param headingLevel {string} - The string of what heading level you want ('h1', 'h2', etc). If you want default h3 pass in null
 * @param appType {string} - The App Type for your application. This is set in the formConfig file for your form
 *
 */
export function changeSaveInProgressHeadingLevel(headingLevel, appType) {
  const content = (
    <>
      Save time—and save your work in progress—by signing in before starting
      your {appType}
    </>
  );
  const headingClass = 'usa-alert-heading';
  switch (headingLevel) {
    case 'h1':
      return <h1 className={headingClass}>{content}</h1>;
    case 'h2':
      return <h2 className={headingClass}>{content}</h2>;
    case 'h3':
      return <h3 className={headingClass}>{content}</h3>;
    default:
      return <h3 className={headingClass}>{content}</h3>;
  }
}

export function createRoutesWithSaveInProgress(formConfig) {
  const protectedRoutes = new Set([
    'introduction',
    'review-and-submit',
    'confirmation',
    '*',
  ]);

  if (Array.isArray(formConfig.additionalRoutes)) {
    formConfig.additionalRoutes.forEach(route => {
      protectedRoutes.add(route.path);
    });
  }

  const formPages = createFormPageList(formConfig);
  const pageList = createPageList(formConfig, formPages);
  const newRoutes = createRoutes(formConfig);

  newRoutes.forEach((route, index) => {
    let newRoute;

    // rewrite page component
    if (!protectedRoutes.has(route.path)) {
      newRoute = Object.assign({}, route, {
        component: RoutedSavablePage,
        formConfig,
      });
      newRoutes[index] = newRoute;
    }

    // rewrite review page component
    if (route.path === 'review-and-submit') {
      newRoute = Object.assign({}, route, {
        component: RoutedSavableReviewPage,
      });
      newRoutes[index] = newRoute;
    }
  });

  if (!formConfig.disableSave) {
    newRoutes.splice(newRoutes.length - 1, 0, {
      path: 'form-saved',
      component: formConfig.formSavedPage || FormSaved,
      pageList,
      formConfig,
    });

    newRoutes.splice(newRoutes.length - 1, 0, {
      path: 'error',
      component: SaveInProgressErrorPage,
      pageList, // In case we need it for startOver?
      formConfig,
    });

    newRoutes.splice(newRoutes.length - 1, 0, {
      path: 'resume',
      pageList,
      formConfig,
    });
  }

  return newRoutes;
}
