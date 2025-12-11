import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { SchemaForm } from 'platform/forms-system/exportsFile';
import { scrollTo } from 'platform/utilities/scroll';
import EditPageButtons from './EditPageButtons';

import { saveEditContactInformation } from '../util/contact-info';

/**
 * Edit Phone Page Component
 * @typedef {object} EditPhonePageProps
 * @property {object} schema - form schema
 * @property {object} uiSchema - form uiSchema
 * @property {object} data - form data
 * @property {function} goToPath - function to go to specific path
 * @property {function} setFormData - function to set form data
 * @property {node} contentBeforeButtons - content to render before buttons
 * @property {node} contentAfterButtons - content to render after buttons
 *
 * @param {EditPhonePageProps} props - Component props
 * @returns {React.Component} - Edit phone page
 */
const EditPhonePage = ({
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

  const originalPhone = useRef(data.phone);

  const handlers = {
    onInput: inputData => {
      setFormData({
        ...data,
        phone: inputData.phone,
      });
    },
    onUpdate: () => {
      saveEditContactInformation('phone', 'update');
      returnToPath();
    },
    onCancel: event => {
      event.preventDefault();
      setFormData({
        ...data,
        phone: originalPhone.current,
      });
      saveEditContactInformation('phone', 'cancel');
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
      <h3 className="vads-u-margin-bottom--4">
        {`Edit ${data['view:phoneSource'] || 'mobile'} phone number`}
      </h3>
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
        <EditPageButtons handlers={handlers} pageName="Phone number" />
        {contentAfterButtons}
      </SchemaForm>
    </>
  );
};

EditPhonePage.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  uiSchema: PropTypes.object.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default EditPhonePage;
