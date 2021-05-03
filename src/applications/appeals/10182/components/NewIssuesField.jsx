import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';

import {
  toIdSchema,
  getDefaultFormState,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import { setArrayRecordTouched } from 'platform/forms-system/src/js/helpers';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';
import { scrollToFirstError } from 'platform/utilities/ui';

import { scrollAndFocus } from '../utils/ui';
import { isEmptyObject } from '../utils/helpers';
import { SELECTED, MAX_NEW_CONDITIONS } from '../constants';
import { IssueCard } from './IssueCard';

const Element = Scroll.Element;

/* Non-review growable table (array) field */
const NewIssuesField = props => {
  const {
    schema,
    uiSchema,
    errorSchema,
    idSchema,
    formData = [],
    registry,
    formContext,
    onBlur,
  } = props;

  const uiOptions = uiSchema['ui:options'] || {};

  const initialEditingState =
    uiOptions.setInitialEditMode?.(formData) || formData.map(() => false);
  const [editing, setEditing] = useState(initialEditingState);

  const toggleSelection = (indexToChange, checked) => {
    const newItems = formData.map((item, index) => ({
      ...item,
      [SELECTED]: index === indexToChange ? checked : item[SELECTED],
    }));
    props.onChange(newItems);
  };

  const onItemChange = (indexToChange, value) => {
    const newItems = formData.map(
      (item, index) => (index === indexToChange ? value : item),
    );
    props.onChange(newItems);
  };

  const getItemSchema = index => {
    const itemSchema = schema;
    if (itemSchema.items.length > index) {
      return itemSchema.items[index];
    }
    return itemSchema.additionalItems;
  };

  /*
   * Clicking edit on an item that’s not last and so is in view mode
   */
  const handleEdit = (index, status = true) => {
    setEditing(editing.map((mode, indx) => (indx === index ? status : mode)));
    scrollAndFocus({
      selector: `.additional-issues dd[data-index="${index}"] legend`,
      timer: 50,
    });
  };

  /*
   * Clicking Update on an item that’s not last and is in edit mode
   */
  const handleUpdate = index => {
    if (errorSchemaIsValid(errorSchema[index])) {
      // check the updated issue
      toggleSelection(index, true);
      setEditing(editing.map((mode, indx) => (indx === index ? false : mode)));
      scrollAndFocus({
        selector: `.additional-issues dd[data-index="${index}"] .edit`,
        timer: 50,
      });
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
      setEditing(editing.concat([true]));

      const newFormData = formData.concat(
        getDefaultFormState(
          schema.additionalItems,
          undefined,
          registry.definitions,
        ) || {},
      );
      props.onChange(newFormData);
      scrollAndFocus({
        selector: `.additional-issues dd[data-index="${lastIndex + 1}"] legend`,
        timer: 50,
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
    const newItems = formData.filter((_, index) => index !== indexToRemove);
    setEditing(editing.filter((_, index) => index !== indexToRemove));
    props.onChange(newItems);
    scrollAndFocus({
      selector: '.additional-issues .va-growable-add-btn',
      timer: 50,
    });
  };

  const definitions = registry.definitions;
  const { SchemaField } = registry.fields;

  const onReviewPage = formContext.onReviewPage;
  // review mode = only show selected cards on the review & submit page
  const isReviewMode = formContext.reviewMode;
  const showCheckbox = !onReviewPage || (onReviewPage && !isReviewMode);

  // if we have form data, use that, otherwise use an array with a single default object
  const items = formData.length
    ? formData
    : [getDefaultFormState(schema, undefined, registry.definitions)];

  const atMax = items.length > MAX_NEW_CONDITIONS;

  const addButton = !atMax &&
    showCheckbox && (
      <button
        type="button"
        className="usa-button-secondary va-growable-add-btn vads-u-width--auto"
        onClick={handleAdd}
      >
        Add issue
      </button>
    );

  const content = items.map((item, index) => {
    const itemSchema = getItemSchema(index);
    const itemIdPrefix = `${idSchema.$id}_${index}`;
    const itemIdSchema = toIdSchema(itemSchema, itemIdPrefix, definitions);
    const updateText = index === 0 ? 'Save' : 'Update';
    const isEditing = editing[index];
    const itemName = item.issue || 'issue';

    // Don't show unselected items on the review & submit page in review
    // mode
    if (isReviewMode && (!item[SELECTED] || isEmptyObject(item))) {
      return null;
    }

    // show edit card, but not in review mode
    if (!isReviewMode && isEditing) {
      return (
        <div
          key={index}
          className="review-row vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2"
        >
          <dt className="widget-checkbox-wrap" />
          <dd data-index={index}>
            <Element name={`table_${itemIdPrefix}`} />
            <fieldset className="additional-issues vads-u-text-align--left">
              <legend className="schemaform-block-header vads-u-font-size--base vads-u-font-weight--normal">
                <h3 className="vads-u-margin-top--0">Add issue</h3>
                {uiSchema['ui:description']}
              </legend>
              <div className="input-section vads-u-margin-bottom--0 vads-u-font-weight--normal">
                <SchemaField
                  key={index}
                  schema={itemSchema}
                  uiSchema={uiSchema.items}
                  errorSchema={errorSchema ? errorSchema[index] : undefined}
                  idSchema={itemIdSchema}
                  formData={item}
                  onChange={value => onItemChange(index, value)}
                  onBlur={onBlur}
                  registry={registry}
                  required
                />
              </div>
              <div className="vads-u-margin-top--2 vads-u-display--flex vads-u-justify-content--space-between">
                <button
                  type="button"
                  className="vads-u-margin-right--2 update"
                  aria-label={`${updateText} ${itemName}`}
                  onClick={() => handleUpdate(index)}
                >
                  {updateText}
                </button>
                <button
                  type="button"
                  className="usa-button-secondary float-right remove"
                  aria-label={`Remove ${itemName}`}
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </button>
              </div>
            </fieldset>
          </dd>
        </div>
      );
    }
    return (
      <IssueCard
        key={index}
        id={idSchema.$id}
        index={index}
        item={item}
        options={uiOptions}
        onChange={toggleSelection}
        showCheckbox={showCheckbox}
        onEdit={() => handleEdit(index)}
      />
    );
  });

  return isReviewMode ? (
    content
  ) : (
    <div className="schemaform-field-container additional-issues-wrap">
      <Element name={`topOfTable_${idSchema.$id}`} />
      {formData.length > 0 && <dl className="va-growable review">{content}</dl>}
      {addButton}
      <p>{atMax && `You’ve entered the maximum number of items allowed.`}</p>
    </div>
  );
};

NewIssuesField.propTypes = {
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

export default NewIssuesField;
