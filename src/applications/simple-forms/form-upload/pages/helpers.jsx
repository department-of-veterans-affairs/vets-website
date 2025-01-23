import React from 'react';
import PropTypes from 'prop-types';
import { FormNavButtons, SchemaForm } from 'platform/forms-system/exportsFile';
import { getFormNumber } from '../helpers';

export const CustomTopContent = () => {
  const formNumber = getFormNumber();
  const breadcrumbs = [
    { href: '/', label: 'VA.gov home' },
    { href: '/find-forms', label: 'Find a Form' },
    {
      href: `/find-forms/about-form-${formNumber}`,
      label: `About Form ${formNumber}`,
    },
    {
      href: `/form-upload/${formNumber}/introduction`,
      label: `Upload Form ${formNumber}`,
    },
  ];
  const bcString = JSON.stringify(breadcrumbs);
  return (
    <va-breadcrumbs
      className="breadcrumbs-container"
      breadcrumb-list={bcString}
      label="Breadcrumb"
      home-veterans-affairs={false}
    />
  );
};

/** @type {CustomPageType} */
export const CustomAlertPage = props => (
  <div className="form-panel">
    {props.alert}
    <SchemaForm {...props}>
      <>
        {props.contentBeforeButtons}
        <FormNavButtons
          goBack={props.goBack}
          goForward={props.onContinue}
          submitToContinue
        />
        {props.contentAfterButtons}
      </>
    </SchemaForm>
  </div>
);

CustomAlertPage.propTypes = {
  alert: PropTypes.element,
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  goBack: PropTypes.func,
  onContinue: PropTypes.func,
};
