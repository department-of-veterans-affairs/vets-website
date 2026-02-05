import { memo, useEffect, useRef } from 'react';
import { add, getYear } from 'date-fns';
import { cloneDeep, intersection, matches, merge, uniq } from 'lodash';
import * as Sentry from '@sentry/browser';
import { deepEquals } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import { handleSessionUpdates } from '../../../utilities/api';
import get from '../../../utilities/data/get';
import omit from '../../../utilities/data/omit';
import set from '../../../utilities/data/set';
import unset from '../../../utilities/data/unset';
import { createStringifyFormReplacer } from './utilities/createStringifyFormReplacer';

export const minYear = 1900;
export const currentYear = getYear(new Date());
// maxYear was previously set to 3000
export const maxYear = getYear(add(currentYear, { years: 100 }));

// For the DISPLAYED step-count on pages [in progress-bar and step-header], we need to subtract the number of progress-hidden chapters from the total number of chapters
// Progress-hidden chapters are those that have a hideFormNavProgress prop set to true
export const getChaptersLengthDisplay = ({ uniqueChapters, formConfig }) => {
  // Do NOT manipulate or re-assign formConfig param!
  // It's used elsewhere [in functional logic]
  const { chapters } = formConfig;

  // some chapters have hideFormNavProgress true, so we need to substract them from the total length
  let progressHiddenChaptersLength = 0;
  Object.keys(chapters).forEach(chapter => {
    if (chapters[chapter].hideFormNavProgress) {
      progressHiddenChaptersLength += 1;
    }
  });
  return uniqueChapters.length - progressHiddenChaptersLength;
};

// For the DISPLAYED chapter NUMBER on pages [in step-header], we need to account for any progress-hidden chapters.
// Progress-hidden chapters are those that have a hideFormNavProgress prop set to true.
export const getCurrentChapterDisplay = (formConfig, currentChapterIndex) => {
  // Do NOT manipulate or re-assign params passed in!
  // formConfig & currentChapterIndex are likely used in elsewhere [in functional logic]
  const { chapters } = formConfig;
  let upstreamProgressHiddenChaptersLength = 0;
  Object.keys(chapters).forEach((chapter, index) => {
    if (index < currentChapterIndex && chapters[chapter].hideFormNavProgress) {
      upstreamProgressHiddenChaptersLength += 1;
    }
  });

  return currentChapterIndex - upstreamProgressHiddenChaptersLength;
};

// An active page is one that will be shown to the user.
// Pages become inactive if they are conditionally shown based
// on answers to previous questions.
export function isActivePage(page, data) {
  if (typeof page.depends === 'function') {
    return page.depends(data, page.index);
  }

  if (Array.isArray(page.depends)) {
    return page.depends.some(condition => matches(condition)(data));
  }

  return page.depends === undefined || matches(page.depends)(data);
}

export function getActivePages(pages, data) {
  return pages.filter(page => isActivePage(page, data));
}

/**
 * Returns property keys for a page based on its schema and array context.
 *
 * - If no schema properties exist, returns an empty array.
 * - For array pages, returns keys prefixed with `"arrayPath.index."`.
 * - Otherwise, returns the top-level schema property keys.
 *
 * @param {FormConfigPage} page - Page definition with schema and optional array context.
 * @returns {string[]} Property keys (e.g., ["name"] or ["addresses.0.city"]).
 */
export function getPageProperties(page) {
  if (!page?.schema?.properties) return [];

  const isArrayPage =
    typeof page.arrayPath === 'string' &&
    page.arrayPath.length &&
    page.schema.properties[page.arrayPath]?.items?.properties;

  if (isArrayPage) {
    const { properties } = page.schema.properties[page.arrayPath].items;
    return Object.keys(properties).map(
      key => `${page.arrayPath}.${page.index}.${key}`,
    );
  }

  return Object.keys(page.schema.properties);
}

