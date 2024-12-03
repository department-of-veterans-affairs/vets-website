import React, { useEffect } from 'react';
import { SchemaForm, setData } from 'platform/forms-system/exportsFile';
import { useDispatch } from 'react-redux';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { scrollTo } from '@department-of-veterans-affairs/platform-utilities/ui';

const EditVeteranAddressBase = props => {
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
      goToPath('/2/task-orange/review-then-submit');
    },
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollTo('topScrollElement');
    }, 250);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <va-alert status="info" slim class="vads-u-margin-y--3">
        <p className="vads-u-margin--0">
          <strong>Note:</strong> We’ve prefilled some of your information. If
          you need to make changes, you can edit on this screen. Your changes
          won’t affect your VA.gov profile.
        </p>
      </va-alert>
      <h3 className="vads-u-margin-bottom--4">Edit mailing address</h3>
      <SchemaForm
        addNameAttribute
        // `name` and `title` are required by SchemaForm, but are only used
        // internally by the SchemaForm component
        name="Contact Info Form"
        title="Contact Info Form"
        idSchema={{}}
        schema={schema}
        data={data}
        uiSchema={uiSchema}
        onChange={handlers.onInput}
        onSubmit={handlers.onSubmit}
      >
        <VaButton text="Save" submit="prevent" />
        <VaButton text="Cancel" onClick={handlers.onCancel} secondary />
      </SchemaForm>
      <div className="vads-u-margin-y--4">
        <va-link
          text="Finish this application later"
          href="/mock-form-ae-design-patterns/2/task-orange"
        />
      </div>
    </>
  );
};

EditVeteranAddressBase.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  location: PropTypes.object,
};

export const EditVeteranAddress = withRouter(EditVeteranAddressBase);
