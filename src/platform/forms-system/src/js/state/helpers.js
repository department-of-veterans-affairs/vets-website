import React from 'react';
import { dropRight, merge } from 'lodash';
import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import environment from 'platform/utilities/environment';
import dataGet from '../../../../utilities/data/get';
import set from '../../../../utilities/data/set';
import unset from '../../../../utilities/data/unset';

import { checkValidSchema, createFormPageList, isActivePage } from '../helpers';
import { getActiveFormPageContext } from './activeFormPageContext';

function isHiddenField(schema = {}) {
  return !!schema['ui:collapsed'] || !!schema['ui:hidden'];
}

function get(path, data) {
  return path.reduce(
    (current, next) =>
      typeof current === 'undefined' ? current : current[next],
    data,
  );
}

/*
 * This function goes through a schema/uiSchema and updates the required array
 * based on any ui:required field properties in the uiSchema.
 *
 * If no required fields are changing, it makes sure to not mutate the existing schema,
 * so we can still take advantage of any shouldComponentUpdate optimizations
 */
export function updateRequiredFields(
  schema,
  uiSchema,
  formData,
  index = null,
  fullData,
  path = [],
) {
  if (!uiSchema) {
    return schema;
  }

  if (schema.type === 'object') {
    const newRequired = Object.keys(schema.properties).reduce(
      (requiredArray, nextProp) => {
        const field = uiSchema[nextProp];
        if (field && field['ui:required']) {
          const isRequired = field['ui:required'](
            formData,
            index,
            fullData,
            path.concat(nextProp),
          );
          const arrayHasField = requiredArray.some(prop => prop === nextProp);

          if (arrayHasField && !isRequired) {
            return requiredArray.filter(prop => prop !== nextProp);
          }
          if (!arrayHasField && isRequired) {
            return requiredArray.concat(nextProp);
          }

          return requiredArray;
        }

        return requiredArray;
      },
      schema.required || [],
    );

    const newSchema = Object.keys(schema.properties).reduce(
      (currentSchema, nextProp) => {
        if (uiSchema) {
          const nextSchema = updateRequiredFields(
            currentSchema.properties[nextProp],
            uiSchema[nextProp],
            formData,
            index,
            fullData,
            path.concat(nextProp),
          );
          if (nextSchema !== currentSchema.properties[nextProp]) {
            return set(['properties', nextProp], nextSchema, currentSchema);
          }
        }

        return currentSchema;
      },
      schema,
    );

    if (
      newSchema.required !== newRequired &&
      (newSchema.required || newRequired.length > 0)
    ) {
      return set('required', newRequired, newSchema);
    }

    return newSchema;
  }

  if (schema.type === 'array') {
    // each item has its own schema, so we need to update the required fields on those schemas
    // and then check for differences
    const newItemSchemas = schema.items.map((item, idx) =>
      updateRequiredFields(
        item,
        uiSchema.items,
        formData,
        idx,
        fullData,
        path.concat(idx),
      ),
    );
    if (newItemSchemas.some((newItem, idx) => newItem !== schema.items[idx])) {
      return set('items', newItemSchemas, schema);
    }
  }

  return schema;
}

export function isContentExpanded(data, matcher, formData, index, fullData) {
  if (typeof matcher === 'undefined') {
    return !!data;
  }
  if (typeof matcher === 'function') {
    return matcher(data, formData, index, fullData);
  }

  return data === matcher;
}

/**
 * Gets preserveHiddenData value for the page (multiple levels deep).
 * At least three levels are needed to work with arrays:
 * uiSchema (0) > arrayValue > items > formEl > ui:options > preserveHiddenData
 * @param {UISchemaOptions} uiSchema
 * @returns {Boolean} Flag to preserve hidden data is set to true anywhere
 * within the page uiSchema ui:options
 */
export function getPreserveHiddenData(uiSchema, index = 0) {
  // Stop recursion after 3 levels deep
  return index > 3
    ? false
    : get(['ui:options', 'preserveHiddenData'], uiSchema || {}) ||
        Object.keys(uiSchema || {}).reduce(
          (result, key) =>
            result || getPreserveHiddenData(uiSchema[key], index + 1) || false,
          false,
        );
}