/**
 * Deletes a deeply nested property from an object using a dot-separated path,
 * while guarding against prototype pollution by disallowing "__proto__", "constructor",
 * and "prototype" at any segment of the path.
 *
 * Traverses `obj` along `pathString` and removes the final property if reachable.
 * If any segment does not resolve to an object, the function exits without changes.
 *
 * @param {Object} obj - The object to modify (mutated in place).
 * @param {string} pathString - Dot-separated path to the property (e.g., "user.address.street").
 * @returns {void}
 */
export function deleteNestedProperty(obj, pathString) {
  const parts = pathString.split('.');
  let current = obj;

  // guard against prototype pollution: bail if any segment is dangerous
  for (let i = 0; i < parts.length; i++) {
    const k = parts[i];
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') return;
  }

  for (let i = 0; i < parts.length - 1; i++) {
    const segment = parts[i];
    const next = current?.[segment];
    if (next === null || typeof next !== 'object') return;
    current = next;
  }

  const last = parts[parts.length - 1];

  if (Array.isArray(current) && /^\d+$/.test(last)) {
    const idx = Number(last);
    if (idx >= 0 && idx < current.length) {
      // remove the element without creating a sparse array
      current.splice(idx, 1);
    }
    return;
  }

  if (current && typeof current === 'object') {
    delete current[last];
  }
}

/**
 * Aggregates active property keys across pages, de-duplicated.
 *
 * Uses {@link getPageProperties} for each page. Handles cases where array items
 * are defined via `$ref` with no inline `properties`—in that case the array
 * path itself (e.g., "dependents") is treated as active.
 *
 * @param {FormConfigPage[]} activePages - Pages considered active.
 * @returns {string[]} Unique list of active property keys.
 */
export function getActivePageProperties(activePages) {
  const props = activePages.flatMap(page => {
    const pageProps = getPageProperties(page);
    if (pageProps.length) return pageProps;

    const hasArrayPath =
      typeof page.arrayPath === 'string' && page.arrayPath.length;
    const hasItemsSchema = !!page?.schema?.properties?.[page.arrayPath]?.items;

    // items may be $ref’d with no inline properties; mark parent as active
    if (hasArrayPath && hasItemsSchema) return [page.arrayPath];

    if (page?.schema?.properties) return Object.keys(page.schema.properties);

    return [];
  });

  return [...new Set(props)];
}

// TODO: remove when functionality from `filterInactiveNestedPages` is validated
export function getActiveProperties(activePages) {
  const allProperties = [];
  activePages.forEach(page => {
    if (page.schema) {
      allProperties.push(...Object.keys(page.schema.properties));
    }
  });
  return uniq(allProperties);
}

export function getInactivePages(pages, data) {
  return pages.filter(page => !isActivePage(page, data));
}

export function createFormPageList(formConfig) {
  if (!formConfig?.chapters) return [];

  return Object.keys(formConfig.chapters).reduce((pageList, chapterKey) => {
    const chapter = formConfig.chapters[chapterKey];

    if (!chapter?.pages) return pageList;

    const chapterTitle = chapter?.title ?? formConfig.title;
    const hideOnReviewPage = chapter?.hideOnReviewPage || false;
    const pages = Object.keys(chapter.pages).map(pageKey => ({
      ...chapter.pages[pageKey],
      chapterTitle,
      chapterKey,
      hideOnReviewPage,
      pageKey,
    }));
    return pageList.concat(pages);
  }, []);
}

export function createPageListByChapter(formConfig) {
  if (!formConfig?.chapters) return {};
  return Object.keys(formConfig.chapters).reduce((chapters, chapter) => {
    const pages = Object.keys(formConfig.chapters[chapter].pages).map(page => ({
      ...formConfig.chapters[chapter].pages[page],
      pageKey: page,
      chapterKey: chapter,
    }));
    return set(chapter, pages, chapters);
  }, {});
}

export function createPageList(formConfig, formPages) {
  let pageList = formPages;

  if (!formConfig) return [];

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
      set('path', `${formConfig.urlPrefix || ''}${page.path}`, page),
    );
}

