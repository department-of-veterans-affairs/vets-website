import React from 'react';
import PropTypes from 'prop-types';
import { FormNavButtons, SchemaForm } from 'platform/forms-system/exportsFile';

export const CustomAlertPage = props => (
  <div className="form-panel">
    {props.alert}
    <SchemaForm {...props}>
      <>
        {props.contentBeforeButtons}
        <FormNavButtons {...props} submitToContinue />
        {props.contentAfterButtons}
      </>
    </SchemaForm>
  </div>
);

CustomAlertPage.propTypes = {
  alert: PropTypes.element,
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
};