/*
 * This steps through a schema and sets any fields to hidden, based on a
 * hideIf function from uiSchema and the current page data. Sets 'ui:hidden'
 * which is a non-standard JSON Schema property
 *
 * The path parameter will contain the path, relative to formData, to the
 * form data corresponding to the current schema object; and should include the
 * page index, if within an array
 */
export function setHiddenFields(
  schema,
  uiSchema,
  formData,
  path = [],
  fullData,
  index,
) {
  if (!uiSchema) {
    return schema;
  }

  // expandUnder fields are relative to the parent object of the current
  // field, so get that object using path here
  const containingObject = get(path.slice(0, -1), formData) || formData;

  let updatedSchema = schema;
  const hideIf = get(['ui:options', 'hideIf'], uiSchema);
  if (index == null) {
    // eslint-disable-next-line no-param-reassign
    index = path.reduce(
      (current, next) => (typeof next === 'number' ? next : current),
      null,
    );
  }

  if (hideIf && hideIf(formData, index, fullData, path)) {
    if (!updatedSchema['ui:hidden']) {
      updatedSchema = set('ui:hidden', true, updatedSchema);
    }
  } else if (updatedSchema['ui:hidden']) {
    updatedSchema = unset('ui:hidden', updatedSchema);
  }

  const expandUnder = get(['ui:options', 'expandUnder'], uiSchema);
  const expandUnderCondition = get(
    ['ui:options', 'expandUnderCondition'],
    uiSchema,
  );
  if (expandUnder) {
    const isExpanded = isContentExpanded(
      containingObject[expandUnder],
      expandUnderCondition,
      formData,
      index,
      fullData,
    );
    const isCollapsed = !isExpanded;
    if (updatedSchema['ui:collapsed'] !== isCollapsed) {
      updatedSchema = set('ui:collapsed', isCollapsed, updatedSchema);
    }
  } else if (updatedSchema['ui:collapsed']) {
    updatedSchema = unset('ui:collapsed', updatedSchema);
  }

  if (updatedSchema.type === 'object') {
    const newProperties = Object.keys(updatedSchema.properties).reduce(
      (current, next) => {
        const newSchema = setHiddenFields(
          updatedSchema.properties[next],
          uiSchema[next],
          formData,
          path.concat(next),
          fullData,
          index,
        );

        if (newSchema !== updatedSchema.properties[next]) {
          return set(next, newSchema, current);
        }

        return current;
      },
      updatedSchema.properties,
    );

    if (newProperties !== updatedSchema.properties) {
      return set('properties', newProperties, updatedSchema);
    }
  }

  if (updatedSchema.type === 'array') {
    // each item has its own schema, so we need to update the required fields on those schemas
    // and then check for differences
    const newItemSchemas = updatedSchema.items.map((item, idx) =>
      setHiddenFields(
        item,
        uiSchema.items,
        formData,
        path.concat(idx),
        fullData,
        idx,
      ),
    );

    if (
      newItemSchemas.some(
        (newItem, idx) => newItem !== updatedSchema.items[idx],
      )
    ) {
      return set('items', newItemSchemas, updatedSchema);
    }
  }

  return updatedSchema;
}

/*
 * Steps through data and removes any fields that are marked as hidden
 * This is done so that hidden fields don’t cause validation errors that
 * a user can’t see.
 */
export function removeHiddenData(schema, data) {
  // null is necessary here because Rails 4 will convert empty arrays to null
  // In the forms, there's no difference between an empty array and null or undefined
  if (isHiddenField(schema) || typeof data === 'undefined' || data === null) {
    return undefined;
  }

  if (schema.type === 'object') {
    return Object.keys(data).reduce((current, next) => {
      if (typeof data[next] !== 'undefined' && schema.properties[next]) {
        const nextData = removeHiddenData(schema.properties[next], data[next]);

        // if the data was removed, then just unset it
        if (typeof nextData === 'undefined') {
          return unset(next, current);
        }

        // if data was updated (like a nested prop was removed), update it
        if (nextData !== data[next]) {
          return set(next, nextData, current);
        }
      }

      return current;
    }, data);
  }

  if (schema.type === 'array') {
    const newItems = data.map((item, index) =>
      removeHiddenData(schema.items[index], item),
    );

    if (newItems.some((newItem, idx) => newItem !== data[idx])) {
      return newItems;
    }

    return data;
  }

  return data;
}

