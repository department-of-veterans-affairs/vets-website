import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { Link, MemoryRouter, Route, Router, Routes } from 'react-router-dom';
import { RouterProps } from '../../src/routing/types';
import Page from '../../src/routing/Page';
import Chapter from '../../src/routing/Chapter';
import { act } from 'react-dom/test-utils';
import { FormFooter, FormTitle } from '../../src';
import { Formik } from 'formik';

const ChapterOne = () => (
  <>
    <Chapter title="Chapter One">
      <p>
        Custom UI content that can go inside chapter 1: 
        <Link to="/chapter-one/page-one">PageOne</Link>
      </p>
    </Chapter>
  </>
);

const ChapterOnePageOne = () => (
  <Page title="Page One" nextPage="/chapter-one/page-two">
    <p>chapter one, page one</p>
  </Page>
);

const ChapterOnePageTwo = () => (
  <Page title="Page Two" nextPage="/">
    <p>chapter one, page two</p>
  </Page>
);

const FormRouterInternal = (props: RouterProps): JSX.Element => (
  <>
    {props?.title && (
      <FormTitle title={props.title} subTitle={props?.subtitle} />
    )}
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
    <FormFooter />
  </>
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

describe('Routing - Chapter', () => {

  test('it can navigate Chapters and Pages', async() => {
    const { container } = render(
      <MemoryRouter initialEntries={["/chapter-one", "/chapter-one/page-one", "/chapter-one/page-two"]} initialIndex={0}>
        <FormRouterInternal basename="/" formData={initialValues} title="Chapter Test">
          <Route path="/chapter-one" element={<ChapterOne />} >
            <Route path="page-one" element={<ChapterOnePageOne />} />
            <Route path="page-two" element={<ChapterOnePageTwo />} />
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
          <Route path="/chapter-one" element={<ChapterOne />} >
            <Route path="page-one" element={<ChapterOnePageOne />} />
            <Route path="page-two" element={<ChapterOnePageTwo />} />
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
