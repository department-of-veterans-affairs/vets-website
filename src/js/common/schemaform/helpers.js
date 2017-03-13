import _ from 'lodash/fp';
import FormPage from './FormPage';
import ReviewPage from './review/ReviewPage';
import shouldUpdate from 'recompose/shouldUpdate';

import { deepEquals } from 'react-jsonschema-form/lib/utils';

import { getActivePages } from '../utils/helpers';

export function createFormPageList(formConfig) {
  return Object.keys(formConfig.chapters)
    .reduce((pageList, chapter) => {
      const chapterTitle = formConfig.chapters[chapter].title;
      const pages = Object.keys(formConfig.chapters[chapter].pages)
        .map(page => {
          return _.assign(formConfig.chapters[chapter].pages[page], {
            chapterTitle,
            chapterKey: chapter,
            pageKey: page
          });
        });
      return pageList.concat(pages);
    }, []);
}

export function createPageListByChapter(formConfig) {
  return Object.keys(formConfig.chapters)
    .reduce((chapters, chapter) => {
      const pages = Object.keys(formConfig.chapters[chapter].pages)
        .map(page => {
          return _.assign(formConfig.chapters[chapter].pages[page], {
            pageKey: page,
            chapterKey: chapter
          });
        });
      return _.set(chapter, pages, chapters);
    }, {});
}

export function createPageList(formConfig, formPages) {
  let pageList = formPages;
  if (formConfig.introduction) {
    pageList = [
      {
        pageKey: 'introduction',
        path: 'introduction'
      }
    ].concat(pageList);
  }

  return pageList
    .concat([
      {
        pageKey: 'review-and-submit',
        path: 'review-and-submit',
        chapterKey: 'review'
      }
    ])
    .map(page => {
      return _.set('path', `${formConfig.urlPrefix}${page.path}`, page);
    });
}

/*
 * Create the routes based on a form config. This goes through each chapter in a form
 * config, pulls out the config for each page, then generates a list of Route components with the
 * config as props
 */
export function createRoutes(formConfig) {
  const formPages = createFormPageList(formConfig);
  const pageList = createPageList(formConfig, formPages);
  let routes = formPages
    .map(page => {
      return {
        path: page.path,
        component: FormPage,
        pageConfig: page,
        pageList
      };
    });

  if (formConfig.introduction) {
    routes = [
      {
        path: 'introduction',
        component: formConfig.introduction,
        pageList
      }
    ].concat(routes);
  }

  return routes.concat([
    {
      path: 'review-and-submit',
      formConfig,
      component: ReviewPage,
      pageList
    },
    {
      path: 'confirmation',
      component: formConfig.confirmation
    }
  ]);
}

function formatDayMonth(val) {
  if (val) {
    const dayOrMonth = val.toString();
    if (Number(dayOrMonth) && dayOrMonth.length === 1) {
      return `0${val}`;
    } else if (Number(dayOrMonth)) {
      return dayOrMonth;
    }
  }

  return 'XX';
}

function formatYear(val) {
  if (!val || !val.length) {
    return 'XXXX';
  }

  return val;
}

export function formatISOPartialDate({ month, day, year }) {
  if (month || day || year) {
    return `${formatYear(year)}-${formatDayMonth(month)}-${formatDayMonth(day)}`;
  }

  return undefined;
}

export function formatReviewDate(dateString) {
  if (dateString) {
    const [year, month, day] = dateString.split('-', 3);
    return `${formatDayMonth(month)}/${formatDayMonth(day)}/${formatYear(year)}`;
  }

  return undefined;
}
export function parseISODate(dateString) {
  if (dateString) {
    const [year, month, day] = dateString.split('-', 3);

    return {
      month: month === 'XX' ? '' : Number(month).toString(),
      day: day === 'XX' ? '' : Number(day).toString(),
      year: year === 'XXXX' ? '' : year
    };
  }

  return {
    month: '',
    day: '',
    year: ''
  };
}

/*
 * Merges data for pages in list into one object
 */
export function flattenFormData(pages, form) {
  return pages.reduce((formPages, page) => {
    const pageData = form[page.pageKey].data;
    return _.assign(formPages, pageData);
  }, { privacyAgreementAccepted: form.privacyAgreementAccepted });
}

/*
 * Removes 'view:' fields from data object
 */
export function filterViewFields(data) {
  return Object.keys(data).reduce((newData, nextProp) => {
    const field = data[nextProp];

    if (Array.isArray(field)) {
      const newArray = field.map((item) => filterViewFields(item));

      return _.set(nextProp, newArray, newData);
    }

    if (typeof field === 'object') {
      if (nextProp.startsWith('view:')) {
        return _.assign(newData, filterViewFields(field));
      }
      return _.set(nextProp, filterViewFields(field), newData);
    }

    if (!nextProp.startsWith('view:')) {
      return _.set(nextProp, field, newData);
    }

    return newData;
  }, {});
}

