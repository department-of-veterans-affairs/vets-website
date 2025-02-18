import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import UnsavedFieldNote from './UnsavedFieldNote';
import { PAGE_PATH } from '../constants';

/** @type {CustomPageType} */
const EditEmail = props => {
  const {
    data,
    formContext,
    goToPath,
    name,
    onSubmit,
    onReviewPage,
    setFormData,
    title,
    updatePage,
    uiSchema,
    schema,
  } = props;

  const [localData, setLocalData] = useState({
    emailAddress: data.emailAddress,
  });

  const handlers = {
    onUpdateReview: () => {
      if (!document.querySelector('va-text-input[error]')) {
        setFormData({ ...data, ...localData });
        updatePage();
      }
    },
    onCancelReview: () => {
      updatePage();
    },
    onCancel: () => {
      goToPath(PAGE_PATH.CONTACT_INFORMATION);
    },
    onChange: formData => {
      setLocalData({ ...localData, ...formData });
    },
    onSubmit: () => {
      setFormData({ ...data, ...localData });
      onSubmit({ formData: { ...data, ...localData } });
    },
  };
  return (
    <div>
      <UnsavedFieldNote fieldName="email address" />
      <SchemaForm
        name={name}
        title={title}
        data={localData}
        uiSchema={uiSchema}
        schema={schema}
        formContext={formContext}
        onSubmit={handlers.onSubmit}
        onChange={handlers.onChange}
      >
        <div className="vads-u-margin-y--2">
          {onReviewPage ? (
            <>
              <va-button
                text="Update Page"
                onClick={handlers.onUpdateReview}
                class="mhv-update-cancel-buttons"
              />
              <va-button
                text="Cancel"
                onClick={handlers.onCancelReview}
                secondary
                class="mhv-update-cancel-buttons"
              />
            </>
          ) : (
            <>
              <va-button
                text="Update"
                submit="prevent"
                class="mhv-update-cancel-buttons"
              />
              <va-button
                text="Cancel"
                onClick={handlers.onCancel}
                secondary
                class="mhv-update-cancel-buttons"
              />
            </>
          )}
        </div>
      </SchemaForm>
    </div>
  );
};

EditEmail.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  appStateData: PropTypes.object,
  data: PropTypes.object,
  defaultEditButton: PropTypes.func,
  formContext: PropTypes.object,
  goToPath: PropTypes.func,
  name: PropTypes.string,
  setFormData: PropTypes.func,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default EditEmail;