/*
 * This is similar to the hidden fields schema function above, except more
 * general. It will step through a schema and replace parts of it based on an
 * updateSchema or replaceSchema function in uiSchema. This means the schema can
 * be re-calculated based on data a user has entered.
 */
export function updateSchemaFromUiSchema(
  schema,
  uiSchema,
  formData,
  index = null,
  path = [],
  fullData,
) {
  if (!uiSchema) {
    return schema;
  }

  let currentSchema = schema;

  if (currentSchema.type === 'object') {
    const newSchema = Object.keys(currentSchema.properties).reduce(
      (current, next) => {
        const nextProp = updateSchemaFromUiSchema(
          current.properties[next],
          uiSchema[next],
          formData,
          index,
          path.concat(next),
          fullData || formData,
        );

        if (current.properties[next] !== nextProp) {
          return set(['properties', next], nextProp, current);
        }

        return current;
      },
      currentSchema,
    );

    if (newSchema !== schema) {
      currentSchema = newSchema;
    }
  }

  if (currentSchema.type === 'array') {
    // each item has its own schema, so we need to update the required fields on those schemas
    // and then check for differences
    const newItemSchemas = currentSchema.items.map((item, idx) =>
      updateSchemaFromUiSchema(
        item,
        uiSchema.items,
        formData,
        idx,
        path.concat(idx),
        fullData || formData,
      ),
    );

    if (
      newItemSchemas.some(
        (newItem, idx) => newItem !== currentSchema.items[idx],
      )
    ) {
      currentSchema = set('items', newItemSchemas, currentSchema);
    }
  }

  const updateSchema = get(['ui:options', 'updateSchema'], uiSchema);

  if (updateSchema) {
    const newSchemaProps = updateSchema(
      formData,
      currentSchema,
      uiSchema,
      index,
      path,
      fullData || formData,
    );

    const newSchema = Object.keys(newSchemaProps).reduce((current, next) => {
      if (newSchemaProps[next] !== schema[next]) {
        return set(next, newSchemaProps[next], current);
      }

      return current;
    }, currentSchema);

    if (newSchema !== currentSchema) {
      return newSchema;
    }
  }

  const replaceSchema = get(['ui:options', 'replaceSchema'], uiSchema);

  if (replaceSchema) {
    const newSchema = replaceSchema(
      formData,
      currentSchema,
      uiSchema,
      index,
      path,
      fullData || formData,
    );

    if (newSchema !== currentSchema) {
      return newSchema;
    }
  }

  return currentSchema;
}

// These are managed by other flows, or already handle dynamic behavior,
// so we don’t want to allow these to be updated via updateUiSchema
const DISALLOWED_UPDATE_UI_SCHEMA_PROPS = {
  'ui:field': true,
  'ui:required': true,
  'ui:reviewField': true,
  'ui:validations': true,
  hideIf: true,
  updateSchema: true,
  updateUiSchema: true,
  replaceSchema: true,
  viewComponent: true,
  viewField: true,
};

/**
 * Merges a partial uiSchema into an existing uiSchema, but only if
 * the new uiSchema is different from the existing one.
 * Does not support arrays.
 * @param {UISchemaOptions} uiSchema - The existing uiSchema
 * @param {UISchemaOptions} newUiSchema - A partial uiSchema to merge into the existing one
 * @returns {UISchemaOptions} Merged or original uiSchema
 */
function mergeUiSchemasIfDifferent(uiSchema, newUiSchema) {
  if (!newUiSchema) {
    return uiSchema;
  }

  let isDifferent = false;
  const updatedUiSchema = { ...uiSchema };

  Object.entries(newUiSchema).forEach(([prop, value]) => {
    let newValue = value;
    if (DISALLOWED_UPDATE_UI_SCHEMA_PROPS[prop]) {
      throw new Error(
        `Cannot update uiSchema property '${prop}' using updateUiSchema.`,
      );
    }
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !React.isValidElement(value)
    ) {
      newValue = mergeUiSchemasIfDifferent(uiSchema?.[prop], newValue);
    }

    if (updatedUiSchema[prop] !== newValue) {
      updatedUiSchema[prop] = newValue;
      isDifferent = true;
    }
  });

  return isDifferent ? updatedUiSchema : uiSchema;
}

