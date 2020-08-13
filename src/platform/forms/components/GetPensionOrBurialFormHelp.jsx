import React from 'react';
import CallVBACenter from '../../static-data/CallVBACenter';
import { APP_TYPE_DEFAULT } from 'platform/forms-system/src/js/constants';

function GetFormHelp(formConfig) {
  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
  return (
    <div>
      <p className="help-talk">
        For benefit related questions, or if the {appType} isn’t working right,
        <br />
        please <CallVBACenter />
      </p>
    </div>
  );
}

export default GetFormHelp;
