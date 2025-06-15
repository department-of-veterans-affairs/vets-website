import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { useEditOrAddForm } from 'platform/forms-system/src/js/patterns/array-builder/useEditOrAddForm';
import UnsavedFieldNote from './UnsavedFieldNote';
import { PAGE_PATH } from '../constants';

const EditAddress = props => {
  const { data, schema, uiSchema, onChange, onSubmit } = useEditOrAddForm({
    isEdit: true,
    schema: props.schema,
    uiSchema: props.uiSchema,
    data: props.data,
    onChange: props.onChange,
    onSubmit: props.onSubmit,
  });

  if (!schema) {
    return null;
  }

  const handlers = {
    onUpdateReview: () => {
      if (!document.querySelector('va-text-input[error],va-select[error]')) {
        props.setFormData({ ...data });
        props.updatePage();
      }
    },
    onCancelReview: () => {
      props.updatePage();
    },
    onCancel: () => {
      props.goToPath(PAGE_PATH.CONTACT_INFORMATION);
    },
  };

  return (
    <div>
      <UnsavedFieldNote fieldName="shipping address" />
      <SchemaForm
        addNameAttribute
        name={props.name}
        title={props.title}
        data={data}
        uiSchema={uiSchema}
        schema={schema}
        formContext={props.formContext}
        appStateData={props.appStateData}
        trackingPrefix={props.trackingPrefix}
        onSubmit={onSubmit}
        onChange={onChange}
      >
        <div className="vads-u-margin-y--2">
          {props.onReviewPage ? (
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

EditAddress.propTypes = {
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
  onChange: PropTypes.func,
  onReviewPage: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default EditAddress;
