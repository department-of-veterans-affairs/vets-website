import React from 'react';

import SubTask from '~/platform/forms/sub-task';

import pages from './pages';

import GetFormHelp from '../../shared/content/GetFormHelp';

export const SubTaskContainer = () => {
  return (
    <>
      <article data-page="start">
        <SubTask pages={pages} />
      </article>
      <va-need-help>
        <GetFormHelp />
      </va-need-help>
    </>
  );
};

export default SubTaskContainer;
