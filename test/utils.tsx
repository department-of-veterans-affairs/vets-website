import React from 'react';
import { render } from '@testing-library/react';
import { Formik, FormikProps, FormikConfig } from 'formik';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const buildRenderForm = (initialValues: Record<string, unknown>) => {
  type Values = typeof initialValues;

  // Got this from Formik's Field tests
  return function renderForm(
    ui?: React.ReactNode,
    props?: Partial<FormikConfig<Values>>
  ) {
    let injected: FormikProps<Values>;
    const { rerender, ...rest } = render(
      <Formik onSubmit={noop} initialValues={initialValues} {...props}>
        {(formikProps: FormikProps<Values>) =>
          (injected = formikProps) && ui ? ui : null
        }
      </Formik>
    );

    return {
      getFormProps(): FormikProps<Values> {
        return injected;
      },
      ...rest,
      rerender: () =>
        rerender(
          <Formik onSubmit={noop} initialValues={initialValues} {...props}>
            {(formikProps: FormikProps<Values>) =>
              (injected = formikProps) && ui ? ui : null
            }
          </Formik>
        ),
    };
  };
};
