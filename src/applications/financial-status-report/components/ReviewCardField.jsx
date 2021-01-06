import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

const ReviewCardField = props => {
  const [editing, setEditing] = useState(false);
  const [canCancel, setCanCancel] = useState(!editing);
  const [oldData, setOldData] = useState(props.formData);

  useEffect(() => {
    // Throw an error if there’s no viewComponent (should be React component)
    if (typeof get('ui:options.viewComponent', props.uiSchema) !== 'function') {
      throw new Error(
        `No viewComponent found in uiSchema for ReviewCardField ${
          props.idSchema.$id
        }.`,
      );
    }

    const acceptedTypes = ['object', 'array'];
    if (!acceptedTypes.includes(props.schema.type)) {
      throw new Error(
        `Unknown schema type in ReviewCardField. Expected one of [${acceptedTypes.join(
          ', ',
        )}], but got ${props.schema.type}.`,
      );
    }

    const invalidInitialData = !errorSchemaIsValid(props.errorSchema);
    const startInEditConfigOption = get(
      'ui:options.startInEdit',
      props.uiSchema,
      false,
    );

    let shouldStartInEdit = startInEditConfigOption;
    if (typeof startInEditConfigOption === 'function') {
      shouldStartInEdit = startInEditConfigOption(props.formData);
    }
    setEditing(invalidInitialData || shouldStartInEdit);
  }, []);

  const resetFormData = () => {
    const formData = getDefaultFormState(
      props.schema,
      undefined,
      props.registry.definitions,
    );
    props.onChange(formData);
  };

  const startEditing = () => {
    // If the data is volatile, cache the original data before
    // clearing it out so we have the option to cancel later
    if (props.uiSchema['ui:options']?.volatileData) {
      setOldData(props.formData);
      resetFormData();
    }
    setEditing(true);
  };

  const update = () => {
    if (!errorSchemaIsValid(props.errorSchema)) {
      // Show validation errors
      props.formContext.onError();
    } else {
      setEditing(false);
      setCanCancel(true);
      setOldData(props.formData);
      if (props.uiSchema.saveClickTrackEvent) {
        recordEvent(props.uiSchema.saveClickTrackEvent);
      }
    }
  };

  const cancelUpdate = () => {
    props.onChange(oldData);
    setEditing(false);
  };

  const getTitle = () => {
    const { uiSchema, formData } = props;
    return typeof uiSchema['ui:title'] === 'function'
      ? uiSchema['ui:title'](formData)
      : uiSchema['ui:title'];
  };

  const getSubtitle = () => {
    const { uiSchema, formData } = props;
    return typeof uiSchema['ui:subtitle'] === 'function'
      ? uiSchema['ui:subtitle'](formData)
      : uiSchema['ui:subtitle'];
  };

  const getDescription = () => {
    const {
      uiSchema: { 'ui:description': description },
      formData,
    } = props;
    if (!description) {
      return null;
    }

    return typeof description === 'function' ? (
      description(formData)
    ) : (
      <p>{description}</p>
    );
  };

  const getEditView = () => {
    const {
      disabled,
      errorSchema,
      formData,
      idSchema,
      onBlur,
      onChange,
      readonly,
      registry,
      required,
      schema,
      formContext,
    } = props;

    const { SchemaField } = registry.fields;
    const uiSchema = omit(
      ['ui:field', 'ui:title', 'ui:description'],
      props.uiSchema,
    );

    const { volatileData, editTitle } = props.uiSchema['ui:options'];
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
        uiSchema={uiSchema}
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
      uiSchema['ui:options']?.volatileData;

    return (
      <div className="review-card">
        <div className="review-card--body input-section va-growable-background">
          <h4 className={titleClasses}>{title}</h4>
          {subtitle && <div className="review-card--subtitle">{subtitle}</div>}
          {needsDlWrapper ? <dl className="review">{Field}</dl> : Field}
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-top--2p5">
            {!formContext.reviewMode && (
              <>
                <button className={updateButtonClasses} onClick={update}>
                  Save mailing address
                </button>
                {((volatileData && canCancel) || !volatileData) && (
                  <button
                    className={cancelButtonClasses}
                    onClick={cancelUpdate}
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getReviewView = () => {
    const { viewComponent: ViewComponent } = props.uiSchema['ui:options'];
    return <ViewComponent formData={props.formData} edit={startEditing} />;
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
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      viewComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
        .isRequired,
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
  schema: PropTypes.object.isRequired,
  errorSchema: PropTypes.object.isRequired,
  idSchema: PropTypes.object.isRequired,
  registry: PropTypes.shape({
    fields: PropTypes.shape({
      SchemaField: PropTypes.func.isRequired,
    }),
    definitions: PropTypes.object.isRequired,
  }).isRequired,
  formData: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  formContext: PropTypes.shape({
    onError: PropTypes.func.isRequired,
  }).isRequired,
};

export default ReviewCardField;
