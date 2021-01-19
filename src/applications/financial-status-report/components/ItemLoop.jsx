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
    <div className="schemaform-block-header item-loop-header">
      {title &&
        !hideTitle && (
          <TitleField
            id={`${idSchema.$id}__title`}
            title={title}
            formContext={formContext}
          />
        )}
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
  items,
  schema,
  uiSchema,
  index,
  errorSchema,
  item,
  onBlur,
  registry,
  disabled,
  readonly,
  idSchema,
  editing,
  handleChange,
  handleUpdate,
  handleRemove,
  handleCancel,
}) => {
  const showCancel = items.length > 1;
  const showRemove = items.length > 1 && editing && editing[index] !== 'add';
  const showSave = uiSchema['ui:options'].showSave;
  const updateText = showSave ? 'Save' : 'Update';
  const notLastOrMultipleRows = showSave || items.length > 1;
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

  const titlePrefix = editing && editing[index] === true ? 'Edit' : 'Add';
  const containerClassNames = classNames('item-loop', {
    'vads-u-border-bottom--1px':
      uiSchema['ui:options'].viewType === 'table' && items?.length > 1,
  });

  return (
    notLastOrMultipleRows && (
      <div className={containerClassNames}>
        <ScrollElement name={`table_${itemIdPrefix}`} />
        <div className="row small-collapse">
          <div className="small-12 columns">
            {items?.length &&
              uiSchema['ui:options'].itemName && (
                <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--2">
                  {titlePrefix} {uiSchema['ui:options'].itemName}
                </h3>
              )}
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

            {notLastOrMultipleRows && (
              <div className="row small-collapse">
                <div className="small-4 left columns button-group">
                  {showSave && (
                    <button
                      className="float-left"
                      onClick={e => handleUpdate(e, index)}
                      aria-label={`${updateText} ${title}`}
                    >
                      {updateText}
                    </button>
                  )}

                  {showCancel && <a onClick={handleCancel}>Cancel</a>}
                </div>
                <div className="small-8 right columns">
                  {showRemove && (
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
    )
  );
};

const AddAnotherButton = ({
  formData,
  addAnotherDisabled,
  uiOptions,
  handleAdd,
}) => (
  <>
    <div className="add-item-container">
      <div className="add-item-link-section">
        <i className="fas fa-plus plus-icon" />
        <a
          className="add-item-link"
          disabled={!formData || addAnotherDisabled}
          onClick={() => handleAdd()}
        >
          {uiOptions.itemName ? `Add ${uiOptions.itemName}` : 'Add another'}
        </a>
      </div>
    </div>
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
  const tableHeaders = Object.values(uiSchema?.items)
    .filter(item => item['ui:title'] !== undefined)
    .map(item => item['ui:title']);

  const [editing, setEditing] = useState(['add']);
  const [showTable, setShowTable] = useState(false);
  const [oldData, setOldData] = useState(formData);

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
        : ['add'];
      if (formData?.length !== editing.length) {
        setEditing(isEditing);
      }
      if (formData?.length > 1) {
        setShowTable(true);
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
      if (item !== 'add') {
        return false;
      }
      return item;
    });

    if (editing.length === 1) {
      setShowTable(false);
    }
    setOldData(formData);
    setEditing(editData);
    scrollToRow(`${idSchema.$id}_${index}`);
  };

  const formatEditData = editArr => {
    // if adding and editing set all editing vals to false except for the add row
    const conditions = [true, 'add'];
    const isEditAndAdd = conditions.every(item => editArr.includes(item));

    if (isEditAndAdd) {
      return editArr.map(item => (item === 'add' ? item : false));
    }
    return editArr.map(() => false);
  };

  const handleUpdate = (e, i) => {
    e.preventDefault();
    if (!formData) return;

    const { viewType } = uiOptions;
    if (viewType === 'table') {
      setShowTable(true);
    }

    if (errorSchemaIsValid(errorSchema[i])) {
      const editData = formatEditData(editing);
      setEditing(editData);
      scrollToRow(`${idSchema.$id}_${i}`);
    } else {
      // Set all the fields for this item as touched, so we show errors
      const touched = setArrayRecordTouched(idSchema.$id, i);
      formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  };

  const handleAdd = () => {
    if (!formData) return;
    const lastIndex = formData.length - 1;
    if (errorSchemaIsValid(errorSchema[lastIndex])) {
      const editData = editing.map(() => false);

      setOldData(formData);
      setShowTable(true);
      setEditing([...editData, 'add']);

      const newFormData = formData.concat(
        getDefaultFormState(
          schema.additionalItems,
          undefined,
          registry.definitions,
        ),
      );
      onChange(newFormData);
      scrollToRow(`${idSchema.$id}_${lastIndex + 1}`);
    } else {
      const touched = setArrayRecordTouched(idSchema.$id, lastIndex);
      formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  };

  const handleCancel = () => {
    const editData = formatEditData(editing);
    setEditing(editData);
    onChange(oldData);
  };

  const handleRemove = index => {
    const newItems = formData.filter((item, i) => index !== i);
    const filtered = editing.filter((item, i) => index !== i);
    setEditing(filtered);
    onChange(newItems);
    scrollToTop();
  };

  // use form data otherwise use an array with a single default object
  const items = formData?.length
    ? formData
    : [getDefaultFormState(schema, undefined, registry.definitions)];

  const addAnotherDisabled = items.length >= (schema.maxItems || Infinity);

  const containerClassNames = classNames({
    'item-loop-container': true,
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

        {uiOptions.viewType === 'table' ? (
          <table className="vads-u-font-family--sans vads-u-margin-top--3 vads-u-margin-bottom--0">
            {showTable && (
              <thead className="vads-u-border-bottom--1px">
                <tr>
                  {tableHeaders.map((item, i) => (
                    <th key={i} className="vads-u-border--0">
                      {item}
                    </th>
                  ))}
                  <th className="vads-u-border--0" width="50" />
                </tr>
              </thead>
            )}
            <tbody>
              {items.map((item, index) => {
                const isEditing = editing[index];

                return isReviewMode || isEditing ? (
                  <tr key={index}>
                    <td
                      className="vads-u-border--0 vads-u-padding--0"
                      colSpan="3"
                    >
                      <InputSection
                        key={index}
                        item={item}
                        index={index}
                        title={title}
                        items={items}
                        schema={schema}
                        uiSchema={uiSchema}
                        idSchema={idSchema}
                        onBlur={onBlur}
                        registry={registry}
                        disabled={disabled}
                        readonly={readonly}
                        errorSchema={errorSchema}
                        editing={editing}
                        handleChange={handleChange}
                        handleUpdate={handleUpdate}
                        handleRemove={handleRemove}
                        handleCancel={handleCancel}
                      />
                    </td>
                  </tr>
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
            </tbody>
          </table>
        ) : (
          items.map((item, index) => {
            const isEditing = editing[index];

            return isReviewMode || isEditing ? (
              <InputSection
                key={index}
                item={item}
                index={index}
                title={title}
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
          })
        )}

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