function formatDayMonth(val) {
  if (val) {
    const dayOrMonth = val.toString();
    if (Number(dayOrMonth) && dayOrMonth.length === 1) {
      return `0${val}`;
    }
    if (Number(dayOrMonth)) {
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

export function formatMonthYearISOPartialDate({ month, year }) {
  if (month || year) {
    return `${formatYear(year)}-${formatDayMonth(month)}`;
  }

  return undefined;
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
    const [year = 'XXXX', month = 'XX', day = 'XX'] = dateString.split('-', 3);

    return {
      month: month === 'XX' ? '' : Number(month).toString(),
      day: day === 'XX' ? null : Number(day).toString(),
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

    if (field !== null) {
      if (Array.isArray(field)) {
        const newArray = field.map(item => filterViewFields(item));

        return set(nextProp, newArray, newData);
      }

      if (typeof field === 'object') {
        if (nextProp.startsWith('view:')) {
          return { ...newData, ...filterViewFields(field) };
        }
        return set(nextProp, filterViewFields(field), newData);
      }

      if (!nextProp.startsWith('view:')) {
        return set(nextProp, field, newData);
      }
    }

    return newData;
  }, {});
}

// Check 'events' for 'events.0.agency', 'veteran' for 'veteran.fullName.first', etc.
function hasActiveAncestor(prop, activeSet) {
  const parts = prop.split('.');
  for (let i = 1; i < parts.length; i++) {
    const ancestor = parts.slice(0, i).join('.');
    if (activeSet.has(ancestor)) return true;
  }
  return false;
}

// guard to ensure parent array isn’t deleted if any parent.* key is active.
function hasActiveDescendant(prop, activeSet) {
  if (!prop || typeof prop !== 'string') return false;
  const prefix = `${prop}.`;
  for (const key of activeSet) {
    if (typeof key === 'string' && key.startsWith(prefix)) return true;
  }
  return false;
}

/**
 * Removes inactive page data from a form while preserving active fields and ancestors.
 *
 * Rules:
 * - Active properties come from {@link getActiveProperties}.
 * - A property is protected from deletion if it is active *or* has an active ancestor
 *   (e.g., "dependents" protects "dependents.0.name").
 * - Array items:
 *   - If multiple fields within the same item are active, all siblings are preserved.
 *   - If only one field is active, inactive siblings are removed.
 *
 * @param {FormConfigPage[]} inactivePages - Pages considered inactive; their properties may be removed.
 * @param {FormConfigPage[]} activePages - Pages considered active; determine what to keep.
 * @param {object} form - Object containing the `data` to be filtered.
 * @returns {Object} A deep-cloned `data` object with inactive properties removed.
 */
export function filterInactiveNestedPageData(inactivePages, activePages, form) {
  const activeProps = getActivePageProperties(activePages);
  const activePropsSet = new Set(activeProps);
  const formData = cloneDeep(form.data); // don't mutate inputs

  // count how many active nested fields exist per array item: "<root>.<index>"
  const activeItemCounts = activeProps.reduce((map, p) => {
    const parts = p.split('.');
    const isArrayChild = parts.length > 2 && /^\d+$/.test(parts[1]);
    if (isArrayChild) {
      const key = `${parts[0]}.${parts[1]}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, new Map());

  inactivePages.forEach(page => {
    getPageProperties(page).forEach(prop => {
      // protected if exact active match, has an active ancestor, OR has active descendants
      if (
        activePropsSet.has(prop) ||
        hasActiveAncestor(prop, activePropsSet) ||
        hasActiveDescendant(prop, activePropsSet)
      ) {
        return;
      }

      const parts = prop.split('.');
      const isArrayChild =
        parts.length > 2 &&
        /^\d+$/.test(parts[1]) &&
        Array.isArray(formData?.[parts[0]]);
      const itemPrefix = isArrayChild ? `${parts[0]}.${parts[1]}` : null;

      // Keep siblings ONLY if that array item has MULTIPLE active fields
      // (e.g., events.0 has details + location active). If there's just one
      // active field (e.g., dependents.0.ssn), allow deletion of inactive siblings.
      if (isArrayChild && (activeItemCounts.get(itemPrefix) || 0) >= 2) {
        return;
      }

      deleteNestedProperty(formData, prop);
    });
  });

  return formData;
}

// TODO: remove when functionality from `filterInactiveNestedPages` is validated
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

export const stringifyFormReplacer = createStringifyFormReplacer();

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
      !get('ui:options.keepInPageOnReview', ui)
    ) {
      fields.push({
        path,
        schema: set('definitions', data.schema.definitions, obj),
        uiSchema: get(path, data.uiSchema) || data.uiSchema,
      });
    }

    if (obj.type === 'object' && !isHiddenField(obj)) {
      Object.keys(obj.properties).forEach(prop => {
        findArrays(obj.properties?.[prop], ui?.[prop], path.concat(prop));
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
    !get('ui:options.keepInPageOnReview', uiSchema)
  ) {
    return {
      schema: undefined,
      uiSchema,
    };
  }

  if (
    schema.type === 'object' &&
    !get('ui:options.displayEmptyObjectOnReview', uiSchema)
  ) {
    const newProperties = Object.keys(schema.properties).reduce(
      (current, next) => {
        const newSchema = getNonArraySchema(
          schema.properties[next],
          uiSchema[next],
        );

        if (typeof newSchema.schema === 'undefined') {
          return unset(next, current);
        }

        if (newSchema.schema !== schema.properties[next]) {
          return set(next, newSchema.schema, current);
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
      let newSchema = set('properties', newProperties, schema);
      if (newSchema.required) {
        const newRequired = intersection(
          Object.keys(newSchema.properties),
          newSchema.required,
        );
        if (newRequired.length !== newSchema.required.length) {
          newSchema = set('required', newRequired, newSchema);
        }
      }

      const schemaPropertyKeys = Object.keys(newSchema.properties);
      const newUiSchema = { ...uiSchema };
      newUiSchema['ui:order'] = uiSchema['ui:order']?.filter(item => {
        // check item === '*' here?
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

// HOC that only re-renders when props have deeply changed
// Equivalent to React.memo with deepEquals comparison
export const pureWithDeepEquals = Component =>
  memo(Component, (prevProps, nextProps) => deepEquals(prevProps, nextProps));

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
    if (typeof schema === 'function') {
      const functionName = schema.name || 'function';
      errors.push(
        `Invalid schema at "${path.join(
          '.',
        )}": expected a schema object, but received the function "${functionName}". ` +
          `JSON schemas must be plain objects. Did you forget to call "${functionName}()"?`,
      );
    } else {
      errors.push(
        `Invalid schema at "${path.join(
          '.',
        )}": missing or invalid "type" property. Expected an object with a "type" string.`,
      );
    }
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
    (current, { label, value }) => merge({}, current, { [value]: label }),
    {},
  );
}

