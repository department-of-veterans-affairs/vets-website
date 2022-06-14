import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { Link, MemoryRouter, Route, Router, Routes } from 'react-router-dom';
import { RouterProps } from '../../src/routing/types';
import Page from '../../src/routing/Page';
import Chapter from '../../src/routing/Chapter';
import { act } from 'react-dom/test-utils';
import { FormFooter, FormTitle } from '../../src';
import { Formik } from 'formik';
import { RouterContextProvider } from '../../src/routing/RouterContext';

const FormRouterInternal = (props: RouterProps): JSX.Element => {
  const initialValues = props.formData;

  return (
    <Formik
      initialValues={props.formData}
      onSubmit={(values, actions) => {
        // Here we leverage formik actions to perform validations, submit data, etc.
        // Also a good candidate for extracting data out of form apps
        actions.setSubmitting(true);
      }}
    >
      <RouterContextProvider routes={props.children}>
        <Routes>{props.children}</Routes>
      </RouterContextProvider>  
    </Formik>
  )
};

const PageOne = () => (
  <Page 
    title="page one">
    <p>page one</p>
  </Page>
);

const PageTwo = () => (
  <Page
    title="page two"
    >
    <p>page two</p>
  </Page>
);

const initialValues = {
  firstName: '', 
  lastName: '', 
  email: '', 
  street: '', 
  streetTwo: '', 
  streetThree: '', 
  state: '', 
  zipcode: ''
};
describe('Routing - Router', () => {
  test('can display page content', () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/", "/page-two"]} initialIndex={0}>
        <FormRouterInternal basename="/" formData={initialValues} title="Page Test">
          <Route index element={<PageOne />} />
          <Route path="/page-two" element={<PageTwo />} />
        </FormRouterInternal>
      </MemoryRouter>
    );

    const containerTitleP1 = container.querySelector('h3');
    expect(containerTitleP1?.innerHTML).toContain('page one');
  });

  test('switches page content', () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/", "/page-two"]} initialIndex={1}>
        <FormRouterInternal basename="/" formData={initialValues} title="Page Test">
          <Route index element={<PageOne />} />
          <Route path="/page-two" element={<PageTwo />} />
        </FormRouterInternal>
      </MemoryRouter>
    );

    const containerTitleP1 = container.querySelector('h3');
    expect(containerTitleP1?.innerHTML).toContain('page two');
  });
});
