import React from 'react';

import FormFooter from 'platform/forms/components/FormFooter';
import SubTask from 'platform/forms/sub-task';

import pages from './pages';

import GetFormHelp from '../../shared/content/GetFormHelp';

export const SubTaskContainer = () => {
  return (
    <article data-page="start" className="row">
      <div className="vads-u-margin-bottom--2">
        <SubTask pages={pages} />
      </div>
      <FormFooter formConfig={{ getHelp: GetFormHelp }} />
    </article>
  );
};

export default SubTaskContainer;
