import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { SchemaForm } from 'platform/forms-system/exportsFile';
import { scrollTo } from 'platform/utilities/scroll';
import EditPageButtons from './EditPageButtons';

import { saveEditContactInformation } from '../util/contact-info';

/**
 * Edit Mailing Address Page Component
 * @typedef {object} EditMailingAddressPageProps
 * @property {object} schema - form schema
 * @property {object} uiSchema - form uiSchema
 * @property {object} data - form data
 * @property {function} goToPath - function to go to specific path
 * @property {function} setFormData - function to set form data
 * @property {node} contentBeforeButtons - content to render before buttons
 * @property {node} contentAfterButtons - content to render after buttons
 *
 * @param {EditMailingAddressPageProps} props - Component props
 * @returns {React.Component} - Edit mailing address page
 */
const EditMailingAddress = ({
  schema,
  uiSchema,
  data,
  goToPath,
  contentBeforeButtons,
  contentAfterButtons,
  setFormData,
}) => {
  const fromReviewPage = sessionStorage.getItem('onReviewPage') || false;

  const returnPath = '/veteran-contact-information';

  const returnToPath = () => {
    goToPath(fromReviewPage ? '/review-and-submit' : returnPath);
  };

  const originalAddress = useRef(data.address);

  const handlers = {
    onInput: inputData => {
      setFormData({
        ...data,
        address: inputData.address,
      });
    },
    onUpdate: () => {
      saveEditContactInformation('address', 'update');
      returnToPath();
    },
    onCancel: event => {
      event.preventDefault();
      setFormData({
        ...data,
        address: originalAddress.current,
      });
      saveEditContactInformation('address', 'cancel');
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
        <EditPageButtons handlers={handlers} pageName="Mailing address" />
        {contentAfterButtons}
      </SchemaForm>
    </>
  );
};

EditMailingAddress.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  uiSchema: PropTypes.object.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default EditMailingAddress;
