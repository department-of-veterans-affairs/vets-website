import { RouterContextProvider } from "../../src/routing/RouterContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import { Page, RouterProps } from "../../src";
import RouterProgress from "../../src/routing/RouterProgress";
import { render, waitFor } from "@testing-library/react";
import { Formik } from "formik";
import userEvent from "@testing-library/user-event";

const FormRouterInternal = (props: RouterProps): JSX.Element => {
  const [route, updateRoute] = useState('/');

  return (
    <RouterContextProvider
      routes={props.children}
      currentRoute={route}
      updateRoute={updateRoute}>

      <RouterProgress route={route}/>
      <Formik
        initialValues={props.formData}
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
        }}
      >
        <Routes>{props.children}</Routes>
      </Formik>
    </RouterContextProvider>
  )
};

const IndexPage = (props: { title: string }) => (
  <Page
    {...props}
    nextPage="/about">
    <p>Index</p>
  </Page>
);

const AboutPage = (props: { title: string }) => (
  <Page
    {...props}
    nextPage="/confirmation">
    <p>About</p>
  </Page>
);

const ConfirmationPage = (props: { title: string }) => (
  <Page
    {...props}
    nextPage="/"
  >
    <p>Confirmation</p>
  </Page>
);

describe('Routing - Router Progress', () => {
  test('Progress Bars do not show on intro and confirmation pages', async() => {
    const routes = ["/", "/about", "/confirmation"];
    const { container } = render(
      <MemoryRouter initialEntries={routes} initialIndex={0}>
        <FormRouterInternal
          basename="/"
          formData={{}}
          title="Page Test"
        >
          <Route index element={<IndexPage title="Index"/>}/>
          <Route path="/about" element={<AboutPage title="About"/>}/>
          <Route path="/confirmation" element={<ConfirmationPage title="Confirmation"/>}/>
        </FormRouterInternal>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(container.querySelector('h2.vads-u-font-size--h4')).toBeNull();
    });
    userEvent.click(container.querySelector('button.next')!);

    await waitFor(() =>
                    expect(
                      container.querySelector('h2.vads-u-font-size--h4')
                        ?.innerHTML).toContain('Step 1 of 1: About')
    );
    userEvent.click(container.querySelector('button.next')!);

    await waitFor(() => {
      expect(container.querySelector('h2.vads-u-font-size--h4')).toBeNull();
    });
  });
});