/*
 * Take a list of pages and create versions of them
 * for each item in an array
 */
function generateArrayPages(arrayPages, data) {
  let items = get(arrayPages[0].arrayPath, data) || [];

  if (!items.length && arrayPages[0].allowPathWithNoItems) {
    // Add one item for the /0 path with empty data. The number
    // of items is used to determine the number of pages to
    // generate and the data isn't actually important
    items = [{}];
  }

  return (
    items
      .reduce(
        (pages, item, index) =>
          pages.concat(
            arrayPages.map(page => ({
              ...page,
              path: page.path.replace(':index', index),
              index,
            })),
          ),
        [],
      )
      // doing this after the map so that we don’t change indexes
      .filter(
        page => !page.itemFilter || page.itemFilter(items[page.index], data),
      )
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
      }
      if (nextPage.arrayPath !== lastArrayPath && !!arrayPages.length) {
        const newList = currentList.concat(
          generateArrayPages(arrayPages, data),
          nextPage,
        );
        return {
          ...acc,
          lastArrayPath: null,
          arrayPages: [],
          currentList: newList,
        };
      }

      return set('currentList', currentList.concat(nextPage), acc);
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
    let { pageKey } = page;
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

  return uniq(
    expandedPageList
      .filter(
        p => !p.hideOnReviewPage && p.chapterKey && p.chapterKey !== 'review',
      )
      .map(p => p.chapterKey),
  );
}

