// CustomPage.jsx
import React from 'react';
import { Formik } from 'formik';
import { TextField } from '@department-of-veterans-affairs/formulate';

import { useSelector } from 'react-redux';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import Form from '~/platform/forms/formulate-integration/Form';

import { VaTextInput } from 'web-components/react-bindings';

const CustomPage = ({ data, goBack, goForward, onReviewPage, updatePage }) => {
  const customForward = () => {
    goForward();
  };
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  const lorRotaData = useSelector(state => state.preCheckIn);
  // console.log({ lorRotaData });

  return (
    <Formik
      initialValues={data}
      onSubmit={onReviewPage ? updatePage : customForward}
    >
      <Form>
        <TextField
          name="firstName"
          label="First Name"
          title="First Name"
          required
          value={lorRotaData.context.payload.demographics.firstName}
        />
        <VaTextInput
          label={'Working around'}
          required
          value={lorRotaData.context.payload.demographics.firstName}
        />
        {onReviewPage ? updateButton : navButtons}
      </Form>
    </Formik>
  );
};

export default CustomPage;
