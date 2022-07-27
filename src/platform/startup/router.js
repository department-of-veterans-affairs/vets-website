/**
 * Module for functions related to starting up and application
 * @module platform/startup
 */
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { CompatRouter, Routes } from 'react-router-dom-v5-compat';
import { Formik } from 'formik';
import {
  FormTitle,
  FormFooter,
} from '@department-of-veterans-affairs/va-forms-system-core';
import startReactApp from './react';
import setUpCommonFunctionality from './setup';

const initialValues = {
  relationship: {
    type: '',
    other: '',
    isEntity: null,
  },
  locationOfDeath: {
    location: '',
    other: '',
  },
  toursOfDuty: [
    {
      dateRange: {
        from: '',
        to: '',
      },
      serviceBranch: '',
      rank: '',
      serviceNumber: '',
      placeOfEntry: '',
      placeOfSeparation: '',
    },
  ],
  veteranServedUnderAnotherName: null,
  previousNames: [
    {
      first: '',
      middle: '',
      last: '',
      suffix: '',
    },
  ],
  claimantEmail: '',
  benefitsSelection: {
    burialAllowance: null,
    plotAllowance: null,
    transportation: null,
  },
  burialAllowance: null,
  plotAllowance: null,
  transportation: null,
  amountIncurred: 0,
  burialAllowanceRequested: '',
  burialCost: 0,
  placeOfRemains: '',
  federalCemetery: null,
  stateCemetery: null,
  govtContributions: null,
  amountGovtContribution: 0,
  placeOfBirth: '',
  officialPosition: '',
  firmName: '',
  privacyAgreementAccepted: null,
  claimantAddress: {
    isMilitaryBaseOutside: null,
    streetAddress: '',
    streetAddressLine2: '',
    streetAddressLine3: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  },
  claimantPhone: '',
  claimantFullName: {
    first: '',
    middle: '',
    last: '',
    suffix: '',
  },
  veteranFullName: {
    first: '',
    middle: '',
    last: '',
    suffix: '',
  },
  veteranSocialSecurityNumber: '',
  vaFileNumber: '',
  burialDate: '',
  deathDate: '',
  veteranDateOfBirth: '',
  deathCertificate: [
    {
      name: '',
      size: '',
      confirmationCode: '',
    },
  ],
  transportationReceipts: [
    {
      name: '',
      size: '',
      confirmationCode: '',
    },
  ],
};

/**
 * Starts an application in the default element for standalone React
 * applications. It also sets up the common store, starts the site-wide
 * components (like the header menus and login widget), and wraps the provided
 * routes in the Redux and React Router v5 boilerplate common to most applications.
 *
 * @param {object} appInfo The UI and business logic of your React application
 * @param {Route|array<Route>} appInfo.routes The routes for the application
 * @param {ReactElement} appInfo.component A React element to render. Only used if routes
 * is not passed
 * @param {object} appInfo.reducer An object containing reducer functions. Will have
 * combineReducers run on it after being merged with the common, cross-site reducer.
 * @param {string} appInfo.url The base url for the React application
 * @param {array} appInfo.analyticsEvents An array which contains analytics events to collect
 * when the respective actions are fired.
 */
export default function startApp({
  routes,
  createRoutesWithStore,
  component,
  reducer,
  url,
  analyticsEvents,
  entryName = 'unknown',
}) {
  const store = setUpCommonFunctionality({
    entryName,
    url,
    reducer,
    analyticsEvents,
  });

  let content = component;
  if (createRoutesWithStore) {
    content = (
      <BrowserRouter basename={url}>
        <CompatRouter>{createRoutesWithStore(store)}</CompatRouter>
      </BrowserRouter>
    );
  } else if (routes) {
    content = (
      <BrowserRouter basename={url}>
        <CompatRouter>
          {/* <FormRouter
            formData={initialValues}
            title="Burial POC"
            subTitle="Example form for Burials using VAFSC"
          >
            {routes}
          </FormRouter> */}
          {/* 
          <FormRouter
            formData={initialValues}
            title="Burial POC"
            subTitle="Example form for Burials using VAFSC"
          >
            <Route path="/hello" element={<h1>Hello From the other side</h1>} />
          </FormRouter> */}

          <div className="row">
            <div className="usa-width-two-thirds medium-8 columns">
              <Formik initialValues={initialValues}>
                <form>
                  <FormTitle
                    title="Burial POC"
                    subTitle="Here is my subTitle for Burial POC"
                  />
                  <Routes>{routes}</Routes>
                  <FormFooter />
                </form>
              </Formik>
            </div>
          </div>
        </CompatRouter>
      </BrowserRouter>
    );
  }

  startReactApp(<Provider store={store}>{content}</Provider>);
}
