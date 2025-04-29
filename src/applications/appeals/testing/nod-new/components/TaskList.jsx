import React from 'react';
import { Link } from 'react-router';

import formConfig from '../config/form';
import { setupPages } from '../utils/taskListPages';

export const TaskList = () => {
  const { chapterTitles, getChapterPagesFromChapterIndex } = setupPages(
    formConfig,
  );

  return (
    <>
      <div name="topScrollElement" />
      <div name="topNavScrollElement" />
      <p>
        <span>&#x2190;&#x00a0;</span>
        <a href="/decision-reviews/test-nod">Board Appeals</a>
      </p>
      <h1>Request a Board Appeal (Form 10182)</h1>
      <ol className="task-list vads-u-margin-bottom--8 vads-u-margin-left--0 vads-u-padding-left--0">
        {chapterTitles.map((title, index) => (
          <li key={index}>
            <h2>
              {index + 1}. {title}
            </h2>
            <ul className="chapter-list vads-u-padding-left--0">
              {getChapterPagesFromChapterIndex(index).map(
                page =>
                  page.taskListHide ? null : (
                    <li
                      key={page.path}
                      data-path={page?.path.replace(':index', '0')}
                      className="task-list-link-wrap vads-u-padding-y--1 vads-u-border-color--gray-light vads-u-border-bottom--1px"
                    >
                      <Link to={page.path.replace(':index', '0')}>
                        {page.title}
                      </Link>
                    </li>
                  ),
              )}
            </ul>
          </li>
        ))}
      </ol>
    </>
  );
};

export default TaskList;