/*
 * Normal transform for schemaform data
 */
export function transformForSubmit(formConfig, form) {
  const activePages = getActivePages(createFormPageList(formConfig), form);
  const flattened = flattenFormData(activePages, form);
  const withoutViewFields = filterViewFields(flattened);

  return JSON.stringify(withoutViewFields, (key, value) => {
    // an object with country is an address
    if (value && typeof value.country !== 'undefined' &&
      (!value.street || !value.city || !value.postalCode)) {
      return undefined;
    }

    return value;
  });
}

function isHiddenField(schema) {
  return !!schema['ui:collapsed'] || !!schema['ui:hidden'];
}

/*
 * Pull the array fields from a schema. Used to separate out array fields
 * from the rest of page to be displayed on the review page
 */
export function getArrayFields(data) {
  const fields = [];
  const findArrays = (obj, path = []) => {
    if (obj.type === 'array' && !isHiddenField(obj)) {
      fields.push({
        path,
        schema: _.set('definitions', data.schema.definitions, obj),
        uiSchema: _.get(path, data.uiSchema) || data.uiSchema
      });
    }

    if (obj.type === 'object' && !isHiddenField(obj)) {
      Object.keys(obj.properties).forEach(prop => {
        findArrays(obj.properties[prop], path.concat(prop));
      });
    }
  };

  findArrays(data.schema);

  return fields;
}

/*
 * Checks to see if there are non array fields in a page schema, so that
 * we don't show a blank page header on the review page if a page is just
 * a growable table
 */
export function hasFieldsOtherThanArray(schema) {
  if (schema.$ref || (schema.type !== 'object' && schema.type !== 'array')) {
    return true;
  }

  if (schema.type === 'object') {
    return Object.keys(schema.properties).some(nextProp => {
      return hasFieldsOtherThanArray(schema.properties[nextProp]);
    });
  }

  return false;
}

/*
 * Return a schema without array fields. If the schema has only array fields,
 * then return undefined (because there's no reason to use an object schema with
 * no properties)
 */
export function getNonArraySchema(schema) {
  if (schema.type === 'array') {
    return undefined;
  }

  if (schema.type === 'object') {
    const newProperties = Object.keys(schema.properties).reduce((current, next) => {
      const newSchema = getNonArraySchema(schema.properties[next]);

      if (typeof newSchema === 'undefined') {
        return _.unset(next, current);
      }

      if (newSchema !== schema.properties[next]) {
        return _.set(next, newSchema, current);
      }

      return current;
    }, schema.properties);

    if (Object.keys(newProperties).length === 0) {
      return undefined;
    }

    if (newProperties !== schema.properties) {
      return _.set('properties', newProperties, schema);
    }
  }

  return schema;
}

/*
 * This function goes through a schema/uiSchema and updates the required array
 * based on any ui:required field properties in the uiSchema.
 *
 * If no required fields are changing, it makes sure to not mutate the existing schema,
 * so we can still take advantage of any shouldComponentUpdate optimizations
 */
export function updateRequiredFields(schema, uiSchema, formData) {
  if (!uiSchema) {
    return schema;
  }

  if (schema.type === 'object') {
    const newRequired = Object.keys(schema.properties).reduce((requiredArray, nextProp) => {
      const field = uiSchema[nextProp];
      if (field && field['ui:required']) {
        const isRequired = field['ui:required'](formData);
        const arrayHasField = requiredArray.some(prop => prop === nextProp);

        if (arrayHasField && !isRequired) {
          return requiredArray.filter(prop => prop !== nextProp);
        } else if (!arrayHasField && isRequired) {
          return requiredArray.concat(nextProp);
        }

        return requiredArray;
      }

      return requiredArray;
    }, schema.required || []);

    const newSchema = Object.keys(schema.properties).reduce((currentSchema, nextProp) => {
      if (uiSchema) {
        const nextSchema = updateRequiredFields(currentSchema.properties[nextProp], uiSchema[nextProp], formData);
        if (nextSchema !== currentSchema.properties[nextProp]) {
          return _.set(['properties', nextProp], nextSchema, currentSchema);
        }
      }

      return currentSchema;
    }, schema);

    if (newSchema.required !== newRequired && (newSchema.required || newRequired.length > 0)) {
      return _.set('required', newRequired, newSchema);
    }

    return newSchema;
  }

  if (schema.type === 'array') {
    const newItemSchema = updateRequiredFields(schema.items, uiSchema.items, formData);
    if (newItemSchema !== schema.items) {
      return _.set('items', newItemSchema, schema);
    }
  }

  return schema;
}

export const pureWithDeepEquals = shouldUpdate((props, nextProps) => {
  return !deepEquals(props, nextProps);
});