/**
 * A helper that returns a new uiSchema based on the input uiSchema and
 * formData. Only updates and returns a uiSchema object for the field that has
 * an `updateUiSchema` callback defined in its `ui:options`.
 *
 * @param {SchemaOptions} schema - The schema
 * @param {UISchemaOptions} uiSchema - The uiSchema to update
 * @param {Object} formData - The form data to based uiSchema updates on
 * @param {Object} fullData - full form data
 * @param {Number} index -  The index of the current item in an array
 * @returns {UISchemaOptions} The new uiSchema object
 */
export function updateUiSchema(schema, uiSchema, formData, fullData, index) {
  if (!uiSchema) {
    return uiSchema;
  }

  let currentUiSchema = uiSchema;

  if (schema.type === 'object') {
    // looping through the schema rather than the uiSchema
    // because we just care about object traversal of 'properties'
    const newUiSchema = Object.keys(schema.properties).reduce(
      (modifiedUiSchema, key) => {
        const nextProp = updateUiSchema(
          schema.properties[key],
          modifiedUiSchema[key],
          formData,
          fullData || formData,
          index,
        );

        if (modifiedUiSchema[key] !== nextProp) {
          return { ...modifiedUiSchema, [key]: nextProp };
        }

        return modifiedUiSchema;
      },
      currentUiSchema,
    );

    if (newUiSchema !== uiSchema) {
      currentUiSchema = newUiSchema;
    }
  }

  // if (schema.type === 'array') {
  // array path is not supported for updateUiSchema because there is only one
  // uiSchema per array, so we can't guarantee it's correct. A workaround for
  // the consumer is to use updateSchema (there are multiple schemas per array)
  // which has access to updating 'title' which affects 'ui:title'

  const uiSchemaUpdater = uiSchema['ui:options']?.updateUiSchema;

  if (!uiSchemaUpdater) {
    return currentUiSchema;
  }

  const newProps = uiSchemaUpdater(formData, fullData || formData, index);
  return mergeUiSchemasIfDifferent(currentUiSchema, newProps);
}

export function replaceRefSchemas(schema, definitions, path = '') {
  // this can happen if you import a field that doesn’t exist from a schema
  if (!schema) {
    throw new Error(`Schema is undefined at ${path}`);
  }
  if (schema.$ref) {
    // There’s a whole spec for JSON pointers, but we don’t use anything more complicated
    // than this so far
    const refPath = schema.$ref.replace('#/definitions/', '').split('/');
    const definition = get(refPath, definitions);
    if (!definition) {
      throw new Error(
        `Missing definition for ${
          schema.$ref
        } at ${path}. You probably need to add it to defaultDefinitions`,
      );
    }

    return replaceRefSchemas(definition, definitions, path);
  }

  if (schema.type === 'object') {
    return Object.keys(schema.properties).reduce((current, next) => {
      const nextProp = replaceRefSchemas(
        schema.properties[next],
        definitions,
        `${path}.${next}`,
      );

      if (current.properties[next] !== nextProp) {
        return set(['properties', next], nextProp, current);
      }

      return current;
    }, schema);
  }

  if (schema.type === 'array') {
    const newItems = replaceRefSchemas(
      schema.items,
      definitions,
      `${path}.items`,
    );

    if (newItems !== schema.items) {
      return set('items', newItems, schema);
    }
  }

  return schema;
}

/**
 * This function updates an array schema to use the array of
 * item schema format and keeps that array in sync with the
 * data in that array in the form data.
 *
 * This allows us to have conditional fields for each array item,
 * because our conditional field implementation depends on modifying
 * schemas
 *
 * @param {SchemaOptions} schema The current JSON Schema object
 * @param {any} fieldData The data associated with the current schema
 * @returns {SchemaOptions} The updated JSON Schema object
 */
