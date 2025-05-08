import React from 'react';

import FormFooter from '@department-of-veterans-affairs/platform-forms/FormFooter';
import SubTask from '@department-of-veterans-affairs/platform-forms/sub-task';

import { getPageTitle, wrapWithBreadcrumb } from '../utils';
import pages from './pages';
import formConfig from '../config/form';

export const SubTaskContainer = () =>
  wrapWithBreadcrumb(
    getPageTitle(),
    <>
      <article className="row">
        <div className="usa-width-two-thirds medium-8 columns vads-u-margin-bottom--2">
          <SubTask pages={pages} />
        </div>
      </article>
      <FormFooter formConfig={formConfig} />
    </>,
  );

export default SubTaskContainer;
