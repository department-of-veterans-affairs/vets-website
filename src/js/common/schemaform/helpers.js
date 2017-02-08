import _ from 'lodash/fp';
import FormPage from './FormPage';
import ReviewPage from './review/ReviewPage';
import shouldUpdate from 'recompose/shouldUpdate';

import { deepEquals } from 'react-jsonschema-form/lib/utils';

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

export function flattenFormData(form) {
  const pages = _.omit(['privacyAgreementAccepted', 'submission'], form);
  return _.values(pages).reduce((formPages, page) => {
    return _.assign(formPages, page.data);
  }, {});
}

export function getArrayFields(pageConfig) {
  const fields = [];
  const findArrays = (obj, path = []) => {
    if (obj.type === 'array') {
      fields.push({
        path,
        schema: obj,
        uiSchema: _.get(path, pageConfig.uiSchema)
      });
    }

    if (obj.type === 'object') {
      Object.keys(obj.properties).forEach(prop => {
        findArrays(obj.properties[prop], path.concat(prop));
      });
    }
  };

  findArrays(pageConfig.schema);

  return fields;
}

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