export function hideFormTitle(formConfig, pathName, formData) {
  if (
    !formConfig?.chapters ||
    typeof formConfig.chapters !== 'object' ||
    formConfig.chapters.length === 0
  )
    return false;

  const formPages = createFormPageList(formConfig);
  let pageList = createPageList(formConfig, formPages);
  try {
    pageList = getActiveExpandedPages(pageList, formData);
  } catch {
    // If we can't get active expanded pages, just use the default pageList
  }
  const page = pageList.find(p => p.path === pathName);

  if (pathName === '/confirmation') {
    return !!(formConfig.hideFormTitleConfirmation === undefined
      ? formConfig.hideFormTitle
      : formConfig.hideFormTitleConfirmation);
  }

  if (!page || !page.chapterKey) {
    return false;
  }

  return (
    formConfig.chapters[page.chapterKey]?.hideFormTitle ??
    formConfig.hideFormTitle ??
    false
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

  const newSchema = omit('required', schema);
  Object.keys(newSchema).forEach(key => {
    newSchema[key] = omitRequired(newSchema[key]);
  });

  return newSchema;
}

/**
 * @param formConfig
 * @param form
 * @param {ReplacerOptions | (key, val) => any | any[]} [options] An object of options for the transform, or a JSON.stringify replacer argument
 */
export function transformForSubmit(formConfig, form, options) {
  try {
    const replacer =
      typeof options === 'function' || Array.isArray(options)
        ? options
        : createStringifyFormReplacer(options);
    const expandedPages = expandArrayPages(
      createFormPageList(formConfig),
      form.data,
    );
    const activePages = getActivePages(expandedPages, form.data);
    const inactivePages = getInactivePages(expandedPages, form.data);
    const withoutInactivePages = formConfig?.formOptions
      ?.filterInactiveNestedPageData
      ? filterInactiveNestedPageData(inactivePages, activePages, form)
      : filterInactivePageData(inactivePages, activePages, form);
    const withoutViewFields = filterViewFields(withoutInactivePages);

    return JSON.stringify(withoutViewFields, replacer) || '{}';
  } catch (error) {
    window.DD_LOGS?.logger.error('Transform for Submit error', {}, error);
    return '{}';
  }
}

/**
 * Determines whether or not the review field should be displayed on the review page
 *
 * @param propName {string} The name of the field to check
 * @param schema {Object} The current JSON Schema
 * @param uiSchema {Object} The current UI Schema
 * @param formData {Object} The current form data
 * @param formContext {Object} The context of the current form
 * @returns {boolean} the display status of the field
 */
export function showReviewField(
  propName,
  schema,
  uiSchema,
  formData,
  formContext,
) {
  const hiddenOnSchema =
    schema.properties[propName] && schema.properties[propName]['ui:hidden'];
  const collapsedOnSchema =
    schema.properties[propName] && schema.properties[propName]['ui:collapsed'];
  const hideOnReviewIfFalse =
    get([propName, 'ui:options', 'hideOnReviewIfFalse'], uiSchema) === true;
  let hideOnReview = get([propName, 'ui:options', 'hideOnReview'], uiSchema);
  if (typeof hideOnReview === 'function') {
    hideOnReview = hideOnReview(formData, formContext);
  }
  return (
    (!hideOnReviewIfFalse || !!formData[propName]) &&
    !hideOnReview &&
    !hiddenOnSchema &&
    !collapsedOnSchema
  );
}

/**
 * Custom hook to track previous values inside a useEffect
 * See https://blog.logrocket.com/accessing-previous-props-state-react-hooks/
 * @param {*} value - previous value to track
 * @returns previous value
 */
export function usePreviousValue(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * Convert urlParams object to string such as `'?key1=value1&key2=value2'`
 * @param {Object} urlParams - object of url params
 */
export function stringifyUrlParams(urlParams) {
  let urlParamsString = '';

  if (
    urlParams &&
    typeof urlParams === 'object' &&
    Object.keys(urlParams).length
  ) {
    urlParamsString = Object.keys(urlParams)
      .map(key => `${key}=${urlParams[key]}`)
      .join('&');
    urlParamsString = `?${urlParamsString}`;
  }

  return urlParamsString;
}

/**
 * Returns the index of the url path
 *
 * Tip: use `window.location.pathname` to get the current url path index
 *
 * Example: Returns `1` if url is `'current-form/1'`
 * Example: Returns `1` if url is `'current-form/1?edit=true'`
 * Example: Returns `0` if URL is `'current-form/0/page-name'`
 * @returns {number | undefined}
 */
export function getUrlPathIndex(url) {
  if (!url) {
    return undefined;
  }
  const urlParts = url.split('/');
  const indexString = urlParts
    .map(part => part.replace(/\?.*/, ''))
    .reverse()
    .find(part => !Number.isNaN(Number(part)));
  return indexString ? Number(indexString) : undefined;
}

/**
 * Converts a url path to a formConfig's page path, which for arrays will include `:index`
 *
 * @param {string} urlPath for example `window.location.pathname` is a valid urlPath
 * @param {string} [rootUrl] Optional - First part of the url path to remove
 * @returns {string}
 */
export function convertUrlPathToPageConfigPath(urlPath, rootUrl = null) {
  if (!urlPath) {
    return urlPath;
  }

  try {
    let pageConfigPath = urlPath;
    let root = rootUrl;

    pageConfigPath = pageConfigPath.split('/').filter(Boolean);

    if (root) {
      root = root.split('/').filter(Boolean);

      pageConfigPath = pageConfigPath.reduce((acc, _, index) => {
        if (pageConfigPath[index] !== root[index]) {
          acc.push(pageConfigPath[index]);
        }
        return acc;
      }, []);
    }

    pageConfigPath = pageConfigPath.join('/');

    // change path/0/name to path/:index/name
    // change path/0 to path/:index
    // keep path/name as path/name
    return pageConfigPath.replace(/\/\d{1,2}(?=\/|$)/, '/:index');
  } catch {
    return urlPath;
  }
}

/**
 * Wrap a XMLHttpRequest so that it mimics the url and headers.get properties
 * of a Response object for compatability with platform utilities that use fetch
 *
 * @param {XMLHttpRequest} XHR request object
 * @returns {Object} wrapped XHR instance with methods / properties that mimic some of Response object's
 */
function xhrWrapper(xhr) {
  return {
    headers: {
      get: name => xhr.getResponseHeader(name),
    },
    url: xhr.url,
  };
}

/**
 * Update session tokens after request
 *
 * @param {XMLHttpRequest} XHR request object
 * @param {string} CSRF token stored before request made
 */
export function handleSessionRefresh(xhr, csrfTokenStored) {
  const wrapper = xhrWrapper(xhr);
  try {
    handleSessionUpdates(wrapper);
  } catch (err) {
    Sentry.withScope(scope => {
      scope.setExtra('error', err);
      scope.setFingerprint(['{{default}}', scope._tags?.source]);
      Sentry.captureMessage(`vets_client_error: ${err.message}`);
    });
  }
  const csrfToken = wrapper.headers.get('X-CSRF-Token');
  if (csrfToken && csrfToken !== csrfTokenStored) {
    localStorage.setItem('csrfToken', csrfToken);
  }
}
