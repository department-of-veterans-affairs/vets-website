import React from 'react';
import _ from 'lodash/fp';
import { Route, IndexRedirect } from 'react-router';
import FormPage from './FormPage';

function createFormPageList(formConfig) {
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
    <Route path="review-and-submit" key="review-and-submit" formConfig={formConfig} component={null} pageList={pageList}/>,
    <Route path="submit-message" key="submit-message" component={formConfig.confirmation}/>,
  ]);
}

function formatDayMonth(val) {
  if (!val || !val.length || !Number(val)) {
    return 'XX';
  } else if (val.length === 1) {
    return `0${val}`;
  }

  return val.toString();
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

export function parseISODate(dateString) {
  if (dateString) {
    const [year, month, day] = dateString.split('-', 3);

    return {
      month: month === 'XX' ? '' : Number(month),
      day: day === 'XX' ? '' : Number(day),
      year: year === 'XXXX' ? '' : year
    };
  }

  return {
    month: '',
    day: '',
    year: ''
  };
}
