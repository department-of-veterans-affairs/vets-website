import React from 'react';
import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
import { getNestedUISchema } from '../helpers';
import {
  getUiOptions,
  getWidget,
  optionsList,
  getDefaultRegistry,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

/*
 * This is a minimal string field implementation for the
 * review page, so we can pass custom review widgets
 * in the config
 */
export default function StringField(props) {
  const {
    registry = getDefaultRegistry(),
    schema,
    uiSchema,
    formData,
    children,
    formContext,
    id,
  } = props;
  const realUiSchema = getNestedUISchema(uiSchema);
  const uiOptions = getUiOptions(realUiSchema);
  const labels = uiOptions.labels || {};
  const enumOptions = Array.isArray(schema.enum) && optionsList(schema);
  const isRoot = id === 'root';
  let Widget = realUiSchema['ui:reviewWidget'];

  if (!Widget) {
    if (schema.type !== 'object' && schema.type !== 'array') {
      const defaultWidget = schema.format || (enumOptions ? 'select' : 'text');
      Widget = getWidget(schema, defaultWidget, registry.widgets);
    } else {
      return children;
    }
  }

  if (isRoot && (schema.type === 'object' || schema.type === 'array')) {
    const { pageTitle, hideTitle, hideHeaderRow, onEdit } = formContext;

    const editLabel =
      uiOptions.ariaLabelForEditButtonOnReview || typeof pageTitle === 'string'
        ? `Edit ${pageTitle}`
        : null;

    return (
      <>
        {!hideHeaderRow && (
          <div className="form-review-panel-page-header-row vads-u-margin-bottom--3">
            {pageTitle?.trim() &&
              !hideTitle && (
                <h3 className="form-review-panel-page-header vads-u-font-size--h5">
                  {typeof pageTitle === 'function'
                    ? pageTitle(formData, formContext)
                    : pageTitle}
                </h3>
              )}
            <button
              type="button"
              className="edit-btn primary-outline"
              aria-label={editLabel}
              onClick={() => onEdit()}
            >
              Edit
            </button>
          </div>
        )}
        <Widget
          options={Object.assign(uiOptions, { enumOptions, labels })}
          value={formData}
          {...props}
        />
      </>
    );
  }

  return (
    <Widget
      options={_.assign(uiOptions, { enumOptions, labels })}
      value={formData}
      {...props}
    />
  );
}
