import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';

import {
  toIdSchema,
  getDefaultFormState,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import scrollTo from 'platform/utilities/ui/scrollTo';
import set from 'platform/utilities/data/set';
import {
  $,
  focusElement,
  scrollToFirstError,
} from 'platform/forms-system/src/js/utilities/ui';
import { setArrayRecordTouched } from 'platform/forms-system/src/js/helpers';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';
import { isReactComponent } from 'platform/utilities/ui';

const { Element } = Scroll;

const copyAndUpdate = (arr, index, val) => {
  const copy = [...arr];
  copy[index] = val;
  return copy;
};

const LocationField = ({
  disabled,
  errorSchema,
  formContext,
  formData = [],
  idSchema,
  onBlur,
  onChange,
  readonly,
  registry,
  schema,
  uiSchema,
}) => {
  const setupEditing = () =>
    formData.length
      ? formData.map((item, index) => !errorSchemaIsValid(errorSchema[index]))
      : [true];

  const [editing, setEditing] = useState(setupEditing);

  useEffect(
    () => {
      // This fills in an empty item in the array if it has minItems set
      // so that schema validation runs against the fields in the first item
      // in the array. This shouldn’t be necessary, but there’s a fix in rjsf
      // that has not been released yet
      if (schema.minItems > 0 && formData.length === 0) {
        onChange(
          Array(schema.minItems).fill(
            getDefaultFormState(
              schema.additionalItems || schema.items,
              undefined,
              registry.definitions,
            ),
          ),
        );
      }
    },
    [schema, registry, formData, onChange],
  );

  const onItemChange = (indexToChange, value) => {
    const newItems = set(indexToChange, value, formData);
    onChange(newItems);
  };

  const getItemSchema = index => {
    if (schema?.items?.length > index) {
      return schema.items[index];
    }
    return schema.additionalItems;
  };

  /*
   * Clicking edit on an item that’s not last and so is in view mode
   */
  const handleEdit = (index, status = true) => {
    setEditing(copyAndUpdate(editing, index, status));
    setTimeout(() => scrollTo(`table_${idSchema.$id}_${index}`));
  };

  /*
   * Clicking Update on an item that’s not last and is in edit mode
   */
  const handleUpdate = index => {
    if (errorSchemaIsValid(errorSchema[index])) {
      setEditing(copyAndUpdate(editing, index, false));
      scrollTo(`topOfTable_${idSchema.$id}`, { offset: -60 });
    } else {
      // Set all the fields for this item as touched, so we show errors
      const touched = setArrayRecordTouched(idSchema.$id, index);
      formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  };

  /*
   * Clicking Add another
   */
  const handleAdd = () => {
    const lastIndex = formData.length - 1;
    if (errorSchemaIsValid(errorSchema[lastIndex])) {
      // When we add another, we want to change the editing state of the currently
      // last item, but not ones above it
      const newEditing = editing.map(
        (val, index) => (index + 1 === editing.length ? false : val),
      );
      const editingState = uiSchema['ui:options'].reviewMode;
      setEditing([...newEditing, !!editingState]);
      const newFormData = formData.concat(
        getDefaultFormState(
          schema.additionalItems,
          undefined,
          registry.definitions,
        ) || {},
      );
      onChange(newFormData);
      const card = `table_${idSchema.$id}_${lastIndex + 1}`;
      scrollTo(card);
      setTimeout(() => {
        focusElement($(`[name="${card}"]`)?.parentElement);
      });
    } else {
      const touched = setArrayRecordTouched(idSchema.$id, lastIndex);
      formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  };

  /*
   * Clicking Remove on an item in edit mode
   */
  const handleRemove = indexToRemove => {
    const newItems = formData.filter((val, index) => index !== indexToRemove);
    const newEditing = editing.filter((val, index) => index !== indexToRemove);
    onChange(newItems);
    setEditing(newEditing);
    scrollTo(`topOfTable_${idSchema.$id}`, { offset: -60 });
    // Focus on "Add Another xyz" button after removing
    focusElement('.va-growable-add-btn');
  };

  const { definitions } = registry;
  const { TitleField, SchemaField } = registry.fields;

  const uiOptions = uiSchema['ui:options'] || {};
  const ViewField = uiOptions.viewField;
  const title = uiSchema['ui:title'] || schema.title;
  const hideTitle = !!uiOptions.title;
  const description = uiSchema['ui:description'];
  const textDescription = typeof description === 'string' ? description : null;
  const DescriptionField = isReactComponent(description)
    ? uiSchema['ui:description']
    : null;
  const isReviewMode = uiOptions.reviewMode;
  const hasTitleOrDescription = (!!title && !hideTitle) || !!description;

  // if we have form data, use that, otherwise use an array with a single
  // default object
  const items =
    formData && formData.length
      ? formData
      : [getDefaultFormState(schema, undefined, registry.definitions)];
  const itemsLength = items.length;
  const addAnotherDisabled = itemsLength >= (schema.maxItems || Infinity);

  const containerClassNames = [
    'schemaform-field-container',
    hasTitleOrDescription ? 'schemaform-block' : '',
  ].join(' ');
  const addButtonClassNames = [
    'usa-button-secondary',
    'va-growable-add-btn',
    !formData || addAnotherDisabled ? 'usa-button-disabled' : '',
  ].join(' ');

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
          {DescriptionField && <DescriptionField options={uiOptions} />}
          {!textDescription && !DescriptionField && description}
        </div>
      )}
      <div className="va-growable">
        <Element name={`topOfTable_${idSchema.$id}`} />
        {items.map((item, index) => {
          // This is largely copied from the default ArrayField
          const itemSchema = getItemSchema(index);
          const itemIdPrefix = `${idSchema.$id}_${index}`;

          const itemIdSchema = toIdSchema(
            itemSchema || {},
            itemIdPrefix,
            definitions,
          );
          const isLast = itemsLength === index + 1;
          const isEditing = editing[index];
          const ariaLabel = uiOptions.itemAriaLabel;
          const itemName =
            (typeof ariaLabel === 'function' && ariaLabel(item || {})) ||
            uiOptions.itemName ||
            'Item';
          const notLastOrMultipleRows = !isLast || itemsLength > 1;

          if (isReviewMode || isEditing) {
            return (
              <div
                key={index}
                className={
                  notLastOrMultipleRows ? 'va-growable-background' : null
                }
              >
                <Element name={`table_${itemIdPrefix}`} />
                <div className="row small-collapse vads-u-margin--0">
                  <div className="small-12 columns va-growable-expanded">
                    {isLast && itemsLength > 1 ? (
                      <h3 className="vads-u-font-size--h5">
                        {`New ${uiOptions.itemName}`}
                      </h3>
                    ) : null}
                    <div className="input-section">
                      <SchemaField
                        key={index}
                        schema={itemSchema || {}}
                        uiSchema={uiSchema.items}
                        errorSchema={
                          errorSchema ? errorSchema[index] : undefined
                        }
                        idSchema={itemIdSchema}
                        formData={item}
                        onChange={value => onItemChange(index, value)}
                        onBlur={onBlur}
                        registry={registry}
                        required={false}
                        disabled={disabled}
                        readonly={readonly}
                      />
                    </div>
                    {notLastOrMultipleRows ? (
                      <div className="row small-collapse">
                        <div className="small-12 columns">
                          <va-button
                            class="float-right"
                            onClick={() => handleUpdate(index)}
                            label={`Save ${itemName}`}
                            text="Save"
                          />
                          {itemsLength > 1 ? (
                            <va-button
                              secondary
                              class="float-right vads-u-margin-right--1"
                              onClick={() => handleRemove(index)}
                              label={`Remove ${itemName}`}
                              text="Remove"
                            />
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div key={index} className="va-growable-background editable-row">
              <div className="small-collapse vads-u-display--flex vads-u-align-items--center">
                <div className="vads-u-flex--fill">
                  <ViewField formData={item} onEdit={() => handleEdit(index)} />
                </div>
                <va-button
                  secondary
                  class="edit vads-u-flex--auto"
                  onClick={() => handleEdit(index)}
                  label={`Edit ${itemName}`}
                  text="Edit"
                />
              </div>
            </div>
          );
        })}
        <button
          type="button"
          className={addButtonClassNames}
          disabled={!formData || addAnotherDisabled}
          onClick={handleAdd}
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

LocationField.propTypes = {
  formContext: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  errorSchema: PropTypes.object,
  formData: PropTypes.array,
  idSchema: PropTypes.object,
  readonly: PropTypes.bool,
  registry: PropTypes.shape({
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    ).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    definitions: PropTypes.object.isRequired,
  }),
  requiredSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  onBlur: PropTypes.func,
};

export default LocationField;
