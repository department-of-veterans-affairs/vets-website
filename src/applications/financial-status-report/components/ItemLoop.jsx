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
                  {uiSchema['ui:options'].itemName}
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
                <div className="small-6 left columns">
                  {showSave && (
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
          {uiOptions.itemName ? uiOptions.itemName : 'Add another'}
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

  const [editing, setEditing] = useState([true]);
  const [showTable, setShowTable] = useState(false);

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
      return false;
    });
    setEditing(editData);
    scrollToRow(`${idSchema.$id}_${index}`);
  };

  const handleUpdate = (e, index) => {
    e.preventDefault();
    setShowTable(true);
    if (errorSchemaIsValid(errorSchema[index])) {
      const editData = editing.map(() => false);
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
      const editData = editing.map(() => false);

      setShowTable(true);
      setEditing([...editData, true]);

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

  const containerClassNames = classNames({
    'item-loop-container': true,
    'schemaform-block': hasTitleOrDescription,
  });

  const addAnotherDisabled = items.length >= (schema.maxItems || Infinity);

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
                  <th className="vads-u-border--0" />
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
                        handleChange={handleChange}
                        handleUpdate={handleUpdate}
                        handleRemove={handleRemove}
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
