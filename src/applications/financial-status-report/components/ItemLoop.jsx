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

const ScrollElement = Scroll.Element;
const scroller = Scroll.scroller;

const Header = ({
  title,
  hideTitle,
  idSchema,
  formContext,
  uiSchema,
  description,
  registry,
}) => {
  const { TitleField } = registry.fields;
  const textDescription = typeof description === 'string' ? description : null;
  const DescriptionField =
    typeof description === 'function' ? uiSchema['ui:description'] : null;

  return (
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
  );
};

const InputSection = ({
  title,
  isLast,
  items,
  schema,
  uiSchema,
  index,
  errorSchema,
  handleChange,
  item,
  onBlur,
  registry,
  disabled,
  readonly,
  handleUpdate,
  handleRemove,
  idSchema,
}) => {
  const showSave = uiSchema['ui:options'].showSave;
  const updateText = showSave && index === 0 ? 'Save' : 'Update';
  const notLastOrMultipleRows = showSave || !isLast || items.length > 1;
  const { SchemaField } = registry.fields;
  const itemIdPrefix = `${idSchema.$id}_${index}`;

  const getItemSchema = i => {
    if (schema.items.length > i) {
      return schema.items[i];
    }
    return schema.additionalItems;
  };

  const itemSchema = getItemSchema(index);
  const itemIdSchema = toIdSchema(
    itemSchema,
    itemIdPrefix,
    registry.definitions,
  );

  return (
    <div className={notLastOrMultipleRows ? 'va-growable-background' : null}>
      <ScrollElement name={`table_${itemIdPrefix}`} />
      <div className="row small-collapse">
        <div className="small-12 columns va-growable-expanded">
          {isLast && items.length > 1 && uiSchema['ui:options'].itemName ? (
            <h3 className="vads-u-font-size--h5">
              New {uiSchema['ui:options'].itemName}
            </h3>
          ) : null}
          <div className="input-section">
            <SchemaField
              schema={itemSchema}
              uiSchema={uiSchema.items}
              errorSchema={errorSchema ? errorSchema[index] : undefined}
              idSchema={itemIdSchema}
              formData={item}
              onBlur={onBlur}
              registry={registry}
              disabled={disabled}
              readonly={readonly}
              onChange={value => handleChange(index, value)}
              required={false}
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
  );
};

const AddAnotherButton = ({
  formData,
  addAnotherDisabled,
  uiOptions,
  handleAdd,
}) => (
  <>
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
  </>
);

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
  const uiOptions = uiSchema['ui:options'] || {};
  const title = uiSchema['ui:title'] || schema.title;
  const hideTitle = !!uiOptions.title;
  const isReviewMode = uiSchema['ui:options'].reviewMode;
  const description = uiSchema['ui:description'];
  const hasTitleOrDescription = (!!title && !hideTitle) || !!description;
  const ViewField = uiOptions.viewField;

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

  const scrollToTop = () => {
    if (!uiSchema['ui:options'].doNotScroll) {
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
    }
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

  const handleRemove = index => {
    const newItems = formData.filter((item, i) => index !== i);
    const filtered = editing.filter((item, i) => index !== i);
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
        <Header
          title={title}
          hideTitle={hideTitle}
          idSchema={idSchema}
          formContext={formContext}
          uiSchema={uiSchema}
          description={description}
          registry={registry}
        />
      )}
      <div className="va-growable">
        <ScrollElement name={`topOfTable_${idSchema.$id}`} />

        {items.map((item, index) => {
          const isEditing = editing[index];
          const isLast = items.length === index + 1;

          return (isReviewMode ? (
            isEditing
          ) : (
            isLast || isEditing
          )) ? (
            <InputSection
              key={index}
              item={item}
              index={index}
              title={title}
              isLast={isLast}
              items={items}
              schema={schema}
              uiSchema={uiSchema}
              idSchema={idSchema}
              onBlur={onBlur}
              registry={registry}
              disabled={disabled}
              readonly={readonly}
              errorSchema={errorSchema}
              handleChange={handleChange}
              handleUpdate={handleUpdate}
              handleRemove={handleRemove}
            />
          ) : (
            <ViewField
              key={index}
              formData={item}
              index={index}
              title={title}
              onEdit={e => handleEdit(e, index)}
            />
          );
        })}

        <AddAnotherButton
          formData={formData}
          addAnotherDisabled={addAnotherDisabled}
          uiOptions={uiOptions}
          handleAdd={handleAdd}
        />
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
