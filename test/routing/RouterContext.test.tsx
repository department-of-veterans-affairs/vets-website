import React from 'react';

import { routeObjectsReducer, RouterContext, RouterContextProvider } from "../../src/routing/RouterContext";
import { Formik } from "formik";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Page, RouterProps } from "../../src";
import { render, waitFor } from "@testing-library/react";
import RouterProgress from "../../src/routing/RouterProgress";

const IntroPage = (props: {title: string}) => (
  <Page 
    {...props}
    nextPage="/page-one">
    <p>page one</p>
  </Page>
);

const PageOne = (props: {title: string}) => (
  <Page
    {...props}
    nextPage="/page-two">
    <p>page one</p>
  </Page>
);

const PageTwo = (props: {title: string}) => (
  <Page 
  {...props}
  nextPage="/"
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

const FormRouterInternal = (props: RouterProps): JSX.Element => {
  const initialValues = props.formData;

  return (
    <RouterContextProvider
      routes={props.children}
      currentRoute={"/page-two"}
      updateRoute={(value:string) => {return undefined}}>

      <RouterProgress route={"/page-two"} />
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

describe('Routing - Router Context', () => {
  test('router reducer returns list of routes', () => {
    // Some Dummy Data
    const routeObjects = [
      {
        index: true,
        path: undefined,
        element: {
          props: {
            title: "Introduction Page"
          }
        }
      },
      {
        path: "/about",
        element: {
          props: {
            title: "About"
          }
        },
        children: [
          {
            path: 'plants',
            element: {
              props: {
                title: "About Plants"
              }
            }
          },
        ]
      },
    ]
    // Dummy Data expected result
    const expectedResult = [
      {
        path: '/',
        title: "Introduction Page"
      },
      {
        path: '/about',
        title: "About"
      },
      {
        path: '/about/plants',
        title: "About Plants"
      }
    ]

    const generatedRoutes = routeObjectsReducer(routeObjects);
    expect(generatedRoutes).toEqual(expectedResult);
  });

  test('Router Context passes correct information to the progress bar', async() => {
    const routes = ["/", "/page-one", "/page-two"];
    const { container } = render(
      <MemoryRouter initialEntries={routes} initialIndex={1}>
        <FormRouterInternal
          basename="/"
          formData={initialValues}
          title="Page Test"
          >
          <Route index element={<IntroPage title="Intro Page" />} />
          <Route path="/page-one" element={<PageOne title="Page One" />} />
          <Route path="/page-two" element={<PageTwo title="Page Two" />} />
        </FormRouterInternal>
      </MemoryRouter>
    );

    await waitFor(() => 
      expect(
        container.querySelector('h2.vads-u-font-size--h4')
        ?.innerHTML).toContain('Step 2 of 2: Page Two')
      );
  })

});
