import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import _ from 'lodash/fp';
import classNames from 'classnames';
import Scroll from 'react-scroll';
import { scrollToFirstError } from 'platform/forms-system/src/js/utilities/ui';
import { setArrayRecordTouched } from 'platform/forms-system/src/js/helpers';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';
import {
  toIdSchema,
  getDefaultFormState,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

const ItemLoop = ({
  uiSchema,
  idSchema,
  schema,
  onChange,
  registry,
  formData,
  errorSchema,
  formContext,
  disabled,
  readonly,
  onBlur,
}) => {
  const definitions = registry.definitions;
  const { TitleField, SchemaField } = registry.fields;
  const uiOptions = uiSchema['ui:options'] || {};
  const title = uiSchema['ui:title'] || schema.title;
  const hideTitle = !!uiOptions.title;
  const description = uiSchema['ui:description'];
  const textDescription = typeof description === 'string' ? description : null;
  const ViewField = uiOptions.viewField;
  const DescriptionField =
    typeof description === 'function' ? uiSchema['ui:description'] : null;
  const isReviewMode = uiSchema['ui:options'].reviewMode;
  const hasTitleOrDescription = (!!title && !hideTitle) || !!description;

  const [editing, setEditing] = useState([]);

  useEffect(() => {
    // Throw an error if there’s no viewField (should be React component)
    if (typeof uiSchema['ui:options'].viewField !== 'function') {
      throw new Error(
        `No viewField found in uiSchema for ArrayField ${idSchema.$id}.`,
      );
    }
    if (schema.minItems > 0 && formData.length === 0) {
      onChange(
        Array(schema.minItems).fill(
          getDefaultFormState(
            schema.additionalItems,
            undefined,
            registry.definitions,
          ),
        ),
      );
    }
  });

  useEffect(
    () => {
      const isEditing = formData
        ? formData.map((item, index) => !errorSchemaIsValid(errorSchema[index]))
        : [true];

      if (formData?.length !== editing.length) {
        setEditing(isEditing);
      }
    },
    [errorSchema, formData, editing.length],
  );

  const getItemSchema = index => {
    if (schema.items.length > index) {
      return schema.items[index];
    }
    return schema.additionalItems;
  };

  const scrollToTop = () => {
    setTimeout(() => {
      scroller.scrollTo(
        `topOfTable_${idSchema.$id}`,
        window.Forms?.scroll || {
          duration: 500,
          delay: 0,
          smooth: true,
          offset: -60,
        },
      );
    }, 100);
  };

  const scrollToRow = id => {
    if (!uiSchema['ui:options'].doNotScroll) {
      setTimeout(() => {
        scroller.scrollTo(
          `table_${id}`,
          window.Forms?.scroll || {
            duration: 500,
            delay: 0,
            smooth: true,
            offset: 0,
          },
        );
      }, 100);
    }
  };

  const handleChange = (index, value) => {
    const newItems = _.set(index, value, formData || []);
    onChange(newItems);
  };

  const handleEdit = (e, index) => {
    e.preventDefault();
    const editData = editing.map((item, i) => {
      if (i === index) {
        return true;
      }
      return false;
    });
    setEditing(editData);
    scrollToRow(`${idSchema.$id}_${index}`);
  };

  const handleUpdate = (e, index) => {
    e.preventDefault();
    if (errorSchemaIsValid(errorSchema[index])) {
      const editData = editing.map(() => {
        return false;
      });
      setEditing(editData);
      scrollToRow(`${idSchema.$id}_${index}`);
    } else {
      // Set all the fields for this item as touched, so we show errors
      const touched = setArrayRecordTouched(idSchema.$id, index);
      formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  };

  const handleAdd = () => {
    const lastIndex = formData.length - 1;
    if (errorSchemaIsValid(errorSchema[lastIndex])) {
      // When we add another item we want to change the editing
      // state of the last item, but not ones above it
      const newEditing = editing?.map(
        (item, index) => (index + 1 === editing.length ? false : item),
      );
      const newFormData = formData.concat(
        getDefaultFormState(
          schema.additionalItems,
          undefined,
          registry.definitions,
        ),
        // ) || {}, // TODO: sets new item to empty object should be integer for type number
      );
      onChange(newFormData);
      setEditing(newEditing);
      scrollToRow(`${idSchema.$id}_${lastIndex + 1}`);
    } else {
      const touched = setArrayRecordTouched(idSchema.$id, lastIndex);
      formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  };

  const handleRemove = indexToRemove => {
    const newItems = formData.filter((item, index) => index !== indexToRemove);
    const filtered = editing.filter((item, index) => index !== indexToRemove);
    setEditing(filtered);
    onChange(newItems);
    scrollToTop();
  };

  // use form data otherwise use an array with a single default object
  const items =
    formData && formData.length
      ? formData
      : [getDefaultFormState(schema, undefined, registry.definitions)];
  const addAnotherDisabled = items.length >= (schema.maxItems || Infinity);

  const containerClassNames = classNames({
    'schemaform-field-container': true,
    'schemaform-block': hasTitleOrDescription,
  });

  return (
    <div className={containerClassNames}>
      {hasTitleOrDescription && (
        <div className="schemaform-block-header">
          {title && !hideTitle ? (
            <TitleField
              id={`${idSchema.$id}__title`}
              title={title}
              formContext={formContext}
            />
          ) : null}
          {textDescription && <p>{textDescription}</p>}
          {DescriptionField && (
            <DescriptionField options={uiSchema['ui:options']} />
          )}
          {!textDescription && !DescriptionField && description}
        </div>
      )}
      <div className="va-growable">
        <Element name={`topOfTable_${idSchema.$id}`} />
        {items.map((item, index) => {
          const isEditing = editing[index];
          const showSave = uiSchema['ui:options'].showSave;
          const updateText = showSave && index === 0 ? 'Save' : 'Update';
          const isLast = items.length === index + 1;
          const notLastOrMultipleRows = showSave || !isLast || items.length > 1;
          const itemSchema = getItemSchema(index);
          const itemIdPrefix = `${idSchema.$id}_${index}`;
          const itemIdSchema = toIdSchema(
            itemSchema,
            itemIdPrefix,
            definitions,
          );

          return (isReviewMode ? (
            isEditing
          ) : (
            isLast || isEditing
          )) ? (
            <div
              key={index}
              className={
                notLastOrMultipleRows ? 'va-growable-background' : null
              }
            >
              <Element name={`table_${itemIdPrefix}`} />
              <div className="row small-collapse">
                <div className="small-12 columns va-growable-expanded">
                  {isLast &&
                  items.length > 1 &&
                  uiSchema['ui:options'].itemName ? (
                    <h3 className="vads-u-font-size--h5">
                      New {uiSchema['ui:options'].itemName}
                    </h3>
                  ) : null}
                  <div className="input-section">
                    <SchemaField
                      key={index}
                      schema={itemSchema}
                      uiSchema={uiSchema.items}
                      errorSchema={errorSchema ? errorSchema[index] : undefined}
                      idSchema={itemIdSchema}
                      formData={item}
                      onChange={value => handleChange(index, value)}
                      onBlur={onBlur}
                      registry={registry}
                      required={false}
                      disabled={disabled}
                      readonly={readonly}
                    />
                  </div>
                  {notLastOrMultipleRows && (
                    <div className="row small-collapse">
                      <div className="small-6 left columns">
                        {(!isLast || showSave) && (
                          <button
                            className="float-left"
                            onClick={e => handleUpdate(e, index)}
                            aria-label={`${updateText} ${title}`}
                          >
                            {updateText}
                          </button>
                        )}
                      </div>
                      <div className="small-6 right columns">
                        {index !== 0 && (
                          <button
                            className="usa-button-secondary float-right"
                            type="button"
                            onClick={() => handleRemove(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div key={index} className="va-growable-background editable-row">
              <div className="row small-collapse vads-u-display--flex vads-u-align-items--center">
                <div className="vads-u-flex--fill">
                  <ViewField
                    formData={item}
                    onEdit={e => handleEdit(e, index)}
                  />
                </div>
                <button
                  className="usa-button-secondary edit vads-u-flex--auto"
                  onClick={e => handleEdit(e, index)}
                  aria-label={`Edit ${title}`}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
        <button
          type="button"
          className={classNames('usa-button-secondary', 'va-growable-add-btn', {
            'usa-button-disabled': !formData || addAnotherDisabled,
          })}
          disabled={!formData || addAnotherDisabled}
          onClick={() => handleAdd()}
        >
          Add another {uiOptions.itemName}
        </button>
        <p>
          {addAnotherDisabled &&
            `You’ve entered the maximum number of items allowed.`}
        </p>
      </div>
    </div>
  );
};

export default ItemLoop;

ItemLoop.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  errorSchema: PropTypes.object,
  requiredSchema: PropTypes.object,
  idSchema: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  formData: PropTypes.array,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  registry: PropTypes.shape({
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    ).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    definitions: PropTypes.object.isRequired,
    formContext: PropTypes.object.isRequired,
  }),
};
