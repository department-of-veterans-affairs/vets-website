import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import { isReactComponent } from 'platform/utilities/ui';

const ReviewCardField = ({
  uiSchema,
  schema,
  errorSchema,
  idSchema,
  registry,
  formData,
  onBlur,
  formContext,
  onChange,
  required,
  disabled,
  readonly,
}) => {
  const [editing, setEditing] = useState(false);
  const [canCancel, setCanCancel] = useState(!editing);
  const [oldData, setOldData] = useState(formData);

  const invalidInitialData = !errorSchemaIsValid(errorSchema);
  const startInEditConfigOption = get(
    'ui:options.startInEdit',
    uiSchema,
    false,
  );

  useEffect(() => {
    let shouldStartInEdit = startInEditConfigOption;

    if (typeof startInEditConfigOption === 'function') {
      shouldStartInEdit = startInEditConfigOption(formData);
    }

    setEditing(invalidInitialData || shouldStartInEdit);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Throw an error if there’s no viewComponent (should be React component)
    if (!isReactComponent(get('ui:options.viewComponent', uiSchema))) {
      throw new Error(
        `No viewComponent found in uiSchema for ReviewCardField ${
          idSchema.$id
        }.`,
      );
    }

    const acceptedTypes = ['object', 'array'];
    if (!acceptedTypes.includes(schema.type)) {
      throw new Error(
        `Unknown schema type in ReviewCardField. Expected one of [${acceptedTypes.join(
          ', ',
        )}], but got ${schema.type}.`,
      );
    }
  });

  const resetFormData = () => {
    const newData = getDefaultFormState(
      schema,
      undefined,
      registry.definitions,
    );
    onChange(newData);
  };

  const startEditing = () => {
    // If the data is volatile, cache the original data before
    // clearing it out so we have the option to cancel later
    if (uiSchema['ui:options']?.volatileData) {
      setOldData(formData);
      resetFormData();
    }
    setEditing(true);
  };

  const update = () => {
    if (!errorSchemaIsValid(errorSchema)) {
      // Show validation errors
      formContext.onError();
    } else {
      setEditing(false);
      setCanCancel(true);
      setOldData(formData);
      if (uiSchema.saveClickTrackEvent) {
        recordEvent(uiSchema.saveClickTrackEvent);
      }
    }
  };

  const cancelUpdate = () => {
    onChange(oldData);
    setEditing(false);
  };

  const getTitle = () => {
    return typeof uiSchema['ui:title'] === 'function'
      ? uiSchema['ui:title'](formData)
      : uiSchema['ui:title'];
  };

  const getSubtitle = () => {
    return typeof uiSchema['ui:subtitle'] === 'function'
      ? uiSchema['ui:subtitle'](formData)
      : uiSchema['ui:subtitle'];
  };

  const getDescription = () => {
    const description = uiSchema['ui:description'];
    if (!description) return null;

    return typeof description === 'function' ? (
      description(formData)
    ) : (
      <p>{description}</p>
    );
  };

  const getEditView = () => {
    const { SchemaField } = registry.fields;
    const newUISchema = omit(
      ['ui:field', 'ui:title', 'ui:description'],
      uiSchema,
    );

    const { volatileData, editTitle } = newUISchema['ui:options'];
    const title = editTitle || getTitle();
    const subtitle = getSubtitle();
    const titleClasses = [
      'review-card--title',
      'vads-u-margin-top--1',
      'vads-u-margin-bottom--2p5',
      'vads-u-margin-x--0',
    ].join(' ');

    const updateButtonClasses = [
      'update-button',
      'usa-button-primary',
      'vads-u-margin-top--1',
      'vads-u-margin-right--1p5',
      'vads-u-width--auto',
    ].join(' ');

    const cancelButtonClasses = [
      'cancel-button',
      'usa-button-secondary',
      'vads-u-width--auto',
    ].join(' ');

    const Field = (
      <SchemaField
        name={idSchema.$id}
        required={required}
        schema={schema}
        uiSchema={newUISchema}
        errorSchema={errorSchema}
        idSchema={idSchema}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
        registry={registry}
        disabled={disabled}
        readonly={readonly}
      />
    );

    const needsDlWrapper =
      // Wrap in DL only if on review page & in review mode
      formContext.onReviewPage &&
      formContext.reviewMode &&
      // volatileData is for arrays, which displays separate blocks
      newUISchema['ui:options']?.volatileData;

    const saveButtonText = 'Save mailing address';
    const cancelButtonText = 'Cancel';

    return (
      <div className="review-card">
        <div className="review-card--body input-section va-growable-background">
          <h4 className={titleClasses}>{title}</h4>
          {subtitle && <div className="review-card--subtitle">{subtitle}</div>}
          {needsDlWrapper ? <dl className="review">{Field}</dl> : Field}
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-top--2p5">
            {!formContext.reviewMode && (
              <>
                <va-button
                  className={updateButtonClasses}
                  text={saveButtonText}
                  onClick={update}
                />
                {((volatileData && canCancel) || !volatileData) && (
                  <va-button
                    className={cancelButtonClasses}
                    text={cancelButtonText}
                    onClick={cancelUpdate}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getReviewView = () => {
    const { viewComponent: ViewComponent } = uiSchema['ui:options'];
    return <ViewComponent formData={formData} edit={startEditing} />;
  };

  const description = getDescription();
  const viewOrEditCard = editing ? getEditView() : getReviewView();

  return (
    <>
      {description}
      {viewOrEditCard}
    </>
  );
};

ReviewCardField.propTypes = {
  errorSchema: PropTypes.object.isRequired,
  formContext: PropTypes.shape({
    onError: PropTypes.func.isRequired,
    onReviewPage: PropTypes.func,
    reviewMode: PropTypes.bool,
  }).isRequired,
  formData: PropTypes.object.isRequired,
  idSchema: PropTypes.object.isRequired,
  registry: PropTypes.shape({
    fields: PropTypes.shape({
      SchemaField: PropTypes.elementType.isRequired,
    }),
    definitions: PropTypes.object.isRequired,
  }).isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      viewComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.elementType,
      ]).isRequired,
      startInEdit: PropTypes.oneOfType([PropTypes.func, PropTypes.any]),
      volatileData: PropTypes.bool,
      reviewTitle: PropTypes.string,
      editTitle: PropTypes.string,
      itemName: PropTypes.string,
      itemNameAction: PropTypes.string,
    }).isRequired,
    'ui:description': PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
      PropTypes.string,
    ]),
    'ui:title': PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    'ui:subtitle': PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    saveClickTrackEvent: PropTypes.object,
  }).isRequired,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
};

export default ReviewCardField;
