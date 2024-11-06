import React from 'react';
import GetFormHelp from '../GetFormHelp';

const FormFooter = () => (
  <div className="vads-u-margin-bottom--2">
    <va-need-help>
      <div slot="content">
        <GetFormHelp />
      </div>
    </va-need-help>
  </div>
);

export default FormFooter;
