import React, { useState } from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Formik } from 'formik';
import { RouterProps } from './types';

import FormTitle from '../form-layout/FormTitle';
import FormFooter from '../form-layout/FormFooter';
import { RouterContextProvider } from './RouterContext';
import RouterProgress from './RouterProgress';

/**
 * Manages form pages as routes
 * Parent formik insance is rendered here
 * @beta
 */
export default function FormRouter(props: RouterProps): JSX.Element {
  const initialValues = props.formData;
  const [route, updateRoute] = useState('/');

  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <BrowserRouter basename={props.basename}>
          <RouterContextProvider
            routes={props.children}
            currentRoute={route}
            updateRoute={updateRoute}
          >
            <FormTitle title={props.title} subTitle={props?.subtitle} />
            <RouterProgress route={route} />
            <Formik
              initialValues={initialValues}
              onSubmit={(values, actions) => {
                // Here we leverage formik actions to perform validations, submit data, etc.
                // Also a good candidate for extracting data out of form apps
                actions.setSubmitting(true);
              }}
            >
              <Routes>{props.children}</Routes>
            </Formik>
            <FormFooter />
          </RouterContextProvider>
        </BrowserRouter>
      </div>
    </div>
  );
}
