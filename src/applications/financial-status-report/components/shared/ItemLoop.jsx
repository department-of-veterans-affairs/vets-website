import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Scroll from 'react-scroll';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';
import { isReactComponent } from 'platform/utilities/ui';
import {
  toIdSchema,
  getDefaultFormState,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import { allEqual } from '../../utils/helpers';

const ScrollElement = Scroll.Element;
const { scroller } = Scroll;

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
  const DescriptionField = isReactComponent(description)
    ? uiSchema['ui:description']
    : null;

  const uniqueId = Math.random()
    .toString(36)
    .substring(7);

  return (
    <div className="schemaform-block-header item-loop-header">
      {title &&
        !hideTitle && (
          <TitleField
            id={`${idSchema.$id}_${uniqueId}__title`}
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

Header.propTypes = {
  description: PropTypes.string,
  formContext: PropTypes.object,
  hideTitle: PropTypes.bool,
  idSchema: PropTypes.object,
  registry: PropTypes.object,
  title: PropTypes.string,
  uiSchema: PropTypes.object,
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
  idSchema,
  editing,
  handleChange,
  handleSave,
  handleRemove,
  handleCancel,
}) => {
  const showCancel = items.length > 1;
  const showRemove = items.length > 1 && editing && editing[index] !== 'add';
  const { SchemaField } = registry.fields;
  const itemIdPrefix = `${idSchema.$id}_${index}`;
  const titlePrefix = editing && editing[index] === true ? 'Edit' : 'Add';
  const buttonText = 'Save';

  const getItemSchema = i => {
    return schema.items.length > i ? schema.items[i] : schema.additionalItems;
  };

  const itemSchema = getItemSchema(index);
  const itemIdSchema = toIdSchema(
    itemSchema,
    itemIdPrefix,
    registry.definitions,
  );

  const containerClassNames = classNames(
    'item-loop',
    {
      'vads-u-margin-top--2 vads-u-margin-bottom--2':
        uiSchema['ui:options'].viewType === undefined,
    },
    {
      'vads-u-margin-top--0 vads-u-margin-bottom--0':
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
              <h3 className="vads-u-font-size--h5 vads-u-margin-top--2">
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
            onChange={value => handleChange(index, value)}
          />
          <div className="row small-collapse">
            <div className="left columns button-group">
              <button
                aria-label={`${buttonText} ${title}`}
                className="float-left"
                onClick={() => handleSave(index, itemSchema)}
                type="button"
              >
                {buttonText}
              </button>
              {showCancel && (
                <button
                  aria-label={`Cancel ${title}`}
                  className="usa-button-secondary vads-u-margin-left--2"
                  onClick={() => handleCancel(index)}
                  type="button"
                >
                  Cancel
                </button>
              )}
              {showRemove && (
                <button
                  aria-label={`Remove ${title}`}
                  className="usa-button-secondary vads-u-margin-left--9"
                  onClick={() => handleRemove(index)}
                  type="button"
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

InputSection.propTypes = {
  editing: PropTypes.array,
  errorSchema: PropTypes.object,
  handleCancel: PropTypes.func,
  handleChange: PropTypes.func,
  handleRemove: PropTypes.func,
  handleSave: PropTypes.func,
  idSchema: PropTypes.object,
  index: PropTypes.number,
  item: PropTypes.object,
  items: PropTypes.array,
  registry: PropTypes.object,
  schema: PropTypes.object,
  title: PropTypes.string,
  uiSchema: PropTypes.object,
  onBlur: PropTypes.func,
};

const AddAnotherButton = ({ uiOptions, handleAdd, collapsed }) => {
  const linkClassNames = classNames(
    'add-item-button usa-button-secondary vads-u-width--auto vads-u-margin--0',
    {
      disabled: !collapsed,
    },
  );

  return (
    <div>
      <div className="add-item-container" name="table_root_">
        <div className="add-item-button-section">
          <button className={linkClassNames} onClick={handleAdd} type="button">
            <i
              role="presentation"
              aria-hidden="true"
              className="fas fa-plus plus-icon"
            />
            {uiOptions.itemName ? `Add ${uiOptions.itemName}` : 'Add another'}
          </button>
        </div>
      </div>
    </div>
  );
};

AddAnotherButton.propTypes = {
  collapsed: PropTypes.bool,
  handleAdd: PropTypes.func,
  uiOptions: PropTypes.object,
};

const ItemLoop = ({
  uiSchema,
  idSchema,
  schema,
  onChange,
  registry,
  formData,
  errorSchema,
  formContext,
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
  // use formData otherwise use an array with a single default object
  const items = formData?.length
    ? formData
    : [getDefaultFormState(schema, undefined, registry.definitions)];

  const [cache, setCache] = useState(formData);
  const [editing, setEditing] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const isCollapsed = allEqual(editing) && editing.includes(false);

  // Throw an error if there’s no viewField (should be React component)
  if (!isReactComponent(uiSchema['ui:options'].viewField)) {
    throw new Error(`No viewField found in uiSchema for ${idSchema.$id}.`);
  }

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

  const handleChange = (index, value) => {
    const newData = items.map((item, i) => (index === i ? value : item));
    onChange(newData);
  };

  const handleEdit = index => {
    if (!isCollapsed) return;
    const editData = editing.map((item, i) => index === i);
    if (editing.length === 1) {
      setShowTable(false);
    }
    setCache(items);
    setEditing(editData);
    handleScroll(`table_${idSchema.$id}_${index}`, 0);
  };

  const handleSave = (index, itemSchema) => {
    const isRequired = itemSchema.required?.length;
    const isUndefined = Object.values(items[index]).includes(undefined);
    const disableSave = !isRequired && isUndefined;

    if (disableSave || !errorSchemaIsValid(errorSchema[index])) {
      formContext.onError();
    } else {
      const editData = editing.map(() => false);
      setEditing(editData);
      setShowTable(true);
      handleScroll(`table_${idSchema.$id}_${index}`, 0);
    }
  };

  const handleAdd = () => {
    const lastIndex = items?.length - 1;
    const defaultData = getDefaultFormState(
      schema.additionalItems,
      undefined,
      registry.definitions,
    );
    const newFormData = [...items, defaultData];
    setCache(items);
    onChange(newFormData);
    setEditing(prevState => [...prevState, 'add']);
    handleScroll(`table_${idSchema.$id}_${lastIndex + 1}`, 0);
    formContext.onError(false);

    setTimeout(() => {
      const associatedInputField = document.getElementById(
        `${idSchema.$id}_${lastIndex + 1}_name`,
      );

      if (associatedInputField) associatedInputField.focus();
    }, 1);
  };

  const handleCancel = index => {
    const lastIndex = items.length - 1;
    const isAdding = editing.includes('add');
    if (isAdding && index === lastIndex) {
      const editData = editing.filter(item => item !== 'add');
      setEditing(editData);
    } else {
      const editData = editing.map(() => false);
      setEditing(editData);
    }
    onChange(cache);
  };

  const handleRemove = index => {
    const newItems = items.filter((item, i) => index !== i);
    const filtered = editing.filter((item, i) => index !== i);
    setEditing(filtered);
    onChange(newItems);
    handleScroll(`topOfTable_${idSchema.$id}`, -60);
  };

  useEffect(
    () => {
      const editData = formData
        ? formData.map(item => Object.values(item).includes(undefined))
        : ['add'];
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
    },
    // watch for changes to the page index when arrayPath is used
    [formContext?.pagePerItemIndex], // eslint-disable-line react-hooks/exhaustive-deps
  );

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
          <va-table className="vads-u-margin-top--3 vads-u-margin-bottom--0">
            {showTable && (
              <va-table-row slot="headers">
                {tableHeaders.map((item, i) => (
                  <span
                    key={i}
                    className="vads-u-border--0 vads-u-border-bottom--1px"
                  >
                    {item}
                  </span>
                ))}
                <span className="vads-u-border--0 vads-u-border-bottom--1px">
                  {' '}
                </span>
              </va-table-row>
            )}

            {items.map((item, index) => {
              const isEditing = editing[index];

              return isReviewMode || isEditing ? (
                <va-table-row key={index}>
                  <span className="vads-u-padding--0 vads-u-border--0">
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
                      errorSchema={errorSchema}
                      editing={editing}
                      handleChange={handleChange}
                      handleSave={handleSave}
                      handleRemove={handleRemove}
                      handleCancel={handleCancel}
                    />
                  </span>
                </va-table-row>
              ) : (
                <va-table-row
                  key={index}
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <ViewField
                    key={index}
                    formData={item}
                    index={index}
                    title={title}
                    onEdit={() => handleEdit(index)}
                  />
                </va-table-row>
              );
            })}
          </va-table>
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
                onEdit={() => handleEdit(index)}
              />
            );
          })
        )}
        <AddAnotherButton
          uiOptions={uiOptions}
          collapsed={isCollapsed}
          handleAdd={handleAdd}
        />
      </div>
    </div>
  );
};

export default ItemLoop;

ItemLoop.propTypes = {
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  errorSchema: PropTypes.object,
  formContext: PropTypes.object,
  formData: PropTypes.array,
  idSchema: PropTypes.object,
  registry: PropTypes.shape({
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    ).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    definitions: PropTypes.object.isRequired,
    formContext: PropTypes.object.isRequired,
  }),
  requiredSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  onBlur: PropTypes.func,
};
