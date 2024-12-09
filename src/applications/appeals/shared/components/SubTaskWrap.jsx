import React from 'react';

import SubTask from '~/platform/forms/sub-task';

import GetFormHelp from '../content/GetFormHelp';

const SubTaskWrap = ({ pages }) => (
  <>
    <div className="vads-u-margin-bottom--4">
      <SubTask pages={pages} focusOnAlertRole />
    </div>
    <va-need-help>
      <div slot="content">
        <GetFormHelp />
      </div>
    </va-need-help>
  </>
);

export default SubTaskWrap;
