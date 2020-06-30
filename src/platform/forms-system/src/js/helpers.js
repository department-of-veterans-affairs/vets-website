import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
import shouldUpdate from 'recompose/shouldUpdate';
import { deepEquals } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import FormPage from './containers/FormPage';
import ReviewPage from './review/ReviewPage';

// An active page is one that will be shown to the user.
// Pages become inactive if they are conditionally shown based
// on answers to previous questions.
export function isActivePage(page, data) {
  if (typeof page.depends === 'function') {
    return page.depends(data, page.index);
  }

  if (Array.isArray(page.depends)) {
    return page.depends.some(condition => _.matches(condition)(data));
  }

  return page.depends === undefined || _.matches(page.depends)(data);
}

export function getActivePages(pages, data) {
  return pages.filter(page => isActivePage(page, data));
}

export function getActiveProperties(activePages) {
  const allProperties = [];
  activePages.forEach(page => {
    if (page.schema) {
      allProperties.push(...Object.keys(page.schema.properties));
    }
  });
  return _.uniq(allProperties);
}

export function getInactivePages(pages, data) {
  return pages.filter(page => !isActivePage(page, data));
}

export function createFormPageList(formConfig) {
  return Object.keys(formConfig.chapters).reduce((pageList, chapter) => {
    const chapterTitle = formConfig.chapters[chapter].title;
    const pages = Object.keys(formConfig.chapters[chapter].pages).map(page =>
      _.assign(formConfig.chapters[chapter].pages[page], {
        chapterTitle,
        chapterKey: chapter,
        pageKey: page,
      }),
    );
    return pageList.concat(pages);
  }, []);
}

export function createPageListByChapter(formConfig) {
  return Object.keys(formConfig.chapters).reduce((chapters, chapter) => {
    const pages = Object.keys(formConfig.chapters[chapter].pages).map(page =>
      _.assign(formConfig.chapters[chapter].pages[page], {
        pageKey: page,
        chapterKey: chapter,
      }),
    );
    return _.set(chapter, pages, chapters);
  }, {});
}

export function createPageList(formConfig, formPages) {
  let pageList = formPages;

  if (formConfig.additionalRoutes) {
    pageList = formConfig.additionalRoutes.concat(pageList);
  }

  if (formConfig.introduction) {
    pageList = [
      {
        pageKey: 'introduction',
        path: 'introduction',
      },
    ].concat(pageList);
  }

  return pageList
    .concat([
      {
        pageKey: 'review-and-submit',
        path: 'review-and-submit',
        chapterKey: 'review',
      },
    ])
    .map(page =>
      _.set('path', `${formConfig.urlPrefix || ''}${page.path}`, page),
    );
}

/*
 * Create the routes based on a form config. This goes through each chapter in a form
 * config, pulls out the config for each page, then generates a list of Route components with the
 * config as props
 */
