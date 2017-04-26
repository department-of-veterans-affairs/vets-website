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

    // clean up empty objects, which we have no reason to send
    if (typeof value === 'object') {
      const fields = Object.keys(value);
      if (fields.length === 0 || fields.every(field => value[field] === undefined)) {
        return undefined;
      }
    }

    return value;
  }) || '{}';
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
      let newSchema = _.set('properties', newProperties, schema);
      if (newSchema.required) {
        const newRequired = _.intersection(Object.keys(newSchema.properties), newSchema.required);
        if (newRequired.length !== newSchema.required.length) {
          newSchema = _.set('required', newRequired, newSchema);
        }
      }

      return newSchema;
    }
  }

  return schema;
}


export const pureWithDeepEquals = shouldUpdate((props, nextProps) => {
  return !deepEquals(props, nextProps);
});

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

export function createUSAStateLabels(states) {
  return states.USA.reduce((current, { label, value }) => {
    return _.merge(current, { [value]: label });
  }, {});
}
