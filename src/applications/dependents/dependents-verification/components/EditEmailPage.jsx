import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { SchemaForm } from 'platform/forms-system/exportsFile';
import { scrollTo } from 'platform/utilities/scroll';
import EditPageButtons from './EditPageButtons';

import { saveEditContactInformation } from '../util/contact-info';

/**
 * Edit Email Page Component
 * @typedef {object} EditEmailPageProps
 * @property {object} schema - form schema
 * @property {object} uiSchema - form uiSchema
 * @property {object} data - form data
 * @property {function} goToPath - function to go to specific path
 * @property {function} setFormData - function to set form data
 * @property {node} contentBeforeButtons - content to render before buttons
 * @property {node} contentAfterButtons - content to render after buttons
 *
 * @param {EditEmailPageProps} props - Component props
 * @returns {React.Component} - Edit email page
 */
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
      saveEditContactInformation('email', 'update');
      returnToPath();
    },
    onCancel: event => {
      event.preventDefault();
      setFormData({
        ...data,
        email: originalEmail.current,
        electronicCorrespondence: originalElectronicCorrespondence.current,
      });
      saveEditContactInformation('email', 'cancel');
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