export function createRoutes(formConfig) {
  const formPages = createFormPageList(formConfig);
  const pageList = createPageList(formConfig, formPages);

  let routes = formPages.map(page => ({
    path: page.path,
    component: page.component || FormPage,
    pageConfig: page,
    pageList,
    urlPrefix: formConfig.urlPrefix,
  }));

  if (formConfig.additionalRoutes) {
    routes = formConfig.additionalRoutes
      .map(route => ({
        ...route,
        formConfig,
        pageList,
      }))
      .concat(routes);
  }

  if (formConfig.introduction) {
    routes = [
      {
        path: 'introduction',
        component: formConfig.introduction,
        formConfig,
        pageList,
      },
    ].concat(routes);
  }

  return routes.concat([
    {
      path: 'review-and-submit',
      formConfig,
      component: ReviewPage,
      pageList,
    },
    {
      path: 'confirmation',
      component: formConfig.confirmation,
    },
    {
      path: '*',
      onEnter: (nextState, replace) => replace(formConfig.urlPrefix || '/'),
    },
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
    return `${formatYear(year)}-${formatDayMonth(month)}-${formatDayMonth(
      day,
    )}`;
  }

  return undefined;
}

export function formatReviewDate(dateString, monthYear = false) {
  if (dateString) {
    let [year, month, day] = dateString.split('-', 3);
    // dates (e.g. dob) are sometimes in this pattern: 'YYYYMMDD'
    if (year.length > 4) {
      year = dateString.substring(0, 4);
      month = dateString.substring(4, 6);
      day = dateString.substring(6, 8);
    }

    return monthYear
      ? `${formatDayMonth(month)}/${formatYear(year)}`
      : `${formatDayMonth(month)}/${formatDayMonth(day)}/${formatYear(year)}`;
  }

  return undefined;
}
export function parseISODate(dateString) {
  if (typeof dateString === 'string') {
    const [year, month, day] = dateString.split('-', 3);

    return {
      month: month === 'XX' ? '' : Number(month).toString(),
      day: day === 'XX' ? '' : Number(day).toString(),
      year: year === 'XXXX' ? '' : year,
    };
  }

  return {
    month: '',
    day: '',
    year: '',
  };
}

/*
 * Removes 'view:' fields from data object
 */
export function filterViewFields(data) {
  return Object.keys(data).reduce((newData, nextProp) => {
    const field = data[nextProp];

    if (Array.isArray(field)) {
      const newArray = field.map(item => filterViewFields(item));

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

export function filterInactivePageData(inactivePages, activePages, form) {
  const activeProperties = getActiveProperties(activePages);
  let newData;

  return inactivePages.reduce(
    (formData, page) =>
      Object.keys(page.schema.properties).reduce((currentData, prop) => {
        newData = currentData;
        if (!activeProperties.includes(prop)) {
          delete newData[prop];
        }
        return newData;
      }, formData),
    form.data,
  );
}

export function stringifyFormReplacer(key, value) {
  // an object with country is an address
  if (
    value &&
    typeof value.country !== 'undefined' &&
    (!value.street || !value.city || (!value.postalCode && !value.zipcode))
  ) {
    return undefined;
  }

  // clean up empty objects, which we have no reason to send
  if (typeof value === 'object') {
    const fields = Object.keys(value);
    if (
      fields.length === 0 ||
      fields.every(field => value[field] === undefined)
    ) {
      return undefined;
    }

    // autosuggest widgets save value and label info, but we should just return the value
    if (value.widget === 'autosuggest') {
      return value.id;
    }

    // Exclude file data
    if (value.confirmationCode && value.file) {
      return _.omit('file', value);
    }
  }

  // Clean up empty objects in arrays
  if (Array.isArray(value)) {
    const newValues = value.filter(v => !!stringifyFormReplacer(key, v));
    // If every item in the array is cleared, remove the whole array
    return newValues.length > 0 ? newValues : undefined;
  }

  return value;
}

export function isInProgress(pathName) {
  const trimmedPathname = pathName.replace(/\/$/, '');
  return !(
    trimmedPathname.endsWith('introduction') ||
    trimmedPathname.endsWith('confirmation') ||
    trimmedPathname.endsWith('form-saved') ||
    trimmedPathname.endsWith('error')
  );
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
  const findArrays = (obj, ui, path = []) => {
    if (
      obj.type === 'array' &&
      !isHiddenField(obj) &&
      !_.get('ui:options.keepInPageOnReview', ui)
    ) {
      fields.push({
        path,
        schema: _.set('definitions', data.schema.definitions, obj),
        uiSchema: _.get(path, data.uiSchema) || data.uiSchema,
      });
    }

    if (obj.type === 'object' && !isHiddenField(obj)) {
      Object.keys(obj.properties).forEach(prop => {
        findArrays(obj.properties[prop], ui[prop], path.concat(prop));
      });
    }
  };

  findArrays(data.schema, data.uiSchema);

  return fields;
}

/*
 * Checks to see if there are non array fields in a page schema, so that
 * we don’t show a blank page header on the review page if a page is just
 * a growable table
 */
export function hasFieldsOtherThanArray(schema) {
  if (schema.$ref || (schema.type !== 'object' && schema.type !== 'array')) {
    return true;
  }

  if (schema.type === 'object') {
    return Object.keys(schema.properties).some(nextProp =>
      hasFieldsOtherThanArray(schema.properties[nextProp]),
    );
  }

  return false;
}

/*
 * Return a schema without array fields. If the schema has only array fields,
 * then return undefined (because there’s no reason to use an object schema with
 * no properties)
 */
export function getNonArraySchema(schema, uiSchema = {}) {
  if (
    schema.type === 'array' &&
    !_.get('ui:options.keepInPageOnReview', uiSchema)
  ) {
    return {
      schema: undefined,
      uiSchema,
    };
  }

  if (schema.type === 'object') {
    const newProperties = Object.keys(schema.properties).reduce(
      (current, next) => {
        const newSchema = getNonArraySchema(
          schema.properties[next],
          uiSchema[next],
        );

        if (typeof newSchema.schema === 'undefined') {
          return _.unset(next, current);
        }

        if (newSchema.schema !== schema.properties[next]) {
          return _.set(next, newSchema.schema, current);
        }

        return current;
      },
      schema.properties,
    );

    if (Object.keys(newProperties).length === 0) {
      return {
        schema: undefined,
        uiSchema,
      };
    }

    if (newProperties !== schema.properties) {
      let newSchema = _.set('properties', newProperties, schema);
      if (newSchema.required) {
        const newRequired = _.intersection(
          Object.keys(newSchema.properties),
          newSchema.required,
        );
        if (newRequired.length !== newSchema.required.length) {
          newSchema = _.set('required', newRequired, newSchema);
        }
      }

      const schemaPropertyKeys = Object.keys(newSchema.properties);
      const newUiSchema = Object.assign({}, uiSchema);
      newUiSchema['ui:order'] = uiSchema['ui:order']?.filter(item => {
        return schemaPropertyKeys.includes(item);
      });

      return {
        schema: newSchema,
        uiSchema: newUiSchema,
      };
    }
  }

  return {
    schema,
    uiSchema,
  };
}

export const pureWithDeepEquals = shouldUpdate(
  (props, nextProps) => !deepEquals(props, nextProps),
);

/**
 * Recursively checks to see if the schema is valid.
 *
 * Note: This only returns true. If the schema is invalid, an error is thrown to
 *  stop everything.
 *
 * @param {Object} schema - The schema in question
 * @return {bool}         - true if we succeed
 * @throws {Error}        - If the schema is invalid
 */
export function checkValidSchema(schema, errors = [], path = ['root']) {
  if (typeof schema.type !== 'string') {
    errors.push(`Missing type in ${path.join('.')} schema.`);
  }

  if (schema.type === 'object') {
    if (typeof schema.properties !== 'object') {
      errors.push(`Missing object properties in ${path.join('.')} schema.`);
    } else {
      Object.keys(schema.properties).forEach(propName => {
        checkValidSchema(schema.properties[propName], errors, [
          ...path,
          propName,
        ]);
      });
    }
  }

  if (schema.type === 'array') {
    // We check this both before items is turned into additionalItems and after,
    //  so we need to account for it being both an object and an array.
    if (Array.isArray(schema.items)) {
      if (!schema.additionalItems) {
        errors.push(
          `${path.join(
            '.',
          )} should contain additionalItems when items is an array.`,
        );
      }
      schema.items.forEach((item, index) => {
        checkValidSchema(item, errors, [...path, 'items', index]);
      });
    } else if (typeof schema.items === 'object') {
      if (schema.additionalItems) {
        errors.push(
          `${path.join(
            '.',
          )} should not contain additionalItems when items is an object.`,
        );
      }
      checkValidSchema(schema.items, errors, [...path, 'items']);
    } else {
      errors.push(`Missing items schema in ${path.join('.')}.`);
    }

    // Check additionalItems
    if (schema.additionalItems) {
      checkValidSchema(schema.additionalItems, errors, [
        ...path,
        'additionalItems',
      ]);
    }
  }

  // We’ve recursed all the way back down to ['root']; throw an error containing
  //  all the error messages.
  if (path.length === 1 && errors.length > 0) {
    // console.log(`Error${errors.length > 1 ? 's' : ''} found in schema: ${errors.join(' ')} -- ${path.join('.')}`);
    throw new Error(
      `Error${errors.length > 1 ? 's' : ''} found in schema: ${errors.join(
        ' ',
      )}`,
    );
  } else {
    return true;
  }
}

export function setArrayRecordTouched(prefix, index) {
  return { [`${prefix}_${index}`]: true };
}

export function createUSAStateLabels(states) {
  return states.USA.reduce(
    (current, { label, value }) => _.merge(current, { [value]: label }),
    {},
  );
}

/*
 * Take a list of pages and create versions of them
 * for each item in an array
 */
function generateArrayPages(arrayPages, data) {
  const items = _.get(arrayPages[0].arrayPath, data) || [];
  return (
    items
      .reduce(
        (pages, item, index) =>
          pages.concat(
            arrayPages.map(page =>
              _.assign(page, {
                path: page.path.replace(':index', index),
                index,
              }),
            ),
          ),
        [],
      )
      // doing this after the map so that we don’t change indexes
      .filter(page => !page.itemFilter || page.itemFilter(items[page.index]))
  );
}

/*
 * We want to generate the pages we need for each item in the array
 * being used by an array page. We also want to group those pages by item.
 * So, this grabs contiguous sections of array pages and at the end generates
 * the right number of pages based on the items in the array
 */
export function expandArrayPages(pageList, data) {
  const result = pageList.reduce(
    (acc, nextPage) => {
      const { lastArrayPath, arrayPages, currentList } = acc;
      // If we see an array page and we’re starting a section or in the middle of one, just add it
      // to the temporary array
      if (
        nextPage.showPagePerItem &&
        (!lastArrayPath || nextPage.arrayPath === lastArrayPath)
      ) {
        arrayPages.push(nextPage);
        return acc;
        // Now we’ve hit the end of a section of array pages using the same array, so
        // actually generate the pages now
      } else if (nextPage.arrayPath !== lastArrayPath && !!arrayPages.length) {
        const newList = currentList.concat(
          generateArrayPages(arrayPages, data),
          nextPage,
        );
        return _.assign(acc, {
          lastArrayPath: null,
          arrayPages: [],
          currentList: newList,
        });
      }

      return _.set('currentList', currentList.concat(nextPage), acc);
    },
    { lastArrayPath: null, arrayPages: [], currentList: [] },
  );

  if (result.arrayPages.length > 0) {
    return result.currentList.concat(
      generateArrayPages(result.arrayPages, data),
    );
  }

  return result.currentList;
}

/**
 * Gets active and expanded pages, in the correct order
 *
 * Any `showPagePerItem` pages are expanded to create items for each array item.
 * We update the `path` for each of those pages to replace `:index` with the current item index.
 *
 * @param pages {Array<Object>} List of page configs
 * @param data {Object} Current form data
 * @returns {Array<Object>} A list of pages, including individual array
 *   pages that are active
 */
export function getActiveExpandedPages(pages, data) {
  const expandedPages = expandArrayPages(pages, data);
  return getActivePages(expandedPages, data);
}

/**
 * getPageKeys returns a list of keys for the currently active pages
 *
 * @param pages {Array<Object>} List of page configs
 * @param formData {Object} Current form data
 * @returns {Array<string>} A list of page keys from the page config
 *   and the index if it’s a pagePerItem page
 */
export function getPageKeys(pages, formData) {
  const expandedPageList = getActiveExpandedPages(pages, formData);

  return expandedPageList.map(page => {
    let pageKey = page.pageKey;
    if (typeof page.index !== 'undefined') {
      pageKey += page.index;
    }
    return pageKey;
  });
}

/**
 * getActiveChapters returns the list of chapter keys with active pages
 *
 * @param formConfig {Object} The form config object
 * @param formData {Object} The current form data
 * @returns {Array<string>} The list of chapter key strings for active chapters
 */
export function getActiveChapters(formConfig, formData) {
  const formPages = createFormPageList(formConfig);
  const pageList = createPageList(formConfig, formPages);
  const expandedPageList = getActiveExpandedPages(pageList, formData);

  return _.uniq(
    expandedPageList
      .map(p => p.chapterKey)
      .filter(key => !!key && key !== 'review'),
  );
}

/**
 * Returns the schema, omitting all `required` arrays.
 *
 * @param schema {Object}
 * @returns {Object} The schema without any `required` arrays
 */
export function omitRequired(schema) {
  if (typeof schema !== 'object' || Array.isArray(schema)) {
    return schema;
  }

  const newSchema = _.omit('required', schema);
  Object.keys(newSchema).forEach(key => {
    newSchema[key] = omitRequired(newSchema[key]);
  });

  return newSchema;
}

/*
 * Normal transform for schemaform data
 */
export function transformForSubmit(
  formConfig,
  form,
  replacer = stringifyFormReplacer,
) {
  const expandedPages = expandArrayPages(
    createFormPageList(formConfig),
    form.data,
  );
  const activePages = getActivePages(expandedPages, form.data);
  const inactivePages = getInactivePages(expandedPages, form.data);
  const withoutInactivePages = filterInactivePageData(
    inactivePages,
    activePages,
    form,
  );
  const withoutViewFields = filterViewFields(withoutInactivePages);

  return JSON.stringify(withoutViewFields, replacer) || '{}';
}
