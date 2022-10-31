import React from 'react';

import FormFooter from 'platform/forms/components/FormFooter';
import SubTask from 'platform/forms/sub-task';

import pages from './pages';
import formConfig from '../config/form';

export const SubTaskContainer = () => (
  <article className="row">
    <div className="usa-width-two-thirds medium-8 columns vads-u-margin-bottom--2">
      <SubTask pages={pages} />
      <p>
        If you don’t think this is the right form for you, find out about other
        decision review options.
      </p>
      <a href="/resources/choosing-a-decision-review-option/">
        Learn about choosing a decision review option
      </a>
    </div>
    <FormFooter formConfig={formConfig} />
  </article>
);

export default SubTaskContainer;
