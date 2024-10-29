import React from 'react';
import { SchemaForm, setData } from 'platform/forms-system/exportsFile';
import { useDispatch } from 'react-redux';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { withRouter } from 'react-router';

export const MailingAddressEditBase = props => {
  const dispatch = useDispatch();

  const { location } = props;
  const fromReviewPage = location?.query?.review;

  const setFormData = data => {
    dispatch(setData(data));
  };

  const { schema, uiSchema, data, goBack, goToPath } = props;
  const handlers = {
    onInput: inputData => {
      setFormData(inputData);
    },
    onSubmit: () => {
      if (fromReviewPage) {
        goToPath(
          '/2/task-orange/review-then-submit?updatedSection=veteranAddress&success=true',
        );
        return;
      }
      goBack();
    },
    onCancel: () => {
      goBack();
    },
  };
  return (
    <SchemaForm
      addNameAttribute
      // `name` and `title` are required by SchemaForm, but are only used
      // internally by the SchemaForm component
      name="Contact Info Form"
      title="Contact Info Form"
      schema={schema}
      data={data}
      uiSchema={uiSchema}
      onChange={handlers.onInput}
      onSubmit={handlers.onSubmit}
    >
      <VaButton text="Save" submit="prevent" />
      <VaButton text="Cancel" onClick={handlers.onCancel} secondary />
    </SchemaForm>
  );
};

export const MailingAddressEdit = withRouter(MailingAddressEditBase);
