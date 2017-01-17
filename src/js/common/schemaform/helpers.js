import React from 'react';
import _ from 'lodash/fp';
import { Route, IndexRedirect } from 'react-router';
import FormPage from './FormPage';
import ReviewPage from './review/ReviewPage';

export function createFormPageList(formConfig) {
  return Object.keys(formConfig.chapters)
    .reduce((pageList, chapter) => {
      const chapterTitle = formConfig.chapters[chapter].title;
      const pages = Object.keys(formConfig.chapters[chapter].pages)
        .map(page => {
          return _.assign(formConfig.chapters[chapter].pages[page], {
            chapterTitle,
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
            pageKey: page
          });
        });
      return _.set(chapter, pages, chapters);
    }, {});
}

function createPageList(formConfig, formPages) {
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
        path: 'review-and-submit'
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
      return (
        <Route
            key={page.path}
            path={page.path}
            component={FormPage}
            pageConfig={page}
            pageList={pageList}/>
      );
    });

  if (formConfig.introduction) {
    routes = [
      <IndexRedirect to="introduction" key="introRedirect"/>,
      <Route path="introduction" key="introduction" component={formConfig.introduction} pageList={pageList}/>
    ].concat(routes);
  }

  return routes.concat([
    <Route path="review-and-submit" key="review-and-submit" formConfig={formConfig} component={ReviewPage} pageList={pageList}/>,
    <Route path="submit-message" key="submit-message" component={formConfig.confirmation}/>,
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
      month: month === 'XX' ? '' : Number(month),
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

export function isValidForm(form) {
  const pages = _.omit(['privacyAgreementAccepted', 'submission'], form);
  return Object.keys(pages).reduce((isValid, page) => {
    return isValid && pages[page].isValid;
  }, true);
}

export function flattenFormData(form) {
  const pages = _.omit(['privacyAgreementAccepted', 'submission'], form);
  return _.values(pages).reduce((formPages, page) => {
    return _.assign(formPages, page.data);
  }, {});
}

export function errorSchemaIsValid(errorSchema) {
  if (errorSchema && errorSchema.__errors && errorSchema.__errors.length) {
    return false;
  }

  return _.values(_.omit('__errors', errorSchema)).every(errorSchemaIsValid);
}

export function touchFieldsInSchema(idSchema, arrayField, index, touched = {}) {
  const schemaKeys = Object.keys(idSchema).filter(field => field !== '$id');
  if (!schemaKeys.length) {
    const id = idSchema.$id.replace(arrayField, `${arrayField}_${index}`);
    const newTouched = {};
    newTouched[id] = true;
    return _.assign(touched, newTouched);
  }

  return schemaKeys.reduce((touchedFields, nextField) => {
    const newTouched = touchFieldsInSchema(idSchema[nextField], arrayField, index, touchedFields);
    return _.assign(touchedFields, newTouched);
  }, touched);
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
