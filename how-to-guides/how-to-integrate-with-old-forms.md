---
layout: page
title: How to integrate with the old forms library
parent: How-to guides
---

# How to integrate with the old forms library

For more information on how to create non-schema pages in the schema-based forms library, see [Bypassing the Schemaform](https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/bypassing-schemaform). This guide will focus on how VA Forms System Core fits into the mix.

## Create a new page

Let's start with an example. The following would be a page in your existing schema-based form application.

```jsx
// CustomPage.jsx
import React from 'react';
import { Formik } from 'formik';
import { TextField } from '@department-of-veterans-affairs/va-forms-system-core';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import Form from '~/platform/forms/va-forms-system-core-integration/Form';

const CustomPage = ({ data, goBack, goForward, onReviewPage, updatePage }) => {
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;
  return (
    <Formik
      initialValues={data}
      onSubmit={onReviewPage ? updatePage : goForward}
    >
      <Form>
        <TextField name="theData" label="The data to collect" required />
        {onReviewPage ? updateButton : navButtons}
      </Form>
    </Formik>
  );
};

export default CustomPage;
```

## VA Forms System Core-related components

The pieces here that are specific to VA Forms System Core are:

- `Formik`
- `Form`
- `TextField`

### Formik

First off, we have to wrap all the form elements in a [`<Formik>` component](https://formik.org/docs/api/formik). This will hold all the form state.

There are a couple things going on here:

- We're passing the entire form data (from all pages) as `initialValues`
  - This is so `<Form>` can update the data in the redux store (see [Form](#form) below).
- We're passing a callback to `onSubmit` based on whether we're on the review page or not
  - Use `onSubmit` to either move to the next page or update the review page. If there are validation errors on the page, the `onSubmit` callback will not be called. This prevents the user from navigating away if their data is invalid.
  - Note how the `updateButton` and `navButtons` are children of `<Formik>`; this is important. They're `button[type="submit"]`, which will trigger Formik's validation and Formik will then know whether or not to call the `onSubmit` callback.

### Form

The [`Form` component](https://github.com/department-of-veterans-affairs/vets-website/blob/master/src/platform/forms/va-forms-system-core-integration/Form.jsx) is the integration layer between VA Forms System Core and the shema-based forms library. It ensures the Redux context used to store the form data from every other page is updated when data is entered on this VA Forms System Core page. It should be a pass-through that you can mostly ignore. Just make sure it's there.

### TextField

The [`TextField` component](https://github.com/department-of-veterans-affairs/va-forms-system-core/blob/master/src/form-builder/TextField.tsx) is the first component from VA Forms System Core itself. It's a simple text field which uses the VA.gov design system's [`<va-text-input>` web component](https://design.va.gov/storybook/?path=/docs/components-va-text-input--default) and hooks it into the Formik context.

See the [generated documentation](/va-forms-system-core/reference/va-forms-system-core.textfield.html) for more details on how to use it.