export function updateItemsSchema(schema, fieldData = null) {
  if (schema.type === 'array') {
    let newSchema = schema;

    // This happens the first time this function is called when
    // generating the form
    if (!Array.isArray(schema.items)) {
      newSchema = {
        ...schema,
        items: [],
        additionalItems: schema.items,
      };
    }

    if (!fieldData) {
      // If there’s no data, the list of schemas should be empty
      newSchema = set('items', [], newSchema);
    } else if (fieldData.length > newSchema.items.length) {
      // Here we’re filling in the items array to make it the same
      // length as the array of form data. This happens when you add
      // another record on the form, mainly.
      const fillIn = Array(fieldData.length - newSchema.items.length).fill(
        newSchema.additionalItems,
      );
      newSchema = set('items', newSchema.items.concat(fillIn), newSchema);
    } else if (fieldData.length < newSchema.items.length) {
      // If someone removed a record we’re removing the last schema item
      // This may not be the actual removed schema, but the schemas will
      // always be updated in the next step
      newSchema = set('items', dropRight(newSchema.items, 1), newSchema);
    }

    const updatedItems = newSchema.items.map((item, index) =>
      updateItemsSchema(item, fieldData[index]),
    );
    if (newSchema.items.some((item, index) => item !== updatedItems[index])) {
      return set('items', updatedItems, newSchema);
    }

    return newSchema;
  }

  if (schema.type === 'object') {
    return Object.keys(schema.properties).reduce((current, next) => {
      const nextProp = updateItemsSchema(
        schema.properties[next],
        fieldData ? fieldData[next] : null,
      );

      if (current.properties[next] !== nextProp) {
        return set(['properties', next], nextProp, current);
      }

      return current;
    }, schema);
  }

  return schema;
}

/**
 * This is the main sequence of updates that happens when data is changed
 * on a form. Most updates are applied to the schema. And by default the data
 * is updated to remove newly hidden data. And the uiSchema is updated if
 * there are any updateUiSchema updates based on the new data.
 *
 * @param {SchemaOptions} schema The current JSON Schema
 * @param {UISchemaOptions} uiSchema The current UI Schema (does not change)
 * @param {Object} formData Flattened data for the entire form
 * @param {boolean} [preserveHiddenData=false] Do not remove hidden data if
 * this is set to `true`
 * @param {Object} fullData Full data for the entire form
 * @param {Number} index The index of the current item in an array
 * @returns {{
 *  data: Object,
 *  schema: SchemaOptions,
 *  uiSchema: UISchemaOptions
 * }} An object with the updated schema, uiSchema, and data
 */
export function updateSchemasAndData(
  schema,
  uiSchema,
  formData,
  preserveHiddenData = false, // also in uiSchema['ui:options']
  fullData,
  index,
) {
  let newSchema = updateItemsSchema(schema, formData);
  newSchema = updateRequiredFields(
    newSchema,
    uiSchema,
    formData,
    index,
    fullData,
    [], // path
  );

  // Update the schema with any fields that are now hidden because of the data change
  newSchema = setHiddenFields(
    newSchema,
    uiSchema,
    formData,
    [], // path
    fullData,
    index,
  );

  // Update the uiSchema and  schema with any general updates based on the new data
  const newUiSchema = updateUiSchema(
    newSchema,
    uiSchema,
    formData,
    fullData || formData,
    index,
  );
  newSchema = updateSchemaFromUiSchema(
    newSchema,
    newUiSchema,
    formData,
    index,
    [], // path
    fullData || formData,
  );

  if (!(preserveHiddenData || getPreserveHiddenData(uiSchema))) {
    // Remove any data that’s now hidden in the schema
    const newData = removeHiddenData(newSchema, formData);

    // We need to do this again because array data might have been removed
    newSchema = updateItemsSchema(newSchema, newData);

    checkValidSchema(newSchema);

    return {
      data: newData,
      schema: newSchema,
      uiSchema: newUiSchema,
    };
  }

  checkValidSchema(newSchema);

  return {
    data: formData,
    schema: newSchema,
    uiSchema: newUiSchema,
  };
}

const pageWithCurrentIndex = (page, activeContext) => {
  if (
    activeContext &&
    page.arrayPath &&
    page.index === undefined &&
    page.arrayPath === activeContext.arrayPath
  ) {
    return { ...page, index: activeContext.index };
  }
  return page;
};

