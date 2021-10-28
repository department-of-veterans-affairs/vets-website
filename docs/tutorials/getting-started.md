---
layout: page
title: Getting Started
parent: Tutorials
---

# Getting Started
Welcome to Formulate!

For now, Formulate is just a light layer on top of Formik for building single-page forms which can be [embedded inside existing applications](formulate/how-to-guides/how-to-integrate-with-old-forms.html) or used in a stand-alone app. This light layer is responsible for using the VA.gov design system components and providing some basic validation.

To get started, check out the [Formik tutorial](https://formik.org/docs/tutorial) for more information on how to build single-page forms.

## Using Formulate fields
For a list of fields available within Formulate, head over to the [Reference section](/formulate/reference/formulate).

Let's start with an example:
```jsx
// MyForm.jsx
import React from 'react';
import { Formik } from 'formik';
import { TextField } from '@department-of-veterans-affairs/formulate';

import submitData from './submit-data';

const MyForm = () => {
  return (
    <Formik
      onSubmit={submitData}
    >
      <TextField
          name="theData"
          label="The data to collect"
          required
      />
      <button type="submit">Submit</button>
    </Formik>
  );
};

export default MyForm;
```

There are a few things here worth calling out:
- `submitData` is, in this example, a dummy function
    - It may make an API request with the form data payload
    - It may do some data transformation first
    - It's entirely customizable by you, the developer
- `onSubmit` is only called when there are no validation errors
- `TextField` props follow a common pattern: `name`, `label`, and `required`
    - See [How to build Formulate fields](/formulate/how-to-guides/how-to-build-formulate-fields) for more information

The barebones here are pretty basic. That's all there is to it.

## Routing
_Coming soon to a forms library near you!_