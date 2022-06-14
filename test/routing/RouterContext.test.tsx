import React from 'react';

import { getNextRoute, getPreviousRoute, routeObjectsReducer, RouterContext, RouterContextProvider } from "../../src/routing/RouterContext";
import { Formik } from "formik";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ConditionalRoute, Page, RouterProps } from "../../src";
import { render, waitFor } from "@testing-library/react";
import RouterProgress from "../../src/routing/RouterProgress";

const IntroPage = (props: {title: string}) => (
  <Page 
    {...props}>
    <p>page one</p>
  </Page>
);

const PageOne = (props: {title: string}) => (
  <Page
    {...props}>
    <p>page one</p>
  </Page>
);

const PageTwo = (props: {title: string}) => (
  <Page 
  {...props}
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
  zipcode: '',
  conditional: true,
  conditionalFalse: false
};

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
      <RouterContextProvider
        routes={props.children}
        >
        <RouterProgress />
        <Routes>{props.children}</Routes>
      </RouterContextProvider>
    </Formik>
  )
};

describe('Routing - Router Context', () => {

  test('NextRoute function returns next viable route', () => {
    const routes = [
      {
        path: '/',
        title: "Introduction Page",
        conditional: false,
        isShown: null
      },
      {
        path: '/about',
        title: "About",
        conditional: true,
        isShown: false
      },
      {
        path: '/about-plants',
        title: "About Plants",
        conditional: true,
        isShown: true
      }
    ]
    const nextRoute = getNextRoute(routes, '/');
    expect(nextRoute?.path).toEqual('/about-plants');
  });

  test('PrevRoute function returns previous viable route', () => {
    const routes = [
      {
        path: '/',
        title: "Introduction Page",
        conditional: false,
        isShown: null
      },
      {
        path: '/about-animals',
        title: "About Animals",
        conditional: true,
        isShown: true
      },
      {
        path: '/about',
        title: "About",
        conditional: true,
        isShown: false
      },
      {
        path: '/about-plants',
        title: "About Plants",
        conditional: true,
        isShown: true
      }
    ]
    const nextRoute = getPreviousRoute(routes, '/about-plants');
    expect(nextRoute?.path).toEqual('/about-animals');
  });

  test('First route previous route function returns null', () => {
    const routes = [
      {
        path: '/',
        title: "Introduction Page",
        conditional: false,
        isShown: null
      },
      {
        path: '/about-animals',
        title: "About Animals",
        conditional: true,
        isShown: true
      },
      {
        path: '/about',
        title: "About",
        conditional: true,
        isShown: false
      },
      {
        path: '/about-plants',
        title: "About Plants",
        conditional: true,
        isShown: true
      }
    ]
    const previousRoute = getPreviousRoute(routes, '/');
    expect(previousRoute).toBe(null);
  });

  test('Last route next route function returns null', () => {
    const routes = [
      {
        path: '/',
        title: "Introduction Page",
        conditional: false,
        isShown: null
      },
      {
        path: '/about-animals',
        title: "About Animals",
        conditional: true,
        isShown: true
      },
      {
        path: '/about',
        title: "About",
        conditional: true,
        isShown: false
      },
      {
        path: '/about-plants',
        title: "About Plants",
        conditional: true,
        isShown: true
      }
    ]
    const nextRoute = getNextRoute(routes, '/about-plants');
    expect(nextRoute).toBe(null);
  });

  test('Landing on disabled route should return next viable route', () => {
    const routes = [
      {
        path: '/',
        title: "Introduction Page",
        conditional: false,
        isShown: null
      },
      {
        path: '/about-animals',
        title: "About Animals",
        conditional: true,
        isShown: false
      },
      {
        path: '/about',
        title: "About",
        conditional: true,
        isShown: false
      },
      {
        path: '/about-plants',
        title: "About Plants",
        conditional: true,
        isShown: true
      }
    ]
    const nextRoute = getNextRoute(routes, '/about-animals');
    expect(nextRoute?.path).toBe('/about-plants');
  });

  test('Router Context passes correct route information to the progress bar', async() => {
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

    await waitFor(() => expect(
      container.querySelector('h2.vads-u-font-size--h4')
      ?.innerHTML).toContain('Step 1 of 2: Page One')
    );
  })

  test('Router Context passes correct conditional route information to the progress bar', async() => {
    const routes = ["/", "/page-two", "/page-two-conditional"];
    const { container } = render(
      <MemoryRouter initialEntries={routes} initialIndex={1}>
        <FormRouterInternal
          basename="/"
          formData={initialValues}
          title="Page Test"
          >
          {/* Progress bar skips '/' */}
          <Route index element={<PageOne title="Page One" />} /> 
          <Route path="/page-two" element={<PageTwo title="Page Two" />} />
          <Route path="/page-two-conditional" element={
            <ConditionalRoute title="Page Two Conditional" type="conditional" condition={'conditional'}>
              <PageTwo title="Page Two Conditional" />
            </ConditionalRoute>
          } />
        </FormRouterInternal>
      </MemoryRouter>
    );

    await waitFor(() => expect(
      container.querySelector('h2.vads-u-font-size--h4')
      ?.innerHTML).toContain('Step 1 of 2: Page Two')
    );
  })

  test('Landing on enabled Conditional Route Renders child element', async() => {
    const routes = ["/", "/page-two", "/page-two-conditional"];
    const { container } = render(
      <MemoryRouter initialEntries={routes} initialIndex={2}>
        <FormRouterInternal
          basename="/"
          formData={initialValues}
          title="Page Test"
          >
          <Route index element={<PageOne title="Page One" />} />
          <Route path="/page-two" element={<PageTwo title="Page Two" />} />
          <Route path="/page-two-conditional" element={
            <ConditionalRoute title="Page Two Conditional" type="conditional" condition={'conditional'}>
              <PageTwo title="Page Two Conditional" />
            </ConditionalRoute>
          } />
        </FormRouterInternal>
      </MemoryRouter>
    );

    await waitFor(() => expect(
      container.querySelector('h2.vads-u-font-size--h4')
      ?.innerHTML).toContain('Step 2 of 2: Page Two Conditional')
    );
  });

  test('Landing on disabled Conditional Route Renders next viable route', async() => {
    const routes = [
      "/",
      "/page-two-conditional",
      "/page-two-point-five-conditional",
      "/page-three"
    ];
    const { container } = render(
      <MemoryRouter initialEntries={routes} initialIndex={2}>
        <FormRouterInternal
          basename="/"
          formData={initialValues}
          title="Page Test"
          >
          <Route index element={<PageOne title="Page One" />} />
          <Route path="/page-two-conditional" element={
            <ConditionalRoute title="Page Two Conditional" type="conditional" condition={'conditionalFalse'}>
              <PageTwo title="Page Two Conditional" />
            </ConditionalRoute>
          } />
           <Route path="/page-two-point-five-conditional" element={
            <ConditionalRoute title="Page Two Point Five Conditional" type="conditional" condition={'conditionalFalse'}>
              <PageTwo title="Page Two Point Five Conditional" />
            </ConditionalRoute>
          } />
          <Route path="/page-three" element={<PageTwo title="Page Three" />} />
        </FormRouterInternal>
      </MemoryRouter>
    );

    await waitFor(() => expect(
      container.querySelector('h2.vads-u-font-size--h4')
      ?.innerHTML).toContain('Step 1 of 1: Page Three')
    );
  });
});
