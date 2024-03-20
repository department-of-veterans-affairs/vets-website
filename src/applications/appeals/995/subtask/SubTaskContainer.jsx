import React from 'react';

import FormFooter from 'platform/forms/components/FormFooter';
import SubTask from 'platform/forms/sub-task';

import pages from './pages';
import formConfig from '../config/form';

export const SubTaskContainer = () => {
  return (
    <article data-page="start" className="row">
      <div className="usa-width-two-thirds medium-8 columns vads-u-margin-bottom--2">
        <SubTask pages={pages} />
      </div>
      <FormFooter formConfig={formConfig} />
    </article>
  );
};

export default SubTaskContainer;
