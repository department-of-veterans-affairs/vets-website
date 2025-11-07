import React from 'react';
import PropTypes from 'prop-types';
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

SubTaskWrap.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      back: PropTypes.string,
      component: PropTypes.component,
      name: PropTypes.string,
      next: PropTypes.func,
      validate: PropTypes.func,
    }),
  ),
};

export default SubTaskWrap;