export function recalculateSchemaAndData(reduxFormState) {
  const activeContext = getActiveFormPageContext();

  return Object.keys(reduxFormState.pages).reduce((state, pageKey) => {
    // on each data change, we need to do the following steps
    // Recalculate any required fields, based on the new data
    const page = state.pages[pageKey];
    const formData = reduxFormState.data;

    const { data, schema, uiSchema } = updateSchemasAndData(
      page.schema,
      page.uiSchema,
      formData,
      false, // preserveHiddenData
      formData,
      // index: undefined; assuming we're recalculating outside of arrays
    );

    let newState = state;

    const pageWithIndex = pageWithCurrentIndex(page, activeContext);

    /**
     * If the page is inactive, in the case of a feature toggle setting or data conditional,
     * an issue in the schema recalculation is presented in the next conditional statements
     * if two pages (one active, one inactive) use the same data keys in their respective
     * schemas. Thus we should not need to recalculate inactive pages any further.
     */
    if (!isActivePage(pageWithIndex, formData)) {
      return newState;
    }

    if (formData !== data) {
      newState = set('data', data, state);
    }

    if (page.schema !== schema) {
      newState = set(['pages', pageKey, 'schema'], schema, newState);
    }

    if (page.uiSchema !== uiSchema) {
      newState = set(['pages', pageKey, 'uiSchema'], uiSchema, newState);
    }

    if (page.showPagePerItem) {
      const arrayData = dataGet(page.arrayPath, newState.data) || [];
      // If an item was added or removed for the data used by a showPagePerItem page,
      // we have to reset everything because we can’t match the edit states to rows directly
      // This will rarely ever be noticeable
      if (page.editMode.length !== arrayData.length) {
        newState = set(
          ['pages', pageKey, 'editMode'],
          arrayData.map(() => false),
          newState,
        );
      }
    }

    return newState;
  }, reduxFormState);
}

export function createInitialState(formConfig) {
  let initialState = {
    submission: {
      status: false,
      errorMessage: false,
      id: false,
      timestamp: false,
      hasAttemptedSubmit: false,
    },
    formId: formConfig.formId,
    loadedData: {
      formData: {},
      metadata: {},
    },
    reviewPageView: {
      openChapters: {},
      viewedPages: new Set(),
    },
    trackingPrefix: formConfig.trackingPrefix,
    formErrors: {},
  };

  const uniquePaths = new Set();

  const pageAndDataState = createFormPageList(formConfig).reduce(
    (state, page) => {
      const definitions = {
        ...(formConfig.defaultDefinitions || {}),
        ...page.schema.definitions,
      };
      let schema = replaceRefSchemas(page.schema, definitions, page.pageKey);
      // Throw an error if the new schema is invalid
      checkValidSchema(schema);
      if (page.path) {
        if (
          !environment.isProduction() &&
          uniquePaths.has(page.path) &&
          !formConfig.allowDuplicatePaths
        ) {
          throw new Error(
            `Duplicate page path found: ${page.path}. Page paths must be unique.
            Paths must be unique because usually the side effects are unintentional,
            such as going to the route you didn't expect to go to. (router.push will
            go to the first path it finds, even if its "depends" is false)`,
          );
        }
        uniquePaths.add(page.path);
      }
      schema = updateItemsSchema(schema);
      const isArrayPage = page.showPagePerItem;
      const data = getDefaultFormState(
        schema,
        page.initialData,
        schema.definitions,
      );

      if (state.pages[page.pageKey]) {
        // eslint-disable-next-line no-console
        console?.warn(
          `Duplicate page key found: ${
            page.pageKey
          }. Page keys must be unique.`,
        );
      }

      /* eslint-disable no-param-reassign */
      state.pages[page.pageKey] = {
        arrayPath: page.arrayPath,
        chapterKey: page.chapterKey,
        CustomPage: page.CustomPage,
        CustomPageReview: page.CustomPageReview,
        depends: page.depends,
        editMode: isArrayPage ? [] : false,
        itemFilter: page.itemFilter,
        pageKey: page.pageKey,
        path: page.path,
        schema,
        showPagePerItem: page.showPagePerItem,
        uiSchema: page.uiSchema,
      };

      state.data = merge({}, state.data, data);
      /* eslint-enable no-param-reassign */

      return state;
    },
    {
      data: {},
      pages: {},
    },
  );

  initialState = { ...initialState, ...pageAndDataState };
  // Take another pass and recalculate the schema and data based on the default data
  // We do this to avoid passing undefined for the whole form state when the form first renders
  initialState = recalculateSchemaAndData(initialState);

  return initialState;
}
