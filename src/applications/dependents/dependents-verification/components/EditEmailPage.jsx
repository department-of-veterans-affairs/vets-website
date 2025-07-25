import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { SchemaForm } from 'platform/forms-system/exportsFile';
import { scrollTo } from 'platform/utilities/scroll';
import EditPageButtons from './EditPageButtons';

const EditEmailPage = ({
  schema,
  uiSchema,
  data,
  goToPath,
  contentBeforeButtons,
  contentAfterButtons,
  setFormData,
}) => {
  const returnPath = '/veteran-contact-information';
  const returnToPath = () => {
    goToPath(
      sessionStorage.getItem('onReviewPage')
        ? '/review-and-submit'
        : returnPath,
    );
  };

  const originalEmail = useRef(data.email);
  const originalElectronicCorrespondence = useRef(
    data.electronicCorrespondence,
  );

  const handlers = {
    onInput: inputData => {
      setFormData({
        ...data,
        ...inputData,
      });
    },
    onUpdate: () => {
      returnToPath();
    },
    onCancel: () => {
      setFormData({
        ...data,
        email: originalEmail.current,
        electronicCorrespondence: originalElectronicCorrespondence.current,
      });
      returnToPath();
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
      <h3 className="vads-u-margin-bottom--4">Edit email address</h3>
      <SchemaForm
        addNameAttribute
        name="Contact Info Form"
        title="Contact Info Form"
        idSchema={{}}
        schema={schema}
        data={data}
        uiSchema={uiSchema}
        onChange={handlers.onInput}
        onSubmit={handlers.onUpdate}
      >
        {contentBeforeButtons}
        <EditPageButtons handlers={handlers} pageName="Email address" />
        {contentAfterButtons}
      </SchemaForm>
    </>
  );
};

EditEmailPage.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  uiSchema: PropTypes.object.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default EditEmailPage;