/*
 * This steps through a schema and sets any fields to hidden, based on a
 * hideIf function from uiSchema and the current page data. Sets 'ui:hidden'
 * which is a non-standard JSON Schema property
 */
export function setHiddenFields(schema, uiSchema, data) {
  if (!uiSchema) {
    return schema;
  }

  let updatedSchema = schema;
  const hideIf = _.get(['ui:options', 'hideIf'], uiSchema);

  if (hideIf && hideIf(data)) {
    if (!updatedSchema['ui:hidden']) {
      updatedSchema = _.set('ui:hidden', true, updatedSchema);
    }
  } else if (updatedSchema['ui:hidden']) {
    updatedSchema = _.unset('ui:hidden', updatedSchema);
  }

  const expandUnder = _.get(['ui:options', 'expandUnder'], uiSchema);
  if (expandUnder && !data[expandUnder]) {
    if (!updatedSchema['ui:collapsed']) {
      updatedSchema = _.set('ui:collapsed', true, updatedSchema);
    }
  } else if (updatedSchema['ui:collapsed']) {
    updatedSchema = _.unset('ui:collapsed', updatedSchema);
  }

  if (updatedSchema.type === 'object') {
    const newProperties = Object.keys(updatedSchema.properties).reduce((current, next) => {
      const newSchema = setHiddenFields(updatedSchema.properties[next], uiSchema[next], data);

      if (newSchema !== updatedSchema.properties[next]) {
        return _.set(next, newSchema, current);
      }

      return current;
    }, updatedSchema.properties);

    if (newProperties !== updatedSchema.properties) {
      return _.set('properties', newProperties, updatedSchema);
    }
  }

  if (updatedSchema.type === 'array') {
    const newSchema = setHiddenFields(updatedSchema.items, uiSchema.items, data);

    if (newSchema !== updatedSchema.items) {
      return _.set('items', newSchema, updatedSchema);
    }
  }

  return updatedSchema;
}

/*
 * Steps through data and removes any fields that are marked as hidden
 * This is done so that hidden fields don't cause validation errors that
 * a user can't see.
 */
export function removeHiddenData(schema, data) {
  if (isHiddenField(schema) || typeof data === 'undefined') {
    return undefined;
  }

  if (schema.type === 'object') {
    return Object.keys(data).reduce((current, next) => {
      if (typeof data[next] !== 'undefined') {
        const nextData = removeHiddenData(schema.properties[next], data[next]);

        if (typeof nextData === 'undefined') {
          return _.unset(next, current);
        }
      }

      return current;
    }, data);
  }

  if (schema.type === 'array') {
    return data.reduce((current, next, index) => {
      const nextData = removeHiddenData(schema.items, next);

      if (nextData !== next) {
        return _.set(index, nextData, current);
      }

      return data;
    }, data);
  }

  return data;
}

/*
 * This is similar to the hidden fields schema function above, except more general.
 * It will step through a schema and replace parts of it based on an updateSchema
 * function in uiSchema. This means the schema can be re-calculated based on data
 * a user has entered.
 */
export function updateSchemaFromUiSchema(schema, uiSchema, data, formData) {
  if (!uiSchema) {
    return schema;
  }

  let currentSchema = schema;

  if (currentSchema.type === 'object') {
    const newSchema = Object.keys(currentSchema.properties).reduce((current, next) => {
      const nextData = data ? data[next] : undefined;
      const nextProp = updateSchemaFromUiSchema(current.properties[next], uiSchema[next], nextData, formData);

      if (current.properties[next] !== nextProp) {
        return _.set(['properties', next], nextProp, current);
      }

      return current;
    }, currentSchema);

    if (newSchema !== schema) {
      currentSchema = newSchema;
    }
  }

  if (currentSchema.type === 'array') {
    const newSchema = updateSchemaFromUiSchema(currentSchema.items, uiSchema.items, data, formData);

    if (newSchema !== currentSchema.items) {
      currentSchema = _.set('items', newSchema, currentSchema);
    }
  }

  const updateSchema = _.get(['ui:options', 'updateSchema'], uiSchema);

  if (updateSchema) {
    const newSchemaProps = updateSchema(data, formData, currentSchema);

    const newSchema = Object.keys(newSchemaProps).reduce((current, next) => {
      if (newSchemaProps[next] !== schema[next]) {
        return _.set(next, newSchemaProps[next], current);
      }

      return current;
    }, currentSchema);

    if (newSchema !== currentSchema) {
      return newSchema;
    }
  }

  return currentSchema;
}

export function setItemTouched(prefix, index, idSchema) {
  const fields = Object.keys(idSchema).filter(field => field !== '$id');
  if (!fields.length) {
    const id = idSchema.$id.replace(prefix, `${prefix}_${index}`);
    return { [id]: true };
  }

  return fields.reduce((idObj, field) => {
    return _.merge(idObj, setItemTouched(prefix, index, idSchema[field]));
  }, {});
}
