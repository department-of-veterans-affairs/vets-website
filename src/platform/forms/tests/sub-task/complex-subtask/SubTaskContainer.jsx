import React from 'react';

import SubTask from 'platform/forms/sub-task';

import pages from './pages';

export const SubTaskContainer = () => (
  <>
    <article className="row">
      <div className="usa-width-two-thirds medium-8 columns vads-u-margin-bottom--2">
        <SubTask pages={pages} />
      </div>
    </article>
  </>
);

export default SubTaskContainer;
