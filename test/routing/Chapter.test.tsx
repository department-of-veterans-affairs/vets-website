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

const ChapterOne = (props: {title: string}) => (
  <>
    <Chapter {...props}>
      <p>
        Custom UI content that can go inside chapter 1: 
        <Link to="/chapter-one/page-one">PageOne</Link>
      </p>
    </Chapter>
  </>
);

const ChapterOnePageOne = (props: {title: string}) => (
  <Page {...props} nextPage="/chapter-one/page-two">
    <p>chapter one, page one</p>
  </Page>
);

const ChapterOnePageTwo = (props: {title: string}) => (
  <Page  {...props} nextPage="/">
    <p>chapter one, page two</p>
  </Page>
);

const FormRouterInternal = (props: RouterProps): JSX.Element => {
    const initialValues = props.formData;

  return (
    <RouterContextProvider
      routes={props.children}
      currentRoute={"/page-two"}
      updateRoute={(value:string) => {return undefined}}>

      <Formik
        initialValues={props.formData}
        onSubmit={(values, actions) => {
          // Here we leverage formik actions to perform validations, submit data, etc.
          // Also a good candidate for extracting data out of form apps
          actions.setSubmitting(true);
        }}
      >
        <Routes>{props.children}</Routes>
      </Formik>
    </RouterContextProvider>
  )
};

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

describe('Routing - Chapter', () => {

  test('it can navigate Chapters and Pages', async() => {
    const { container } = render(
      <MemoryRouter initialEntries={["/chapter-one", "/chapter-one/page-one", "/chapter-one/page-two"]} initialIndex={0}>
        <FormRouterInternal basename="/" formData={initialValues} title="Chapter Test">
          <Route path="/chapter-one" element={<ChapterOne title="Chapter One" />} >
            <Route path="page-one" element={<ChapterOnePageOne title="Chapter One Page One"  />} />
            <Route path="page-two" element={<ChapterOnePageTwo title="Chapter One Page Two"  />} />
          </Route>
        </FormRouterInternal>
      </MemoryRouter>
    );
    act(() => {
      const goLink = container.querySelector('[href="/chapter-one/page-one"]');
      goLink?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    await waitFor(() => expect(container.querySelector('h3')?.innerHTML).toContain('Page One'));
  });

  test('it can navigate Pages within Chapters', async() => {
    let { container } = render(
      <MemoryRouter initialEntries={["/chapter-one", "/chapter-one/page-one", "/chapter-one/page-two"]} initialIndex={1}>
        <FormRouterInternal basename="/" formData={initialValues} title="Chapter Test">
          <Route path="/chapter-one" element={<ChapterOne title="Chapter One" />} >
            <Route path="page-one" element={<ChapterOnePageOne title="Chapter One Page One" />} />
            <Route path="page-two" element={<ChapterOnePageTwo title="Chapter One Page Two" />} />
          </Route>
        </FormRouterInternal>
      </MemoryRouter>
    );
    act(() => {
      const goLink = container.querySelector('button.btn');
      goLink?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    await waitFor(() => expect(container.querySelector('h3')?.innerHTML).toContain('Page Two'));
  });
});
