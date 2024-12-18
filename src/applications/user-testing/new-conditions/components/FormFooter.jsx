import React from 'react';

import CallVBACenter from 'platform/static-data/CallVBACenter';

const FormFooter = () => (
  <div className="row vads-u-margin-bottom--2">
    <div className="usa-width-two-thirds medium-8 columns">
      <va-need-help>
        <div slot="content">
          <div>
            <p className="help-talk">
              For help filling out this form, or if the form isn’t working
              right, <CallVBACenter />
            </p>
          </div>
        </div>
      </va-need-help>
    </div>
  </div>
);

export default FormFooter;
