// CustomPage.jsx
import React from 'react';
import { Formik } from 'formik';
import { TextField } from '@department-of-veterans-affairs/formulate';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import Form from '~/platform/forms/formulate-integration/Form';

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
