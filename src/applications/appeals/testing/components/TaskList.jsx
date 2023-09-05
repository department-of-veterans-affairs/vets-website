import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import formConfig from '../config/form';
import { setupPages } from '../utils/taskListPages';

export const TaskList = () => {
  const { chapterTitles, getChapterPagesFromChapterIndex } = setupPages(
    formConfig,
  );

  return (
    <>
      <p>
        <span>&#x2190;&#x00a0;</span>
        <a href="/decision-reviews/appeals-testing">Board Appeals</a>
      </p>
      <h1>Request a Board Appeal (Form 10182)</h1>
      <ol className="task-list">
        {chapterTitles.map((title, index) => (
          <li key={index}>
            <h2>
              {index + 1}. {title}
            </h2>
            {getChapterPagesFromChapterIndex(index).map(
              page =>
                page.taskListHide ? null : (
                  <div
                    key={page.path}
                    data-path={page.path}
                    className="task-list-link-wrap vads-u-padding-y--1 vads-u-border-color--gray-light vads-u-border-bottom--1px"
                  >
                    <Link
                      to={{
                        pathname: page.path,
                        search: '?redirect',
                      }}
                    >
                      {page.title}
                    </Link>
                  </div>
                ),
            )}
          </li>
        ))}
      </ol>
    </>
  );
};

TaskList.propTypes = {
  goToPath: PropTypes.func,
};

export default TaskList;
