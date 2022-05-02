import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Formik } from 'formik';
import { RouterProps } from './types';

/**
 * Manages form pages as routes
 * Parent formik insance is rendered here
 * @beta
 */
export default function FormRouter(props: RouterProps): JSX.Element {
  const initialValues = props.formData;

  return (
    <BrowserRouter basename={props.basename}>
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
    </BrowserRouter>
  );
}
