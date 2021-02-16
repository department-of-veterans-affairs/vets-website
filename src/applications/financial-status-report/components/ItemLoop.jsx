import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
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
  handleSave,
  handleRemove,
  handleCancel,
}) => {
  const showCancel = items.length > 1;
  const showRemove = items.length > 1 && editing && editing[index] !== 'add';
  const showSave = uiSchema['ui:options'].showSave;
  const updateText = showSave ? 'Save' : 'Update';
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
  const containerClassNames = classNames(
    'item-loop',
    {
      'vads-u-margin-top--2 vads-u-margin-bottom--2':
        uiSchema['ui:options'].viewType === undefined,
    },
    {
      'vads-u-border-bottom--1px vads-u-margin-top--0 vads-u-margin-bottom--0':
        uiSchema['ui:options'].viewType === 'table' && items?.length > 1,
    },
  );

  return (
    <div className={containerClassNames}>
      <ScrollElement name={`table_${itemIdPrefix}`} />
      <div className="row small-collapse">
        <div className="small-12 columns">
          {items?.length &&
            uiSchema['ui:options'].itemName && (
              <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0 vads-u-margin-top--2">
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
          <div className="row small-collapse">
            <div className="small-4 left columns button-group">
              <button
                className="float-left"
                onClick={e => handleSave(e, index)}
                aria-label={`${updateText} ${title}`}
              >
                {updateText}
              </button>
              {showCancel && <a onClick={() => handleCancel(index)}>Cancel</a>}
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
        </div>
      </div>
    </div>
  );
};

const AddAnotherButton = ({
  items,
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
          disabled={!items || addAnotherDisabled}
          onClick={handleAdd}
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

  const [cache, setCache] = useState(formData);
  const [editing, setEditing] = useState([]);
  const [showTable, setShowTable] = useState(false);

  useEffect(
    () => {
      // Throw an error if there’s no viewField (should be React component)
      if (typeof uiSchema['ui:options'].viewField !== 'function') {
        throw new Error(`No viewField found in uiSchema for ${idSchema.$id}.`);
      }
    },
    [idSchema.$id, uiSchema],
  );

  useEffect(() => {
    const editData = formData ? formData.map(() => false) : ['add'];
    setEditing(editData);
    setShowTable(editData.includes(false));

    if (!formData) {
      const initData = Array(schema.minItems).fill(
        getDefaultFormState(
          schema.additionalItems,
          undefined,
          registry.definitions,
        ),
      );
      onChange(initData);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // use formData otherwise use an array with a single default object
  const items = formData?.length
    ? formData
    : [getDefaultFormState(schema, undefined, registry.definitions)];
  const addAnotherDisabled = items.length >= (schema.maxItems || Infinity);

  const handleScroll = (id, offset) => {
    if (uiSchema['ui:options'].doNotScroll) return;
    setTimeout(() => {
      scroller.scrollTo(
        id,
        window.Forms?.scroll || {
          duration: 500,
          delay: 0,
          smooth: true,
          offset,
        },
      );
    }, 100);
  };

  const formatEditData = (index, edit) => {
    return editing.map((item, i) => (index === i ? edit : item));
  };

  const handleChange = (index, value) => {
    const newData = items.map((item, i) => (index === i ? value : item));
    onChange(newData);
  };

  const handleEdit = (e, index) => {
    const editData = formatEditData(index, true);

    if (editing.length === 1) {
      setShowTable(false);
    }

    setCache(items);
    setEditing(editData);
    handleScroll(`table_${idSchema.$id}_${index}`, 0);
  };

  const handleSave = (e, index) => {
    if (errorSchemaIsValid(errorSchema[index])) {
      const editData = formatEditData(index, false);
      setEditing(editData);
      setShowTable(true);
      handleScroll(`table_${idSchema.$id}_${index}`, 0);
    } else {
      // Set all the fields for this item as touched, so we show errors
      const touched = setArrayRecordTouched(idSchema.$id, index);
      formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  };

  const handleAdd = () => {
    const lastIndex = items?.length - 1;
    if (errorSchemaIsValid(errorSchema[lastIndex])) {
      const defaultData = getDefaultFormState(
        schema.additionalItems,
        undefined,
        registry.definitions,
      );
      const newFormData = [...items, defaultData];
      setCache(items);
      setEditing([...editing, 'add']);
      onChange(newFormData);
      handleScroll(`table_${idSchema.$id}_${lastIndex + 1}`, 0);
    } else {
      const touched = setArrayRecordTouched(idSchema.$id, lastIndex);
      formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  };

  const handleCancel = index => {
    const lastIndex = items.length - 1;
    const isAdding = editing.includes('add');

    if (isAdding && lastIndex === index) {
      const editData = editing.filter(item => item !== 'add');
      const filtered = items.filter(item => {
        return Object.values(item).includes(undefined) ? null : item;
      });
      setEditing(editData);
      onChange(filtered);
    } else {
      const editData = formatEditData(index, false);
      setEditing(editData);
      onChange(cache);
    }
  };

  const handleRemove = index => {
    const newItems = items.filter((item, i) => index !== i);
    const filtered = editing.filter((item, i) => index !== i);
    setEditing(filtered);
    onChange(newItems);
    handleScroll(`topOfTable_${idSchema.$id}`, -60);
  };

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
                        handleSave={handleSave}
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
                editing={editing}
                handleChange={handleChange}
                handleSave={handleSave}
                handleRemove={handleRemove}
                handleCancel={handleCancel}
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
          items={items}
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
