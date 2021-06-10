import React from 'react';
import Scroll from 'react-scroll';

import { toIdSchema } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import { isEmptyObject, getItemSchema } from '../utils/helpers';

import { SELECTED } from '../constants';
import { IssueCard } from './IssueCard';
import {
  missingIssuesErrorMessage,
  noneSelected,
} from '../content/additionalIssues';

const Element = Scroll.Element;

export const getContent = ({
  handlers,
  registry,
  items,
  schema,
  uiSchema,
  errorSchema,
  singleIssue,
  id,
  formData,
  editing,
  isReviewMode,
  showCheckbox,
}) => {
  const { SchemaField } = registry.fields;
  const uiOptions = uiSchema['ui:options'] || {};

  return items.map((item, index) => {
    const itemSchema = getItemSchema(schema, index);
    const itemIdPrefix = `${id}_${index}`;
    const itemIdSchema = toIdSchema(itemSchema, itemIdPrefix, {});
    const isEditing = editing[index];
    const itemName = item?.issue || 'issue';

    // Don't show unselected items on the review & submit page in review
    // mode
    if (isReviewMode && (!item[SELECTED] || isEmptyObject(item))) {
      return null;
    }

    const first = singleIssue && index === 0;
    const className = [
      'review-row',
      'additional-issue',
      'editing',
      first ? '' : 'vads-u-background-color--gray-lightest',
      first ? 'vads-u-border-top--0' : '',
      first ? 'vads-u-padding--0' : 'vads-u-padding--3',
      first ? 'vads-u-margin--0' : 'vads-u-margin-bottom--2',
    ].join(' ');

    // show edit card, but not in review mode
    return !isReviewMode && isEditing ? (
      <div key={index} className={className}>
        <dt className="widget-checkbox-wrap" />
        <dd data-index={index}>
          <Element name={`table_${itemIdPrefix}`} />
          <fieldset className="vads-u-text-align--left">
            <legend className="schemaform-block-header vads-u-margin-top--0 vads-u-padding-y--0">
              {first ? (
                <span className="vads-u-font-size--base vads-u-font-weight--normal">
                  Please add a new issue for review:
                </span>
              ) : (
                <div className="vads-u-font-size--md vads-u-font-family--serif">
                  {`${isEditing === 1 ? 'Add' : 'Update'} issue`}
                </div>
              )}
            </legend>
            <div className="input-section vads-u-margin-bottom--0 vads-u-font-weight--normal">
              <SchemaField
                key={index}
                schema={itemSchema}
                uiSchema={uiSchema.items}
                errorSchema={errorSchema ? errorSchema[index] : undefined}
                idSchema={itemIdSchema}
                formData={item}
                onChange={value => handlers.onItemChange(index, value)}
                onBlur={handlers.blur}
                registry={registry}
                required
              />
            </div>
            <div className="vads-u-margin-top--2 vads-u-display--flex vads-u-justify-content--space-between">
              <button
                type="button"
                className="vads-u-margin-right--2 update"
                aria-label={`Save ${itemName}`}
                onClick={() => handlers.update(index)}
              >
                Save
              </button>
              {formData.length > 1 && (
                <button
                  type="button"
                  className="usa-button-secondary float-right remove"
                  aria-label={`Remove ${itemName}`}
                  onClick={() => handlers.remove(index)}
                >
                  Remove
                </button>
              )}
            </div>
          </fieldset>
        </dd>
      </div>
    ) : (
      <IssueCard
        key={index}
        id={id}
        index={index}
        item={item}
        options={uiOptions}
        onChange={handlers.toggleSelection}
        showCheckbox={showCheckbox}
        onEdit={() => handlers.edit(index)}
      />
    );
  });
};

export const renderPage = ({
  id,
  isReviewMode,
  isEditing,
  hasSelected,
  showError,
  showContent,
  showCheckbox,
  atMax,
  content,
  handlers,
}) => {
  const addButton = !atMax &&
    showCheckbox && (
      <button
        type="button"
        className="usa-button-secondary va-growable-add-btn vads-u-width--auto"
        onClick={handlers.add}
      >
        Add another issue
      </button>
    );

  return isReviewMode ? (
    <>
      {!showError && !hasSelected && noneSelected}
      {showError && missingIssuesErrorMessage}
      {content}
    </>
  ) : (
    <div
      className={`schemaform-field-container additional-issues-wrap ${
        showError ? 'usa-input-error vads-u-margin-top--0' : ''
      }`}
    >
      <Element name={`topOfTable_${id}`} />
      {showError && missingIssuesErrorMessage}
      {showContent && <dl className="va-growable review">{content}</dl>}
      {isEditing ? null : addButton}
      {atMax && <p>You’ve entered the maximum number of items allowed.</p>}
    </div>
  );
};
