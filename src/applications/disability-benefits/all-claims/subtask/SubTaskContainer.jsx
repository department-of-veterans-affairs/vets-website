import React, { useEffect } from 'react';

import FormFooter from 'platform/forms/components/FormFooter';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import SubTask from 'platform/forms/sub-task';

import { getPageTitle, wrapWithBreadcrumb } from '../utils';
import pages from './pages';
import formConfig from '../config/form';

export const SubTaskContainer = () => {
  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
    scrollToTop();
  });

  return wrapWithBreadcrumb(
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
};

export default SubTaskContainer;
